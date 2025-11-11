import mongoose from 'mongoose';

const emergencyContactSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/, 'Please provide a valid phone number']
    },
    relationship: {
      type: String,
      enum: ['Parent', 'Sibling', 'Spouse', 'Friend', 'Doctor', 'Other'],
      default: 'Other'
    },
    email: {
      type: String,
      default: null,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    isPrimary: {
      type: Boolean,
      default: false
    },
    notifyBy: {
      type: [String],
      enum: ['phone', 'email', 'sms'],
      default: ['phone']
    },
    address: {
      type: String,
      default: null
    },
    notes: {
      type: String,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const EmergencyContact = mongoose.model('EmergencyContact', emergencyContactSchema);

export default EmergencyContact;
