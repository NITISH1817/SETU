import mongoose, { Schema, Document } from 'mongoose';
import { ApplicationStatus } from '../types';

export interface IApplication extends Document {
  applicationId: string; // APP-2026-001
  citizenId: string; // CIT-1001
  schemeId: string;
  schemeTitle: string;
  category: string;
  status: ApplicationStatus;
  submissionData: {
    applicantName: string;
    applicantAge: number;
    phone: string;
    address: string;
    purpose: string;
  };
  consentId?: string;
  incomeVerification?: {
    verified: boolean;
    revenueId?: string;
    annualIncome?: number;
    financialYear?: string;
    source?: string;
    rawXml?: string;
    verifiedAt?: Date;
  };
  eligibilityResult?: {
    isEligible: boolean;
    reason: string;
    evaluatedAt: Date;
  };
  currentDepartment: string;
  nextStep: string;
  statusHistory: Array<{
    status: ApplicationStatus;
    changedAt: Date;
    note: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema: Schema = new Schema(
  {
    applicationId: { type: String, required: true, unique: true, index: true },
    citizenId: { type: String, required: true, index: true },
    schemeId: { type: String, required: true },
    schemeTitle: { type: String, required: true },
    category: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.SUBMITTED
    },
    submissionData: {
      applicantName: { type: String, required: true },
      applicantAge: { type: Number, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      purpose: { type: String, required: true }
    },
    consentId: { type: String },
    incomeVerification: {
      verified: { type: Boolean, default: false },
      revenueId: { type: String },
      annualIncome: { type: Number },
      financialYear: { type: String },
      source: { type: String },
      rawXml: { type: String },
      verifiedAt: { type: Date }
    },
    eligibilityResult: {
      isEligible: { type: Boolean },
      reason: { type: String },
      evaluatedAt: { type: Date }
    },
    currentDepartment: { type: String, default: 'Social Welfare Department' },
    nextStep: { type: String, default: 'Grant income verification consent' },
    statusHistory: [
      {
        status: { type: String, required: true },
        changedAt: { type: Date, default: Date.now },
        note: { type: String }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model<IApplication>('Application', ApplicationSchema);
