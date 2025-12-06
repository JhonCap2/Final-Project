import { useState, useEffect } from 'react';
import API from '../../axios'; // Usar la instancia configurada de Axios
import axios from 'axios'; // Importar el objeto principal de axios
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

  useEffect(() => {
    if (!token) {
      setLoading(false);
      // Cargar datos locales si no hay token
      try {
        const localUserData = localStorage.getItem("userMedicalData");
        if (localUserData) setUserData(JSON.parse(localUserData));
      } catch { /* Ignorar error */ }
      return;
    }

    const source = axios.CancelToken.source();
    const config = { cancelToken: source.token };

    const fetchProfile = API.get('/users/profile', config);
    const fetchContacts = API.get('/contacts', config);
    const fetchAllergies = API.get('/allergies', config);

    Promise.all([fetchProfile, fetchContacts, fetchAllergies])
      .then(axios.spread((profileRes, contactsRes, allergiesRes) => {
        // Procesar perfil
        const user = profileRes.data.user;
        setUserData(prev => ({
          ...prev,
          fullName: user.fullName || '',
          bloodType: user.bloodType || '',
          medicalConditions: user.medicalConditions || [],
          medications: user.medications || [],
        }));

        // Procesar contactos
        const contacts = Array.isArray(contactsRes.data.contacts) ? contactsRes.data.contacts : [];
        setEmergencyContacts(contacts);

        // Procesar alergias
        const serverAllergies = Array.isArray(allergiesRes.data.allergies) ? allergiesRes.data.allergies.map(a => ({
          _id: a._id,
          name: a.allergen,
          severity: a.severity ? a.severity.toLowerCase() : 'moderate',
          reaction: a.reactions || ''
        })) : [];
        setUserData(prev => ({ ...prev, allergies: serverAllergies }));
      }))
      .catch(err => {
        if (axios.isCancel(err)) {
          console.log('Request canceled:', err.message);
        } else {
          console.error('Failed to fetch initial data', err);
          toast.error('Failed to load data from server. Some data may be from local cache.');
        }
      })
      .finally(() => {
        setLoading(false);
      });

    // Cleanup: cancelar peticiones si el componente se desmonta
    return () => {
      source.cancel('Component unmounted, canceling requests.');
    };
  }, [token]);

  // Persistencia local
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

  const addContact = async (newContact) => {
    if (token) {
      try {
        const res = await API.post('/contacts', newContact);
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
  };

  const deleteContact = async (id) => {
    const contact = (emergencyContacts || []).find(c => (c._id || c.id) === id);
    if (contact && contact._id && token) {
      try {
        await API.delete(`/contacts/${contact._id}`);
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
  };

  const addAllergy = async (newAllergy) => {
    const severityServer = newAllergy.severity.charAt(0).toUpperCase() + newAllergy.severity.slice(1);
    if (token) {
      try {
        const res = await API.post('/allergies', { allergen: newAllergy.name, severity: severityServer });
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
  };

  const deleteAllergy = async (id) => {
    const allergy = (userData.allergies || []).find(a => (a._id || a.id) === id);
    if (allergy && allergy._id && token) {
      await API.delete(`/allergies/${allergy._id}`);
      setUserData(prev => ({ ...prev, allergies: (prev.allergies || []).filter(a => (a._id || a.id) !== allergy._id) }));
      toast.success('Allergy deleted from server');
    } else {
      setUserData(prev => ({ ...prev, allergies: (prev.allergies || []).filter(a => (a._id || a.id) !== id) }));
      toast.info('Allergy deleted locally');
    }
  };

  const addMedication = async (newMedication) => {
    // En la app real, esto haría una llamada a la API.
    // Por ahora, lo manejamos localmente como en el Dashboard.
    // La lógica para guardar permanentemente está en Profile.jsx.
    setUserData(prev => ({
      ...prev,
      medications: [{ id: Date.now(), ...newMedication }, ...(prev.medications || [])]
    }));
    toast.info('Medication added locally. Save on your Profile page to persist.');
    return true;
  };

  const deleteMedication = async (id) => {
    // Similar a addMedication, se maneja localmente aquí.
    setUserData(prev => ({
      ...prev,
      medications: (prev.medications || []).filter(m => (m.id || m._id) !== id)
    }));
    toast.info('Medication removed locally.');
  };

  const addIncident = async (newIncident) => {
    // En una app real, esto guardaría el incidente en el servidor.
    // Por ahora, lo guardamos en el estado local de userData.
    setUserData(prev => ({
      ...prev,
      allergyHistory: [newIncident, ...(prev.allergyHistory || [])]
    }));
    toast.success('Allergy incident recorded.');
    return true;
  };

  const deleteIncident = async (incidentDate) => {
    // Filtra el historial para eliminar el incidente por su fecha/ID único
    setUserData(prev => ({
      ...prev,
      allergyHistory: (prev.allergyHistory || []).filter(inc => inc.date !== incidentDate)
    }));
    toast.info('Incident removed.');
  };

  const recordSOSAlert = async () => {
    const newAlert = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      status: 'Activated'
    };
    setSosHistory(prev => [newAlert, ...(prev || [])]);
    toast.warning('🚨 SOS Alert Recorded in History!');
    return true;
  };

  return { 
    loading, userData, setUserData, 
    emergencyContacts, addContact, deleteContact, 
    addAllergy, deleteAllergy,
    addMedication, deleteMedication,
    addIncident, deleteIncident,
    sosHistory, recordSOSAlert
  };
}