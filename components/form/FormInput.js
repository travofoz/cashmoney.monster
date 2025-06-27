"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getFieldError } from '@/utils/formValidation';
import DOBModal from './DOBModal';

/**
 * Form input component with validation
 * @param {Object} props - Component props
 * @param {string} props.name - Field name
 * @param {string} props.label - Field label
 * @param {string} props.type - Input type (text, email, tel, etc.)
 * @param {string} props.value - Current value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.required - Whether field is required
 * @param {Array} props.options - Select options (for select type)
 * @param {string} props.error - Custom error message
 * @param {string} props.tooltip - Tooltip text to display on hover
 * @returns {JSX.Element} Form input with validation
 */
export default function FormInput({
  name,
  label,
  type = 'text',
  value = '',
  onChange,
  placeholder = '',
  required = false,
  options = null,
  error = null,
  tooltip = null
}) {
  const [touched, setTouched] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [dobModalOpen, setDobModalOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Only show validation error if field has been touched and has error
  const validationError = error || localError;
  const showError = touched && validationError;

  const handleChange = (newValue) => {
    if (onChange) {
      onChange(name, newValue);
    }
  };

  const handleDOBSelect = (dateValue) => {
    handleChange(dateValue);
    setTouched(true);
  };

  const formatDisplayDate = (dateValue) => {
    if (!dateValue) return 'Select Date of Birth';
    const date = new Date(dateValue);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleBlur = () => {
    setTouched(true);
    if (required || value) {
      const errorMsg = getFieldError(name, value);
      setLocalError(errorMsg);
    }
  };

  // Helper component for label with tooltip
  const LabelWithTooltip = ({ children, htmlFor, className }) => (
    <div className="flex items-center gap-1">
      <Label htmlFor={htmlFor} className={className}>
        {children}
      </Label>
      {tooltip && (
        <div className="relative inline-block">
          <button
            type="button"
            className="w-4 h-4 rounded-full bg-muted text-muted-foreground text-xs flex items-center justify-center hover:bg-muted-foreground hover:text-muted transition-colors"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={(e) => {
              e.preventDefault();
              setShowTooltip(!showTooltip);
            }}
          >
            ?
          </button>
          {showTooltip && (
            <div className="absolute left-6 top-0 w-64 p-2 bg-popover text-popover-foreground text-xs rounded-md shadow-md border z-50">
              {tooltip}
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Render select dropdown
  if (options && Array.isArray(options)) {
    return (
      <div className="space-y-2">
        <LabelWithTooltip htmlFor={name} className={required ? "text-foreground" : "text-muted-foreground"}>
          {label} {required && <span className="text-destructive">*</span>}
        </LabelWithTooltip>
        <Select value={value} onValueChange={handleChange}>
          <SelectTrigger 
            className={showError ? "border-destructive" : ""}
            onBlur={handleBlur}
          >
            <SelectValue placeholder={placeholder || `Select ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem 
                key={typeof option === 'string' ? option : (option.key || option.value)} 
                value={typeof option === 'string' ? option : option.value}
              >
                {typeof option === 'string' ? option : option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {showError && (
          <p className="text-sm text-destructive">{validationError}</p>
        )}
      </div>
    );
  }

  // Render checkbox
  if (type === 'checkbox') {
    return (
      <div className="flex items-center space-x-2">
        <Checkbox
          id={name}
          checked={value === '1'}
          onCheckedChange={(checked) => handleChange(checked ? '1' : '0')}
        />
        <LabelWithTooltip htmlFor={name} className={required ? "text-foreground" : "text-muted-foreground"}>
          {label} {required && <span className="text-destructive">*</span>}
        </LabelWithTooltip>
        {showError && (
          <p className="text-sm text-destructive ml-6">{validationError}</p>
        )}
      </div>
    );
  }

  // Format phone numbers and SSN automatically
  const formatValue = (val) => {
    if ((type === 'tel' || name.includes('Phone') || name.includes('phone')) && val) {
      const digits = val.replace(/\D/g, '');
      if (digits.length >= 6) {
        return digits.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      } else if (digits.length >= 3) {
        return digits.replace(/(\d{3})(\d{0,3})/, '($1) $2');
      }
      return digits;
    }
    
    if (name === 'ssn' && val) {
      const digits = val.replace(/\D/g, '');
      if (digits.length > 5) {
        return digits.replace(/(\d{3})(\d{2})(\d{0,4})/, '$1-$2-$3');
      } else if (digits.length > 3) {
        return digits.replace(/(\d{3})(\d{0,2})/, '$1-$2');
      }
      return digits;
    }
    
    return val;
  };

  // Special handling for date of birth field
  if (name === 'dateOfBirth') {
    return (
      <div className="space-y-2">
        <LabelWithTooltip htmlFor={name} className={required ? "text-foreground" : "text-muted-foreground"}>
          {label} {required && <span className="text-destructive">*</span>}
        </LabelWithTooltip>
        <Button
          variant="outline"
          onClick={() => setDobModalOpen(true)}
          className={`w-full justify-start text-left font-normal ${showError ? "border-destructive" : ""}`}
        >
          {formatDisplayDate(value)}
        </Button>
        {showError && (
          <p className="text-sm text-destructive">{validationError}</p>
        )}
        <DOBModal
          isOpen={dobModalOpen}
          onClose={() => setDobModalOpen(false)}
          onSelect={handleDOBSelect}
          currentValue={value}
        />
      </div>
    );
  }

  // Handle input change with formatting
  const handleInputChange = (e) => {
    let newValue = e.target.value;
    
    // Remove formatting for phone numbers and SSN before storing
    if ((type === 'tel' || name.includes('Phone') || name.includes('phone')) && newValue) {
      newValue = newValue.replace(/\D/g, '');
    }
    
    if (name === 'ssn' && newValue) {
      newValue = newValue.replace(/\D/g, '');
      // Limit to 9 digits max
      if (newValue.length > 9) {
        newValue = newValue.substring(0, 9);
      }
    }
    
    handleChange(newValue);
  };

  return (
    <div className="space-y-2">
      <LabelWithTooltip htmlFor={name} className={required ? "text-foreground" : "text-muted-foreground"}>
        {label} {required && <span className="text-destructive">*</span>}
      </LabelWithTooltip>
      <Input
        id={name}
        name={name}
        type={type}
        value={formatValue(value)}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={showError ? "border-destructive" : ""}
        autoComplete={getAutoComplete(name)}
      />
      {showError && (
        <p className="text-sm text-destructive">{validationError}</p>
      )}
    </div>
  );
}

/**
 * Get appropriate autocomplete attribute for field
 * @param {string} fieldName - Name of the field
 * @returns {string} Autocomplete attribute value
 */
function getAutoComplete(fieldName) {
  const autoCompleteMap = {
    firstName: 'given-name',
    lastName: 'family-name',
    email: 'email',
    homePhone: 'tel-national',
    mobilePhone: 'tel-national',
    address: 'street-address',
    city: 'address-level2',
    state: 'address-level1',
    zip: 'postal-code',
    bankName: 'organization',
    employerName: 'organization'
  };
  
  return autoCompleteMap[fieldName] || 'off';
}