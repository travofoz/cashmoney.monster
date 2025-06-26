"use client";

import React, { useState } from 'react';
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/**
 * Theme-aware DatePicker component using shadcn Calendar
 * @param {Object} props - Component props
 * @param {string} props.name - Field name
 * @param {string} props.label - Field label
 * @param {string} props.value - Current value (MM/DD/YYYY format)
 * @param {Function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.required - Whether field is required
 * @param {string} props.error - Custom error message
 * @returns {JSX.Element} DatePicker component
 */
export default function DatePicker({
  name,
  label,
  value = '',
  onChange,
  placeholder = 'Pick a date',
  required = false,
  error = null
}) {
  const [touched, setTouched] = useState(false);
  const [open, setOpen] = useState(false);
  
  // Convert MM/DD/YYYY string to Date object
  const parseDate = (dateString) => {
    if (!dateString) return undefined;
    const [month, day, year] = dateString.split('/').map(Number);
    if (month && day && year) {
      return new Date(year, month - 1, day);
    }
    return undefined;
  };

  // Convert Date object to MM/DD/YYYY string
  const formatDate = (date) => {
    if (!date) return '';
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const selectedDate = parseDate(value);
  const showError = touched && error;

  const handleDateSelect = (date) => {
    if (date) {
      const formattedDate = formatDate(date);
      onChange(name, formattedDate);
      setOpen(false);
      setTouched(true);
    }
  };

  const handleBlur = () => {
    setTouched(true);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className={required ? "text-foreground" : "text-muted-foreground"}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground",
              showError && "border-destructive"
            )}
            onBlur={handleBlur}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, "PPP") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>
      
      {showError && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}