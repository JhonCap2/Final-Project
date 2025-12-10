import mongoose from 'mongoose';

const sosSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Sent', 'Failed', 'Partial'],
      default: 'Sent',
    },
  },
  { timestamps: true }
);

const SOS = mongoose.model('SOS', sosSchema);

export default SOS;