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
  const handleSliderChange = (values) => {
    onChange('loanAmount', values[0].toString());
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
              ${formData.loanAmount || 100}
            </span>
          </div>
          <Slider
            value={[parseInt(formData.loanAmount) || 100]}
            onValueChange={handleSliderChange}
            max={1000}
            min={100}
            step={100}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>$100</span>
            <span>$1,000</span>
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