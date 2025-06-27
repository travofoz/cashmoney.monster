"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "light",
  setTheme: () => null,
});

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
}) {
  const [theme, setTheme] = useState(defaultTheme);
  
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Get system preference
    const getSystemTheme = () => {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    };
    
    // Load theme from localStorage on mount only once (not on theme change)
    const initTheme = () => {
      try {
        const savedTheme = localStorage.getItem(storageKey);
        if (savedTheme) {
          setTheme(savedTheme);
        } else {
          // No saved preference, use system preference
          const systemTheme = getSystemTheme();
          setTheme(systemTheme);
        }
      } catch (e) {
        console.warn("Failed to read theme from localStorage:", e);
        // Fallback to system preference
        const systemTheme = getSystemTheme();
        setTheme(systemTheme);
      }
    };
    
    // Initialize theme only once on mount
    initTheme();
    
    // Setup listener for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (e) => {
      // Only update if user hasn't manually set a preference
      const savedTheme = localStorage.getItem(storageKey);
      if (!savedTheme) {
        const newSystemTheme = e.matches ? "dark" : "light";
        setTheme(newSystemTheme);
      }
    };
    
    // Setup listener for theme changes from other sources
    const handleThemeChange = (e) => {
      if (e.detail?.theme) {
        setTheme(e.detail.theme);
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    window.addEventListener('themeChanged', handleThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, [storageKey]); // Removed theme from dependency array
  
  // Apply theme class in a separate effect to prevent infinite loops
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Apply theme class
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    
    // Save theme to localStorage
    try {
      localStorage.setItem(storageKey, theme);
    } catch (e) {
      console.warn("Failed to save theme to localStorage:", e);
    }
  }, [theme, storageKey]);
  
  const value = {
    theme,
    setTheme,
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Add prevention for update loops
  const safeSetTheme = (newTheme) => {
    // Only set theme if it's actually different
    if (newTheme !== theme) {
      setTheme(newTheme);
    }
  };
  
  if (!mounted) {
    return null;
  }
  
  return (
    <button
      onClick={() => safeSetTheme(theme === "light" ? "dark" : "light")}
      className="fixed z-50 bottom-4 right-4 bg-background border border-border hover:bg-accent p-2 rounded-full shadow-lg transition-colors"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "dark" ? (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 text-primary" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
          />
        </svg>
      ) : (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 text-primary" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
          />
        </svg>
      )}
    </button>
  );
}