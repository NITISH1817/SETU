import mongoose, { Schema, Document } from 'mongoose';
import { ConsentStatus } from '../types';

export interface IConsent extends Document {
  citizenId: string; // CIT-1001
  requestedData: string; // e.g. "INCOME_CERTIFICATE"
  purpose: string; // e.g. "Scholarship Eligibility Verification"
  grantedAt: Date;
  expiresAt: Date;
  status: ConsentStatus;
  revokedAt?: Date;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConsentSchema: Schema = new Schema(
  {
    citizenId: { type: String, required: true, index: true },
    requestedData: { type: String, required: true, default: 'INCOME_CERTIFICATE' },
    purpose: { type: String, required: true },
    grantedAt: { type: Date, required: true, default: Date.now },
    expiresAt: { type: Date, required: true },
    status: { type: String, enum: Object.values(ConsentStatus), default: ConsentStatus.ACTIVE },
    revokedAt: { type: Date },
    ipAddress: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<IConsent>('Consent', ConsentSchema);
