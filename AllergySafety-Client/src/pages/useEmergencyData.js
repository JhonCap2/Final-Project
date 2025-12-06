import { useState, useEffect, useCallback } from 'react';
import API from '../../axios'; // Usar la instancia configurada de Axios
import { toast } from 'react-toastify';

export function useEmergencyData(token) {
  const [userData, setUserData] = useState({ fullName: "", bloodType: "", medications: [], medicalConditions: [], allergies: [] });
  const [emergencyContacts, setEmergencyContacts] = useState(() => {
    try {
      const data = localStorage.getItem("emergencyContacts");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);
  const [sosHistory, setSosHistory] = useState(() => {
    try {
      const data = localStorage.getItem("sosHistory");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  // --- DATA FETCHING ---
  useEffect(() => {
    if (!token) {
      setLoading(false);
      try {
        const localUserData = localStorage.getItem("userMedicalData");
        if (localUserData) setUserData(JSON.parse(localUserData));
      } catch { /* Ignorar error */ }
      return;
    }
    
    const controller = new AbortController();
    const config = { signal: controller.signal };

    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileRes, contactsRes, allergiesRes] = await Promise.all([
          API.get('/users/profile', config),
          API.get('/contacts', config),
          API.get('/allergies', config)
        ]);

        const user = profileRes.data.user;
        const contacts = Array.isArray(contactsRes.data.contacts) ? contactsRes.data.contacts : [];
        const serverAllergies = Array.isArray(allergiesRes.data.allergies) ? allergiesRes.data.allergies.map(a => ({
          _id: a._id,
          name: a.allergen,
          severity: a.severity ? a.severity.toLowerCase() : 'moderate',
          reaction: a.reactions || ''
        })) : [];

        setUserData({
          fullName: user.fullName || '',
          bloodType: user.bloodType || '',
          medicalConditions: user.medicalConditions || [],
          medications: user.medications || [],
          allergies: serverAllergies
        });
        setEmergencyContacts(contacts);

      } catch (err) {
        if (err.name === 'CanceledError') {
          console.log('Request canceled:', err.message);
        } else {
          console.error('Failed to fetch initial data', err);
          toast.error('Failed to load data from server. Some data may be from local cache.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [token]);

  // --- LOCAL STORAGE PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem("emergencyContacts", JSON.stringify(emergencyContacts || []));
  }, [emergencyContacts]);

  useEffect(() => {
    if (!token) {
      localStorage.setItem("userMedicalData", JSON.stringify(userData));
    }
  }, [userData, token]);

  useEffect(() => {
    localStorage.setItem("sosHistory", JSON.stringify(sosHistory || []));
  }, [sosHistory]);

  // --- CRUD Functions ---

  const addContact = useCallback(async (newContact) => {
    if (token) {
      try {
        const res = await API.post('/contacts', newContact, { signal: AbortSignal.timeout(5000) });
        const contact = res.data.contact;
        setEmergencyContacts(prev => [contact, ...(prev || [])]);
        toast.success('Emergency contact saved to server');
        return true; // Success
      } catch (err) {
        console.error('Create contact failed', err);
        toast.error('Failed to save contact to server.');
        return false; // Failure
      }
    } else {
      setEmergencyContacts(prev => [{ id: Date.now(), ...newContact }, ...(prev || [])]);
      toast.info('Added contact locally. Log in to persist');
      return true; // Success (local)
    }
  }, [token]);

  const deleteContact = useCallback(async (id) => {
    const contact = (emergencyContacts || []).find(c => (c._id || c.id) === id);
    if (contact && contact._id && token) {
      try {
        await API.delete(`/contacts/${contact._id}`, { signal: AbortSignal.timeout(5000) });
        setEmergencyContacts(prev => (prev || []).filter(c => (c._id || c.id) !== contact._id));
        toast.success('Contact deleted from server');
      } catch (err) {
        console.error('Delete contact failed', err);
        toast.error('Failed to delete from server');
      }
    } else {
      setEmergencyContacts(prev => (prev || []).filter(c => (c._id || c.id) !== id));
      toast.info('Contact deleted locally');
    }
  }, [token, emergencyContacts]);

  const addAllergy = useCallback(async (newAllergy) => {
    const severityServer = newAllergy.severity.charAt(0).toUpperCase() + newAllergy.severity.slice(1);
    if (token) {
      try {
        const res = await API.post('/allergies', { allergen: newAllergy.name, severity: severityServer }, { signal: AbortSignal.timeout(5000) });
        const a = res.data.allergy;
        const clientAllergy = { _id: a._id, name: a.allergen, severity: (a.severity || severityServer).toLowerCase(), reaction: a.reactions || '' };
        setUserData(prev => ({ ...prev, allergies: [clientAllergy, ...(prev.allergies || [])] }));
        toast.success('Allergy saved to server');
        return true;
      } catch (err) {
        console.error('Create allergy failed', err);
        toast.error('Failed to save allergy to server.');
        return false;
      }
    } else {
      setUserData(prev => ({ ...prev, allergies: [{ id: Date.now(), ...newAllergy }, ...(prev.allergies || [])] }));
      toast.info('Added allergy locally. Log in to persist');
      return true;
    }
  }, [token]);

  const deleteAllergy = useCallback(async (id) => {
    const allergy = (userData.allergies || []).find(a => (a._id || a.id) === id);
    if (allergy && allergy._id && token) {
      try {
        await API.delete(`/allergies/${allergy._id}`, { signal: AbortSignal.timeout(5000) });
        setUserData(prev => ({ ...prev, allergies: (prev.allergies || []).filter(a => (a._id || a.id) !== allergy._id) }));
        toast.success('Allergy deleted from server');
      } catch (err) {
        console.error('Delete allergy failed', err);
        toast.error('Failed to delete allergy from server.');
      }
    } else {
      setUserData(prev => ({ ...prev, allergies: (prev.allergies || []).filter(a => (a._id || a.id) !== id) }));
      toast.info('Allergy deleted locally');
    }
  }, [token, userData.allergies]);

  const addMedication = useCallback(async (newMedication) => {
    setUserData(prev => ({
      ...prev,
      medications: [{ id: Date.now(), ...newMedication }, ...(prev.medications || [])]
    }));
    toast.info('Medication added locally. Save on your Profile page to persist.');
    return true;
  }, []);

  const deleteMedication = useCallback(async (id) => {
    setUserData(prev => ({
      ...prev,
      medications: (prev.medications || []).filter(m => (m.id || m._id) !== id)
    }));
    toast.info('Medication removed locally.');
  }, []);

  const addIncident = useCallback(async (newIncident) => {
    setUserData(prev => ({
      ...prev,
      allergyHistory: [newIncident, ...(prev.allergyHistory || [])]
    }));
    toast.success('Allergy incident recorded.');
    return true;
  }, []);

  const deleteIncident = useCallback(async (incidentDate) => {
    setUserData(prev => ({
      ...prev,
      allergyHistory: (prev.allergyHistory || []).filter(inc => inc.date !== incidentDate)
    }));
    toast.info('Incident removed.');
  }, []);

  const recordSOSAlert = useCallback(async () => {
    const newAlert = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      status: 'Activated'
    };
    setSosHistory(prev => [newAlert, ...(prev || [])]);
    toast.warning('🚨 SOS Alert Recorded in History!');
    return true;
  }, []);

  return { 
    loading, userData, setUserData, 
    emergencyContacts, setEmergencyContacts, addContact, deleteContact, 
    addAllergy, deleteAllergy,
    addMedication, deleteMedication,
    addIncident, deleteIncident,
    sosHistory, recordSOSAlert
  };
}