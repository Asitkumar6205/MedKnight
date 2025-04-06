"use client"
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type ActiveCaseContextType = {
  activeCases: Record<string, boolean>;
  setActiveCase: (patientId: string, isActive: boolean, skipDatabaseUpdate?: boolean) => void;
  isActiveCase: (patientId: string) => boolean;
};

const ActiveCaseContext = createContext<ActiveCaseContextType | undefined>(undefined);

export function ActiveCaseProvider({ children }: { children: ReactNode }) {
  const [activeCases, setActiveCases] = useState<Record<string, boolean>>({});

  // Load active cases from localStorage on first render
  useEffect(() => {
    const storedActiveCases: Record<string, boolean> = {};

    // Check all localStorage keys for activeCase prefix
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

  const setActiveCase = async (patientId: string, isActive: boolean, skipDatabaseUpdate = false) => {
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

    // Update database only if skipDatabaseUpdate is false
    if (!skipDatabaseUpdate) {
      try {
        const response = await fetch("/api/updateActiveCase", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ patientId, isActive })
        });
        
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          console.error("Failed to update case status in database:", data.message || response.statusText);
        }
      } catch (error) {
        console.error("Error updating case status in database:", error);
      }
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