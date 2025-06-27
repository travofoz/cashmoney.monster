"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function DOBModal({ isOpen, onClose, onSelect, currentValue }) {
  const [step, setStep] = useState(1); // 1=year, 2=month, 3=day
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  // Parse current value if exists (YYYY-MM-DD format)
  const parseCurrentValue = () => {
    if (currentValue) {
      const [year, month, day] = currentValue.split('-');
      return {
        year: parseInt(year),
        month: parseInt(month),
        day: parseInt(day)
      };
    }
    return null;
  };

  const resetAndClose = () => {
    setStep(1);
    setSelectedYear(null);
    setSelectedMonth(null);
    setSelectedDay(null);
    onClose();
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setStep(2);
  };

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    setStep(3);
  };

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    const dateValue = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onSelect(dateValue);
    resetAndClose();
  };

  const goBack = () => {
    if (step === 2) {
      setStep(1);
      setSelectedYear(null);
    } else if (step === 3) {
      setStep(2);
      setSelectedMonth(null);
    }
  };

  // Generate years (ages 18-80, so current year minus those ages)
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let age = 18; age <= 80; age++) {
    years.push(currentYear - age);
  }
  years.reverse(); // Most recent years first (2007, 2006, 2005...)

  const months = [
    { num: 1, name: 'January', short: 'Jan' },
    { num: 2, name: 'February', short: 'Feb' },
    { num: 3, name: 'March', short: 'Mar' },
    { num: 4, name: 'April', short: 'Apr' },
    { num: 5, name: 'May', short: 'May' },
    { num: 6, name: 'June', short: 'Jun' },
    { num: 7, name: 'July', short: 'Jul' },
    { num: 8, name: 'August', short: 'Aug' },
    { num: 9, name: 'September', short: 'Sep' },
    { num: 10, name: 'October', short: 'Oct' },
    { num: 11, name: 'November', short: 'Nov' },
    { num: 12, name: 'December', short: 'Dec' }
  ];

  // Get days in selected month
  const getDaysInMonth = () => {
    if (!selectedYear || !selectedMonth) return [];
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const formatPreview = () => {
    if (!selectedYear) return '';
    if (!selectedMonth) return `${selectedYear}`;
    const monthName = months.find(m => m.num === selectedMonth)?.name;
    if (!selectedDay) return `${monthName} ${selectedYear}`;
    return `${monthName} ${selectedDay}, ${selectedYear}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {step === 1 && 'Select Birth Year'}
              {step === 2 && 'Select Birth Month'}
              {step === 3 && 'Select Birth Day'}
            </CardTitle>
            {formatPreview() && (
              <p className="text-center text-muted-foreground">{formatPreview()}</p>
            )}
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {/* Step 1: Year Selection */}
              {step === 1 && (
                <motion.div
                  key="year"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto"
                >
                  {years.map((year) => (
                    <Button
                      key={year}
                      variant="outline"
                      onClick={() => handleYearSelect(year)}
                      className="h-12 text-sm"
                    >
                      {year}
                    </Button>
                  ))}
                </motion.div>
              )}

              {/* Step 2: Month Selection */}
              {step === 2 && (
                <motion.div
                  key="month"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-3 gap-2"
                >
                  {months.map((month) => (
                    <Button
                      key={month.num}
                      variant="outline"
                      onClick={() => handleMonthSelect(month.num)}
                      className="h-16 flex flex-col"
                    >
                      <span className="text-sm font-medium">{month.short}</span>
                      <span className="text-xs text-muted-foreground">{month.name}</span>
                    </Button>
                  ))}
                </motion.div>
              )}

              {/* Step 3: Day Selection */}
              {step === 3 && (
                <motion.div
                  key="day"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-7 gap-1"
                >
                  {getDaysInMonth().map((day) => (
                    <Button
                      key={day}
                      variant="outline"
                      onClick={() => handleDaySelect(day)}
                      className="h-12 w-12 p-0"
                    >
                      {day}
                    </Button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-2 mt-6">
              {step > 1 && (
                <Button variant="outline" onClick={goBack} className="flex-1">
                  Back
                </Button>
              )}
              <Button variant="outline" onClick={resetAndClose} className="flex-1">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}