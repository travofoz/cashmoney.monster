"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

/**
 * Hero section for loan application with Question-as-CTA design
 * Following remodel.monster pattern exactly
 */
function LoanHero({ currentStep, handleSubmit, progress = 10, hideButtons = false, children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Add theme-aware animation styles
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes form-glow {
        0% { box-shadow: 0 0 30px hsl(var(--primary) / 0.15); }
        25% { box-shadow: 0 0 40px hsl(var(--primary) / 0.2); }
        50% { box-shadow: 0 0 30px hsl(var(--primary) / 0.15); }
        75% { box-shadow: 0 0 40px hsl(var(--primary) / 0.25); }
        100% { box-shadow: 0 0 30px hsl(var(--primary) / 0.15); }
      }
      
      @keyframes border-glow {
        0% { border-color: hsl(var(--border) / 0.2); }
        50% { border-color: hsl(var(--border) / 0.5); }
        100% { border-color: hsl(var(--border) / 0.2); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (style.parentNode) {
        document.head.removeChild(style);
      }
      setMounted(false);
    };
  }, []);

  const handleYesClick = () => {
    setTimeout(() => {
      handleSubmit('yes');
    }, 300);
  };

  const handleNoClick = () => {
    setTimeout(() => {
      handleSubmit('no');
    }, 300);
  };
  
  return (
    <div className="relative w-full min-h-[600px] md:min-h-[700px]">
      {/* Background with cash/money theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-500 to-green-700"></div>
      
      {/* Theme color overlay - lighter in light mode, darker in dark mode */}
      <div className="absolute inset-0 bg-white/40 dark:bg-black/60"></div>
      
      <div className="relative max-w-[1100px] mx-auto px-4 md:px-6 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-foreground"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
        >
          {!hideButtons && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-block bg-secondary text-secondary-foreground p-4 shadow-md border-2 border-border mb-4 rounded-lg"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                Get Cash Today! 
              </h1>
              <p className="text-xl md:text-2xl max-w-2xl mx-auto">
                Fast payday, personal & installment loans up to $1,000
              </p>
            </motion.div>
          )}
          
          {/* Question as CTA */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-card text-card-foreground p-3 md:p-5 max-w-md mx-auto shadow-md border-2 border-border rounded-lg"
            style={{ 
              transform: "translateZ(0)", 
              backfaceVisibility: "hidden" 
            }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              {!hideButtons ? 'Need money fast?' : ''}
            </h2>
            
            {!hideButtons ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="outline"
                  className={cn(
                    "text-lg py-5 px-10 w-full sm:w-auto",
                    "hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-150",
                    "border-2 border-border"
                  )}
                  onClick={handleNoClick}
                >
                  No, I&apos;m good
                </Button>
                
                <Button 
                  variant="default"
                  className={cn(
                    "text-lg py-5 px-10 w-full sm:w-auto",
                    "hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-150",
                    "shadow-lg"
                  )}
                  onClick={handleYesClick}
                  autoFocus
                >
                  Yes, get cash!
                </Button>
              </div>
            ) : (
              <>
                {/* Show the current form step directly */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 25 }}
                  >
                    {children}
                  </motion.div>
                </AnimatePresence>
              </>
            )}
            
            {/* Progress indicator */}
            {currentStep > 0 && (
              <div className="mt-6 text-center text-sm text-muted-foreground">
                <Progress value={progress} className="h-2" />
                <p className="mt-2">Free 60-second cash qualification</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default LoanHero;