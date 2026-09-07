import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../types';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  citizenId?: string; // e.g. CIT-1001
  department?: string; // Revenue, Welfare, etc.
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), required: true, default: UserRole.CITIZEN },
    citizenId: { type: String, index: true },
    department: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
