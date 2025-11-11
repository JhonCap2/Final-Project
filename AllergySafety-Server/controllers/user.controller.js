import User from '../models/User.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('allergies')
      .populate('emergencyContacts');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: error.message || 'Error fetching user profile' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const { fullName, phone, bloodType, profilePicture } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (bloodType) user.bloodType = bloodType;
    if (profilePicture) user.profilePicture = profilePicture;

    // Support updating medications and medical conditions from client
    if (req.body.medications !== undefined) {
      // Expect array of { name, dosage, frequency, allergyFor }
      user.medications = Array.isArray(req.body.medications) ? req.body.medications : user.medications;
    }

    if (req.body.medicalConditions !== undefined) {
      user.medicalConditions = Array.isArray(req.body.medicalConditions) ? req.body.medicalConditions : user.medicalConditions;
    }

    user.updatedAt = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: error.message || 'Error updating user profile' });
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findById(req.user.userId).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: error.message || 'Error changing password' });
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
export const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('allergies')
      .populate('emergencyContacts');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const stats = {
      totalAllergies: user.allergies.length,
      emergencyContacts: user.emergencyContacts.length,
      bloodType: user.bloodType,
      memberSince: user.createdAt,
      lastLogin: user.lastLogin
    };

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: error.message || 'Error fetching user statistics' });
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
export const deleteUserAccount = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required to delete account' });
    }

    const user = await User.findById(req.user.userId).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Password is incorrect' });
    }

    // Delete user and related data
    await User.findByIdAndDelete(req.user.userId);

    res.status(200).json({
      success: true,
      message: 'User account deleted successfully'
    });
  } catch (error) {
    console.error('Delete user account error:', error);
    res.status(500).json({ message: error.message || 'Error deleting user account' });
  }
};
