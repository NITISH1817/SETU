import mongoose, { Schema, Document } from 'mongoose';

export interface ICitizenIdMapping extends Document {
  welfareId: string; // CIT-1001
  revenueId: string; // REV-7845
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

const CitizenIdMappingSchema: Schema = new Schema(
  {
    welfareId: { type: String, required: true, unique: true, index: true },
    revenueId: { type: String, required: true, unique: true, index: true },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' }
  },
  { timestamps: true }
);

export default mongoose.model<ICitizenIdMapping>('CitizenIdMapping', CitizenIdMappingSchema);
