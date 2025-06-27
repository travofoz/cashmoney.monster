/**
 * Form state management utilities for loan application
 * Provides centralized state handling with localStorage persistence
 */

/**
 * Initial form data structure based on GCL API requirements
 */
export const initialFormData = {
  // Tracking parameters from URL
  aid: '', // affiliate ID
  cid: '', // campaign ID
  clkid: '', // click ID
  arid: '', // affiliate reference ID
  sub1: '', // sub ID 1
  sub2: '', // sub ID 2
  
  // Step 1: Loan Amount
  loanAmount: '500',
  
  // Step 2: Loan Purpose
  loanPurpose: '',
  
  // Step 3: Personal Information
  firstName: '',
  lastName: '',
  email: '',
  emailOptin: '0',
  mobilePhone: '',
  preferredPronouns: '',
  
  // Step 4: Address
  address: '',
  city: '',
  state: '',
  zip: '',
  homeStatus: '',
  timeAtResidence: '',
  dateOfBirth: '',
  
  // Step 5: Employment
  employmentStatus: '',
  employerName: '',
  workPhone: '',
  paycheckAmount: '', // AVGSALARY - gross paycheck amount
  monthlyIncome: '', // calculated from paycheck + frequency
  payFrequency: '',
  timeAtJob: '',
  nextPayDate: '',
  
  // Step 6: Banking & Identity
  bankName: '',
  routingNumber: '',
  accountNumber: '',
  accountType: '',
  timeAtBank: '',
  driverLicenseNumber: '',
  driverLicenseState: '',
  ssn: '',
  
  // Step 7: Final Agreement
  activeMilitary: '0',
  tcpaPhone: '',
  tcpaConsent: '0',
  
  // Technical tracking fields
  userAgent: '',
  ipAddress: '',
  websiteName: 'cashmoney.monster'
};

/**
 * Load form data from localStorage with fallback to initial data
 * @returns {Object} Form data object
 */
export function loadFormData() {
  if (typeof window === 'undefined') return initialFormData;
  
  try {
    const stored = localStorage.getItem('loanFormData');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with initial data to ensure all fields exist
      return { ...initialFormData, ...parsed };
    }
  } catch (error) {
    console.warn('Failed to load form data from localStorage:', error);
  }
  
  return { ...initialFormData };
}

/**
 * Save form data to localStorage
 * @param {Object} formData - Form data to save
 */
export function saveFormData(formData) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('loanFormData', JSON.stringify(formData));
  } catch (error) {
    console.warn('Failed to save form data to localStorage:', error);
  }
}

/**
 * Clear form data from localStorage
 */
export function clearFormData() {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('loanFormData');
  } catch (error) {
    console.warn('Failed to clear form data from localStorage:', error);
  }
}

/**
 * Get current form step based on completed fields
 * @param {Object} formData - Current form data
 * @returns {number} Current step (1-6)
 */
export function getCurrentStep(formData) {
  // Step 1: Loan Details (amount and purpose)
  if (!formData.loanAmount || !formData.loanPurpose) {
    return 1;
  }
  
  // Step 2: Personal Information
  if (!formData.firstName || !formData.lastName || !formData.email || 
      !formData.homePhone || !formData.dateOfBirth || !formData.ssn ||
      !formData.address || !formData.city || !formData.state || !formData.zip) {
    return 2;
  }
  
  // Step 3: Employment & Financial Information
  if (!formData.employmentStatus || !formData.bankName || !formData.routingNumber || 
      !formData.accountNumber || !formData.employerName || !formData.grossPay || 
      !formData.payPeriod || !formData.nextPayDate) {
    return 3;
  }
  
  // Step 4: Additional Details
  if (!formData.reference1Name || !formData.reference1Phone ||
      !formData.reference2Name || !formData.reference2Phone) {
    return 4;
  }
  
  // Step 5: TCPA Consent
  if (!formData.tcpa) {
    return 5;
  }
  
  // All steps complete
  return 5;
}

/**
 * Validate if step can be progressed
 * @param {number} step - Step number to validate
 * @param {Object} formData - Current form data
 * @returns {boolean} True if step is complete
 */
