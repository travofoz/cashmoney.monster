# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Payday/Personal/Installment Loan Lead Generation Site

## Project Overview
Next.js lead generation website for payday, personal, and installment loans. Collects extensive customer information through a multi-step form and submits to GulfCoastLeads (GCL) API for lead processing and buyer matching.

## Technical Stack
- **Framework**: Next.js 15 (canary) with Turbopack
- **Language**: JavaScript with JSDoc (NO TypeScript - we use JSDoc only for IDE autocomplete/LSP)
- **Styling**: Tailwind CSS + shadcn/ui components  
- **State**: React useState (unified formData object pattern)
- **Storage**: localStorage + sessionStorage for persistence
- **API**: GulfCoastLeads XML response system
- **Validation**: Custom validation with react-hot-toast
- **Components**: Always use shadcn components when possible, avoid custom components unless no alternative

## Development Commands
```bash
npm run dev           # Start development server with Turbopack
npm run build         # Production build  
npm run start         # Production server
npm run lint          # ESLint code linting
npm run shadcn        # Add shadcn components
npm run theme:install # Install theme system
```

## Architecture Pattern (Based on /var/www/remodel.monster)

### Form Flow Structure
Multi-step form with unified state management:
1. **Step 1**: Introduction/landing ("Get Your Cash Offer")
2. **Step 2**: Loan details (amount, purpose, employment status)
3. **Step 3**: Personal information (name, contact, SSN, DOB)
4. **Step 4**: Financial information (bank details, income, employer)
5. **Step 5**: Additional details (references, military status)
6. **Step 6**: TCPA consent confirmation

### State Management Pattern
- **Single formData object** - No individual useState hooks for each field
- **Centralized onChange handler** - One handler for all form updates
- **localStorage persistence** - Form state survives page refreshes
- **Tracking parameters** - Pass transaction_id and source from URL params

### API Integration - GulfCoastLeads Specification

#### Endpoint
```
POST https://www.submitlead.com/cash/1.6/
```

#### Required Fields (from GCL_Outside_Posting_Specs.md)
- **Customer Info**: CUSTFNAME, CUSTLNAME, CUSTEMAIL, CUSTHOMEPHONE, CUSTZIP, CUSTCITY, CUSTSTATE, CUSTGENDER, CUSTDOB, CUSTSSN, CUSTADD1
- **Banking**: CUSTBANKNAME, CUSTABANO, CUSTACCTNO, HOWPAID, TIMEATBANK
- **Employment**: EMPNAME, AVGSALARY, PERIODICITY, TYPEOFINCOME, TIMEATJOB, NEXTPAYDATE
- **Loan**: LOANAMOUNT (100-1000, step 100)
- **References**: REFFNAME/REFLNAME/REFRELATION/REFHOMEPHONE (2 references)
- **Tracking**: SourceID, Partner, AID, IP, USER_AGENT, WEBSITENAME, EMAIL_OPTIN

#### Response Handling
- **XML Response Format**: Parse `<Result>ACCEPTED:</Result>` or `<Result>REJECTED:</Result>`
- **Redirect URL**: Extract `<RedirectURL>` from accepted responses for immediate customer redirect
- **Price**: Track `<Price>` for revenue reporting

### Key Technical Patterns

#### Form Validation
- **Comprehensive validation system** using utils/conditionalLogic.js pattern
- **Human-readable error messages** with proper field labels
- **Step-by-step validation** before allowing progression
- **API field mapping** from form fields to GCL specification

#### Component Structure
```
components/
├── form/
│   ├── FormStep.js           # Generic step wrapper
│   ├── PersonalInfo.js       # Customer details
│   ├── FinancialInfo.js      # Banking/income
│   ├── LoanDetails.js        # Amount/purpose
│   └── confirmation.js       # TCPA consent
├── ui/                       # shadcn components only
└── theme-provider.js         # Dark/light theme support
```

#### API Route Structure
```javascript
// app/api/process/route.js
export async function POST(request) {
  const formData = await request.json();
  
  // Extract IP and User-Agent
  const userIp = request.headers.get("X-Forwarded-For");
  const userAgent = request.headers.get("User-Agent");
  
  // Map form fields to GCL API spec
  const gclPayload = {
    SourceID: process.env.GCL_SOURCE_ID,
    Partner: process.env.GCL_PARTNER,
    CUSTFNAME: formData.firstName,
    // ... map all required fields
  };
  
  // POST to GCL, parse XML response
  // Handle ACCEPTED (redirect) vs REJECTED scenarios
}
```

### Environment Configuration
```javascript
// next.config.js
env: {
  GCL_SOURCE_ID: 'provided_by_gcl',
  GCL_PARTNER: 'provided_by_gcl',
  GCL_ENDPOINT: 'https://www.submitlead.com/cash/1.6/',
}
```

### Revenue Optimization Pattern
- **Accepted with redirect**: Immediate redirect to buyer URL
- **Accepted without redirect**: Secondary monetization page after countdown
- **Rejected**: Alternative offers page after countdown  
- **All paths monetized**: No dead ends in user flow

## Critical Implementation Notes

### Banking/Financial Data Handling
- **Sensitive Data**: Never log bank account numbers, SSN, or routing numbers
- **Validation**: Validate ABA routing numbers and account number formats
- **Security**: Use HTTPS only, secure form transmission

### TCPA Compliance Requirements
- **Consent Language**: "By submitting this form, I agree to receive phone calls and text messages..."
- **Checkbox Required**: Must be explicitly checked, not pre-checked
- **API Mapping**: Boolean true/false → "YES"/"NO" for GCL API

### Field Mapping Specifics
- **Phone Numbers**: Format as 10 digits (1234567890), no formatting
- **Dates**: MM/DD/YYYY format for DOB and NEXTPAYDATE
- **Gender**: M or F only
- **Income Type**: P=Employed, G=Social Security, M=Military, etc.
- **Pay Periodicity**: W=Weekly, B=Bi-Weekly, S=Semi-Monthly, M=Monthly

### Reference Data Handling
- **If not collected**: Send 'Not Collected' for names/relationship, '0000000000' for phones
- **Required**: 2 references minimum for loan approval rates

## Production Deployment
- **PM2 Process Management**: Use ecosystem.config.js pattern
- **Port Configuration**: Assign unique port (avoid conflicts)
- **Environment Variables**: Store GCL credentials securely
- **Cache Headers**: Optimize static asset caching
- **Performance**: Enable compression, optimize images

## Legal Pages Required
- **Terms of Service**: Loan service disclosures, state compliance
- **Privacy Policy**: Data collection, sharing with lenders
- **About Page**: Company information, service description
- **Contact Page**: Customer support, complaints handling

Terms and Privacy content can be adapted from /var/www/remodel.monster but updated for lending vertical and regulatory requirements.