import EligibilityRule from '../models/EligibilityRule';
import Scheme from '../models/Scheme';

export interface RuleEvaluationResult {
  isEligible: boolean;
  reason: string;
  schemeTitle: string;
  evaluatedRules: Array<{
    ruleName: string;
    passed: boolean;
    details: string;
  }>;
}

export const evaluateEligibility = async (
  schemeId: string,
  citizenAge: number,
  annualIncome: number
): Promise<RuleEvaluationResult> => {
  const scheme = await Scheme.findOne({ schemeId });
  const schemeTitle = scheme ? scheme.title : 'Welfare Scheme';

  // Fetch dynamic rules from DB if exists
  const dbRules = await EligibilityRule.find({ schemeId, active: true });

  const evaluatedRules: Array<{ ruleName: string; passed: boolean; details: string }> = [];
  let overallEligible = true;
  const failureReasons: string[] = [];

  if (dbRules && dbRules.length > 0) {
    for (const rule of dbRules) {
      let valueToTest: number = 0;
      if (rule.field === 'annualIncome') valueToTest = annualIncome;
      if (rule.field === 'age') valueToTest = citizenAge;

      let passed = false;
      const target = Number(rule.targetValue);

      switch (rule.operator) {
        case '<=':
          passed = valueToTest <= target;
          break;
        case '>=':
          passed = valueToTest >= target;
          break;
        case '==':
          passed = valueToTest === target;
          break;
        case '!=':
          passed = valueToTest !== target;
          break;
      }

      const details = `${rule.field} (${valueToTest}) ${rule.operator} ${target}`;
      evaluatedRules.push({ ruleName: rule.ruleName, passed, details });

      if (!passed) {
        overallEligible = false;
        failureReasons.push(`${rule.description} [Failed: ${valueToTest} vs target ${target}]`);
      }
    }
  } else {
    // Default deterministic rules if scheme not in DB
    const isScholarship = schemeId.toUpperCase().includes('SCHOLARSHIP') || (scheme && scheme.category === 'Scholarship');
    const isPension = schemeId.toUpperCase().includes('PENSION') || (scheme && scheme.category === 'Pension');

    if (isPension) {
      const ageRulePassed = citizenAge >= 60;
      const incomeRulePassed = annualIncome <= 300000;

      evaluatedRules.push({
        ruleName: 'Senior Citizen Age Verification',
        passed: ageRulePassed,
        details: `Age ${citizenAge} >= 60`
      });
      evaluatedRules.push({
        ruleName: 'Pension Annual Income Threshold',
        passed: incomeRulePassed,
        details: `Income ₹${annualIncome.toLocaleString('en-IN')} <= ₹3,00,000`
      });

      if (!ageRulePassed) failureReasons.push(`Applicant age (${citizenAge}) is under minimum pension age requirement (60).`);
      if (!incomeRulePassed) failureReasons.push(`Verified income (₹${annualIncome.toLocaleString('en-IN')}) exceeds maximum pension income limit (₹3,00,000).`);

      overallEligible = ageRulePassed && incomeRulePassed;
    } else {
      // Default to Scholarship rule
      const incomeThreshold = scheme ? scheme.maxIncomeThreshold : 250000;
      const incomeRulePassed = annualIncome <= incomeThreshold;

      evaluatedRules.push({
        ruleName: 'Scholarship Income Limit Check',
        passed: incomeRulePassed,
        details: `Income ₹${annualIncome.toLocaleString('en-IN')} <= ₹${incomeThreshold.toLocaleString('en-IN')}`
      });

      if (!incomeRulePassed) failureReasons.push(`Verified income (₹${annualIncome.toLocaleString('en-IN')}) exceeds maximum scholarship eligibility threshold (₹${incomeThreshold.toLocaleString('en-IN')}).`);

      overallEligible = incomeRulePassed;
    }
  }

  const reason = overallEligible
    ? `Verified income ₹${annualIncome.toLocaleString('en-IN')} meets all eligibility criteria for ${schemeTitle}.`
    : `Ineligible: ${failureReasons.join(' ')}`;

  return {
    isEligible: overallEligible,
    reason,
    schemeTitle,
    evaluatedRules
  };
};
