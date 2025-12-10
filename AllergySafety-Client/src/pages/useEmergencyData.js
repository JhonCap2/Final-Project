import { useState, useEffect } from 'react';
import API from '../../axios'; // Asegúrate de que esta ruta sea correcta para tu instancia de axios
import { toast } from 'react-toastify';

export const useEmergencyData = (token) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    fullName: '',
    bloodType: '',
    allergies: [],
    medications: [],
    emergencyContacts: [],
    allergyHistory: [],
  });
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [sosHistory, setSosHistory] = useState([]);

  // Función para cargar los datos iniciales del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const userRes = await API.get('/users/profile');
        const contactsRes = await API.get('/contacts');
        // Asumiendo que el historial de alergias y SOS se obtienen de endpoints separados
        // Si no existen, necesitarás crearlos en el backend o ajustar esta lógica.
        const historyRes = await API.get('/allergies/history'); 
        const sosHistoryRes = await API.get('/sos/history'); 

        setUserData({
          ...userRes.data.user,
          allergies: userRes.data.user.allergies || [],
          medications: userRes.data.user.medications || [],
          allergyHistory: historyRes.data.history || [], 
        });
        setEmergencyContacts(contactsRes.data.contacts || []);
        setSosHistory(sosHistoryRes.data.sosHistory || []); 
      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast.error('Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [token]);

  // --- Funciones CRUD para Contactos ---
  const addContact = async (contactData) => {
    if (!token) {
      toast.info('Please log in to add contacts.');
      return false;
    }
    try {
      const res = await API.post('/contacts', contactData);
      setEmergencyContacts((prev) => [...prev, res.data.contact]);
      toast.success('Contact added successfully!');
      return true;
    } catch (error) {
      console.error('Error adding contact:', error);
      toast.error('Failed to add contact.');
      return false;
    }
  };

  const deleteContact = async (contactId) => {
    if (!token) {
      toast.info('Please log in to delete contacts.');
      return false;
    }
    try {
      await API.delete(`/contacts/${contactId}`);
      setEmergencyContacts((prev) => prev.filter((c) => c._id !== contactId));
      toast.success('Contact deleted successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact.');
      return false;
    }
  };

  // --- Funciones CRUD para Alergias ---
  const addAllergy = async (allergyData) => {
    if (!token) {
      toast.info('Please log in to add allergies.');
      return false;
    }
    try {
      const res = await API.post('/allergies', allergyData);
      setUserData((prev) => ({ ...prev, allergies: [...prev.allergies, res.data.allergy] }));
      toast.success('Allergy added successfully!');
      return true;
    } catch (error) {
      console.error('Error adding allergy:', error);
      toast.error('Failed to add allergy.');
      return false;
    }
  };

  const deleteAllergy = async (allergyId) => {
    if (!token) {
      toast.info('Please log in to delete allergies.');
      return false;
    }
    try {
      await API.delete(`/allergies/${allergyId}`);
      setUserData((prev) => ({ ...prev, allergies: prev.allergies.filter((a) => a._id !== allergyId) }));
      toast.success('Allergy deleted successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting allergy:', error);
      toast.error('Failed to delete allergy.');
      return false;
    }
  };

  // --- Funciones CRUD para Medicamentos ---
  const addMedication = async (medicationData) => {
    if (!token) {
      toast.info('Please log in to add medications.');
      return false;
    }
    try {
      const updatedMedications = [...userData.medications, medicationData];
      const res = await API.put('/users/profile', { medications: updatedMedications }); // Asumiendo que se actualiza via perfil
      setUserData((prev) => ({ ...prev, medications: res.data.user.medications }));
      toast.success('Medication added successfully!');
      return true;
    } catch (error) {
      console.error('Error adding medication:', error);
      toast.error('Failed to add medication.');
      return false;
    }
  };

  const deleteMedication = async (medicationId) => {
    if (!token) {
      toast.info('Please log in to delete medications.');
      return false;
    }
    try {
      const updatedMedications = userData.medications.filter((m) => m._id !== medicationId);
      const res = await API.put('/users/profile', { medications: updatedMedications }); // Asumiendo que se actualiza via perfil
      setUserData((prev) => ({ ...prev, medications: res.data.user.medications }));
      toast.success('Medication deleted successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting medication:', error);
      toast.error('Failed to delete medication.');
      return false;
    }
  };

  // --- Función para activar el SOS ---
  const recordSOSAlert = async () => {
    if (!token) {
      toast.error('You must be logged in to activate SOS.');
      return false;
    }
    if (emergencyContacts.length === 0) {
      toast.warn('No emergency contacts configured. Please add contacts first.');
      return false;
    }

    try {
      const res = await API.post('/sos');
      toast.success(res.data.message || 'SOS alert sent successfully!');
      // Opcionalmente, actualiza el historial de SOS
      setSosHistory((prev) => [...prev, { id: Date.now(), timestamp: new Date().toISOString(), status: 'Activated' }]);
      return true;
    } catch (error) {
      console.error('Error sending SOS alert:', error);
      toast.error(error.response?.data?.message || 'Failed to send SOS alert.');
      return false;
    }
  };

  return {
    loading,
    userData,
    setUserData,
    emergencyContacts,
    setEmergencyContacts, 
    sosHistory,
    addContact,
    deleteContact,
    addAllergy,
    deleteAllergy,
    addMedication,
    deleteMedication,
    recordSOSAlert,
  };
};