export const fetchRevenueIncomeXml = async (revenueId: string): Promise<string> => {
  const revenueApiUrl = process.env.REVENUE_API_URL || 'http://localhost:5000/api/revenue';

  try {
    const response = await fetch(`${revenueApiUrl}/citizen/${revenueId}/income`, {
      headers: { Accept: 'application/xml, text/xml' }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.warn(`⚠️ External call to Revenue API at ${revenueApiUrl} failed/timed out. Generating local XML simulation for revenueId: ${revenueId}`);
    return generateRevenueXmlSimulation(revenueId);
  }
};

export const generateRevenueXmlSimulation = (revenueId: string): string => {
  // Deterministic mock income based on revenue ID for consistent seed data
  let income = 75000;
  if (revenueId === 'REV-7845') income = 75000; // Eligible for Scholarship
  else if (revenueId === 'REV-9214') income = 210000; // Eligible for Pension
  else if (revenueId === 'REV-3312') income = 450000; // Ineligible due to high income
  else {
    const digits = revenueId.replace(/[^0-9]/g, '');
    const num = parseInt(digits || '5000', 10);
    income = (num % 5) * 60000 + 75000;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<Citizen>
    <RevenueId>${revenueId}</RevenueId>
    <AnnualIncome>${income}</AnnualIncome>
    <FinancialYear>2025-2026</FinancialYear>
    <IssuingAuthority>Revenue Department, Govt of State</IssuingAuthority>
</Citizen>`;
};
