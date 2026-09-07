import { Request, Response } from 'express';
import { generateRevenueXmlSimulation } from '../services/revenueClient';
import { logAuditEvent } from '../services/auditService';

// In-memory store for revenue records overrides
const revenueRecordsMap: Record<string, { revenueId: string; income: number; year: string }> = {
  'REV-7845': { revenueId: 'REV-7845', income: 75000, year: '2025-2026' },
  'REV-9214': { revenueId: 'REV-9214', income: 210000, year: '2025-2026' },
  'REV-3312': { revenueId: 'REV-3312', income: 450000, year: '2025-2026' }
};

export const getCitizenIncomeXml = async (req: Request, res: Response) => {
  try {
    const revenueId = req.params.id;

    if (!revenueId) {
      return res.status(400).send('<Error>Revenue Citizen ID parameter is required</Error>');
    }

    const record = revenueRecordsMap[revenueId];
    const xmlPayload = record
      ? `<?xml version="1.0" encoding="UTF-8"?>
<Citizen>
    <RevenueId>${record.revenueId}</RevenueId>
    <AnnualIncome>${record.income}</AnnualIncome>
    <FinancialYear>${record.year}</FinancialYear>
    <IssuingAuthority>Revenue Department, Govt of State</IssuingAuthority>
</Citizen>`
      : generateRevenueXmlSimulation(revenueId);

    // Audit log legacy request
    await logAuditEvent({
      action: 'REVENUE_API_XML_DISPATCH',
      revenueId,
      status: 'SUCCESS',
      details: { format: 'XML', protocol: 'REST/HTTP' }
    });

    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.status(200).send(xmlPayload);
  } catch (error: any) {
    console.error('Revenue API simulation error:', error);
    res.status(500).set('Content-Type', 'application/xml').send(`<Error>${error.message}</Error>`);
  }
};

export const updateRevenueRecord = async (req: Request, res: Response) => {
  try {
    const revenueId = req.params.id;
    const { annualIncome } = req.body;

    if (annualIncome === undefined || isNaN(Number(annualIncome))) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'Valid annual income is required.' });
    }

    const incomeNum = Number(annualIncome);
    revenueRecordsMap[revenueId] = {
      revenueId,
      income: incomeNum,
      year: '2025-2026'
    };

    await logAuditEvent({
      action: 'REVENUE_RECORD_UPDATED_BY_OFFICER',
      revenueId,
      status: 'SUCCESS',
      details: { updatedIncome: incomeNum }
    });

    res.json({
      message: `Revenue Department income record updated for ${revenueId}`,
      record: revenueRecordsMap[revenueId]
    });
  } catch (error: any) {
    res.status(500).json({ error: 'SERVER_ERROR', message: error.message });
  }
};

export const getAllRevenueRecords = async (req: Request, res: Response) => {
  res.json({ records: Object.values(revenueRecordsMap) });
};
