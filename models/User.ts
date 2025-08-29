import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  userType: 'personal' | 'organization';
  onboardingCompleted?: boolean;
  onboardingData?: {
    location?: {
      country?: string;
      city?: string;
      zipCode?: string;
    };
    energyType?: string[];
    propertyType?: string;
    currentUsage?: number;
    timeframe?: string;
    goals?: string[];
    completedAt?: Date;
  };
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  userType: {
    type: String,
    enum: ['personal', 'organization'],
    required: [true, 'User type is required'],
  },
  onboardingCompleted: {
    type: Boolean,
    default: false,
  },
  onboardingData: {
    location: {
      country: { type: String, default: '' },
      city: { type: String, default: '' },
      zipCode: { type: String, default: '' },
    },
    energyType: [{ type: String }],
    propertyType: { type: String, default: '' },
    currentUsage: { type: Number, default: 0 },
    timeframe: { type: String, default: '' },
    goals: [{ type: String }],
    completedAt: { type: Date },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);
