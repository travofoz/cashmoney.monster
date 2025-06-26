"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from "react-hot-toast";

// Components
import LoanHero from './LoanHero';
import { loadFormData, saveFormData, initialFormData } from '@/utils/formState';

// Form Step Components (to be created)
// import LoanIntroStep from './form/LoanIntroStep';
// import LoanAmountStep from './form/LoanAmountStep';
// ... etc

const BenefitsSection = () => (
  <section className="py-12 bg-card">
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-card-foreground">
        Why Choose Cash Money?
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            title: "Fast Approval",
            description: "Get approved in minutes, not days. Quick decisions for urgent needs."
          },
          {
            title: "Direct Deposit", 
            description: "Funds deposited directly to your bank account as soon as today."
          },
          {
            title: "No Hidden Fees",
            description: "Transparent pricing with no surprise charges or hidden fees."
          }
        ].map((item, index) => (
          <motion.div 
            key={index} 
            className="p-6 border-2 border-border shadow-md hover:shadow-lg transition-all bg-background hover:-translate-y-0.5 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <h3 className="text-xl font-semibold mb-2 text-foreground">{item.title}</h3>
            <p className="text-muted-foreground">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const UrgencySection = ({ onGetStarted }) => (
  <section className="py-12 bg-primary text-primary-foreground">
    <div className="max-w-4xl mx-auto px-4 text-center">
      <h2 className="text-3xl font-black mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
        Don&apos;t Let Money Problems Stress You Out!
      </h2>
      <p className="text-xl font-semibold mb-8 leading-relaxed" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
        Cash Money MONSTER devours financial stress for breakfast. Get the cash you need now!
      </p>
      <button 
        onClick={onGetStarted}
        className="px-8 py-3 bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0.5 border-2 border-border rounded-lg"
      >
        Get Cash Now!
      </button>
    </div>
  </section>
);

export default function CashMonsterHomePage() {
  const [currentStep, setCurrentStep] = useState(0); // 0 = landing, 1+ = form steps
  const [formData, setFormData] = useState(initialFormData);

  // Single onChange handler for all form fields
  const handleFieldChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const calculateProgress = () => {
    const totalSteps = 7; // Updated to match new flow
    return Math.min(100, Math.max(10, (currentStep / totalSteps) * 100));
  };

  // Load stored form data and step on component mount
  useEffect(() => {
    const savedData = loadFormData();
    setFormData(savedData);
    
    // Load current step from localStorage, fallback to URL if needed
    const savedStep = localStorage.getItem('loanCurrentStep');
    if (savedStep) {
      setCurrentStep(parseInt(savedStep));
    } else {
      // Fallback to URL parameter if localStorage is empty
      const urlParams = new URLSearchParams(window.location.search);
      const urlStep = urlParams.get('step');
      if (urlStep) {
        const stepNum = parseInt(urlStep);
        setCurrentStep(stepNum);
        localStorage.setItem('loanCurrentStep', stepNum.toString());
      }
    }
  }, []);

  // Save form data and step whenever they change
  useEffect(() => {
    saveFormData(formData);
  }, [formData]);

  useEffect(() => {
    if (currentStep > 0) {
      localStorage.setItem('loanCurrentStep', currentStep.toString());
    }
  }, [currentStep]);

  // Capture URL tracking parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const transaction_id = params.get("transaction_id");
    const source = params.get("source");

    if (transaction_id) {
      handleFieldChange('transaction_id', transaction_id);
    }
    if (source) {
      handleFieldChange('source', source);
    }
  }, [handleFieldChange]);

  const handleLandingResponse = (response) => {
    if (response === 'yes') {
      setCurrentStep(1); // Start form
    } else {
      // Maybe show alternative content or redirect
      toast.success("No problem! Come back when you need cash.");
    }
  };

  const handleNext = () => {
    // Validate current step before progressing
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const validateCurrentStep = () => {
    // Step-specific validation logic
    switch (currentStep) {
      case 1:
        if (!formData.loanAmount) {
          toast.error("Please select a loan amount");
          return false;
        }
        break;
      case 2:
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.homePhone) {
          toast.error("Please complete all required fields");
          return false;
        }
        break;
      // Add more validation as needed
      default:
        break;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!formData.tcpa) {
      toast.error("You must agree to the terms to submit your application.");
      return;
    }

    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
    }
  };

  const handleGetStarted = () => {
    setCurrentStep(1);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (currentStep === 7) {
      handleSubmit();
    } else {
      handleNext();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">How much cash do you need?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Step 1 content - Loan amount selection will go here
            </p>
          </div>
        );
      // Add more steps as they're built
      default:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Step {currentStep} content coming soon...
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <LoanHero 
        currentStep={currentStep}
        handleSubmit={handleLandingResponse}
        progress={calculateProgress()}
        hideButtons={currentStep > 0}
      >
        {currentStep > 0 && (
          <form onSubmit={handleFormSubmit} className="mb-6">
            {renderStepContent()}
            
            {/* Form navigation buttons */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-all text-sm shadow-sm hover:-translate-y-0.5 active:translate-y-0.5"
                disabled={currentStep <= 1}
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all text-sm shadow-sm hover:-translate-y-0.5 active:translate-y-0.5"
              >
                {currentStep === 7 ? 'Submit Application' : 'Continue'}
              </button>
            </div>
          </form>
        )}
      </LoanHero>
      
      <BenefitsSection />
      <UrgencySection onGetStarted={handleGetStarted} />
    </div>
  );
}