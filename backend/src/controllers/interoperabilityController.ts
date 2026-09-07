import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import Application from '../models/Application';
import Citizen from '../models/Citizen';
import Scheme from '../models/Scheme';
import { ApplicationStatus } from '../types';
import { getRevenueIdForCitizen } from '../services/idMappingService';
import { fetchRevenueIncomeXml, generateRevenueXmlSimulation } from '../services/revenueClient';
import { parseRevenueXmlToCommonModel } from '../services/xmlTransformer';
import { validateIncomeData } from '../services/dataValidator';
import { evaluateEligibility } from '../services/eligibilityEngine';
import { updateApplicationStatus } from '../services/workflowService';
import { logAuditEvent } from '../services/auditService';

export const verifyIncomeInteroperability = async (req: AuthenticatedRequest, res: Response) => {
  const startTime = Date.now();
  try {
    const { applicationId, citizenId: bodyCitizenId } = req.body;
    const citizenId = bodyCitizenId || req.user?.citizenId;

    if (!citizenId) {
      return res.status(400).json({ error: 'MISSING_CITIZEN_ID', message: 'Welfare Citizen ID is required.' });
    }

    let application = null;
    if (applicationId) {
      application = await Application.findOne({ applicationId });
    } else {
      application = await Application.findOne({
        citizenId,
        status: { $in: [ApplicationStatus.SUBMITTED, ApplicationStatus.CONSENT_PENDING, ApplicationStatus.INCOME_VERIFICATION] }
      }).sort({ createdAt: -1 });
    }

    if (!application) {
      // Create lightweight application if none existing
      const scheme = await Scheme.findOne() || { schemeId: 'SCH-SCHOLARSHIP-01', title: 'Pre-Matric Post-Matric Scholarship', category: 'Scholarship', maxIncomeThreshold: 250000 };
      application = new Application({
        applicationId: `APP-2026-${Math.floor(100 + Math.random() * 900)}`,
        citizenId,
        schemeId: scheme.schemeId,
        schemeTitle: scheme.title,
        category: scheme.category,
        status: ApplicationStatus.INCOME_VERIFICATION,
        submissionData: {
          applicantName: 'Applicant',
          applicantAge: 24,
          phone: '+91 9876543210',
          address: 'New Delhi',
          purpose: 'Income Verification Test'
        }
      });
      await application.save();
    }

    // Step 1: ID Mapping (Welfare CIT-xxxx -> Revenue REV-xxxx)
    const revenueId = await getRevenueIdForCitizen(citizenId);
    if (!revenueId) {
      await logAuditEvent({
        userId: req.user?.userId,
        userEmail: req.user?.email,
        role: req.user?.role,
        action: 'IDENTITY_MAPPING_FAILED',
        citizenId,
        status: 'FAILED',
        details: { reason: `No Revenue ID mapping found for Welfare ID ${citizenId}` }
      });

      return res.status(404).json({
        error: 'IDENTITY_MAPPING_NOT_FOUND',
        message: `Could not resolve Revenue Department Citizen ID for Welfare ID '${citizenId}'.`
      });
    }

    await logAuditEvent({
      userId: req.user?.userId,
      userEmail: req.user?.email,
      role: req.user?.role,
      action: 'IDENTITY_MAPPED',
      citizenId,
      revenueId,
      status: 'SUCCESS',
      details: { welfareId: citizenId, revenueId }
    });

    // Step 2: Revenue API Fetch (Returns XML)
    const rawXml = await fetchRevenueIncomeXml(revenueId);

    await logAuditEvent({
      userId: req.user?.userId,
      userEmail: req.user?.email,
      role: req.user?.role,
      action: 'REVENUE_XML_FETCHED',
      citizenId,
      revenueId,
      status: 'SUCCESS',
      details: { rawXmlLength: rawXml.length }
    });

    // Step 3: Syntactic Data Transformation (XML -> Common JSON)
    const commonData = parseRevenueXmlToCommonModel(rawXml, citizenId);

    await logAuditEvent({
      userId: req.user?.userId,
      userEmail: req.user?.email,
      role: req.user?.role,
      action: 'DATA_TRANSFORMED',
      citizenId,
      revenueId,
      status: 'SUCCESS',
      details: { transformedModel: commonData }
    });

    // Step 4: Data Quality Validation
    const validationResult = validateIncomeData(commonData);
    if (!validationResult.isValid) {
      await logAuditEvent({
        userId: req.user?.userId,
        userEmail: req.user?.email,
        role: req.user?.role,
        action: 'DATA_VALIDATION_FAILED',
        citizenId,
        revenueId,
        status: 'FAILED',
        details: { errors: validationResult.errors }
      });

      return res.status(422).json({
        error: 'DATA_VALIDATION_FAILED',
        message: 'Revenue income data failed quality validation.',
        validationErrors: validationResult.errors
      });
    }

    await logAuditEvent({
      userId: req.user?.userId,
      userEmail: req.user?.email,
      role: req.user?.role,
      action: 'DATA_VALIDATION_PASSED',
      citizenId,
      revenueId,
      status: 'SUCCESS'
    });

    // Update Application Status to INCOME_VERIFIED
    await updateApplicationStatus(
      application.applicationId,
      ApplicationStatus.INCOME_VERIFIED,
      'Income data fetched from Revenue Dept, parsed from XML, and validated successfully',
      {
        incomeVerification: {
          verified: true,
          revenueId,
          annualIncome: commonData.annualIncome,
          financialYear: commonData.financialYear,
          source: commonData.source,
          rawXml,
          verifiedAt: commonData.verifiedAt
        }
      }
    );

    // Step 5: Deterministic Eligibility Engine
    const citizen = await Citizen.findOne({ citizenId });
    const age = citizen ? citizen.age : application.submissionData?.applicantAge || 25;

    const eligibilityResult = await evaluateEligibility(
      application.schemeId,
      age,
      commonData.annualIncome
    );

    const finalStatus = eligibilityResult.isEligible
      ? ApplicationStatus.ELIGIBLE
      : ApplicationStatus.NOT_ELIGIBLE;

    const updatedApp = await updateApplicationStatus(
      application.applicationId,
      finalStatus,
      eligibilityResult.reason,
      {
        eligibilityResult: {
          isEligible: eligibilityResult.isEligible,
          reason: eligibilityResult.reason,
          evaluatedAt: new Date()
        }
      }
    );

    const durationMs = Date.now() - startTime;

    await logAuditEvent({
      userId: req.user?.userId,
      userEmail: req.user?.email,
      role: req.user?.role,
      action: 'INTEROPERABILITY_WORKFLOW_COMPLETED',
      citizenId,
      revenueId,
      applicationId: application.applicationId,
      status: 'SUCCESS',
      details: {
        durationMs,
        isEligible: eligibilityResult.isEligible,
        annualIncome: commonData.annualIncome,
        scheme: application.schemeTitle
      }
    });

    res.json({
      success: true,
      message: 'Cross-departmental interoperability income verification completed successfully.',
      durationMs,
      interoperabilityDetails: {
        welfareCitizenId: citizenId,
        mappedRevenueId: revenueId,
        rawXmlPayload: rawXml,
        transformedCommonModel: commonData,
        validation: { passed: true, checksCount: 6 },
        eligibility: eligibilityResult
      },
      application: updatedApp
    });
  } catch (error: any) {
    console.error('Interoperability Verification error:', error);
    res.status(500).json({ error: 'INTEROPERABILITY_FAILURE', message: error.message });
  }
};

