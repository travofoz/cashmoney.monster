/**
 * Bank name lookup from routing numbers using FedACHdir.txt
 */

let bankData = null;

/**
 * Parse FedACHdir.txt format and build lookup table
 * Fixed-width format: routing(9) + other fields + bank_name(~40 chars starting around pos 35)
 */
async function loadBankData() {
  if (bankData) return bankData;
  
  try {
    const response = await fetch('https://raw.githubusercontent.com/moov-io/fed/refs/heads/master/data/FedACHdir.txt');
    const text = await response.text();
    
    bankData = new Map();
    
    const lines = text.split('\n');
    for (const line of lines) {
      if (line.length < 80) continue; // Skip short/invalid lines
      
      // Extract fields from fixed positions (based on ABA format spec)
      const routingNumber = line.substring(0, 9).trim();
      const bankName = line.substring(35, 71).trim(); // Bank name field: positions 35-70 (36 chars)
      
      if (routingNumber && bankName && routingNumber.match(/^\d{9}$/)) {
        bankData.set(routingNumber, bankName);
      }
    }
    
    console.log(`Loaded ${bankData.size} bank routing numbers`);
    return bankData;
    
  } catch (error) {
    console.error('Failed to load bank data:', error);
    bankData = new Map(); // Empty map as fallback
    return bankData;
  }
}

/**
 * Get bank name from routing number
 * @param {string} routingNumber - 9-digit routing number
 * @returns {Promise<string|null>} Bank name or null if not found
 */
export async function getBankName(routingNumber) {
  if (!routingNumber || routingNumber.length !== 9) return null;
  
  const data = await loadBankData();
  return data.get(routingNumber) || null;
}

/**
 * Validate and get bank name from routing number
 * @param {string} routingNumber - Routing number (with or without formatting)
 * @returns {Promise<{isValid: boolean, bankName: string|null}>}
 */
export async function validateAndGetBank(routingNumber) {
  if (!routingNumber) return { isValid: false, bankName: null };
  
  // Clean routing number
  const cleaned = routingNumber.replace(/\D/g, '');
  
  if (cleaned.length !== 9) {
    return { isValid: false, bankName: null };
  }
  
  // Basic ABA checksum validation
  let sum = 0;
  for (let i = 0; i < 9; i += 3) {
    sum += parseInt(cleaned[i]) * 3;
    sum += parseInt(cleaned[i + 1]) * 7;
    sum += parseInt(cleaned[i + 2]) * 1;
  }
  const isValid = sum % 10 === 0;
  
  if (!isValid) {
    return { isValid: false, bankName: null };
  }
  
  const bankName = await getBankName(cleaned);
  return { isValid: true, bankName };
}