"use client";

import React from 'react';
import FormInput from './FormInput';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

/**
 * Step 2: Loan Details
 * @param {Object} props - Component props
 * @param {Object} props.formData - Current form data
 * @param {Function} props.onChange - Field change handler
 * @returns {JSX.Element} Loan details form step
 */
export default function LoanDetailsStep({ formData, onChange }) {
  const maxLoanAmount = parseInt(process.env.NEXT_PUBLIC_MAX_LOAN_AMOUNT) || 30000;
  
  // Generate all valid loan amounts
  const generateValidAmounts = () => {
    const amounts = [];
    // $100 increments from 100 to 1000
    for (let i = 100; i <= 1000; i += 100) {
      amounts.push(i);
    }
    // $500 increments from 1500 to maxLoanAmount
    for (let i = 1500; i <= maxLoanAmount; i += 500) {
      amounts.push(i);
    }
    return amounts;
  };

  const validAmounts = generateValidAmounts();

  const snapToValidAmount = (value) => {
    // Find the closest valid amount
    return validAmounts.reduce((prev, curr) => 
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
  };

  const handleSliderChange = (values) => {
    const snappedValue = snapToValidAmount(values[0]);
    onChange('loanAmount', snappedValue.toString());
  };

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


  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          How much do you need? <span className="text-red-500">*</span>
        </Label>
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-2xl font-bold text-primary">
              ${parseInt(formData.loanAmount || 100).toLocaleString()}
            </span>
          </div>
          <Slider
            value={[parseInt(formData.loanAmount) || 100]}
            onValueChange={handleSliderChange}
            max={maxLoanAmount}
            min={100}
            step={100}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>$100</span>
            <span>${maxLoanAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <FormInput
        name="loanPurpose"
        label="What will you use the money for?"
        value={formData.loanPurpose}
        onChange={onChange}
        options={loanPurposeOptions}
        required={true}
        placeholder="Select purpose"
      />
    </div>
  );
}