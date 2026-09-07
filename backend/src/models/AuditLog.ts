import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  userId?: string;
  userEmail?: string;
  role?: string;
  action: string; // e.g. CONSENT_GRANTED, IDENTITY_MAPPED, REVENUE_XML_FETCH, DATA_TRANSFORMED, ELIGIBILITY_EVALUATED
  citizenId?: string;
  revenueId?: string;
  applicationId?: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
  details?: any;
  ipAddress?: string;
  timestamp: Date;
}

const AuditLogSchema: Schema = new Schema(
  {
    userId: { type: String },
    userEmail: { type: String },
    role: { type: String },
    action: { type: String, required: true, index: true },
    citizenId: { type: String, index: true },
    revenueId: { type: String, index: true },
    applicationId: { type: String, index: true },
    status: { type: String, enum: ['SUCCESS', 'FAILED', 'WARNING'], default: 'SUCCESS' },
    details: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
    timestamp: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
