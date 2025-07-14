"use client";

import React from 'react';

/**
 * Step 6: TCPA Consent and Final Review
 * @param {Object} props - Component props
 * @param {Object} props.formData - Current form data
 * @param {Function} props.onChange - Field change handler
 * @returns {JSX.Element} TCPA consent and review step
 */
export default function TCPAConsentStep({ formData, onChange }) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Application Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-muted/50 p-3 rounded">
            <span className="font-medium">Loan Amount:</span>
            <div className="text-lg font-bold text-primary">${formData.loanAmount || 'Not selected'}</div>
          </div>
          
          <div className="bg-muted/50 p-3 rounded">
            <span className="font-medium">Name:</span>
            <div>{formData.firstName} {formData.lastName || 'Incomplete'}</div>
          </div>
          
          <div className="bg-muted/50 p-3 rounded">
            <span className="font-medium">Email:</span>
            <div>{formData.email || 'Not provided'}</div>
          </div>
          
          <div className="bg-muted/50 p-3 rounded">
            <span className="font-medium">Phone:</span>
            <div>{formData.homePhone || 'Not provided'}</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Terms and Consent</h3>
        
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="tcpa"
                checked={formData.tcpa || false}
                onChange={(e) => onChange('tcpa', e.target.checked)}
                className="rounded border-gray-300 mt-1"
              />
              <label htmlFor="tcpa" className="text-sm leading-relaxed">
                <span className="font-medium">I agree to the following terms:</span>
                <div className="mt-2 space-y-2 text-xs">
                  <p>
                    By submitting this form, I agree to receive phone calls and text messages from this company 
                    and its partners regarding loan offers. I understand that:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Calls and texts may be made using automated technology</li>
                    <li>I may receive calls from multiple lenders and marketing partners</li>
                    <li>Message and data rates may apply</li>
                    <li>I can opt out at any time by replying STOP</li>
                    <li>My consent is not required to obtain a loan</li>
                  </ul>
                  <p>
                    I also acknowledge that I have read and agree to the 
                    <span className="text-blue-600 dark:text-blue-400"> Terms of Service</span> and 
                    <span className="text-blue-600 dark:text-blue-400"> Privacy Policy</span>.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <h4 className="font-medium mb-2 text-yellow-800 dark:text-yellow-200">Important Disclosure</h4>
          <div className="text-xs text-yellow-700 dark:text-yellow-300 space-y-2">
            <p>
              This is not a loan offer or commitment to lend. We do not guarantee approval or specific loan terms. 
              Loan amounts, terms, and rates vary by lender and are subject to credit approval.
            </p>
            <p>
              By submitting this application, you authorize us to share your information with our network of 
              lenders and partners who may contact you about loan products.
            </p>
            <p>
              APRs range from 5.99% to 35.99%. Loan terms range from 61 days to 72 months. 
              Example: $1,000 loan with 24-month term at 15% APR = 24 payments of $48.49.
            </p>
          </div>
        </div>

        {formData.tcpa && (
          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-green-800 dark:text-green-200">Ready to Submit</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Click &ldquo;Submit Application&rdquo; to process your loan request.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}