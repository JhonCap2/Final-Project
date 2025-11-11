import EmergencyContact from '../models/EmergencyContact.js';
import User from '../models/User.js';

// @desc    Get all emergency contacts for user
// @route   GET /api/contacts
// @access  Private
export const getContacts = async (req, res) => {
  try {
    const contacts = await EmergencyContact.find({ user: req.user.userId })
      .sort({ isPrimary: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      contacts
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: error.message || 'Error fetching contacts' });
  }
};

// @desc    Get single emergency contact
// @route   GET /api/contacts/:id
// @access  Private
export const getContact = async (req, res) => {
  try {
    const contact = await EmergencyContact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Check if user owns this contact
    if (contact.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to access this contact' });
    }

    res.status(200).json({
      success: true,
      contact
    });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ message: error.message || 'Error fetching contact' });
  }
};

// @desc    Create new emergency contact
// @route   POST /api/contacts
// @access  Private
export const createContact = async (req, res) => {
  try {
    console.log('createContact called by user:', req.user?.userId)
    let { name, phone, relationship, email, isPrimary, address, notes, notifyBy } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone are required' });
    }

    // sanitize relationship to allowed enums
    const allowedRelationships = ['Parent', 'Sibling', 'Spouse', 'Friend', 'Doctor', 'Other'];
    if (!relationship || typeof relationship !== 'string') relationship = 'Other';
    // normalize common lowercase/variants
    const relNormalized = relationship.trim();
    const relCapitalized = relNormalized.charAt(0).toUpperCase() + relNormalized.slice(1);
    relationship = allowedRelationships.includes(relCapitalized) ? relCapitalized : 'Other';

    // Ensure notifyBy is an array
    if (!Array.isArray(notifyBy)) {
      notifyBy = ['phone'];
    }

    try {
      const contact = await EmergencyContact.create({
        user: req.user.userId,
        name,
        phone,
        relationship,
        email: email || undefined,
        isPrimary: isPrimary || false,
        address: address || undefined,
        notes: notes || undefined,
        notifyBy: notifyBy || ['phone']
      });

      // Add contact to user's emergency contacts array
      const user = await User.findById(req.user.userId);
      user.emergencyContacts.push(contact._id);
      await user.save();

      res.status(201).json({
        success: true,
        message: 'Emergency contact created successfully',
        contact
      });
    } catch (err) {
      console.error('Create contact validation error:', err);
      if (err.name === 'ValidationError') {
        // Build field-based messages
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ message: 'Validation failed', errors: messages });
      }
      throw err;
    }
  } catch (error) {
    console.error('Create contact error:', error, 'req.user:', req.user)
    res.status(500).json({ message: error.message || 'Error creating emergency contact' });
  }
};

// @desc    Update emergency contact
// @route   PUT /api/contacts/:id
// @access  Private
export const updateContact = async (req, res) => {
  try {
    console.log('updateContact called by user:', req.user?.userId, 'contactId:', req.params.id)
    let contact = await EmergencyContact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Check if user owns this contact
    if (contact.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this contact' });
    }

    // Update fields
    const { name, phone, relationship, email, isPrimary, address, notes, notifyBy } = req.body;

    if (name) contact.name = name;
    if (phone) contact.phone = phone;
    if (relationship) contact.relationship = relationship;
    if (email !== undefined) contact.email = email;
    if (isPrimary !== undefined) contact.isPrimary = isPrimary;
    if (address !== undefined) contact.address = address;
    if (notes !== undefined) contact.notes = notes;
    if (Array.isArray(notifyBy)) contact.notifyBy = notifyBy;

    contact.updatedAt = new Date();
    await contact.save();

    res.status(200).json({
      success: true,
      message: 'Emergency contact updated successfully',
      contact
    });
  } catch (error) {
    console.error('Update contact error:', error, 'req.user:', req.user)
    res.status(500).json({ message: error.message || 'Error updating emergency contact' });
  }
};

// @desc    Delete emergency contact
// @route   DELETE /api/contacts/:id
// @access  Private
export const deleteContact = async (req, res) => {
  try {
    console.log('deleteContact called by user:', req.user?.userId, 'contactId:', req.params.id)
    const contact = await EmergencyContact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Check if user owns this contact
    if (contact.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this contact' });
    }

    // Remove contact from user's emergency contacts array
    const user = await User.findById(req.user.userId);
    user.emergencyContacts = user.emergencyContacts.filter(id => id.toString() !== req.params.id);
    await user.save();

    await EmergencyContact.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Emergency contact deleted successfully'
    });
  } catch (error) {
    console.error('Delete contact error:', error, 'req.user:', req.user)
    res.status(500).json({ message: error.message || 'Error deleting emergency contact' });
  }
};

// @desc    Set primary emergency contact
// @route   PUT /api/contacts/:id/set-primary
// @access  Private
export const setPrimaryContact = async (req, res) => {
  try {
    console.log('setPrimaryContact called by user:', req.user?.userId, 'contactId:', req.params.id)
    // Remove primary status from all other contacts
    await EmergencyContact.updateMany(
      { user: req.user.userId },
      { isPrimary: false }
    );

    // Set this contact as primary
    const contact = await EmergencyContact.findByIdAndUpdate(
      req.params.id,
      { isPrimary: true, updatedAt: new Date() },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Primary emergency contact set successfully',
      contact
    });
  } catch (error) {
    console.error('Set primary contact error:', error);
    res.status(500).json({ message: error.message || 'Error setting primary contact' });
  }
};
