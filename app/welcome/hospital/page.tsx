"use client"

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import { X, Building2, Mail, Phone, MapPin, FileText, User, Check } from 'lucide-react';

// Type definitions
interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

interface FormData {
  name: string;
  phone: string;
  address: string;
  gstin: string;
  tan: string;
}

interface FormErrors {
  [key: string]: string;
}

interface HospitalDetailsFormProps {
  onSubmit: (data: FormData) => void;
  loading: boolean;
  userEmail: string;
}

interface SuccessMessageProps {
  onContinue: () => void;
}

// Welcome Modal Component
const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose, userName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Welcome!</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Welcome to the platform, <span className="font-semibold text-blue-600">{userName}</span>!
          </p>
          <p className="text-gray-600 mb-4">
            To get started, we need to collect some basic information about your hospital. 
            This will help us provide you with the best possible service.
          </p>
          <p className="text-sm text-gray-500">
            Don't worry - this is a one-time setup and will only take a few minutes.
          </p>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

// Hospital Details Form Component
const HospitalDetailsForm: React.FC<HospitalDetailsFormProps> = ({ onSubmit, loading, userEmail }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    address: '',
    gstin: '',
    tan: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Hospital name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <Building2 className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Hospital Details
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please provide your hospital information to complete the setup
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Hospital Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Hospital Name *
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter hospital name"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Email (Read-only) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={userEmail}
                  readOnly
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-600 sm:text-sm cursor-not-allowed"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                This is the email address you used to sign up
              </p>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number *
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter phone number"
                />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address *
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 pt-2 flex items-start pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.address ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter hospital address"
                />
              </div>
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>

            {/* GSTIN */}
            <div>
              <label htmlFor="gstin" className="block text-sm font-medium text-gray-700">
                GSTIN (Optional)
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="gstin"
                  name="gstin"
                  type="text"
                  value={formData.gstin}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter GSTIN (if applicable)"
                />
              </div>
            </div>

            {/* TAN */}
            <div>
              <label htmlFor="tan" className="block text-sm font-medium text-gray-700">
                TAN (Optional)
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="tan"
                  name="tan"
                  type="text"
                  value={formData.tan}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter TAN (if applicable)"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  Complete Setup
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Success Message Component
const SuccessMessage: React.FC<SuccessMessageProps> = ({ onContinue }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8 text-center">
      <div>
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <Check className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Setup Complete!
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Your hospital details have been saved successfully. You can now access your dashboard.
        </p>
      </div>
      
      <button
        onClick={onContinue}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Continue to Dashboard
      </button>
    </div>
  </div>
);

// Main Hospital Flow Component
const HospitalWelcomeFlow = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<string | null>(null); // Changed to null initially
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingSetup, setIsCheckingSetup] = useState(true);

  // Check if user has already completed hospital setup
  useEffect(() => {
    const checkHospitalSetup = async () => {
      if (session?.user?.role === 'HOSPITAL') {
        setIsCheckingSetup(true);
        try {
          // Fixed: Use the correct API endpoint
          const response = await fetch('/api/hospital/setup-status');
          const data = await response.json();
          
          if (response.ok && data.hasCompletedSetup) {
            // User has already completed setup, redirect to dashboard
            router.push('/admin');
          } else {
            // Show welcome modal
            setCurrentStep('welcome');
          }
        } catch (error) {
          console.error('Error checking hospital setup:', error);
          // On error, show welcome modal to be safe
          setCurrentStep('welcome');
        } finally {
          setIsCheckingSetup(false);
        }
      } else {
        setIsCheckingSetup(false);
      }
    };

    if (status === 'authenticated') {
      checkHospitalSetup();
    } else if (status === 'unauthenticated') {
      setIsCheckingSetup(false);
    }
  }, [session, status, router]);

  const handleWelcomeClose = () => {
    setCurrentStep('form');
  };

  const handleFormSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/hospital/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentStep('success');
      } else {
        setError(data.message || 'Failed to save hospital details');
      }
    } catch (error) {
      console.error('Error submitting hospital details:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    router.push('/admin');
  };

  // Show loading spinner while checking setup or session
  if (status === 'loading' || isCheckingSetup) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not a hospital user
  if (session?.user?.role !== 'HOSPITAL') {
    return null;
  }

  // Don't render anything if we haven't determined the current step yet
  if (currentStep === null) {
    return null;
  }

  // Get userName and userEmail with fallback to prevent undefined values
  const userName = session?.user?.name || session?.user?.username || 'User';
  const userEmail = session?.user?.email || '';

  return (
    <>
      <WelcomeModal 
        isOpen={currentStep === 'welcome'} 
        onClose={handleWelcomeClose}
        userName={userName}
      />
      
      {currentStep === 'form' && (
        <div>
          {error && (
            <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
              {error}
            </div>
          )}
          <HospitalDetailsForm 
            onSubmit={handleFormSubmit} 
            loading={loading}
            userEmail={userEmail}
          />
        </div>
      )}
      
      {currentStep === 'success' && (
        <SuccessMessage onContinue={handleContinue} />
      )}
    </>
  );
};

export default HospitalWelcomeFlow;



