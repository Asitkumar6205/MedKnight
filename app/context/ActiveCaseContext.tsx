"use client"
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type ActiveCaseContextType = {
  activeCases: Record<string, boolean>;
  setActiveCase: (patientId: string, isActive: boolean) => void;
  isActiveCase: (patientId: string) => boolean;
};

const ActiveCaseContext = createContext<ActiveCaseContextType | undefined>(undefined);

export function ActiveCaseProvider({ children }: { children: ReactNode }) {
  const [activeCases, setActiveCases] = useState<Record<string, boolean>>({});

  // Load active cases from localStorage on first render
  useEffect(() => {
    const storedActiveCases: Record<string, boolean> = {};
    
    // Check all localStorage keys for activeCase_ prefix
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('activeCase_')) {
        const patientId = key.replace('activeCase_', '');
        if (localStorage.getItem(key) === 'true') {
          storedActiveCases[patientId] = true;
        }
      }
    }
    
    setActiveCases(storedActiveCases);
  }, []);

  const setActiveCase = (patientId: string, isActive: boolean) => {
    // Update state
    setActiveCases(prev => ({
      ...prev,
      [patientId]: isActive
    }));
    
    // Persist to localStorage
    if (isActive) {
      localStorage.setItem(`activeCase_${patientId}`, 'true');
    } else {
      localStorage.removeItem(`activeCase_${patientId}`);
    }
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('activeCaseUpdated', {
      detail: { patientId, active: isActive }
    }));
  };

  const isActiveCase = (patientId: string) => {
    return !!activeCases[patientId];
  };

  return (
    <ActiveCaseContext.Provider value={{ activeCases, setActiveCase, isActiveCase }}>
      {children}
    </ActiveCaseContext.Provider>
  );
}

export function useActiveCase() {
  const context = useContext(ActiveCaseContext);
  if (context === undefined) {
    throw new Error('useActiveCase must be used within an ActiveCaseProvider');
  }
  return context;
}