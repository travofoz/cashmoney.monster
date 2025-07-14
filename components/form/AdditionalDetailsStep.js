"use client";

import React from 'react';
import FormInput from './FormInput';
import TCPAHelpIcon from '@/components/ui/TCPAHelpIcon';

/**
 * Step 5: Additional Details
 * @param {Object} props - Component props
 * @param {Object} props.formData - Current form data
 * @param {Function} props.onChange - Field change handler
 * @returns {JSX.Element} Additional details form step
 */
export default function AdditionalDetailsStep({ formData, onChange }) {
  const relationshipOptions = [
    'Friend',
    'Family Member',
    'Coworker',
    'Neighbor',
    'Spouse',
    'Parent',
    'Sibling',
    'Other'
  ];

  const bestTimeOptions = [
    { value: 'AM', label: 'Morning (AM)' },
    { value: 'NN', label: 'Afternoon (Noon)' },
    { value: 'PM', label: 'Evening (PM)' }
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Reference Information</h3>
        <p className="text-sm text-muted-foreground">
          Please provide two references who are not related to you and do not live with you.
        </p>
        
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-3">Reference #1</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              name="reference1Name"
              label="First Name"
              type="text"
              value={formData.reference1Name}
              onChange={onChange}
              required={true}
              placeholder="Reference first name"
            />

            <FormInput
              name="reference1LastName"
              label="Last Name"
              type="text"
              value={formData.reference1LastName}
              onChange={onChange}
              required={true}
              placeholder="Reference last name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <FormInput
              name="reference1Relationship"
              label="Relationship"
              value={formData.reference1Relationship}
              onChange={onChange}
              options={relationshipOptions}
              required={true}
              placeholder="Select relationship"
            />

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <FormInput
                    name="reference1Phone"
                    label="Phone Number"
                    type="tel"
                    value={formData.reference1Phone}
                    onChange={onChange}
                    required={true}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <TCPAHelpIcon className="mt-6" />
              </div>
              <p className="text-xs text-muted-foreground">
                Reference contact information for verification purposes only.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-3">Reference #2</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              name="reference2Name"
              label="First Name"
              type="text"
              value={formData.reference2Name}
              onChange={onChange}
              required={true}
              placeholder="Reference first name"
            />

            <FormInput
              name="reference2LastName"
              label="Last Name"
              type="text"
              value={formData.reference2LastName}
              onChange={onChange}
              required={true}
              placeholder="Reference last name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <FormInput
              name="reference2Relationship"
              label="Relationship"
              value={formData.reference2Relationship}
              onChange={onChange}
              options={relationshipOptions}
              required={true}
              placeholder="Select relationship"
            />

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <FormInput
                    name="reference2Phone"
                    label="Phone Number"
                    type="tel"
                    value={formData.reference2Phone}
                    onChange={onChange}
                    required={true}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <TCPAHelpIcon className="mt-6" />
              </div>
              <p className="text-xs text-muted-foreground">
                Reference contact information for verification purposes only.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Contact Preferences</h3>
        
        <FormInput
          name="bestTimeToCall"
          label="Best time to contact you"
          value={formData.bestTimeToCall}
          onChange={onChange}
          options={bestTimeOptions}
          required={true}
          placeholder="Select best time"
        />

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="emailOptIn"
              checked={formData.emailOptIn || false}
              onChange={(e) => onChange('emailOptIn', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="emailOptIn" className="text-sm">
              I agree to receive emails about loan offers and financial services
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="titleLoanInterest"
              checked={formData.titleLoanInterest || false}
              onChange={(e) => onChange('titleLoanInterest', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="titleLoanInterest" className="text-sm">
              I own a vehicle and am interested in title loan options
            </label>
          </div>
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
        <h4 className="font-medium mb-2 text-green-800 dark:text-green-200">Almost Done!</h4>
        <p className="text-sm text-green-700 dark:text-green-300">
          You&apos;re just one step away from completing your loan application. Review your information and submit to get instant approval.
        </p>
      </div>
    </div>
  );
}