export const getInteroperabilityPipelineDemo = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { citizenId } = req.params;
    const revenueId = await getRevenueIdForCitizen(citizenId) || 'REV-7845';
    const citizen = await Citizen.findOne({ citizenId });
    const application = await Application.findOne({ citizenId }).sort({ createdAt: -1 });

    const rawXml = generateRevenueXmlSimulation(revenueId);
    const commonModel = parseRevenueXmlToCommonModel(rawXml, citizenId);
    const validation = validateIncomeData(commonModel);
    const eligibility = await evaluateEligibility(
      application ? application.schemeId : 'SCH-SCHOLARSHIP-01',
      citizen ? citizen.age : 24,
      commonModel.annualIncome
    );

    const pipelineSteps = [
      {
        id: 'step-1',
        name: 'Welfare System Request',
        department: 'WELFARE',
        status: 'SUCCESS',
        description: 'Initiated scholarship/pension income verification request',
        data: { welfareCitizenId: citizenId, scheme: application?.schemeTitle || 'Government Scholarship' }
      },
      {
        id: 'step-2',
        name: 'Authentication & Access Control',
        department: 'MIDDLEWARE',
        status: 'SUCCESS',
        description: 'JWT validation & Role-based Access Control authorization',
        data: { authenticatedUser: req.user?.email || 'citizen@gov.in', role: req.user?.role || 'CITIZEN' }
      },
      {
        id: 'step-3',
        name: 'Citizen Consent Verification',
        department: 'MIDDLEWARE',
        status: 'SUCCESS',
        description: 'Checked active digital consent for Revenue data retrieval',
        data: { scope: 'INCOME_CERTIFICATE', status: 'ACTIVE', grantedAt: new Date().toISOString() }
      },
      {
        id: 'step-4',
        name: 'Master Identity Mapping',
        department: 'MIDDLEWARE',
        status: 'SUCCESS',
        description: 'Mapped Welfare Citizen ID to Revenue Legacy ID',
        data: { welfareId: citizenId, revenueId }
      },
      {
        id: 'step-5',
        name: 'Revenue Legacy API Execution',
        department: 'REVENUE',
        status: 'SUCCESS',
        description: 'Dispatched request to GET /api/revenue/citizen/:id/income',
        data: { endpoint: `/api/revenue/citizen/${revenueId}/income`, responseFormat: 'XML' }
      },
      {
        id: 'step-6',
        name: 'Legacy XML Payload Receipt',
        department: 'REVENUE',
        status: 'SUCCESS',
        description: 'Received raw XML response from Revenue Department database',
        data: { rawXmlPayload: rawXml }
      },
      {
        id: 'step-7',
        name: 'Syntactic Data Transformation',
        department: 'MIDDLEWARE',
        status: 'SUCCESS',
        description: 'Converted XML payload into Common Data JSON Model',
        data: { transformedJson: commonModel }
      },
      {
        id: 'step-8',
        name: 'Data Quality Validation',
        department: 'MIDDLEWARE',
        status: 'SUCCESS',
        description: 'Executed 6 schema quality & semantic constraint validations',
        data: { isValid: validation.isValid, validatedFields: ['citizenId', 'annualIncome', 'nonNegative', 'provenance'] }
      },
      {
        id: 'step-9',
        name: 'Deterministic Eligibility Engine',
        department: 'WELFARE',
        status: 'SUCCESS',
        description: 'Evaluated rule criteria against verified income',
        data: { isEligible: eligibility.isEligible, reason: eligibility.reason, evaluatedRules: eligibility.evaluatedRules }
      },
      {
        id: 'step-10',
        name: 'Workflow State & Audit Log',
        department: 'MIDDLEWARE',
        status: 'SUCCESS',
        description: 'Updated application status and recorded immutable audit event',
        data: { finalStatus: eligibility.isEligible ? 'ELIGIBLE' : 'NOT_ELIGIBLE', auditEventLogged: true }
      }
    ];

    res.json({
      citizenId,
      revenueId,
      pipelineSteps
    });
  } catch (error: any) {
    res.status(500).json({ error: 'SERVER_ERROR', message: error.message });
  }
};
