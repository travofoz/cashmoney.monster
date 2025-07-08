/**
 * Form validation utilities for loan application
 * Based on GulfCoastLeads API specification requirements
 */

/**
 * Validate Social Security Number
 * Follows SSA rules: no 000, 666, or 900-999 area numbers; no 00 group; no 0000 serial
 * @param {string} ssn - SSN to validate (no dashes)
 * @returns {boolean} True if valid
 */
export function validateSSN(ssn) {
  if (!ssn) return false;
  // Remove any non-digit characters
  const cleaned = ssn.replace(/\D/g, '');
  if (cleaned.length !== 9) return false;
  
  // Parse area, group, and serial numbers
  const area = parseInt(cleaned.substring(0, 3));
  const group = parseInt(cleaned.substring(3, 5));
  const serial = parseInt(cleaned.substring(5, 9));
  
  // Invalid area numbers
  if (area === 0 || area === 666 || area >= 900) return false;
  
  // Invalid group number
  if (group === 0) return false;
  
  // Invalid serial number
  if (serial === 0) return false;
  
  // Additional invalid patterns
  if (cleaned === '123456789' || cleaned === '987654321') return false;
  if (/^(\d)\1{8}$/.test(cleaned)) return false; // All same digit
  
  return true;
}

/**
 * Validate ABA routing number
 * @param {string} routing - ABA routing number
 * @returns {boolean} True if valid
 */
export function validateRoutingNumber(routing) {
  if (!routing) return false;
  const cleaned = routing.replace(/\D/g, '');
  if (cleaned.length !== 9) return false;
  
  // ABA checksum validation
  let sum = 0;
  for (let i = 0; i < 9; i += 3) {
    sum += parseInt(cleaned[i]) * 3;
    sum += parseInt(cleaned[i + 1]) * 7;
    sum += parseInt(cleaned[i + 2]) * 1;
  }
  return sum % 10 === 0;
}

/**
 * Validate phone number
 * @param {string} phone - Phone number
 * @returns {boolean} True if valid
 */
export function validatePhone(phone) {
  if (!phone) return false;
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 && !cleaned.startsWith('0') && !cleaned.startsWith('1');
}

/**
 * Validate email address
 * @param {string} email - Email address
 * @returns {boolean} True if valid
 */
export function validateEmail(email) {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

/**
 * Validate ZIP code
 * @param {string} zip - ZIP code
 * @returns {boolean} True if valid
 */
export function validateZip(zip) {
  if (!zip) return false;
  const cleaned = zip.replace(/\D/g, '');
  return cleaned.length === 5;
}

/**
 * Validate date of birth
 * @param {string} dob - Date in MM/DD/YYYY format
 * @returns {boolean} True if valid and age >= 18
 */
export function validateDOB(dob) {
  if (!dob) return false;
  
  const dobRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
  if (!dobRegex.test(dob)) return false;
  
  const [month, day, year] = dob.split('/').map(Number);
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age >= 18 && age <= 100;
}

/**
 * Validate loan amount
 * @param {number|string} amount - Loan amount
 * @returns {boolean} True if valid (100-30000, step 100 up to 1000, then step 500)
 */
export function validateLoanAmount(amount) {
  const num = typeof amount === 'string' ? parseInt(amount) : amount;
  const maxAmount = parseInt(process.env.NEXT_PUBLIC_MAX_LOAN_AMOUNT) || 30000;
  
  if (num < 100 || num > maxAmount) return false;
  
  // $100 increments from 100-1000
  if (num <= 1000) {
    return num % 100 === 0;
  }
  
  // $500 increments from 1000-30000
  return num % 500 === 0;
}

/**
 * Validate next pay date based on pay frequency
 * @param {string} date - Date in YYYY-MM-DD format (HTML date input)
 * @param {string} payFrequency - Pay frequency (Weekly, Bi-Weekly, Semi-Monthly, Monthly)
 * @returns {boolean} True if valid and within reasonable range
 */
export function validateNextPayDate(date, payFrequency = 'Bi-Weekly') {
  if (!date) return false;
  
  // Handle both YYYY-MM-DD and MM/DD/YYYY formats
  let payDate;
  if (date.includes('-')) {
    // YYYY-MM-DD format from HTML date input
    payDate = new Date(date);
  } else {
    // MM/DD/YYYY format
    const [month, day, year] = date.split('/').map(Number);
    payDate = new Date(year, month - 1, day);
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  payDate.setHours(0, 0, 0, 0);
  
  // Must be today or in the future
  if (payDate < today) return false;
  
  // Set max days based on pay frequency
  let maxDays;
  switch (payFrequency) {
    case 'Weekly': maxDays = 14; break;        // Up to 2 weeks
    case 'Bi-Weekly': maxDays = 21; break;     // Up to 3 weeks  
    case 'Semi-Monthly': maxDays = 35; break;  // Up to 5 weeks
    case 'Monthly': maxDays = 60; break;       // Up to 2 months
    default: maxDays = 21; break;              // Default to bi-weekly
  }
  
  const maxDate = new Date(today.getTime() + maxDays * 24 * 60 * 60 * 1000);
  return payDate <= maxDate;
}

/**
 * Get validation error message for field
 * @param {string} fieldName - Name of the field
 * @param {any} value - Field value
 * @returns {string|null} Error message or null if valid
 */
export function getFieldError(fieldName, value) {
  switch (fieldName) {
    case 'firstName':
    case 'lastName':
      return !value || value.trim().length < 2 ? 'Name must be at least 2 characters' : null;
    
    case 'email':
      return !validateEmail(value) ? 'Please enter a valid email address' : null;
    
    case 'phoneNumber':
    case 'homePhone':
    case 'workPhone':
    case 'mobilePhone':
      return !validatePhone(value) ? 'Please enter a valid 10-digit phone number' : null;
    
    case 'ssn':
      return !validateSSN(value) ? 'Please enter a valid Social Security Number' : null;
    
    case 'dateOfBirth':
      return !validateDOB(value) ? 'Please enter a valid birth date (must be 18+)' : null;
    
    case 'zip':
      return !validateZip(value) ? 'Please enter a valid 5-digit ZIP code' : null;
    
    case 'routingNumber':
      return !validateRoutingNumber(value) ? 'Please enter a valid routing number' : null;
    
    case 'accountNumber':
      return !value || value.length < 4 ? 'Account number must be at least 4 digits' : null;
    
    case 'loanAmount':
      return !validateLoanAmount(value) ? 'Loan amount must be $100-$30,000 ($100 increments up to $1,000, then $500 increments)' : null;
    
    case 'nextPayDate':
      return !validateNextPayDate(value) ? 'Please enter a valid future pay date' : null;
    
    case 'address':
      return !value || value.trim().length < 5 ? 'Please enter a complete address' : null;
    
    case 'city':
      return !value || value.trim().length < 2 ? 'Please enter a valid city' : null;
    
    case 'state':
      return !value || value.length !== 2 ? 'Please select a state' : null;
    
    case 'bankName':
      return !value || value.trim().length < 2 ? 'Please enter your bank name' : null;
    
    case 'employerName':
      return !value || value.trim().length < 2 ? 'Please enter your employer name' : null;
    
    case 'salary':
    case 'grossPay':
      return !value || parseFloat(value) < 100 ? 'Salary must be at least $100' : null;
    
    default:
      return !value ? 'This field is required' : null;
  }
}