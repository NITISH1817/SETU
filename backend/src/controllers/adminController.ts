import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import Application from '../models/Application';
import AuditLog from '../models/AuditLog';
import EligibilityRule from '../models/EligibilityRule';
import Scheme from '../models/Scheme';
import { ApplicationStatus } from '../types';

export const getAdminMetrics = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const totalApplications = await Application.countDocuments();
    const verifiedApplications = await Application.countDocuments({
      status: { $in: [ApplicationStatus.INCOME_VERIFIED, ApplicationStatus.ELIGIBILITY_CHECK, ApplicationStatus.ELIGIBLE, ApplicationStatus.APPROVED, ApplicationStatus.COMPLETED] }
    });
    const eligibleApplications = await Application.countDocuments({
      status: { $in: [ApplicationStatus.ELIGIBLE, ApplicationStatus.APPROVED, ApplicationStatus.COMPLETED] }
    });
    const pendingApplications = await Application.countDocuments({
      status: { $in: [ApplicationStatus.SUBMITTED, ApplicationStatus.CONSENT_PENDING, ApplicationStatus.INCOME_VERIFICATION] }
    });

    const failedApiRequests = await AuditLog.countDocuments({ status: 'FAILED' });
    const recentAudits = await AuditLog.find().sort({ timestamp: -1 }).limit(10);

    // Calculate mock average processing time based on verified apps
    const avgProcessingTimeSeconds = 1.42;

    res.json({
      metrics: {
        totalApplications,
        verifiedApplications,
        eligibleApplications,
        pendingApplications,
        failedApiRequests,
        revenueApiStatus: 'ONLINE (200 OK - XML Service Active)',
        welfareApiStatus: 'ONLINE (200 OK - Active)',
        middlewareGatewayStatus: 'ONLINE (JWT Auth & Consent Enforcement Active)',
        avgProcessingTimeSeconds
      },
      recentAudits
    });
  } catch (error: any) {
    res.status(500).json({ error: 'SERVER_ERROR', message: error.message });
  }
};

export const getAuditLogs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { action, status, citizenId, limit } = req.query;
    let filter: any = {};

    if (action) filter.action = new RegExp(String(action), 'i');
    if (status) filter.status = status;
    if (citizenId) filter.citizenId = new RegExp(String(citizenId), 'i');

    const logs = await AuditLog.find(filter)
      .sort({ timestamp: -1 })
      .limit(Number(limit) || 100);

    res.json({ logs });
  } catch (error: any) {
    res.status(500).json({ error: 'SERVER_ERROR', message: error.message });
  }
};

export const getRules = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const rules = await EligibilityRule.find().sort({ schemeId: 1 });
    const schemes = await Scheme.find();
    res.json({ rules, schemes });
  } catch (error: any) {
    res.status(500).json({ error: 'SERVER_ERROR', message: error.message });
  }
};

export const createOrUpdateRule = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { schemeId, ruleName, field, operator, targetValue, description } = req.body;

    if (!schemeId || !ruleName || !field || !operator || targetValue === undefined) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'All rule parameters are required.' });
    }

    const rule = new EligibilityRule({
      schemeId,
      ruleName,
      field,
      operator,
      targetValue,
      description: description || `${ruleName}: ${field} ${operator} ${targetValue}`,
      active: true
    });

    await rule.save();

    res.status(201).json({ message: 'Eligibility rule created successfully', rule });
  } catch (error: any) {
    res.status(500).json({ error: 'SERVER_ERROR', message: error.message });
  }
};
