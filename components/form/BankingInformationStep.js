"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import FormInput from './FormInput';
import { validateAndGetBank } from '@/utils/bankLookup';

export default function BankingInformationStep({ formData, onChange }) {
  const [isLoadingBank, setIsLoadingBank] = useState(false);
  const [autoPopulatedBankName, setAutoPopulatedBankName] = useState(null);
  const [showBankOverride, setShowBankOverride] = useState(false);
  const lastRoutingNumberRef = useRef('');
  const lastAutoPopulatedBankNameRef = useRef(null);
  const currentBankNameRef = useRef(formData.bankName);

  // Update ref when bankName changes
  useEffect(() => {
    currentBankNameRef.current = formData.bankName;
  }, [formData.bankName]);

  // Auto-populate bank name when routing number changes
  useEffect(() => {
    const lookupBank = async () => {
      if (formData.routingNumber && formData.routingNumber.length === 9) {
        // Only run lookup if routing number actually changed
        if (lastRoutingNumberRef.current === formData.routingNumber) {
          return;
        }
        
        lastRoutingNumberRef.current = formData.routingNumber;
        setIsLoadingBank(true);
        
        try {
          const result = await validateAndGetBank(formData.routingNumber);
          if (result.isValid && result.bankName) {
            setAutoPopulatedBankName(result.bankName);
            // Only auto-set if bank name is empty or matches previous auto-populated name
            if (!currentBankNameRef.current || currentBankNameRef.current === lastAutoPopulatedBankNameRef.current) {
              onChange('bankName', result.bankName);
            }
            lastAutoPopulatedBankNameRef.current = result.bankName;
          } else {
            setAutoPopulatedBankName(null);
            lastAutoPopulatedBankNameRef.current = null;
          }
        } catch (error) {
          console.error('Bank lookup failed:', error);
          setAutoPopulatedBankName(null);
          lastAutoPopulatedBankNameRef.current = null;
        }
        setIsLoadingBank(false);
      } else {
        setAutoPopulatedBankName(null);
        lastRoutingNumberRef.current = '';
        lastAutoPopulatedBankNameRef.current = null;
      }
    };

    lookupBank();
  }, [formData.routingNumber, onChange]);

  const handleBankNameOverride = () => {
    setShowBankOverride(true);
  };

  const confirmBankNameOverride = () => {
    setShowBankOverride(false);
    setAutoPopulatedBankName(null); // Stop auto-populating
    lastAutoPopulatedBankNameRef.current = null; // Reset auto-populated reference
  };

  return (
    <div className="space-y-4">
      {/* Routing Number - First to drive auto-population */}
      <FormInput
        name="routingNumber"
        label="Routing Number"
        value={formData.routingNumber}
        onChange={onChange}
        required={true}
        placeholder="123456789"
      />

      {/* Bank Name - Auto-populated with override option */}
      <div className="space-y-2">
        <FormInput
          name="bankName"
          label="Bank Name"
          value={formData.bankName}
          onChange={onChange}
          required={true}
          placeholder={isLoadingBank ? "Looking up bank..." : "Enter your bank name"}
          disabled={isLoadingBank}
        />
        
        {autoPopulatedBankName && formData.bankName === autoPopulatedBankName && !showBankOverride && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>✓ Auto-populated</span>
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={handleBankNameOverride}
              className="h-auto p-0 text-xs underline"
            >
              Change bank name?
            </Button>
          </div>
        )}

        {showBankOverride && (
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm text-foreground mb-3">
              Are you sure you want to change the bank name? The current name was automatically detected from your routing number.
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowBankOverride(false)}
              >
                Keep Auto-Filled
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={confirmBankNameOverride}
              >
                Yes, I&apos;ll Enter Manually
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Account Type */}
      <FormInput
        name="accountType"
        label="Account Type"
        value={formData.accountType || 'Checking'}
        onChange={onChange}
        required={true}
        options={['Checking', 'Savings']}
        placeholder="Select account type"
      />

      {/* Account Number */}
      <FormInput
        name="accountNumber"
        label="Account Number"
        value={formData.accountNumber}
        onChange={onChange}
        required={true}
        placeholder="Enter account number"
      />

      {/* Time at Bank */}
      <FormInput
        name="timeAtBank"
        label="Time at Current Bank"
        value={formData.timeAtBank || '3'}
        onChange={onChange}
        required={true}
        options={[
          { value: '1', label: '0-3 months' },
          { value: '2', label: '3-6 months' },
          { value: '3', label: '1 year' },
          { value: '4', label: '2 years' },
          { value: '5', label: '3+ years' }
        ]}
        placeholder="Select duration"
      />

      {/* Driver's License Information */}
      <div className="space-y-4 mt-6">
        <h3 className="text-lg font-medium text-foreground">Identity Verification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="driverLicenseNumber"
            label="Driver's License Number"
            value={formData.driverLicenseNumber}
            onChange={onChange}
            required={true}
            placeholder="Enter license number"
          />
          <FormInput
            name="driverLicenseState"
            label="License State"
            value={formData.driverLicenseState}
            onChange={onChange}
            required={true}
            options={[
              'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
              'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
              'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
              'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
              'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
            ]}
            placeholder="Select state"
          />
        </div>
        <FormInput
          name="ssn"
          label="Social Security Number"
          value={formData.ssn}
          onChange={onChange}
          required={true}
          placeholder="XXX-XX-XXXX"
        />
      </div>
    </div>
  );
}