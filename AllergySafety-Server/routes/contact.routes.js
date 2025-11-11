import express from 'express';
import {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  setPrimaryContact
} from '../controllers/contact.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getContacts);
router.post('/', createContact);
router.get('/:id', getContact);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);
router.put('/:id/set-primary', setPrimaryContact);

export default router;
