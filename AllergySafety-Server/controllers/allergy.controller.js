import Allergy from '../models/Allergy.js';
import User from '../models/User.js';

// @desc    Get all allergies for user
// @route   GET /api/allergies
// @access  Private
export const getAllergies = async (req, res) => {
  try {
    const allergies = await Allergy.find({ user: req.user.userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: allergies.length,
      allergies
    });
  } catch (error) {
    console.error('Get allergies error:', error);
    res.status(500).json({ message: error.message || 'Error fetching allergies' });
  }
};

// @desc    Get single allergy
// @route   GET /api/allergies/:id
// @access  Private
export const getAllergy = async (req, res) => {
  try {
    const allergy = await Allergy.findById(req.params.id);

    if (!allergy) {
      return res.status(404).json({ message: 'Allergy not found' });
    }

    // Check if user owns this allergy
    if (allergy.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to access this allergy' });
    }

    res.status(200).json({
      success: true,
      allergy
    });
  } catch (error) {
    console.error('Get allergy error:', error);
    res.status(500).json({ message: error.message || 'Error fetching allergy' });
  }
};

// @desc    Create new allergy
// @route   POST /api/allergies
// @access  Private
export const createAllergy = async (req, res) => {
  try {
    console.log('createAllergy called by user:', req.user?.userId)
    const { allergen, severity, symptoms, reactions, treatment, triggers, medications } = req.body;

    if (!allergen) {
      return res.status(400).json({ message: 'Allergen name is required' });
    }

    const allergy = await Allergy.create({
      user: req.user.userId,
      allergen,
      severity: severity || 'Mild',
      symptoms: symptoms || [],
      reactions: reactions || '',
      treatment: treatment || '',
      triggers: triggers || [],
      medications: medications || []
    });

    // Add allergy to user's allergies array
    const user = await User.findById(req.user.userId);
    user.allergies.push(allergy._id);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Allergy created successfully',
      allergy
    });
  } catch (error) {
    console.error('Create allergy error:', error, 'req.user:', req.user)
    res.status(500).json({ message: error.message || 'Error creating allergy' });
  }
};

// @desc    Update allergy
// @route   PUT /api/allergies/:id
// @access  Private
export const updateAllergy = async (req, res) => {
  try {
    console.log('updateAllergy called by user:', req.user?.userId, 'allergyId:', req.params.id)
    let allergy = await Allergy.findById(req.params.id);

    if (!allergy) {
      return res.status(404).json({ message: 'Allergy not found' });
    }

    // Check if user owns this allergy
    if (allergy.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this allergy' });
    }

    // Update fields
    const { allergen, severity, symptoms, reactions, treatment, triggers, medications, lastReaction, notes } = req.body;

    if (allergen) allergy.allergen = allergen;
    if (severity) allergy.severity = severity;
    if (symptoms) allergy.symptoms = symptoms;
    if (reactions) allergy.reactions = reactions;
    if (treatment) allergy.treatment = treatment;
    if (triggers) allergy.triggers = triggers;
    if (medications) allergy.medications = medications;
    if (lastReaction) allergy.lastReaction = lastReaction;
    if (notes) allergy.notes = notes;

    allergy.updatedAt = new Date();
    await allergy.save();

    res.status(200).json({
      success: true,
      message: 'Allergy updated successfully',
      allergy
    });
  } catch (error) {
    console.error('Update allergy error:', error, 'req.user:', req.user)
    res.status(500).json({ message: error.message || 'Error updating allergy' });
  }
};

// @desc    Delete allergy
// @route   DELETE /api/allergies/:id
// @access  Private
export const deleteAllergy = async (req, res) => {
  try {
    console.log('deleteAllergy called by user:', req.user?.userId, 'allergyId:', req.params.id)
    const allergy = await Allergy.findById(req.params.id);

    if (!allergy) {
      return res.status(404).json({ message: 'Allergy not found' });
    }

    // Check if user owns this allergy
    if (allergy.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this allergy' });
    }

    // Remove allergy from user's allergies array
    const user = await User.findById(req.user.userId);
    user.allergies = user.allergies.filter(id => id.toString() !== req.params.id);
    await user.save();

    await Allergy.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Allergy deleted successfully'
    });
  } catch (error) {
    console.error('Delete allergy error:', error, 'req.user:', req.user)
    res.status(500).json({ message: error.message || 'Error deleting allergy' });
  }
};

// @desc    Log allergy reaction
// @route   POST /api/allergies/:id/reaction
// @access  Private
export const logReaction = async (req, res) => {
  try {
    const { severity, description } = req.body;

    const allergy = await Allergy.findById(req.params.id);

    if (!allergy) {
      return res.status(404).json({ message: 'Allergy not found' });
    }

    // Check if user owns this allergy
    if (allergy.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to log reaction for this allergy' });
    }

    allergy.lastReaction = new Date();
    await allergy.save();

    res.status(200).json({
      success: true,
      message: 'Reaction logged successfully',
      allergy
    });
  } catch (error) {
    console.error('Log reaction error:', error);
    res.status(500).json({ message: error.message || 'Error logging reaction' });
  }
};
