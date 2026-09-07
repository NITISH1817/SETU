import { CommonIncomeData } from '../types';

export interface DataValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateIncomeData = (data: Partial<CommonIncomeData>): DataValidationResult => {
  const errors: string[] = [];

  if (!data.citizenId || typeof data.citizenId !== 'string' || !data.citizenId.trim()) {
    errors.push('Invalid or missing Welfare Citizen ID.');
  }

  if (!data.revenueId || typeof data.revenueId !== 'string' || !data.revenueId.trim()) {
    errors.push('Invalid or missing Revenue Citizen ID.');
  }

  if (data.annualIncome === undefined || data.annualIncome === null) {
    errors.push('Annual income field is required and missing.');
  } else if (typeof data.annualIncome !== 'number' || isNaN(data.annualIncome)) {
    errors.push('Annual income must be a valid numeric value.');
  } else if (data.annualIncome < 0) {
    errors.push('Annual income cannot be a negative value.');
  }

  if (!data.source || typeof data.source !== 'string') {
    errors.push('Data source provenance is missing or invalid.');
  }

  if (!data.verified) {
    errors.push('Data verification flag must be set to true.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
