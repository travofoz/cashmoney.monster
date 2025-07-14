"use client";

import React from 'react';
import FormInput from './FormInput';
import TCPAHelpIcon from '@/components/ui/TCPAHelpIcon';

/**
 * Step 3: Personal Information
 * @param {Object} props - Component props
 * @param {Object} props.formData - Current form data
 * @param {Function} props.onChange - Field change handler
 * @returns {JSX.Element} Personal information form step
 */
export default function PersonalInfoStep({ formData, onChange }) {
  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
  ];

  const stateOptions = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const residenceTypeOptions = [
    { value: 'Rent', label: 'Rent' },
    { value: 'Own', label: 'Own' }
  ];

  const timeAtResidenceOptions = [
    { value: '1', label: 'Less than 6 months' },
    { value: '2', label: '6 months to 1 year' },
    { value: '3', label: '1 to 2 years' },
    { value: '4', label: '2 to 3 years' },
    { value: '5', label: 'More than 3 years' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          name="firstName"
          label="First Name"
          type="text"
          value={formData.firstName}
          onChange={onChange}
          required={true}
          placeholder="Your first name"
        />

        <FormInput
          name="lastName"
          label="Last Name"
          type="text"
          value={formData.lastName}
          onChange={onChange}
          required={true}
          placeholder="Your last name"
        />
      </div>

      <FormInput
        name="gender"
        label="Gender"
        value={formData.gender}
        onChange={onChange}
        options={genderOptions}
        required={true}
        placeholder="Select gender"
      />

      <FormInput
        name="dateOfBirth"
        label="Date of Birth"
        type="text"
        value={formData.dateOfBirth}
        onChange={onChange}
        required={true}
        placeholder="MM/DD/YYYY"
      />

      <FormInput
        name="ssn"
        label="Social Security Number"
        type="text"
        value={formData.ssn}
        onChange={onChange}
        required={true}
        placeholder="000000000 (no dashes)"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          name="email"
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={onChange}
          required={true}
          placeholder="your@email.com"
        />

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <FormInput
                name="homePhone"
                label="Home Phone"
                type="tel"
                value={formData.homePhone}
                onChange={onChange}
                required={true}
                placeholder="(555) 123-4567"
              />
            </div>
            <TCPAHelpIcon className="mt-6" />
          </div>
          <p className="text-xs text-muted-foreground">
            By providing this number, you consent to receive calls/texts about your loan request.
          </p>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <FormInput
              name="mobilePhone"
              label="Mobile Phone"
              type="tel"
              value={formData.mobilePhone}
              onChange={onChange}
              required={false}
              placeholder="(555) 123-4567"
            />
          </div>
          <TCPAHelpIcon className="mt-6" />
        </div>
        <p className="text-xs text-muted-foreground">
          By providing this number, you consent to receive calls/texts about your loan request.
        </p>
      </div>

      <FormInput
        name="address"
        label="Street Address"
        type="text"
        value={formData.address}
        onChange={onChange}
        required={true}
        placeholder="123 Main Street"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormInput
          name="city"
          label="City"
          type="text"
          value={formData.city}
          onChange={onChange}
          required={true}
          placeholder="City"
        />

        <FormInput
          name="state"
          label="State"
          value={formData.state}
          onChange={onChange}
          options={stateOptions}
          required={true}
          placeholder="State"
        />

        <FormInput
          name="zip"
          label="ZIP Code"
          type="text"
          value={formData.zip}
          onChange={onChange}
          required={true}
          placeholder="12345"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          name="residenceType"
          label="Do you rent or own your home?"
          value={formData.residenceType}
          onChange={onChange}
          options={residenceTypeOptions}
          required={true}
          placeholder="Select residence type"
        />

        <FormInput
          name="timeAtResidence"
          label="How long at current address?"
          value={formData.timeAtResidence}
          onChange={onChange}
          options={timeAtResidenceOptions}
          required={true}
          placeholder="Select time period"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          name="driversLicense"
          label="Driver's License Number"
          type="text"
          value={formData.driversLicense}
          onChange={onChange}
          required={true}
          placeholder="License number"
        />

        <FormInput
          name="driversLicenseState"
          label="License State"
          value={formData.driversLicenseState}
          onChange={onChange}
          options={stateOptions}
          required={true}
          placeholder="State"
        />
      </div>

      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="militaryStatus"
            checked={formData.militaryStatus || false}
            onChange={(e) => onChange('militaryStatus', e.target.checked)}
            className="rounded border-gray-300"
          />
          <label htmlFor="militaryStatus" className="text-sm font-medium">
            I am currently active military
          </label>
        </div>
      </div>
    </div>
  );
}