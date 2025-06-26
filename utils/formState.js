/**
 * Form state management utilities for loan application
 * Provides centralized state handling with localStorage persistence
 */

/**
 * Initial form data structure based on GCL API requirements
 */
export const initialFormData = {
  // Step 1: Introduction (tracking parameters)
  transaction_id: '',
  source: '',
  
  // Step 2: Loan Details
  loanAmount: '',
  loanPurpose: '',
  employmentStatus: '',
  
  // Step 3: Personal Information
  firstName: '',
  lastName: '',
  email: '',
  homePhone: '',
  mobilePhone: '',
  gender: '',
  dateOfBirth: '',
  ssn: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  residenceType: '', // 'Rent' or 'Own'
  timeAtResidence: '', // 1-5 scale
  driversLicense: '',
  driversLicenseState: '',
  militaryStatus: false, // true/false for ACTIVE_MILITARY
  
  // Step 4: Financial Information  
  bankName: '',
  routingNumber: '',
  accountNumber: '',
  accountType: '', // 'checking' or 'savings'
  paymentMethod: '', // DC, DS, PC, PS
  timeAtBank: '', // 1-5 scale
  employerName: '',
  employerAddress: '',
  employerZip: '',
  employerPhone: '',
  timeAtJob: '', // 1-5 scale
  grossPay: '',
  payPeriod: '', // W, B, S, M
  incomeType: '', // P, G, M, W, D, S, L, U
  nextPayDate: '',
  
  // Step 5: Additional Details
  reference1Name: '',
  reference1LastName: '',
  reference1Relationship: '',
  reference1Phone: '',
  reference2Name: '',
  reference2LastName: '',
  reference2Relationship: '',
  reference2Phone: '',
  bestTimeToCall: '', // AM, NN, PM
  emailOptIn: false,
  titleLoanInterest: false,
  
  // Step 6: TCPA Consent
  tcpa: false,
  tcpaLanguage: 'By submitting this form, I agree to receive phone calls and text messages from this company and its partners regarding loan offers.',
  
  // Tracking fields
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
  // Step 1: Introduction - always accessible
  
  // Step 2: Loan Details
  if (!formData.loanAmount || !formData.employmentStatus) {
    return 2;
  }
  
  // Step 3: Personal Information
  if (!formData.firstName || !formData.lastName || !formData.email || 
      !formData.homePhone || !formData.dateOfBirth || !formData.ssn ||
      !formData.address || !formData.city || !formData.state || !formData.zip) {
    return 3;
  }
  
  // Step 4: Financial Information
  if (!formData.bankName || !formData.routingNumber || !formData.accountNumber ||
      !formData.employerName || !formData.grossPay || !formData.payPeriod ||
      !formData.nextPayDate) {
    return 4;
  }
  
  // Step 5: Additional Details
  if (!formData.reference1Name || !formData.reference1Phone ||
      !formData.reference2Name || !formData.reference2Phone) {
    return 5;
  }
  
  // Step 6: TCPA Consent
  if (!formData.tcpa) {
    return 6;
  }
  
  // All steps complete
  return 6;
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
      return true; // Introduction step is always passable
    
    case 2:
      return formData.loanAmount && formData.employmentStatus;
    
    case 3:
      return formData.firstName && formData.lastName && formData.email &&
             formData.homePhone && formData.dateOfBirth && formData.ssn &&
             formData.address && formData.city && formData.state && formData.zip;
    
    case 4:
      return formData.bankName && formData.routingNumber && formData.accountNumber &&
             formData.employerName && formData.grossPay && formData.payPeriod &&
             formData.nextPayDate;
    
    case 5:
      return formData.reference1Name && formData.reference1Phone &&
             formData.reference2Name && formData.reference2Phone;
    
    case 6:
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
  const totalSteps = 6;
  const currentStep = getCurrentStep(formData);
  
  // If on the last step and TCPA is checked, 100% complete
  if (currentStep === 6 && formData.tcpa) {
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
  return {
    // Required tracking fields
    SourceID: process.env.NEXT_PUBLIC_GCL_SOURCE_ID,
    Partner: process.env.NEXT_PUBLIC_GCL_PARTNER,
    AID: 'cashmoney-monster',
    
    // Customer information
    CUSTFNAME: formData.firstName,
    CUSTLNAME: formData.lastName,
    CUSTGENDER: formData.gender === 'male' ? 'M' : 'F',
    CUSTEMAIL: formData.email,
    CUSTHOMEPHONE: formData.homePhone.replace(/\D/g, ''),
    CUSTMOBILEPHONE: formData.mobilePhone?.replace(/\D/g, '') || '',
    CUSTZIP: formData.zip,
    CUSTCITY: formData.city,
    CUSTSTATE: formData.state,
    CUSTDOB: formData.dateOfBirth,
    CUSTSSN: formData.ssn.replace(/\D/g, ''),
    CUSTADD1: formData.address,
    CUSTDLNO: formData.driversLicense,
    CUSTDLSTATE: formData.driversLicenseState,
    
    // Banking information
    CUSTBANKNAME: formData.bankName,
    CUSTABANO: formData.routingNumber.replace(/\D/g, ''),
    CUSTACCTNO: formData.accountNumber,
    HOWPAID: formData.paymentMethod,
    TIMEATBANK: formData.timeAtBank,
    
    // Employment information
    EMPNAME: formData.employerName,
    EMPADD1: formData.employerAddress,
    EMPZIP: formData.employerZip,
    CUSTWORKPHONE: formData.employerPhone?.replace(/\D/g, '') || '',
    TIMEATJOB: formData.timeAtJob,
    AVGSALARY: formData.grossPay,
    PERIODICITY: formData.payPeriod,
    TYPEOFINCOME: formData.incomeType,
    NEXTPAYDATE: formData.nextPayDate,
    
    // Loan details
    LOANAMOUNT: formData.loanAmount,
    
    // References
    REFFNAME: formData.reference1Name,
    REFLNAME: formData.reference1LastName,
    REFRELATION: formData.reference1Relationship,
    REFHOMEPHONE: formData.reference1Phone.replace(/\D/g, ''),
    REFFNAME2: formData.reference2Name,
    REFLNAME2: formData.reference2LastName,
    REFRELATION2: formData.reference2Relationship,
    REFHOMEPHONE2: formData.reference2Phone.replace(/\D/g, ''),
    
    // Additional fields
    HOMESTATUS: formData.residenceType,
    TIMEATRESIDENCE: formData.timeAtResidence,
    ACTIVE_MILITARY: formData.militaryStatus ? '1' : '0',
    CUSTCONTACTTIME: formData.bestTimeToCall,
    EMAIL_OPTIN: formData.emailOptIn ? '1' : '0',
    TITLE_OPTION: formData.titleLoanInterest ? '1' : '0',
    
    // Technical fields
    IP: formData.ipAddress,
    USER_AGENT: formData.userAgent,
    WEBSITENAME: formData.websiteName
  };
}