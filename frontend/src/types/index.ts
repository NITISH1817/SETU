export type UserRole = 'CITIZEN' | 'WELFARE_OFFICER' | 'REVENUE_OFFICER' | 'ADMIN';

export type ApplicationStatus =
  | 'SUBMITTED'
  | 'CONSENT_PENDING'
  | 'INCOME_VERIFICATION'
  | 'INCOME_VERIFIED'
  | 'ELIGIBILITY_CHECK'
  | 'ELIGIBLE'
  | 'NOT_ELIGIBLE'
  | 'APPROVED'
  | 'REJECTED'
  | 'PAYMENT_PENDING'
  | 'COMPLETED';

export type ConsentStatus = 'ACTIVE' | 'REVOKED' | 'EXPIRED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  citizenId?: string;
  department?: string;
}

export interface Citizen {
  citizenId: string;
  name: string;
  dob: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
  category: string;
}

export interface Scheme {
  _id: string;
  schemeId: string;
  title: string;
  category: 'Scholarship' | 'Pension' | 'Housing' | 'Healthcare';
  description: string;
  department: string;
  maxIncomeThreshold: number;
  minAgeRequired?: number;
  benefitsAmount: number;
  active: boolean;
}

export interface Application {
  _id: string;
  applicationId: string;
  citizenId: string;
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
    verifiedAt?: string;
  };
  eligibilityResult?: {
    isEligible: boolean;
    reason: string;
    evaluatedAt?: string;
  };
  currentDepartment: string;
  nextStep: string;
  statusHistory: Array<{
    status: ApplicationStatus;
    changedAt: string;
    note: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Consent {
  _id: string;
  citizenId: string;
  requestedData: string;
  purpose: string;
  grantedAt: string;
  expiresAt: string;
  status: ConsentStatus;
  revokedAt?: string;
}

export interface NotificationItem {
  _id: string;
  citizenId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  read: boolean;
  applicationId?: string;
  createdAt: string;
}

export interface AuditLogItem {
  _id: string;
  userId?: string;
  userEmail?: string;
  role?: string;
  action: string;
  citizenId?: string;
  revenueId?: string;
  applicationId?: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
  details?: any;
  ipAddress?: string;
  timestamp: string;
}

export interface PipelineDemoStep {
  id: string;
  name: string;
  department: 'WELFARE' | 'MIDDLEWARE' | 'REVENUE';
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';
  description: string;
  data?: any;
}
