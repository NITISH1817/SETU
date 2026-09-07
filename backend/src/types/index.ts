export enum UserRole {
  CITIZEN = 'CITIZEN',
  WELFARE_OFFICER = 'WELFARE_OFFICER',
  REVENUE_OFFICER = 'REVENUE_OFFICER',
  ADMIN = 'ADMIN'
}

export enum ApplicationStatus {
  SUBMITTED = 'SUBMITTED',
  CONSENT_PENDING = 'CONSENT_PENDING',
  INCOME_VERIFICATION = 'INCOME_VERIFICATION',
  INCOME_VERIFIED = 'INCOME_VERIFIED',
  ELIGIBILITY_CHECK = 'ELIGIBILITY_CHECK',
  ELIGIBLE = 'ELIGIBLE',
  NOT_ELIGIBLE = 'NOT_ELIGIBLE',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  COMPLETED = 'COMPLETED'
}

export enum ConsentStatus {
  ACTIVE = 'ACTIVE',
  REVOKED = 'REVOKED',
  EXPIRED = 'EXPIRED'
}

export interface CommonIncomeData {
  citizenId: string;
  revenueId: string;
  annualIncome: number;
  financialYear: string;
  source: string;
  verifiedAt: Date;
  verified: boolean;
}

export interface VerificationResult {
  success: boolean;
  message: string;
  citizenId: string;
  revenueId?: string;
  transformedData?: CommonIncomeData;
  rawXml?: string;
  validationErrors?: string[];
  eligibilityResult?: {
    isEligible: boolean;
    reason: string;
    schemeName: string;
    evaluatedRules: Array<{
      ruleName: string;
      passed: boolean;
      details: string;
    }>;
  };
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  citizenId?: string;
}

export interface PipelineStep {
  id: string;
  name: string;
  department: 'WELFARE' | 'MIDDLEWARE' | 'REVENUE';
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';
  timestamp?: string;
  details?: any;
  durationMs?: number;
}
