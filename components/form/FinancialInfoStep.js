"use client";

import React from 'react';
import FormInput from './FormInput';
import TCPAHelpIcon from '@/components/ui/TCPAHelpIcon';

/**
 * Step 4: Financial Information
 * @param {Object} props - Component props
 * @param {Object} props.formData - Current form data
 * @param {Function} props.onChange - Field change handler
 * @returns {JSX.Element} Financial information form step
 */
export default function FinancialInfoStep({ formData, onChange }) {
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

  const accountTypeOptions = [
    { value: 'checking', label: 'Checking' },
    { value: 'savings', label: 'Savings' }
  ];

  const paymentMethodOptions = [
    { value: 'DC', label: 'Direct Deposit to Checking' },
    { value: 'DS', label: 'Direct Deposit to Savings' },
    { value: 'PC', label: 'Paper Check to Checking' },
    { value: 'PS', label: 'Paper Check to Savings' }
  ];

  const timeAtBankOptions = [
    { value: '1', label: 'Less than 3 months' },
    { value: '2', label: '3 to 6 months' },
    { value: '3', label: '6 months to 1 year' },
    { value: '4', label: '1 to 2 years' },
    { value: '5', label: 'More than 2 years' }
  ];

  const timeAtJobOptions = [
    { value: '1', label: 'Less than 3 months' },
    { value: '2', label: '3 to 6 months' },
    { value: '3', label: '6 months to 1 year' },
    { value: '4', label: '1 to 2 years' },
    { value: '5', label: 'More than 2 years' }
  ];

  const payPeriodOptions = [
    { value: 'W', label: 'Weekly' },
    { value: 'B', label: 'Bi-Weekly (every 2 weeks)' },
    { value: 'S', label: 'Semi-Monthly (twice per month)' },
    { value: 'M', label: 'Monthly' }
  ];

  const incomeTypeOptions = [
    { value: 'P', label: 'Employed' },
    { value: 'G', label: 'Social Security' },
    { value: 'M', label: 'Military' },
    { value: 'W', label: 'Welfare' },
    { value: 'D', label: 'Disability' },
    { value: 'S', label: 'Pension' },
    { value: 'L', label: 'Self-Employed' },
    { value: 'U', label: 'Unemployment' }
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Employment Status</h3>
        
        <FormInput
          name="employmentStatus"
          label="What is your employment status?"
          value={formData.employmentStatus}
          onChange={onChange}
          options={employmentStatusOptions}
          required={true}
          placeholder="Select employment status"
        />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Banking Information</h3>
        
        <FormInput
          name="bankName"
          label="Bank Name"
          type="text"
          value={formData.bankName}
          onChange={onChange}
          required={true}
          placeholder="Chase, Wells Fargo, etc."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="routingNumber"
            label="Routing Number"
            type="text"
            value={formData.routingNumber}
            onChange={onChange}
            required={true}
            placeholder="9-digit routing number"
          />

          <FormInput
            name="accountNumber"
            label="Account Number"
            type="text"
            value={formData.accountNumber}
            onChange={onChange}
            required={true}
            placeholder="Account number"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="accountType"
            label="Account Type"
            value={formData.accountType}
            onChange={onChange}
            options={accountTypeOptions}
            required={true}
            placeholder="Select account type"
          />

          <FormInput
            name="timeAtBank"
            label="How long with this bank?"
            value={formData.timeAtBank}
            onChange={onChange}
            options={timeAtBankOptions}
            required={true}
            placeholder="Select time period"
          />
        </div>

        <FormInput
          name="paymentMethod"
          label="How would you like to receive your loan?"
          value={formData.paymentMethod}
          onChange={onChange}
          options={paymentMethodOptions}
          required={true}
          placeholder="Select payment method"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Employment Information</h3>
        
        <FormInput
          name="employerName"
          label="Employer Name"
          type="text"
          value={formData.employerName}
          onChange={onChange}
          required={true}
          placeholder="Company name"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="employerAddress"
            label="Employer Address"
            type="text"
            value={formData.employerAddress}
            onChange={onChange}
            required={false}
            placeholder="123 Business St"
          />

          <FormInput
            name="employerZip"
            label="Employer ZIP"
            type="text"
            value={formData.employerZip}
            onChange={onChange}
            required={false}
            placeholder="12345"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <FormInput
                  name="employerPhone"
                  label="Work Phone"
                  type="tel"
                  value={formData.employerPhone}
                  onChange={onChange}
                  required={false}
                  placeholder="(555) 123-4567"
                />
              </div>
              <TCPAHelpIcon className="mt-6" />
            </div>
            <p className="text-xs text-muted-foreground">
              By providing your work number, you consent to receive calls during business hours.
            </p>
          </div>

          <FormInput
            name="timeAtJob"
            label="How long at current job?"
            value={formData.timeAtJob}
            onChange={onChange}
            options={timeAtJobOptions}
            required={true}
            placeholder="Select time period"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="grossPay"
            label="Gross Pay (last paycheck)"
            type="number"
            value={formData.grossPay}
            onChange={onChange}
            required={true}
            placeholder="1500"
          />

          <FormInput
            name="payPeriod"
            label="How often are you paid?"
            value={formData.payPeriod}
            onChange={onChange}
            options={payPeriodOptions}
            required={true}
            placeholder="Select pay frequency"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="incomeType"
            label="Type of Income"
            value={formData.incomeType}
            onChange={onChange}
            options={incomeTypeOptions}
            required={true}
            placeholder="Select income type"
          />

          <FormInput
            name="nextPayDate"
            label="Next Pay Date"
            type="text"
            value={formData.nextPayDate}
            onChange={onChange}
            required={true}
            placeholder="MM/DD/YYYY"
          />
        </div>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <h4 className="font-medium mb-2 text-yellow-800 dark:text-yellow-200">Important Note</h4>
        <p className="text-sm text-yellow-700 dark:text-yellow-300">
          All banking information is encrypted and secure. We use bank-level security to protect your financial data.
        </p>
      </div>
    </div>
  );
}