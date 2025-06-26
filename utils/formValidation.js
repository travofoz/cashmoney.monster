/**
 * Form validation utilities for loan application
 * Based on GulfCoastLeads API specification requirements
 */

/**
 * Validate Social Security Number
 * @param {string} ssn - SSN to validate (no dashes)
 * @returns {boolean} True if valid
 */
export function validateSSN(ssn) {
  if (!ssn) return false;
  // Remove any non-digit characters
  const cleaned = ssn.replace(/\D/g, '');
  // Must be exactly 9 digits, not all zeros, not sequential
  return cleaned.length === 9 && 
         cleaned !== '000000000' && 
         cleaned !== '123456789' &&
         !/^(\d)\1{8}$/.test(cleaned); // Not all same digit
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
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age >= 18 && age <= 100;
}

/**
 * Validate loan amount
 * @param {number|string} amount - Loan amount
 * @returns {boolean} True if valid (100-1000, step 100)
 */
export function validateLoanAmount(amount) {
  const num = typeof amount === 'string' ? parseInt(amount) : amount;
  return num >= 100 && num <= 1000 && num % 100 === 0;
}

/**
 * Validate next pay date
 * @param {string} date - Date in MM/DD/YYYY format
 * @returns {boolean} True if valid and in the future
 */
export function validateNextPayDate(date) {
  if (!date) return false;
  
  const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
  if (!dateRegex.test(date)) return false;
  
  const [month, day, year] = date.split('/').map(Number);
  const payDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time for date comparison
  
  return payDate >= today && payDate <= new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000);
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
      return !validateLoanAmount(value) ? 'Loan amount must be $100-$1000 in $100 increments' : null;
    
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