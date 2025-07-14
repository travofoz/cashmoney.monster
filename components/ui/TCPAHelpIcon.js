"use client";

import React, { useState } from 'react';
import { HelpCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * TCPA Help Icon Component
 * Displays a help icon that opens TCPA information in a new tab
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.size - Icon size ('sm', 'md', 'lg')
 * @returns {JSX.Element} TCPA help icon with tooltip
 */
export default function TCPAHelpIcon({ className = "", size = "sm" }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5", 
    lg: "h-6 w-6"
  };

  const handleClick = () => {
    // Open TCPA page in new tab
    window.open('/tcpa-notice', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative inline-block">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={`p-1 h-auto text-muted-foreground hover:text-foreground transition-colors ${className}`}
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="Learn about TCPA consent requirements"
      >
        <HelpCircle className={sizeClasses[size]} />
        <ExternalLink className="h-2 w-2 ml-0.5 opacity-60" />
      </Button>
      
      {showTooltip && (
        <div className="absolute left-8 top-0 w-72 p-3 bg-popover text-popover-foreground text-xs rounded-md shadow-lg border z-50 pointer-events-none">
          <div className="space-y-2">
            <p className="font-medium">TCPA Consent Information</p>
            <p>
              Learn about your rights regarding automated calls and texts. 
              Click to view full TCPA disclosure and consent requirements.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}