"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Generic form step wrapper component
 * @param {Object} props - Component props
 * @param {string} props.title - Step title
 * @param {string} props.description - Step description
 * @param {React.ReactNode} props.children - Step content
 * @param {number} props.stepNumber - Current step number
 * @param {number} props.totalSteps - Total number of steps
 * @returns {JSX.Element} Form step wrapper
 */
export default function FormStep({ 
  title = "Form Step",
  description = "Please fill out the information below.",
  children,
  stepNumber = 1,
  totalSteps = 6
}) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-muted-foreground">
            Step {stepNumber} of {totalSteps}
          </div>
          <div className="text-sm text-muted-foreground">
            {Math.round((stepNumber / totalSteps) * 100)}% Complete
          </div>
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
        {description && (
          <CardDescription className="text-base">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
      </CardContent>
    </Card>
  );
}