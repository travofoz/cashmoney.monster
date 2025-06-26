"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getFieldError } from '@/utils/formValidation';

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
  error = null
}) {
  const [touched, setTouched] = useState(false);
  const [localError, setLocalError] = useState(null);
  
  // Only show validation error if field has been touched and has error
  const validationError = error || localError;
  const showError = touched && validationError;

  const handleChange = (newValue) => {
    if (onChange) {
      onChange(name, newValue);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    if (required || value) {
      const errorMsg = getFieldError(name, value);
      setLocalError(errorMsg);
    }
  };

  // Render select dropdown
  if (options && Array.isArray(options)) {
    return (
      <div className="space-y-2">
        <Label htmlFor={name} className={required ? "text-foreground" : "text-muted-foreground"}>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
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
                key={typeof option === 'string' ? option : option.value} 
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

  // Format phone numbers automatically
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
    return val;
  };

  // Handle input change with formatting
  const handleInputChange = (e) => {
    let newValue = e.target.value;
    
    // Remove formatting for phone numbers before storing
    if ((type === 'tel' || name.includes('Phone') || name.includes('phone')) && newValue) {
      newValue = newValue.replace(/\D/g, '');
    }
    
    handleChange(newValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className={required ? "text-foreground" : "text-muted-foreground"}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
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