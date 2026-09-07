import bcrypt from 'bcryptjs';
import User from '../models/User';
import Citizen from '../models/Citizen';
import CitizenIdMapping from '../models/CitizenIdMapping';
import Scheme from '../models/Scheme';
import EligibilityRule from '../models/EligibilityRule';
import Consent from '../models/Consent';
import Application from '../models/Application';
import AuditLog from '../models/AuditLog';
import Notification from '../models/Notification';
import { UserRole, ConsentStatus, ApplicationStatus } from '../types';

export const seedDefaultData = async () => {
  try {
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('ℹ️ Demo seed data already present in database. Skipping automatic seeding.');
      return;
    }

    console.log('🌱 Seeding initial GovConnect demo dataset...');

    const salt = await bcrypt.genSalt(10);
    const citizenPassword = await bcrypt.hash('Citizen123!', salt);
    const welfarePassword = await bcrypt.hash('Welfare123!', salt);
    const revenuePassword = await bcrypt.hash('Revenue123!', salt);
    const adminPassword = await bcrypt.hash('Admin123!', salt);

    // 1. Demo Users
    await User.create([
      {
        email: 'citizen@gov.in',
        password: citizenPassword,
        name: 'Ramesh Kumar',
        role: UserRole.CITIZEN,
        citizenId: 'CIT-1001',
        department: 'Citizen'
      },
      {
        email: 'citizen2@gov.in',
        password: citizenPassword,
        name: 'Anita Sharma',
        role: UserRole.CITIZEN,
        citizenId: 'CIT-1002',
        department: 'Citizen'
      },
      {
        email: 'citizen3@gov.in',
        password: citizenPassword,
        name: 'Suresh Patel',
        role: UserRole.CITIZEN,
        citizenId: 'CIT-1003',
        department: 'Citizen'
      },
      {
        email: 'welfare@gov.in',
        password: welfarePassword,
        name: 'Dr. Sunita Rao (Welfare Officer)',
        role: UserRole.WELFARE_OFFICER,
        department: 'Social Welfare Department'
      },
      {
        email: 'revenue@gov.in',
        password: revenuePassword,
        name: 'Rajesh Verma (Revenue Officer)',
        role: UserRole.REVENUE_OFFICER,
        department: 'Revenue Department'
      },
      {
        email: 'admin@gov.in',
        password: adminPassword,
        name: 'GovConnect System Administrator',
        role: UserRole.ADMIN,
        department: 'National Informatics Centre (NIC)'
      }
    ]);

    // 2. Demo Citizens
    await Citizen.create([
      {
        citizenId: 'CIT-1001',
        name: 'Ramesh Kumar',
        dob: new Date('2002-08-14'),
        age: 24,
        gender: 'Male',
        phone: '+91 9811223344',
        email: 'citizen@gov.in',
        address: 'H.No 45, Sector 12, RK Puram, New Delhi',
        category: 'OBC'
      },
      {
        citizenId: 'CIT-1002',
        name: 'Anita Sharma',
        dob: new Date('1961-03-22'),
        age: 65,
        gender: 'Female',
        phone: '+91 9822334455',
        email: 'citizen2@gov.in',
        address: 'B-102, Green Park Extension, New Delhi',
        category: 'General'
      },
      {
        citizenId: 'CIT-1003',
        name: 'Suresh Patel',
        dob: new Date('1994-11-05'),
        age: 32,
        gender: 'Male',
        phone: '+91 9833445566',
        email: 'citizen3@gov.in',
        address: '78, Civil Lines, Jaipur, Rajasthan',
        category: 'General'
      }
    ]);

    // 3. ID Mappings (Welfare ID -> Revenue ID)
    await CitizenIdMapping.create([
      { welfareId: 'CIT-1001', revenueId: 'REV-7845', status: 'ACTIVE' },
      { welfareId: 'CIT-1002', revenueId: 'REV-9214', status: 'ACTIVE' },
      { welfareId: 'CIT-1003', revenueId: 'REV-3312', status: 'ACTIVE' }
    ]);

    // 4. Welfare Schemes
    const schemes = await Scheme.create([
      {
        schemeId: 'SCH-SCHOLARSHIP-01',
        title: 'Post-Matric National Merit Scholarship',
        category: 'Scholarship',
        description: 'Financial assistance for higher education for students from low-income families.',
        department: 'Social Welfare Department',
        maxIncomeThreshold: 250000,
        minAgeRequired: 16,
        benefitsAmount: 50000,
        active: true
      },
      {
        schemeId: 'SCH-PENSION-01',
        title: 'Indira Gandhi National Old Age Pension',
        category: 'Pension',
        description: 'Monthly social security financial support pension for senior citizens aged 60 and above.',
        department: 'Social Welfare Department',
        maxIncomeThreshold: 300000,
        minAgeRequired: 60,
        benefitsAmount: 36000,
        active: true
      }
    ]);

    // 5. Configurable Eligibility Rules
    await EligibilityRule.create([
      {
        schemeId: 'SCH-SCHOLARSHIP-01',
        ruleName: 'Max Family Income Rule',
        field: 'annualIncome',
        operator: '<=',
        targetValue: 250000,
        description: 'Annual family income must not exceed ₹2,50,000.',
        active: true
      },
      {
        schemeId: 'SCH-PENSION-01',
        ruleName: 'Senior Citizen Age Criteria',
        field: 'age',
        operator: '>=',
        targetValue: 60,
        description: 'Applicant must be at least 60 years old.',
        active: true
      },
      {
        schemeId: 'SCH-PENSION-01',
        ruleName: 'Pension Income Limit',
        field: 'annualIncome',
        operator: '<=',
        targetValue: 300000,
        description: 'Annual family income must not exceed ₹3,00,000.',
        active: true
      }
    ]);

    // 6. Active Consents
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const consent1 = await Consent.create({
      citizenId: 'CIT-1001',
      requestedData: 'INCOME_CERTIFICATE',
      purpose: 'Scholarship Verification',
      grantedAt: new Date(),
      expiresAt,
      status: ConsentStatus.ACTIVE
    });

    const consent2 = await Consent.create({
      citizenId: 'CIT-1002',
      requestedData: 'INCOME_CERTIFICATE',
      purpose: 'Senior Pension Verification',
      grantedAt: new Date(),
      expiresAt,
      status: ConsentStatus.ACTIVE
    });

    // 7. Applications
    await Application.create([
      {
        applicationId: 'APP-2026-001',
        citizenId: 'CIT-1001',
        schemeId: 'SCH-SCHOLARSHIP-01',
        schemeTitle: 'Post-Matric National Merit Scholarship',
        category: 'Scholarship',
        status: ApplicationStatus.ELIGIBLE,
        submissionData: {
          applicantName: 'Ramesh Kumar',
          applicantAge: 24,
          phone: '+91 9811223344',
          address: 'H.No 45, Sector 12, RK Puram, New Delhi',
          purpose: 'Scholarship Grant Application'
        },
        consentId: consent1._id.toString(),
        incomeVerification: {
          verified: true,
          revenueId: 'REV-7845',
          annualIncome: 75000,
          financialYear: '2025-2026',
          source: 'Revenue Department Legacy System (XML Interface)',
          verifiedAt: new Date()
        },
        eligibilityResult: {
          isEligible: true,
          reason: 'Verified income ₹75,000 meets all eligibility criteria for Post-Matric National Merit Scholarship.',
          evaluatedAt: new Date()
        },
        currentDepartment: 'Social Welfare Department',
        nextStep: 'Pending Welfare Officer approval',
        statusHistory: [
          { status: ApplicationStatus.SUBMITTED, changedAt: new Date(Date.now() - 3600000 * 4), note: 'Submitted by citizen' },
          { status: ApplicationStatus.INCOME_VERIFIED, changedAt: new Date(Date.now() - 3600000 * 2), note: 'Income verified from Revenue Department' },
          { status: ApplicationStatus.ELIGIBLE, changedAt: new Date(Date.now() - 3600000 * 1), note: 'Deterministically evaluated as Eligible' }
        ]
      },
      {
        applicationId: 'APP-2026-002',
        citizenId: 'CIT-1002',
        schemeId: 'SCH-PENSION-01',
        schemeTitle: 'Indira Gandhi National Old Age Pension',
        category: 'Pension',
        status: ApplicationStatus.ELIGIBLE,
        submissionData: {
          applicantName: 'Anita Sharma',
          applicantAge: 65,
          phone: '+91 9822334455',
          address: 'B-102, Green Park Extension, New Delhi',
          purpose: 'Old Age Pension Benefit'
        },
        consentId: consent2._id.toString(),
        incomeVerification: {
          verified: true,
          revenueId: 'REV-9214',
          annualIncome: 210000,
          financialYear: '2025-2026',
          source: 'Revenue Department Legacy System (XML Interface)',
          verifiedAt: new Date()
        },
        eligibilityResult: {
          isEligible: true,
          reason: 'Verified income ₹2,10,000 meets all eligibility criteria for Indira Gandhi National Old Age Pension.',
          evaluatedAt: new Date()
        },
        currentDepartment: 'Social Welfare Department',
        nextStep: 'Pending Welfare Officer approval',
        statusHistory: [
          { status: ApplicationStatus.SUBMITTED, changedAt: new Date(Date.now() - 3600000 * 5), note: 'Submitted by citizen' },
          { status: ApplicationStatus.ELIGIBLE, changedAt: new Date(Date.now() - 3600000 * 1), note: 'Evaluated as Eligible' }
        ]
      }
    ]);

    // 8. Notifications
    await Notification.create([
      {
        citizenId: 'CIT-1001',
        title: 'Income Verification Completed',
        message: 'Revenue Department income data verified (₹75,000). Your application is Eligible!',
        type: 'SUCCESS',
        applicationId: 'APP-2026-001',
        read: false
      },
      {
        citizenId: 'CIT-1002',
        title: 'Pension Eligibility Confirmed',
        message: 'Your application for Indira Gandhi National Old Age Pension is verified as Eligible.',
        type: 'SUCCESS',
        applicationId: 'APP-2026-002',
        read: false
      }
    ]);

    // 9. Audit Logs
    await AuditLog.create([
      {
        userEmail: 'citizen@gov.in',
        action: 'APPLICATION_SUBMITTED',
        citizenId: 'CIT-1001',
        applicationId: 'APP-2026-001',
        status: 'SUCCESS',
        details: { schemeTitle: 'Post-Matric National Merit Scholarship' }
      },
      {
        userEmail: 'citizen@gov.in',
        action: 'CONSENT_GRANTED',
        citizenId: 'CIT-1001',
        status: 'SUCCESS',
        details: { scope: 'INCOME_CERTIFICATE' }
      },
      {
        userEmail: 'middleware@gov.in',
        action: 'IDENTITY_MAPPED',
        citizenId: 'CIT-1001',
        revenueId: 'REV-7845',
        status: 'SUCCESS',
        details: { welfareId: 'CIT-1001', revenueId: 'REV-7845' }
      },
      {
        userEmail: 'middleware@gov.in',
        action: 'REVENUE_XML_FETCH',
        revenueId: 'REV-7845',
        status: 'SUCCESS',
        details: { format: 'XML' }
      },
      {
        userEmail: 'middleware@gov.in',
        action: 'DATA_TRANSFORMED',
        citizenId: 'CIT-1001',
        revenueId: 'REV-7845',
        status: 'SUCCESS',
        details: { annualIncome: 75000 }
      }
    ]);

    console.log('✅ Demo dataset seeded successfully!');
  } catch (error) {
    console.error('Error seeding demo dataset:', error);
  }
};
