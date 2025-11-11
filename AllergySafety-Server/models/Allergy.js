import mongoose from 'mongoose';

const allergySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    allergen: {
      type: String,
      required: [true, 'Allergen name is required'],
      trim: true
    },
    severity: {
      type: String,
      enum: ['Mild', 'Moderate', 'Severe', 'Life-threatening'],
      default: 'Mild'
    },
    symptoms: {
      type: [String],
      default: []
    },
    reactions: {
      type: String,
      default: ''
    },
    treatment: {
      type: String,
      default: ''
    },
    dateDiscovered: {
      type: Date,
      default: Date.now
    },
    lastReaction: {
      type: Date,
      default: null
    },
    notes: {
      type: String,
      default: ''
    },
    medications: [{
      name: String,
      dosage: String,
      frequency: String
    }],
    triggers: {
      type: [String],
      default: []
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

const Allergy = mongoose.model('Allergy', allergySchema);

export default Allergy;
