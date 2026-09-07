import Application, { IApplication } from '../models/Application';
import { ApplicationStatus } from '../types';
import { createNotification } from './notificationService';
import { logAuditEvent } from './auditService';

export const updateApplicationStatus = async (
  applicationId: string,
  newStatus: ApplicationStatus,
  note: string,
  extraData?: Partial<IApplication>
): Promise<IApplication | null> => {
  const application = await Application.findOne({ applicationId });
  if (!application) return null;

  application.status = newStatus;
  application.statusHistory.push({
    status: newStatus,
    changedAt: new Date(),
    note
  });

  // Department & Next Step state mapping
  switch (newStatus) {
    case ApplicationStatus.SUBMITTED:
      application.currentDepartment = 'Social Welfare Department';
      application.nextStep = 'Citizen consent required for Revenue income verification';
      break;

    case ApplicationStatus.CONSENT_PENDING:
      application.currentDepartment = 'Citizen Portal (Consent Gateway)';
      application.nextStep = 'Awaiting digital consent from Citizen';
      break;

    case ApplicationStatus.INCOME_VERIFICATION:
      application.currentDepartment = 'GovConnect Interoperability Middleware';
      application.nextStep = 'Requesting XML data from Revenue Department';
      break;

    case ApplicationStatus.INCOME_VERIFIED:
      application.currentDepartment = 'GovConnect Interoperability Middleware';
      application.nextStep = 'Evaluating rules in Eligibility Engine';
      break;

    case ApplicationStatus.ELIGIBILITY_CHECK:
      application.currentDepartment = 'Eligibility Engine';
      application.nextStep = 'Determining qualification result';
      break;

    case ApplicationStatus.ELIGIBLE:
      application.currentDepartment = 'Social Welfare Department';
      application.nextStep = 'Pending Welfare Officer final review & approval';
      break;

    case ApplicationStatus.NOT_ELIGIBLE:
      application.currentDepartment = 'Social Welfare Department';
      application.nextStep = 'Application closed (Does not meet income requirements)';
      break;

    case ApplicationStatus.APPROVED:
      application.currentDepartment = 'Treasury & Finance Department';
      application.nextStep = 'Processing direct benefit disbursement';
      break;

    case ApplicationStatus.PAYMENT_PENDING:
      application.currentDepartment = 'DBT Payment Gateway';
      application.nextStep = 'Transferring funds to citizen bank account';
      break;

    case ApplicationStatus.COMPLETED:
      application.currentDepartment = 'Social Welfare Department';
      application.nextStep = 'Benefit successfully disbursed ✓';
      break;
  }

  if (extraData) {
    if (extraData.incomeVerification) {
      application.incomeVerification = {
        ...application.incomeVerification,
        ...extraData.incomeVerification
      };
    }
    if (extraData.eligibilityResult) {
      application.eligibilityResult = extraData.eligibilityResult;
    }
    if (extraData.consentId) {
      application.consentId = extraData.consentId;
    }
  }

  await application.save();

  // Audit logging
  await logAuditEvent({
    action: `WORKFLOW_STATUS_CHANGED`,
    applicationId: application.applicationId,
    citizenId: application.citizenId,
    status: 'SUCCESS',
    details: { oldStatus: application.status, newStatus, note }
  });

  // Citizen Notification
  let notifMessage = `Your application ${application.applicationId} status updated to ${newStatus}.`;
  if (newStatus === ApplicationStatus.INCOME_VERIFIED) {
    notifMessage = `Income verification successfully completed from Revenue Department. Verified income: ₹${application.incomeVerification?.annualIncome?.toLocaleString('en-IN')}.`;
  } else if (newStatus === ApplicationStatus.ELIGIBLE) {
    notifMessage = `Congratulations! You are eligible for ${application.schemeTitle}.`;
  } else if (newStatus === ApplicationStatus.APPROVED) {
    notifMessage = `Your application ${application.applicationId} has been approved by the Welfare Officer.`;
  }

  await createNotification({
    citizenId: application.citizenId,
    title: `Application Update: ${newStatus}`,
    message: notifMessage,
    type: newStatus === ApplicationStatus.NOT_ELIGIBLE ? 'WARNING' : 'SUCCESS',
    applicationId: application.applicationId
  });

  return application;
};
