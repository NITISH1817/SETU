import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import Application from '../models/Application';
import Scheme from '../models/Scheme';
import Citizen from '../models/Citizen';
import Consent from '../models/Consent';
import { ApplicationStatus, ConsentStatus } from '../types';
import { logAuditEvent } from '../services/auditService';
import { createNotification } from '../services/notificationService';

export const createApplication = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { schemeId, purpose, autoGrantConsent } = req.body;
    const citizenId = req.user?.citizenId || req.body.citizenId;

    if (!citizenId || !schemeId) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'Citizen ID and Scheme ID are required.' });
    }

    const scheme = await Scheme.findOne({ schemeId });
    if (!scheme) {
      return res.status(404).json({ error: 'SCHEME_NOT_FOUND', message: `Scheme '${schemeId}' does not exist.` });
    }

    let citizen = await Citizen.findOne({ citizenId });
    if (!citizen) {
      citizen = await Citizen.create({
        citizenId,
        name: req.user?.email ? req.user.email.split('@')[0] : 'Citizen',
        dob: new Date('1998-05-15'),
        age: 26,
        gender: 'Male',
        phone: '+91 9876543210',
        email: req.user?.email || 'citizen@gov.in',
        address: 'New Delhi, India'
      });
    }

    const count = await Application.countDocuments();
    const applicationId = `APP-2026-${String(count + 1).padStart(3, '0')}`;

    let consentId: string | undefined = undefined;
    let initialStatus = ApplicationStatus.CONSENT_PENDING;

    if (autoGrantConsent) {
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      const newConsent = await Consent.create({
        citizenId,
        requestedData: 'INCOME_CERTIFICATE',
        purpose: `Income Verification for ${scheme.title}`,
        grantedAt: new Date(),
        expiresAt,
        status: ConsentStatus.ACTIVE,
        ipAddress: req.ip
      });
      consentId = newConsent._id.toString();
      initialStatus = ApplicationStatus.INCOME_VERIFICATION;
    }

    const application = new Application({
      applicationId,
      citizenId,
      schemeId: scheme.schemeId,
      schemeTitle: scheme.title,
      category: scheme.category,
      status: initialStatus,
      submissionData: {
        applicantName: citizen.name,
        applicantAge: citizen.age,
        phone: citizen.phone,
        address: citizen.address,
        purpose: purpose || `Application for ${scheme.title}`
      },
      consentId,
      currentDepartment: initialStatus === ApplicationStatus.INCOME_VERIFICATION ? 'GovConnect Interoperability Middleware' : 'Citizen Portal',
      nextStep: initialStatus === ApplicationStatus.INCOME_VERIFICATION ? 'Requesting XML income verification from Revenue Department' : 'Provide consent for Revenue income verification',
      statusHistory: [
        {
          status: ApplicationStatus.SUBMITTED,
          changedAt: new Date(),
          note: 'Application created by citizen'
        },
        ...(autoGrantConsent ? [{
          status: ApplicationStatus.INCOME_VERIFICATION,
          changedAt: new Date(),
          note: 'Citizen provided instant digital consent for income verification'
        }] : [])
      ]
    });

    await application.save();

    await logAuditEvent({
      userId: req.user?.userId,
      userEmail: req.user?.email,
      role: req.user?.role,
      action: 'APPLICATION_SUBMITTED',
      citizenId,
      applicationId,
      status: 'SUCCESS',
      details: { schemeId, autoGrantConsent }
    });

    await createNotification({
      citizenId,
      title: 'Application Submitted',
      message: `Your application ${applicationId} for ${scheme.title} has been submitted successfully.`,
      type: 'INFO',
      applicationId
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error: any) {
    console.error('Create application error:', error);
    res.status(500).json({ error: 'SERVER_ERROR', message: error.message });
  }
};

export const getApplications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { role, citizenId: userCitizenId } = req.user || {};
    const queryCitizenId = req.query.citizenId;

    let filter: any = {};

    if (role === 'CITIZEN') {
      filter.citizenId = userCitizenId || queryCitizenId;
    } else if (queryCitizenId) {
      filter.citizenId = queryCitizenId;
    }

    const applications = await Application.find(filter).sort({ createdAt: -1 });
    res.json({ applications });
  } catch (error: any) {
    res.status(500).json({ error: 'SERVER_ERROR', message: error.message });
  }
};

export const getApplicationById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const application = await Application.findOne({
      $or: [{ applicationId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
    });

    if (!application) {
      return res.status(404).json({ error: 'NOT_FOUND', message: `Application ${id} not found.` });
    }

    res.json({ application });
  } catch (error: any) {
    res.status(500).json({ error: 'SERVER_ERROR', message: error.message });
  }
};

export const getSchemes = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const schemes = await Scheme.find({ active: true }).sort({ category: 1 });
    res.json({ schemes });
  } catch (error: any) {
    res.status(500).json({ error: 'SERVER_ERROR', message: error.message });
  }
};
