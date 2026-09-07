import { XMLParser } from 'fast-xml-parser';
import { CommonIncomeData } from '../types';

export const parseRevenueXmlToCommonModel = (
  xmlString: string,
  welfareCitizenId: string
): CommonIncomeData => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    parseTagValue: true,
    trimValues: true
  });

  const parsed = parser.parse(xmlString);

  // XML expected structure:
  // <Citizen>
  //    <RevenueId>REV-7845</RevenueId>
  //    <AnnualIncome>75000</AnnualIncome>
  //    <FinancialYear>2025-2026</FinancialYear>
  // </Citizen>

  const citizenXml = parsed.Citizen || parsed.citizen || parsed;

  const revenueId = citizenXml.RevenueId || citizenXml.revenueId || citizenXml.ID || 'REV-UNKNOWN';
  const rawIncome = citizenXml.AnnualIncome || citizenXml.annualIncome || citizenXml.Income || 0;
  const incomeNum = typeof rawIncome === 'number' ? rawIncome : parseFloat(String(rawIncome).replace(/[^0-9.]/g, '')) || 0;
  const financialYear = citizenXml.FinancialYear || citizenXml.financialYear || '2025-2026';

  return {
    citizenId: welfareCitizenId,
    revenueId: String(revenueId),
    annualIncome: incomeNum,
    financialYear: String(financialYear),
    source: 'Revenue Department Legacy System (XML Interface)',
    verifiedAt: new Date(),
    verified: true
  };
};
