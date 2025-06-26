"use client";

import React from 'react';
import FormInput from './FormInput';

/**
 * Step 2: Loan Details
 * @param {Object} props - Component props
 * @param {Object} props.formData - Current form data
 * @param {Function} props.onChange - Field change handler
 * @returns {JSX.Element} Loan details form step
 */
export default function LoanDetailsStep({ formData, onChange }) {
  const loanAmountOptions = [
    { value: '100', label: '$100' },
    { value: '200', label: '$200' },
    { value: '300', label: '$300' },
    { value: '400', label: '$400' },
    { value: '500', label: '$500' },
    { value: '600', label: '$600' },
    { value: '700', label: '$700' },
    { value: '800', label: '$800' },
    { value: '900', label: '$900' },
    { value: '1000', label: '$1000' }
  ];

  const loanPurposeOptions = [
    'Emergency Expense',
    'Car Repair',
    'Medical Bills',
    'Rent/Utilities',
    'Debt Consolidation',
    'Home Repair',
    'Education',
    'Travel',
    'Other'
  ];

  const employmentStatusOptions = [
    'Employed Full-Time',
    'Employed Part-Time',
    'Self-Employed',
    'Social Security',
    'Military',
    'Disability Benefits',
    'Pension',
    'Unemployed',
    'Other'
  ];

  return (
    <div className="space-y-6">
      <FormInput
        name="loanAmount"
        label="How much do you need?"
        value={formData.loanAmount}
        onChange={onChange}
        options={loanAmountOptions}
        required={true}
        placeholder="Select loan amount"
      />

      <FormInput
        name="loanPurpose"
        label="What will you use the money for?"
        value={formData.loanPurpose}
        onChange={onChange}
        options={loanPurposeOptions}
        required={true}
        placeholder="Select purpose"
      />

      <FormInput
        name="employmentStatus"
        label="What is your employment status?"
        value={formData.employmentStatus}
        onChange={onChange}
        options={employmentStatusOptions}
        required={true}
        placeholder="Select employment status"
      />

      <div className="bg-muted/50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Quick Approval Requirements</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>✓ Be at least 18 years old</li>
          <li>✓ Have a valid checking account</li>
          <li>✓ Have a steady source of income</li>
          <li>✓ Be a US citizen or permanent resident</li>
        </ul>
      </div>
    </div>
  );
}