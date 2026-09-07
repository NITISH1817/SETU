import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import Consent from '../models/Consent';
import { ConsentStatus } from '../types';
import { logAuditEvent } from '../services/auditService';

export const verifyCitizenConsent = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const citizenId = req.body.citizenId || req.params.citizenId || req.query.citizenId || req.user?.citizenId;

    if (!citizenId) {
      return res.status(400).json({
        error: 'MISSING_CITIZEN_ID',
        message: 'Citizen ID parameter is required for consent verification.'
      });
    }

    // Look for active consent for INCOME_CERTIFICATE
    const activeConsent = await Consent.findOne({
      citizenId,
      status: ConsentStatus.ACTIVE,
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    if (!activeConsent) {
      await logAuditEvent({
        userId: req.user?.userId,
        userEmail: req.user?.email,
        role: req.user?.role,
        action: 'CONSENT_CHECK_FAILED',
        citizenId,
        status: 'FAILED',
        details: { reason: 'No active, unexpired consent record found' }
      });

      return res.status(403).json({
        error: 'CONSENT_MISSING_OR_REVOKED',
        message: `Revenue income access denied. Citizen '${citizenId}' has not granted explicit consent or consent has expired/been revoked.`,
        citizenId,
        consentRequired: true
      });
    }

    // Attach verified consent object to request
    (req as any).consent = activeConsent;
    next();
  } catch (error: any) {
    console.error('Consent verification error:', error);
    return res.status(500).json({
      error: 'CONSENT_VERIFICATION_ERROR',
      message: 'Failed to verify citizen consent status.'
    });
  }
};
