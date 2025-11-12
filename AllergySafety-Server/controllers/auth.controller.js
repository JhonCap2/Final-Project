import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { fullName, email, phone, password, confirmPassword, bloodType } = req.body;

    // Validate input
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Create user
    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      phone,
      password,
      bloodType: bloodType || 'Unknown'
    });

    // Generate token
    const token = generateToken(user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.status(201).json({
      success: true,
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message || 'Error during registration' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for user (include password field)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Error during login' });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req, res) => {
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
    console.error('Get current user error:', error);
    res.status(500).json({ message: error.message || 'Error fetching user' });
  }
};

// @desc    Verify token
// @route   GET /api/auth/verify
// @access  Private
export const verifyToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({ message: error.message || 'Error verifying token' });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: error.message || 'Error during logout' });
  }
};

// @desc    Google OAuth login
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Google token required' });
    }

    // NOTE: In production, verify token with Google's API:
    // import { OAuth2Client } from 'google-auth-library';
    // const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    // const ticket = await client.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
    // const payload = ticket.getPayload();
    
    // For now, we'll decode the JWT token (Google provides a JWT with email, name, picture)
    // In production, you should verify the token signature with Google's public keys
    
    const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    
    if (!decoded.email) {
      return res.status(400).json({ message: 'Invalid token: no email found' });
    }

    // Find or create user
    let user = await User.findOne({ email: decoded.email.toLowerCase() });

    if (!user) {
      // Create new user from Google OAuth
      user = await User.create({
        fullName: decoded.name || 'Google User',
        email: decoded.email.toLowerCase(),
        phone: '+1-GOOGLE-OAUTH',
        password: 'google-oauth-' + Math.random().toString(36).substring(7),
        bloodType: 'Unknown',
        googleId: decoded.sub
      });
    } else if (!user.googleId) {
      // Link Google account to existing user
      user.googleId = decoded.sub;
      await user.save();
    }

    // Generate token
    const jwtToken = generateToken(user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      token: jwtToken,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: error.message || 'Error during Google login' });
  }
};

// @desc    Facebook OAuth login
// @route   POST /api/auth/facebook
// @access  Public
export const facebookLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Facebook token required' });
    }

    // NOTE: In production, verify token with Facebook's API:
    // const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,email,name,picture`);
    // const fbUser = await response.json();
    
    // For now, we'll make a request to Facebook's API to get user info
    const fbResponse = await fetch(
      `https://graph.facebook.com/me?access_token=${token}&fields=id,email,name,picture`
    );

    if (!fbResponse.ok) {
      return res.status(401).json({ message: 'Invalid Facebook token' });
    }

    const fbUser = await fbResponse.json();

    if (!fbUser.email) {
      return res.status(400).json({ message: 'Facebook email permission required' });
    }

    // Find or create user
    let user = await User.findOne({ email: fbUser.email.toLowerCase() });

    if (!user) {
      // Create new user from Facebook OAuth
      user = await User.create({
        fullName: fbUser.name || 'Facebook User',
        email: fbUser.email.toLowerCase(),
        phone: '+1-FACEBOOK-OAUTH',
        password: 'facebook-oauth-' + Math.random().toString(36).substring(7),
        bloodType: 'Unknown',
        facebookId: fbUser.id
      });
    } else if (!user.facebookId) {
      // Link Facebook account to existing user
      user.facebookId = fbUser.id;
      await user.save();
    }

    // Generate token
    const jwtToken = generateToken(user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      token: jwtToken,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Facebook login error:', error);
    res.status(500).json({ message: error.message || 'Error during Facebook login' });
  }
};

// @desc    Forgot password - generate reset token
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide an email address' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // To prevent email enumeration, respond with success even if user not found
      return res.status(200).json({ success: true, message: 'If an account with that email exists, a reset token has been generated' });
    }

    // Generate a token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Set token and expiry (1 hour)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // In production you would send this token via email with a link to a reset page.
    // For development we return the token in the response so it can be used directly.
    console.log(`Password reset token for ${user.email}: ${resetToken}`);

    return res.status(200).json({
      success: true,
      message: 'Password reset token generated',
      resetToken
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: error.message || 'Error generating reset token' });
  }
};

// @desc    Reset password using token
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'Please provide token and new password (and confirmation)' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    }).select('+password');

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Update password and clear reset token fields
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    // Optionally generate a new JWT so the user is logged in immediately
    const jwtToken = generateToken(user._id);

    res.status(200).json({ success: true, token: jwtToken, user: user.toJSON() });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: error.message || 'Error resetting password' });
  }
};
