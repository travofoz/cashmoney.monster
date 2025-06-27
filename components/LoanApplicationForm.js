"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

import FormProgress from '@/components/FormProgress';
import FormStep from '@/components/form/FormStep';
import LoanDetailsStep from '@/components/form/LoanDetailsStep';
import PersonalInfoStep from '@/components/form/PersonalInfoStep';
import FinancialInfoStep from '@/components/form/FinancialInfoStep';
import AdditionalDetailsStep from '@/components/form/AdditionalDetailsStep';
import TCPAConsentStep from '@/components/form/TCPAConsentStep';
import { 
  loadFormData, 
  saveFormData, 
  canProgressFromStep, 
  getCurrentStep,
  initialFormData 
} from '@/utils/formState';

/**
 * Main loan application form component
 * Manages form state and step navigation
 * @returns {JSX.Element} Complete loan application form
 */
export default function LoanApplicationForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Load form data on component mount
  useEffect(() => {
    const savedData = loadFormData();
    setFormData(savedData);
    setCurrentStep(getCurrentStep(savedData));
  }, []);

  // Save form data whenever it changes
  useEffect(() => {
    saveFormData(formData);
  }, [formData]);

  /**
   * Handle form field changes
   * @param {string} fieldName - Name of the field
   * @param {any} value - New field value
   */
  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  /**
   * Navigate to next step
   */
  const handleNext = () => {
    if (!canProgressFromStep(currentStep, formData)) {
      toast.error('Please complete all required fields before continuing.');
      return;
    }

    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    }
  };

  /**
   * Navigate to previous step
   */
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  /**
   * Submit form to API
   */
  const handleSubmit = async () => {
    if (!formData.tcpa) {
      toast.error('You must agree to the terms to submit your application.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Add user agent and IP if not already set
      const submissionData = {
        ...formData,
        userAgent: formData.userAgent || navigator.userAgent,
        ipAddress: formData.ipAddress || 'client-side' // Will be overridden server-side
      };

      const response = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (result.status === 'accepted' && result.redirect) {
        toast.success('Application approved! Redirecting to lender...');
        setTimeout(() => {
          window.location.href = result.redirect;
        }, 2000);
      } else if (result.status === 'accepted') {
        toast.success('Application submitted successfully!');
        // Handle accepted without redirect
      } else {
        toast.error(result.message || 'Application was not approved at this time.');
        // Handle rejection
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('There was an error submitting your application. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Render current step content
   */
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <FormStep
            title="Loan Details"
            description="How much do you need and what's it for?"
            stepNumber={1}
            totalSteps={5}
          >
            <LoanDetailsStep 
              formData={formData}
              onChange={handleFieldChange}
            />
          </FormStep>
        );

      case 2:
        return (
          <FormStep
            title="Personal Information"
            description="We need some basic information to verify your identity."
            stepNumber={2}
            totalSteps={5}
          >
            <PersonalInfoStep 
              formData={formData}
              onChange={handleFieldChange}
            />
          </FormStep>
        );

      case 3:
        return (
          <FormStep
            title="Employment & Financial Information"
            description="Employment status, banking and income details for loan processing."
            stepNumber={3}
            totalSteps={5}
          >
            <FinancialInfoStep 
              formData={formData}
              onChange={handleFieldChange}
            />
          </FormStep>
        );

      case 4:
        return (
          <FormStep
            title="Additional Details"
            description="References and contact preferences to complete your application."
            stepNumber={4}
            totalSteps={5}
          >
            <AdditionalDetailsStep 
              formData={formData}
              onChange={handleFieldChange}
            />
          </FormStep>
        );

      case 5:
        return (
          <FormStep
            title="Review & Submit"
            description="Please review your information and agree to our terms."
            stepNumber={5}
            totalSteps={5}
          >
            <TCPAConsentStep 
              formData={formData}
              onChange={handleFieldChange}
            />
          </FormStep>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <FormProgress 
        formData={formData}
        currentStep={currentStep}
        totalSteps={5}
      />
      
      {renderStepContent()}
      
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>
        
        {currentStep < 5 ? (
          <Button
            onClick={handleNext}
            disabled={!canProgressFromStep(currentStep, formData)}
            className="flex items-center gap-2"
          >
            Next Step
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!formData.tcpa || isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? 'Submitting...' : 'Submit Application'}
          </Button>
        )}
      </div>
    </div>
  );
}