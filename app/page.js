"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import FormInput from "@/components/form/FormInput";
import BankingInformationStep from "@/components/form/BankingInformationStep";
import LoanApplicationForm from "@/components/LoanApplicationForm";
import { loadFormData, saveFormData, initialFormData, clearFormData } from "@/utils/formState";

const LoanAmountSlider = ({ value, onChange }) => {
  const amounts = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
  const currentValue = value ? parseInt(value) : 500;
  const sliderIndex = amounts.indexOf(currentValue);
  
  const handleSliderChange = (newValue) => {
    const amount = amounts[newValue[0]];
    onChange(amount.toString());
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <span className="text-5xl font-bold text-primary">${currentValue}</span>
      </div>
      <div className="px-4">
        <Slider
          value={[sliderIndex >= 0 ? sliderIndex : 4]}
          onValueChange={handleSliderChange}
          max={amounts.length - 1}
          min={0}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>$100</span>
          <span>$1,000</span>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  const [currentStep, setCurrentStep] = useState(1); // Start with loan amount
  const [formData, setFormData] = useState(initialFormData);
  const totalSteps = 7;

  useEffect(() => {
    // Check for clear/fresh URL parameters
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      
      if (urlParams.get('clear') === '1' || urlParams.get('fresh') === '1') {
        clearFormData();
        const freshData = {
          ...initialFormData,
          userAgent: navigator.userAgent,
          ipAddress: '', // Will be captured server-side
        };
        setFormData(freshData);
        saveFormData(freshData);
        setCurrentStep(1);
        // Remove the parameter from URL to prevent repeated clearing
        window.history.replaceState({}, '', window.location.pathname);
        return;
      }

      // Extract tracking parameters and prepopulation data
      const trackingParams = {
        aid: urlParams.get('AID') || '',
        cid: urlParams.get('CID') || '',
        clkid: urlParams.get('CLKID') || '',
        arid: urlParams.get('ARID') || '',
        sub1: urlParams.get('SUB1') || '',
        sub2: urlParams.get('SUB2') || '',
      };

      // Extract prepopulation parameters
      const prepopData = {
        firstName: urlParams.get('FNAME') || '',
        lastName: urlParams.get('LNAME') || '',
        address: urlParams.get('ADDR1') || '',
        city: urlParams.get('CITY') || '',
        state: urlParams.get('STATE') || '',
        zip: urlParams.get('ZIP') || '',
        mobilePhone: urlParams.get('PHONE') || '',
        email: urlParams.get('EMAIL') || '',
      };

      const savedData = loadFormData();
      
      // Always capture user agent and tracking params
      const updatedData = {
        ...savedData,
        userAgent: navigator.userAgent,
        ipAddress: savedData.ipAddress || '', // Preserve if already set
        // Always update tracking params from URL
        ...trackingParams,
        // URL prepopulation always takes priority over saved data (fresh intent)
        ...(Object.keys(prepopData).reduce((acc, key) => {
          if (prepopData[key]) {
            acc[key] = prepopData[key];
          }
          return acc;
        }, {}))
      };

      setFormData(updatedData);
      saveFormData(updatedData);
      setCurrentStep(1); // Always start with loan amount
    } else {
      // Fallback for server-side or when window is not available
      const savedData = loadFormData();
      setFormData(savedData);
      setCurrentStep(1);
    }
  }, []);

  // Auto-populate smart defaults when user enters steps with defaults
  useEffect(() => {
    let needsUpdate = false;
    const updates = {};
    
    // Step 5: Employment defaults
    if (currentStep === 5) {
      if (!formData.paycheckAmount && smartDefaults.paycheckAmount) {
        updates.paycheckAmount = smartDefaults.paycheckAmount;
        needsUpdate = true;
      }
      if (!formData.payFrequency && smartDefaults.payFrequency) {
        updates.payFrequency = smartDefaults.payFrequency;
        needsUpdate = true;
      }
      if (!formData.timeAtJob && smartDefaults.timeAtJob) {
        updates.timeAtJob = smartDefaults.timeAtJob;
        needsUpdate = true;
      }
    }
    
    // Step 6: Banking defaults
    if (currentStep === 6) {
      if (!formData.accountType && smartDefaults.accountType) {
        updates.accountType = smartDefaults.accountType;
        needsUpdate = true;
      }
      if (!formData.timeAtBank && smartDefaults.timeAtBank) {
        updates.timeAtBank = smartDefaults.timeAtBank;
        needsUpdate = true;
      }
    }
    
    if (needsUpdate) {
      const newData = { ...formData, ...updates };
      setFormData(newData);
      saveFormData(newData);
    }
  }, [currentStep]);

  // Calculate monthly income when paycheck amount or frequency changes
  useEffect(() => {
    if (formData.paycheckAmount && formData.payFrequency) {
      const paycheckNumber = parseFloat(formData.paycheckAmount.replace(/[^0-9.]/g, ''));
      
      if (paycheckNumber > 0) {
        let monthlyIncome = 0;
        
        switch (formData.payFrequency) {
          case 'Weekly':
            monthlyIncome = paycheckNumber * 4.33; // 52 weeks / 12 months
            break;
          case 'Bi-Weekly':
            monthlyIncome = paycheckNumber * 2.17; // 26 pay periods / 12 months
            break;
          case 'Semi-Monthly':
            monthlyIncome = paycheckNumber * 2; // 24 pay periods / 12 months
            break;
          case 'Monthly':
            monthlyIncome = paycheckNumber * 1;
            break;
          default:
            monthlyIncome = paycheckNumber * 2.17; // Default to bi-weekly
        }
        
        const calculatedMonthlyIncome = `$${Math.round(monthlyIncome).toLocaleString()}`;
        
        // Only update if the calculated value is different
        if (formData.monthlyIncome !== calculatedMonthlyIncome) {
          const updatedData = { ...formData, monthlyIncome: calculatedMonthlyIncome };
          setFormData(updatedData);
          saveFormData(updatedData);
        }
      }
    }
  }, [formData.paycheckAmount, formData.payFrequency]);

  const handleFieldChange = (fieldName, value) => {
    const newData = { ...formData, [fieldName]: value };
    setFormData(newData);
    saveFormData(newData);
  };

  const handleNext = () => {
    if (canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepTitle = () => {
    switch(currentStep) {
      case 1: return "Loan Amount";
      case 2: return "Loan Purpose"; 
      case 3: return "Personal Information";
      case 4: return "Address";
      case 5: return "Employment";
      case 6: return "Banking & Identity";
      case 7: return "Final Agreement";
      default: return "Loan Details";
    }
  };

  const canProceed = () => {
    switch(currentStep) {
      case 1: return formData.loanAmount;
      case 2: return formData.loanPurpose;
      case 3: return formData.firstName && formData.lastName && formData.email && formData.mobilePhone && formData.preferredPronouns;
      case 4: return formData.address && formData.city && formData.state && formData.zip && formData.homeStatus && formData.timeAtResidence && formData.dateOfBirth;
      case 5: 
        const step5Valid = formData.employmentStatus && formData.employerName && formData.workPhone && 
                          formData.paycheckAmount && formData.payFrequency && formData.timeAtJob && formData.nextPayDate;
        return step5Valid;
      case 6: return formData.bankName && formData.accountType && formData.routingNumber && 
                     formData.accountNumber && formData.timeAtBank && formData.driverLicenseNumber && 
                     formData.driverLicenseState && formData.ssn;
      case 7: return formData.tcpaPhone && formData.tcpaConsent === '1' && formData.activeMilitary;
      default: return false;
    }
  };

  // Smart defaults mapping - fields that get partial credit when empty
  const smartDefaults = {
    paycheckAmount: '$750',
    payFrequency: 'B', 
    timeAtJob: '3',
    accountType: 'Checking',
    timeAtBank: '3'
  };

  // Get completion value for a field (1.0 = filled, 0.5 = has default, 0.0 = empty)
  const getFieldCompletionValue = (fieldName, actualValue) => {
    if (actualValue && actualValue.trim()) {
      return 1.0; // User filled it
    }
    if (smartDefaults[fieldName]) {
      return 0.5; // Has smart default available
    }
    return 0.0; // Empty with no default
  };

  const getStepProgress = () => {
    switch(currentStep) {
      case 1: 
        return formData.loanAmount ? 100 : 0;
      case 2:
        return formData.loanPurpose ? 100 : 0;
      case 3:
        const step3Fields = ['firstName', 'lastName', 'email', 'emailOptin', 'mobilePhone', 'preferredPronouns'];
        const step3Total = step3Fields.reduce((sum, field) => sum + getFieldCompletionValue(field, formData[field]), 0);
        return (step3Total / step3Fields.length) * 100;
      case 4:
        const step4Fields = ['address', 'city', 'state', 'zip', 'homeStatus', 'timeAtResidence', 'dateOfBirth'];
        const step4Total = step4Fields.reduce((sum, field) => sum + getFieldCompletionValue(field, formData[field]), 0);
        return (step4Total / step4Fields.length) * 100;
      case 5:
        const step5Fields = ['employmentStatus', 'employerName', 'workPhone', 'paycheckAmount', 'payFrequency', 'timeAtJob', 'nextPayDate'];
        const step5Total = step5Fields.reduce((sum, field) => sum + getFieldCompletionValue(field, formData[field]), 0);
        return (step5Total / step5Fields.length) * 100;
      case 6:
        const step6Fields = ['bankName', 'accountType', 'routingNumber', 'accountNumber', 'timeAtBank', 'driverLicenseNumber', 'driverLicenseState', 'ssn'];
        const step6Total = step6Fields.reduce((sum, field) => sum + getFieldCompletionValue(field, formData[field]), 0);
        return (step6Total / step6Fields.length) * 100;
      case 7:
        const step7Fields = ['tcpaPhone', 'tcpaConsent', 'activeMilitary'];
        const step7Total = step7Fields.reduce((sum, field) => sum + getFieldCompletionValue(field, formData[field]), 0);
        return (step7Total / step7Fields.length) * 100;
      default:
        return 0;
    }
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
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20">
      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Hero section */}
        <section className="pt-20 pb-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold text-foreground mb-4">
              Cash Money MONSTER!
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Loans up to $1,000
            </p>

            {currentStep === 0 && (
              <div className="max-w-md mx-auto space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">
                  Need cash fast?
                </h2>
                <div className="flex gap-4 justify-center">
                  <Button 
                    variant="outline" 
                    size="lg"
                  >
                    No, I&apos;m good
                  </Button>
                  <Button 
                    size="lg"
                    onClick={() => setCurrentStep(1)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Yes, get cash!
                  </Button>
                </div>
                <Progress value={10} className="w-full h-2" />
                <p className="text-sm text-muted-foreground">Free 60-second cash qualification</p>
              </div>
            )}

            {currentStep >= 1 && currentStep <= totalSteps && (
              <div className="max-w-md mx-auto bg-background border border-border p-6 rounded-lg shadow-xl space-y-6">
                <h2 className="text-xl font-semibold text-foreground">
                  {getStepTitle()}
                </h2>
                
                {/* Step 1: Loan Amount */}
                {currentStep === 1 && (
                  <div>
                    <label className="text-sm font-medium text-foreground mb-4 block">
                      How much do you need? *
                    </label>
                    <LoanAmountSlider 
                      value={formData.loanAmount}
                      onChange={(amount) => handleFieldChange('loanAmount', amount)}
                    />
                  </div>
                )}

                {/* Step 2: Loan Purpose */}
                {currentStep === 2 && (
                  <FormInput
                    name="loanPurpose"
                    label="What will you use the money for?"
                    value={formData.loanPurpose}
                    onChange={handleFieldChange}
                    options={loanPurposeOptions}
                    required={true}
                    placeholder="Select purpose"
                  />
                )}

                {/* Step 3: Personal Information */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput
                        name="firstName"
                        label="First Name"
                        value={formData.firstName}
                        onChange={handleFieldChange}
                        required={true}
                        placeholder="Enter your first name"
                      />
                      <FormInput
                        name="lastName"
                        label="Last Name"
                        value={formData.lastName}
                        onChange={handleFieldChange}
                        required={true}
                        placeholder="Enter your last name"
                      />
                    </div>
                    <FormInput
                      name="email"
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={handleFieldChange}
                      required={true}
                      placeholder="Enter your email"
                    />
                    <FormInput
                      name="emailOptin"
                      label="Get exclusive loan offers and financial tips via email"
                      type="checkbox"
                      value={formData.emailOptin}
                      onChange={handleFieldChange}
                      required={false}
                    />
                    <FormInput
                      name="mobilePhone"
                      label="Phone Number"
                      type="tel"
                      value={formData.mobilePhone}
                      onChange={handleFieldChange}
                      required={true}
                      placeholder="(555) 123-4567"
                    />
                    <FormInput
                      name="preferredPronouns"
                      label="Preferred Pronouns"
                      value={formData.preferredPronouns}
                      onChange={handleFieldChange}
                      required={true}
                      options={[
                        { value: 'M', label: 'he/him' },
                        { value: 'F', label: 'she/her' },
                        { value: 'M', label: 'they/them', key: 'they' }
                      ]}
                      placeholder="Select pronouns"
                    />
                  </div>
                )}

                {/* Step 4: Address */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <FormInput
                      name="address"
                      label="Street Address"
                      value={formData.address}
                      onChange={handleFieldChange}
                      required={true}
                      placeholder="123 Main Street"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput
                        name="city"
                        label="City"
                        value={formData.city}
                        onChange={handleFieldChange}
                        required={true}
                        placeholder="Your city"
                      />
                      <FormInput
                        name="state"
                        label="State"
                        value={formData.state}
                        onChange={handleFieldChange}
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
                      name="zip"
                      label="ZIP Code"
                      value={formData.zip}
                      onChange={handleFieldChange}
                      required={true}
                      placeholder="12345"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput
                        name="homeStatus"
                        label="Home Status"
                        value={formData.homeStatus}
                        onChange={handleFieldChange}
                        required={true}
                        options={['Rent', 'Own']}
                        placeholder="Select home status"
                      />
                      <FormInput
                        name="timeAtResidence"
                        label="Time at Address"
                        value={formData.timeAtResidence}
                        onChange={handleFieldChange}
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
                    </div>
                    <FormInput
                      name="dateOfBirth"
                      label="Date of Birth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleFieldChange}
                      required={true}
                    />
                  </div>
                )}

                {/* Step 5: Employment */}
                {currentStep === 5 && (
                  <div className="space-y-4">
                    <FormInput
                      name="employmentStatus"
                      label="Employment Status"
                      value={formData.employmentStatus}
                      onChange={handleFieldChange}
                      required={true}
                      options={[
                        { value: 'P', label: 'Employed Full-Time', key: 'full-time' },
                        { value: 'P', label: 'Employed Part-Time', key: 'part-time' },
                        { value: 'L', label: 'Self-Employed' },
                        { value: 'G', label: 'Social Security' },
                        { value: 'M', label: 'Military' },
                        { value: 'D', label: 'Disability' },
                        { value: 'P', label: 'Other Income', key: 'other' }
                      ]}
                      placeholder="Select employment status"
                    />
                    <FormInput
                      name="employerName"
                      label="Employer Name"
                      value={formData.employerName}
                      onChange={handleFieldChange}
                      required={true}
                      placeholder="Enter employer name"
                    />
                    <FormInput
                      name="workPhone"
                      label="Work Phone Number"
                      type="tel"
                      value={formData.workPhone}
                      onChange={handleFieldChange}
                      required={true}
                      placeholder="(555) 123-4567"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput
                        name="paycheckAmount"
                        label="Last Paycheck"
                        value={formData.paycheckAmount || '$750'}
                        onChange={handleFieldChange}
                        required={true}
                        options={[
                          '$300',
                          '$400',
                          '$500',
                          '$600',
                          '$700',
                          '$750',
                          '$800',
                          '$900',
                          '$1,000',
                          '$1,100',
                          '$1,200',
                          '$1,300',
                          '$1,400',
                          '$1,500',
                          '$1,600+',
                        ]}
                        placeholder="Gross amount before taxes"
                        tooltip="Amount of your last paycheck before taxes were taken out"
                      />
                      <FormInput
                        name="payFrequency"
                        label="Pay Frequency"
                        value={formData.payFrequency || 'B'}
                        onChange={handleFieldChange}
                        required={true}
                        options={[
                          { value: 'W', label: 'Weekly' },
                          { value: 'B', label: 'Bi-Weekly' },
                          { value: 'S', label: 'Semi-Monthly' },
                          { value: 'M', label: 'Monthly' }
                        ]}
                        placeholder="How often paid"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput
                        name="timeAtJob"
                        label="Time at Current Job"
                        value={formData.timeAtJob || '3'}
                        onChange={handleFieldChange}
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
                      <FormInput
                        name="nextPayDate"
                        label="Next Pay Date"
                        type="date"
                        value={formData.nextPayDate}
                        onChange={handleFieldChange}
                        required={true}
                      />
                    </div>
                  </div>
                )}

                {/* Step 6: Banking Information */}
                {currentStep === 6 && (
                  <BankingInformationStep
                    formData={formData}
                    onChange={handleFieldChange}
                  />
                )}

                {/* Step 7: Identity & Agreement */}
                {currentStep === 7 && (
                  <div className="space-y-4">
                    <FormInput
                      name="activeMilitary"
                      label="Are you active duty military?"
                      type="checkbox"
                      value={formData.activeMilitary}
                      onChange={handleFieldChange}
                      required={true}
                    />
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="text-base font-medium text-foreground mb-3">TCPA Consent Agreement</h3>
                      <p className="text-xs text-muted-foreground mb-4">
                        By submitting this form, I agree to receive phone calls and text messages from 
                        Cash Money and its network of lenders, at the phone number provided below. I understand 
                        that these calls may be made using an automatic telephone dialing system and may include 
                        prerecorded messages. I understand that my consent is not required to obtain a loan.
                      </p>
                      <p className="text-xs text-muted-foreground mb-4">
                        I also agree to the Terms of Service and Privacy Policy, and authorize the lenders 
                        to verify my information and check my credit.
                      </p>
                    </div>
                    <FormInput
                      name="tcpaPhone"
                      label="Phone Number for Communications"
                      type="tel"
                      value={formData.tcpaPhone || formData.mobilePhone}
                      onChange={handleFieldChange}
                      required={true}
                      placeholder="(555) 123-4567"
                      tooltip="If you would prefer to receive messages to another number, please enter it instead"
                    />
                    <FormInput
                      name="tcpaConsent"
                      label="I agree to receive communications at the number above"
                      type="checkbox"
                      value={formData.tcpaConsent}
                      onChange={handleFieldChange}
                      required={true}
                    />
                  </div>
                )}

                {/* Navigation buttons */}
                <div className="flex gap-4">
                  {currentStep > 1 && (
                    <Button 
                      variant="outline"
                      onClick={handleBack}
                      className="flex-1"
                    >
                      Back
                    </Button>
                  )}
                  <Button 
                    onClick={currentStep === 7 ? () => alert('Form submission coming soon!') : handleNext}
                    disabled={!canProceed()}
                    className={currentStep === 1 ? "w-full" : "flex-1"}
                  >
                    {currentStep === 7 ? 'Submit Application' : 'Continue'}
                  </Button>
                </div>
                
                <Progress value={(currentStep / totalSteps) * 100} className="w-full h-2" />
                <p className="text-sm text-muted-foreground">Step {currentStep} of {totalSteps} • {Math.round(getStepProgress())}% complete</p>
              </div>
            )}

          </div>
        </section>

        {/* Benefits sections - animated cards like remodel.monster */}
        <section className="py-12 md:py-16 bg-muted">
          <div className="max-w-[1100px] mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
                Common Money Problems
              </h2>
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.2 }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                {
                  title: "Unexpected Bills",
                  description: "Life throws curveballs. We provide quick financial solutions."
                },
                {
                  title: "Time Sensitive", 
                  description: "When you need money now, traditional loans take too long."
                },
                {
                  title: "Credit Concerns",
                  description: "Our extensive network of lenders serves all credit levels."
                }
              ].map((problem, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-xl">{problem.title}</CardTitle>
                      <CardDescription>{problem.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-background">
          <div className="max-w-[1100px] mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
                Why Choose Cash Money?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our loan search service is designed to connect you with lenders quickly and securely. Here&apos;s why you should choose us:
              </p>
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.2 }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {[
                {
                  icon: "⚡",
                  title: "Fast",
                  description: "Deposits as quickly as next business day."
                },
                {
                  icon: "🏪",
                  title: "Convenient",
                  description: "Search our massive network in minutes."
                },
                {
                  icon: "🔒",
                  title: "Secure",
                  description: "Bank-level security for all your information."
                },
                {
                  icon: "✓",
                  title: "Trusted",
                  description: "Thousands of satisfied customers."
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <Card className="h-full">
                    <CardHeader className="flex flex-row items-start space-y-0 space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-xl">{benefit.icon}</span>
                      </div>
                      <div>
                        <CardTitle className="text-xl">{benefit.title}</CardTitle>
                        <CardDescription>{benefit.description}</CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-12 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-black mb-4">
              Don&apos;t Let Money Problems Stress You Out!
            </h2>
            <p className="text-xl font-semibold mb-8">
              Cash Money MONSTER devours financial stress for breakfast!
            </p>
            {currentStep === 0 && (
              <Button 
                size="lg"
                onClick={() => setCurrentStep(1)}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Get Started Now!
              </Button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
