import mongoose from 'mongoose';

export const UserRoles = ['tourist', 'admin'];

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: UserRoles, default: 'tourist' },
    contactNumber: { type: String },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Number }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      transform(doc, ret) {
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        return ret;
      }
    }
  }
);

export const User = mongoose.model('User', userSchema);
