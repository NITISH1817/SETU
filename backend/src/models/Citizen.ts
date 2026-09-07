import mongoose, { Schema, Document } from 'mongoose';

export interface ICitizen extends Document {
  citizenId: string; // Welfare ID, e.g., CIT-1001
  name: string;
  dob: Date;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
  category: string;
  aadharHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CitizenSchema: Schema = new Schema(
  {
    citizenId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    category: { type: String, default: 'General' },
    aadharHash: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<ICitizen>('Citizen', CitizenSchema);
