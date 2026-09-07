import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import Application from '../models/Application';
import Scheme from '../models/Scheme';
import { ApplicationStatus } from '../types';
import { updateApplicationStatus } from '../services/workflowService';

export const getWelfareApplications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, schemeId } = req.query;
    let filter: any = {};

    if (status) filter.status = status;
    if (schemeId) filter.schemeId = schemeId;

    const applications = await Application.find(filter).sort({ updatedAt: -1 });
    res.json({ applications });
  } catch (error: any) {
    res.status(500).json({ error: 'SERVER_ERROR', message: error.message });
  }
};

export const updateOfficerDecision = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { action, note } = req.body; // action: 'APPROVE' | 'REJECT'

    if (!['APPROVE', 'REJECT'].includes(action)) {
      return res.status(400).json({ error: 'INVALID_ACTION', message: 'Action must be APPROVE or REJECT.' });
    }

    const application = await Application.findOne({
      $or: [{ applicationId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
    });

    if (!application) {
      return res.status(404).json({ error: 'NOT_FOUND', message: `Application ${id} not found.` });
    }

    const newStatus = action === 'APPROVE' ? ApplicationStatus.APPROVED : ApplicationStatus.REJECTED;
    const decisionNote = note || `Application ${action === 'APPROVE' ? 'Approved' : 'Rejected'} by Social Welfare Officer.`;

    const updatedApp = await updateApplicationStatus(
      application.applicationId,
      newStatus,
      decisionNote
    );

    res.json({
      message: `Application status updated to ${newStatus}`,
      application: updatedApp
    });
  } catch (error: any) {
    res.status(500).json({ error: 'SERVER_ERROR', message: error.message });
  }
};

export const disburseBenefit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const application = await Application.findOne({
      $or: [{ applicationId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
    });

    if (!application) {
      return res.status(404).json({ error: 'NOT_FOUND', message: `Application ${id} not found.` });
    }

    await updateApplicationStatus(
      application.applicationId,
      ApplicationStatus.PAYMENT_PENDING,
      'Initiated Direct Benefit Transfer (DBT) payout via Treasury Gateway'
    );

    const completedApp = await updateApplicationStatus(
      application.applicationId,
      ApplicationStatus.COMPLETED,
      'Direct Benefit Transfer successfully credited to Citizen bank account ✓'
    );

    res.json({
      message: 'Direct Benefit Transfer completed successfully!',
      application: completedApp
    });
  } catch (error: any) {
    res.status(500).json({ error: 'SERVER_ERROR', message: error.message });
  }
};

export const createScheme = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, category, description, maxIncomeThreshold, benefitsAmount, minAgeRequired } = req.body;

    if (!title || !category || !maxIncomeThreshold || !benefitsAmount) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'All scheme details are required.' });
    }

    const schemeId = `SCH-${category.toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
    const scheme = new Scheme({
      schemeId,
      title,
      category,
      description: description || `Social Welfare assistance scheme for ${category}`,
      department: 'Social Welfare Department',
      maxIncomeThreshold: Number(maxIncomeThreshold),
      minAgeRequired: Number(minAgeRequired || 0),
      benefitsAmount: Number(benefitsAmount),
      active: true
    });

    await scheme.save();
    res.status(201).json({ message: 'Welfare Scheme created successfully', scheme });
  } catch (error: any) {
    res.status(500).json({ error: 'SERVER_ERROR', message: error.message });
  }
};
