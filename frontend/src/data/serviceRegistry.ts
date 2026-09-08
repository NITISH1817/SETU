export interface GovernmentService {
  id: string;
  name: string;
  departmentId: string;
  departmentName: string;
  category: string;
  description: string;
  eligibility: string;
  documents: string[];
  processingTime: string;
  keywords: string[];
  route: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  iconType: string; // Just to map an icon dynamically
}

export const departmentsRegistry: Record<string, Department> = {
  'citizen-services': {
    id: 'citizen-services',
    name: 'Citizen Services & Grievance',
    description: 'Unified entry point for certificates, welfare, and public grievances.',
    iconType: 'UserCheck'
  },
  'business-industry': {
    id: 'business-industry',
    name: 'Business & Industry Services',
    description: 'Single-window interface for licenses, startups, and MSME.',
    iconType: 'Building2'
  },
  'welfare-dept': {
    id: 'welfare-dept',
    name: 'Social Welfare Department',
    description: 'Manages social safety net schemes and financial assistance.',
    iconType: 'ShieldCheck'
  },
  'revenue-dept': {
    id: 'revenue-dept',
    name: 'Revenue Department',
    description: 'Handles land records, income certificates, and tax collection.',
    iconType: 'Database'
  }
};

export const servicesRegistry: GovernmentService[] = [
  {
    id: 'business-registration',
    name: 'Business Registration',
    departmentId: 'business-industry',
    departmentName: 'Business & Industry Services',
    category: 'Business',
    description: 'Register a new business or MSME through the unified government platform.',
    eligibility: 'Entrepreneurs, Startups, Existing Businesses',
    documents: ['Identity Proof (Aadhaar/PAN)', 'Address Proof', 'Business Entity Details'],
    processingTime: '3-7 working days',
    keywords: ['business', 'startup', 'company', 'register', 'msme', 'entrepreneur', 'industry'],
    route: '/services/business'
  },
  {
    id: 'industrial-license',
    name: 'Industrial License Approval',
    departmentId: 'business-industry',
    departmentName: 'Business & Industry Services',
    category: 'Industry',
    description: 'Get clearance and approvals for factory setup and industrial operations.',
    eligibility: 'Manufacturing Units, Factories, Large Enterprises',
    documents: ['Land Records', 'Environmental Clearance', 'Project Report'],
    processingTime: '15-30 working days',
    keywords: ['industry', 'factory', 'license', 'approval', 'clearance', 'manufacturing'],
    route: '/services/business'
  },
  {
    id: 'birth-certificate',
    name: 'Birth/Death Certificate',
    departmentId: 'citizen-services',
    departmentName: 'Citizen Services & Grievance',
    category: 'Certificates',
    description: 'Apply for or download official birth and death certificates.',
    eligibility: 'All Citizens',
    documents: ['Hospital Records', 'Parent Identity Proof'],
    processingTime: '3 working days',
    keywords: ['birth', 'death', 'certificate', 'document', 'citizen'],
    route: '/services/citizen'
  },
  {
    id: 'grievance-registration',
    name: 'Public Grievance Registration',
    departmentId: 'citizen-services',
    departmentName: 'Citizen Services & Grievance',
    category: 'Grievance',
    description: 'File complaints regarding public services or government departments.',
    eligibility: 'Any registered citizen',
    documents: ['Supporting Evidence (Photos/Docs)', 'Detailed Description'],
    processingTime: 'Varies by department (SLA: 14 days)',
    keywords: ['complaint', 'grievance', 'issue', 'problem', 'report', 'pgportal'],
    route: '/services/citizen'
  },
  {
    id: 'income-certificate',
    name: 'Income Verification Certificate',
    departmentId: 'revenue-dept',
    departmentName: 'Revenue Department',
    category: 'Certificates',
    description: 'Official certification of annual family income for welfare eligibility.',
    eligibility: 'Citizens requiring proof of income',
    documents: ['Salary Slips / ITR', 'Aadhaar', 'Self Declaration'],
    processingTime: '5-10 working days',
    keywords: ['income', 'certificate', 'revenue', 'tax', 'earnings'],
    route: '/revenue-department'
  },
  {
    id: 'scholarship-scheme',
    name: 'Higher Education Scholarship',
    departmentId: 'welfare-dept',
    departmentName: 'Social Welfare Department',
    category: 'Welfare Schemes',
    description: 'Financial assistance for higher education based on merit and income.',
    eligibility: 'Students with family income < ₹2,50,000/yr',
    documents: ['Income Certificate', 'Academic Records', 'Bank Details'],
    processingTime: '30-45 days (after deadline)',
    keywords: ['scholarship', 'education', 'student', 'welfare', 'scheme', 'money'],
    route: '/welfare-department'
  }
];

// Simple Intent Matching Logic
export const findRecommendedServices = (query: string): GovernmentService[] => {
  if (!query || query.trim() === '') return [];
  
  const normalizedQuery = query.toLowerCase();
  const tokens = normalizedQuery.split(/\s+/);
  
  // Scoring system
  const scoredServices = servicesRegistry.map(service => {
    let score = 0;
    
    // Direct keyword match in title or category (high value)
    if (service.name.toLowerCase().includes(normalizedQuery)) score += 10;
    if (service.category.toLowerCase().includes(normalizedQuery)) score += 8;
    
    // Token matching against predefined keywords
    service.keywords.forEach(kw => {
      if (normalizedQuery.includes(kw)) score += 5;
      tokens.forEach(token => {
        if (kw === token) score += 3;
        else if (kw.includes(token) || token.includes(kw)) score += 1;
      });
    });
    
    return { service, score };
  });
  
  // Filter and sort
  return scoredServices
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.service);
};
