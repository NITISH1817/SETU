import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import Consent from '../models/Consent';
import Notification from '../models/Notification';
import Application from '../models/Application';
import { ConsentStatus, ApplicationStatus } from '../types';
import { logAuditEvent } from '../services/auditService';
import { updateApplicationStatus } from '../services/workflowService';

export const grantConsent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const citizenId = req.user?.citizenId || req.body.citizenId;
    const { purpose, requestedData, expiresInDays, applicationId } = req.body;

    if (!citizenId) {
      return res.status(400).json({ error: 'MISSING_CITIZEN_ID', message: 'Citizen ID is required.' });
    }

    const expiryDays = expiresInDays || 30;
    const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);

    // Deactivate existing consents for this citizen
    await Consent.updateMany(
      { citizenId, status: ConsentStatus.ACTIVE },
      { status: ConsentStatus.EXPIRED }
    );

    const consent = new Consent({
      citizenId,
      requestedData: requestedData || 'INCOME_CERTIFICATE',
      purpose: purpose || 'Scholarship/Pension Eligibility Verification',
      grantedAt: new Date(),
      expiresAt,
      status: ConsentStatus.ACTIVE,
      ipAddress: req.ip
    });

    await consent.save();

    await logAuditEvent({
      userId: req.user?.userId,
      userEmail: req.user?.email,
      role: req.user?.role,
      action: 'CONSENT_GRANTED',
      citizenId,
      status: 'SUCCESS',
      details: { consentId: consent._id, purpose, expiresAt }
    });

    // If an application was pending consent, update its status
    if (applicationId) {
      await updateApplicationStatus(
        applicationId,
        ApplicationStatus.INCOME_VERIFICATION,
        'Citizen granted consent for Revenue Department income retrieval',
        { consentId: consent._id.toString() }
      );
    } else {
      // Find latest submitted application for citizen
      const latestApp = await Application.findOne({
        citizenId,
        status: { $in: [ApplicationStatus.SUBMITTED, ApplicationStatus.CONSENT_PENDING] }
      }).sort({ createdAt: -1 });

      if (latestApp) {
        await updateApplicationStatus(
          latestApp.applicationId,
          ApplicationStatus.INCOME_VERIFICATION,
          'Citizen granted consent for Revenue Department income retrieval',
          { consentId: consent._id.toString() }
        );
      }
    }

    res.status(201).json({
      message: 'Consent granted successfully.',
      consent
    });
  } catch (error: any) {
    res.status(500).json({ error: 'SERVER_ERROR', message: error.message });
  }
};

export const revokeConsent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { consentId } = req.params;
    const citizenId = req.user?.citizenId || req.body.citizenId;

    const consent = await Consent.findOne({
      ...(consentId ? { _id: consentId } : { citizenId, status: ConsentStatus.ACTIVE })
    });

    if (!consent) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'No active consent record found to revoke.' });
    }

    consent.status = ConsentStatus.REVOKED;
    consent.revokedAt = new Date();
    await consent.save();

    await logAuditEvent({
      userId: req.user?.userId,
      userEmail: req.user?.email,
      role: req.user?.role,
      action: 'CONSENT_REVOKED',
      citizenId: consent.citizenId,
      status: 'WARNING',
      details: { consentId: consent._id }
    });

    res.json({
      message: 'Consent revoked successfully. Revenue Department data access is now disabled.',
      consent
    });
  } catch (error: any) {
    res.status(500).json({ error: 'SERVER_ERROR', message: error.message });
  }
};

export const getConsents = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const citizenId = req.user?.citizenId || req.query.citizenId;
    const consents = await Consent.find(citizenId ? { citizenId } : {}).sort({ createdAt: -1 });
    res.json({ consents });
  } catch (error: any) {
    res.status(500).json({ error: 'SERVER_ERROR', message: error.message });
  }
};

export const getNotifications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const citizenId = req.user?.citizenId || req.query.citizenId;
    const notifications = await Notification.find(citizenId ? { citizenId } : {}).sort({ createdAt: -1 });
    res.json({ notifications });
  } catch (error: any) {
    res.status(500).json({ error: 'SERVER_ERROR', message: error.message });
  }
};

export const markNotificationRead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
    res.json({ notification: notif });
  } catch (error: any) {
    res.status(500).json({ error: 'SERVER_ERROR', message: error.message });
  }
};
