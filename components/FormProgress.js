"use client";

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { getFormCompletionPercentage } from '@/utils/formState';

/**
 * Form progress indicator component
 * @param {Object} props - Component props
 * @param {Object} props.formData - Current form data
 * @param {number} props.currentStep - Current step number
 * @param {number} props.totalSteps - Total number of steps
 * @returns {JSX.Element} Progress indicator
 */
export default function FormProgress({ 
  formData, 
  currentStep = 1, 
  totalSteps = 5 
}) {
  const completionPercentage = getFormCompletionPercentage(formData);
  
  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-muted-foreground">
          {Math.round(completionPercentage)}% Complete
        </span>
      </div>
      
      <Progress 
        value={completionPercentage} 
        className="w-full h-2"
      />
      
      <div className="flex justify-between mt-2">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div 
              key={stepNumber}
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                ${isCompleted 
                  ? 'bg-primary text-primary-foreground' 
                  : isCurrent 
                    ? 'bg-primary/20 text-primary border-2 border-primary' 
                    : 'bg-muted text-muted-foreground'
                }
              `}
            >
              {stepNumber}
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
        <span>Loan</span>
        <span>Personal</span>
        <span>Financial</span>
        <span>Details</span>
        <span>Submit</span>
      </div>
    </div>
  );
}