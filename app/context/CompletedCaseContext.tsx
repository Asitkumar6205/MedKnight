"use client"
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type CompletedCaseContextType = {
  completedCases: Record<string, boolean>;
  setCompletedCase: (patientId: string, isCompleted: boolean, skipDatabaseUpdate?: boolean) => void;
  isCompletedCase: (patientId: string) => boolean;
};

const CompletedCaseContext = createContext<CompletedCaseContextType | undefined>(undefined);

export function CompletedCaseProvider({ children }: { children: ReactNode }) {
  const [completedCases, setCompletedCases] = useState<Record<string, boolean>>({});

  // Load completed cases from localStorage on first render
  useEffect(() => {
    const storedCompletedCases: Record<string, boolean> = {};

    // Check all localStorage keys for completedCase prefix
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('completedCase_')) {
        const patientId = key.replace('completedCase_', '');
        if (localStorage.getItem(key) === 'true') {
          storedCompletedCases[patientId] = true;
        }
      }
    }

    setCompletedCases(storedCompletedCases);
  }, []);

  const setCompletedCase = async (patientId: string, isCompleted: boolean, skipDatabaseUpdate = false) => {
    // Update state
    setCompletedCases(prev => ({
      ...prev,
      [patientId]: isCompleted
    }));

    // Persist to localStorage
    if (isCompleted) {
      localStorage.setItem(`completedCase_${patientId}`, 'true');
    } else {
      localStorage.removeItem(`completedCase_${patientId}`);
    }

    // Update database only if skipDatabaseUpdate is false
    if (!skipDatabaseUpdate) {
      try {
        const response = await fetch("/api/updateCompletedCase", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ patientId, isCompleted })
        });
        
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          console.error("Failed to update case completion status in database:", data.message || response.statusText);
        }
      } catch (error) {
        console.error("Error updating case completion status in database:", error);
      }
    }

    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('completedCaseUpdated', {
      detail: { patientId, completed: isCompleted }
    }));
  };

  const isCompletedCase = (patientId: string) => {
    return !!completedCases[patientId];
  };

  return (
    <CompletedCaseContext.Provider value={{ completedCases, setCompletedCase, isCompletedCase }}>
      {children}
    </CompletedCaseContext.Provider>
  );
}

export function useCompletedCase() {
  const context = useContext(CompletedCaseContext);
  if (context === undefined) {
    throw new Error('useCompletedCase must be used within a CompletedCaseProvider');
  }
  return context;
}