export function canProgressFromStep(step, formData) {
  switch (step) {
    case 1:
      return formData.loanAmount && formData.loanPurpose;
    
    case 2:
      return formData.firstName && formData.lastName && formData.email &&
             formData.homePhone && formData.dateOfBirth && formData.ssn &&
             formData.address && formData.city && formData.state && formData.zip;
    
    case 3:
      return formData.employmentStatus && formData.bankName && formData.routingNumber && 
             formData.accountNumber && formData.employerName && formData.grossPay && 
             formData.payPeriod && formData.nextPayDate;
    
    case 4:
      return formData.reference1Name && formData.reference1Phone &&
             formData.reference2Name && formData.reference2Phone;
    
    case 5:
      return formData.tcpa;
    
    default:
      return false;
  }
}

/**
 * Get form completion percentage
 * @param {Object} formData - Current form data
 * @returns {number} Completion percentage (0-100)
 */
export function getFormCompletionPercentage(formData) {
  const totalSteps = 5;
  const currentStep = getCurrentStep(formData);
  
  // If on the last step and TCPA is checked, 100% complete
  if (currentStep === 5 && formData.tcpa) {
    return 100;
  }
  
  // Otherwise, calculate based on current step
  return Math.min(((currentStep - 1) / totalSteps) * 100, 100);
}

/**
 * Format form data for GCL API submission
 * @param {Object} formData - Form data to format
 * @returns {Object} Formatted data for API
 */
export function formatForGCLAPI(formData) {
  // Clean phone numbers
  const cleanPhone = (phone) => phone ? phone.replace(/\D/g, '') : '0000000000';

  return {
    // Required tracking fields
    SourceID: process.env.NEXT_PUBLIC_GCL_SOURCE_ID,
    Partner: process.env.NEXT_PUBLIC_GCL_PARTNER,
    AID: formData.aid || 'cashmoney-monster',
    
    // Additional tracking parameters
    CID: formData.cid || '',
    CLKID: formData.clkid || '',
    ARID: formData.arid || '',
    SUB1: formData.sub1 || '',
    SUB2: formData.sub2 || '',
    
    // Required customer information
    CUSTGENDER: formData.preferredPronouns || 'M',
    CUSTFNAME: formData.firstName,
    CUSTLNAME: formData.lastName,
    CUSTZIP: formData.zip,
    CUSTCITY: formData.city,
    CUSTSTATE: formData.state,
    CUSTHOMEPHONE: cleanPhone(formData.tcpaPhone || formData.mobilePhone),
    CUSTEMAIL: formData.email,
    HOWPAID: 'DC', // Default to Direct Deposit to Checking
    CUSTBANKNAME: formData.bankName,
    CUSTABANO: cleanPhone(formData.routingNumber),
    CUSTACCTNO: formData.accountNumber,
    TIMEATBANK: formData.timeAtBank || '3',
    LOANAMOUNT: formData.loanAmount,
    CUSTSSN: cleanPhone(formData.ssn),
    CUSTADD1: formData.address,
    TIMEATRESIDENCE: formData.timeAtResidence || '3',
    CUSTMOBILEPHONE: cleanPhone(formData.tcpaPhone || formData.mobilePhone),
    HOMESTATUS: formData.homeStatus,
    CUSTDLNO: formData.driverLicenseNumber,
    CUSTDLSTATE: formData.driverLicenseState,
    CUSTDOB: formData.dateOfBirth,
    EMPNAME: formData.employerName,
    ACTIVE_MILITARY: formData.activeMilitary || '0',
    TIMEATJOB: formData.timeAtJob || '3',
    CUSTWORKPHONE: cleanPhone(formData.workPhone),
    
    // Employment and income information
    AVGSALARY: formData.paycheckAmount ? formData.paycheckAmount.replace(/[^0-9]/g, '') : '750',
    MONTHLYINCOME: formData.monthlyIncome ? formData.monthlyIncome.replace(/[^0-9]/g, '') : '1500',
    PERIODICITY: formData.payFrequency || 'B',
    TYPEOFINCOME: formData.employmentStatus || 'P',
    NEXTPAYDATE: formData.nextPayDate,
    
    // References - sending 'Not Collected' as per spec
    REFFNAME: 'Not Collected',
    REFLNAME: 'Not Collected',
    REFRELATION: 'Not Collected',
    REFHOMEPHONE: '0000000000',
    REFFNAME2: 'Not Collected',
    REFLNAME2: 'Not Collected',
    REFRELATION2: 'Not Collected',
    REFHOMEPHONE2: '0000000000',
    
    // Technical and optional fields
    WEBSITENAME: formData.websiteName || 'cashmoney.monster',
    IP: formData.ipAddress,
    EMAIL_OPTIN: formData.emailOptin || '0',
    USER_AGENT: formData.userAgent,
    TITLE_OPTION: '0' // Default to no title loan interest
  };
}