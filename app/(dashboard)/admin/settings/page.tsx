"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { User, Bell, Lock, CreditCard, Shield, Monitor, HelpCircle, LogOut } from 'lucide-react';

// Define the user data type for TypeScript
interface UserData {
  name: string;
  email: string;
  role: string;
  profileImage: string;
  notifications: {
    email: boolean;
    sms: boolean;
    browser: boolean;
    newCaseAssigned: boolean;
    reportReviewed: boolean;
    paymentReceived: boolean;
    systemUpdates: boolean;
  };
  display: {
    darkMode: boolean;
    highContrast: boolean;
    fontSize: string;
    defaultViewMode: string;
  };
  reporting: {
    autoSaveDraft: boolean;
    defaultTemplate: string;
    keyboardShortcuts: boolean;
    voiceControl: boolean;
  };
}

// Mock function for handling settings updates
const updateSettings = async (settings: any) => {
  // In a real app, this would call your API
  console.log('Settings updated:', settings);
  return { success: true };
};

// Mock function for getting user data
const getUserData = async (): Promise<UserData> => {
  // This would be your API call
  return {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@radiologygroup.com',
    role: 'Radiologist',
    profileImage: '/api/placeholder/100/100',
    notifications: {
      email: true,
      sms: false,
      browser: true,
      newCaseAssigned: true,
      reportReviewed: true,
      paymentReceived: true,
      systemUpdates: false
    },
    display: {
      darkMode: false,
      highContrast: false,
      fontSize: 'medium',
      defaultViewMode: 'standard'
    },
    reporting: {
      autoSaveDraft: true,
      defaultTemplate: 'comprehensive',
      keyboardShortcuts: true,
      voiceControl: false
    }
  };
};

type UserDataSection = 'notifications' | 'display' | 'reporting' | 'profile';

const SettingsPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'saving' | 'success' | 'error' | null>(null);
  // Initialize with a proper type instead of null
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserData();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async (section: UserDataSection, data: any) => {
    setSaveStatus('saving');
    try {
      // Guard against null userData
      if (!userData) {
        throw new Error('User data not loaded');
      }
      
      const updatedUserData = { ...userData };
      
      // Now TypeScript knows section is a valid key
      if (section === 'profile') {
        // Handle profile section separately (direct properties)
        setUserData({ ...userData, ...data });
      } else {
        // For nested objects (notifications, display, reporting)
        updatedUserData[section] = { ...userData[section], ...data };
        setUserData(updatedUserData);
      }
      
      const result = await updateSettings({ [section]: data });
      if (result.success) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading settings...</div>
      </div>
    );
  }

  // Guard against null userData for the entire render
  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Error loading user data</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Settings | Teleradiology Platform</title>
      </Head>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          </div>
        </header>

        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Sidebar */}
              <div className="w-full md:w-64 bg-white shadow rounded-lg p-4">
                <nav className="space-y-1">
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className={`flex items-center px-3 py-2 w-full rounded-md ${activeTab === 'profile' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <User className="mr-3 h-5 w-5" />
                    <span>Profile</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('notifications')}
                    className={`flex items-center px-3 py-2 w-full rounded-md ${activeTab === 'notifications' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Bell className="mr-3 h-5 w-5" />
                    <span>Notifications</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('security')}
                    className={`flex items-center px-3 py-2 w-full rounded-md ${activeTab === 'security' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Lock className="mr-3 h-5 w-5" />
                    <span>Security</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('billing')}
                    className={`flex items-center px-3 py-2 w-full rounded-md ${activeTab === 'billing' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <CreditCard className="mr-3 h-5 w-5" />
                    <span>Billing</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('privacy')}
                    className={`flex items-center px-3 py-2 w-full rounded-md ${activeTab === 'privacy' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Shield className="mr-3 h-5 w-5" />
                    <span>Privacy</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('display')}
                    className={`flex items-center px-3 py-2 w-full rounded-md ${activeTab === 'display' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Monitor className="mr-3 h-5 w-5" />
                    <span>Display</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('reporting')}
                    className={`flex items-center px-3 py-2 w-full rounded-md ${activeTab === 'reporting' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <HelpCircle className="mr-3 h-5 w-5" />
                    <span>Reporting</span>
                  </button>
                </nav>
              </div>

              {/* Main content */}
              <div className="flex-1 bg-white shadow rounded-lg p-6">
                {saveStatus === 'success' && (
                  <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
                    Settings updated successfully!
                  </div>
                )}
                {saveStatus === 'error' && (
                  <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
                    Failed to update settings. Please try again.
                  </div>
                )}

                {/* Profile Settings */}
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
                    <div className="flex flex-col md:flex-row gap-6 mb-6">
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <img 
                            src={userData.profileImage} 
                            alt="Profile" 
                            className="w-24 h-24 rounded-full object-cover"
                          />
                          <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="flex-1 space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            defaultValue={userData.name}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            defaultValue={userData.email}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                          />
                        </div>
                        <div>
                          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                          <input
                            type="text"
                            id="role"
                            name="role"
                            defaultValue={userData.role}
                            disabled
                            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm p-2 border"
                          />
                          <p className="mt-1 text-xs text-gray-500">Contact administration to change your role.</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          const nameElement = document.getElementById('name') as HTMLInputElement;
                          const emailElement = document.getElementById('email') as HTMLInputElement;
                          handleSave('profile', {
                            name: nameElement?.value,
                            email: emailElement?.value
                          });
                        }}
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}

                {/* Notifications Settings */}
                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Notification Channels</h3>
                        <p className="mt-1 text-sm text-gray-500">Decide how you want to receive notifications</p>
                        <div className="mt-4 space-y-4">
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="email-notifications"
                                name="email-notifications"
                                type="checkbox"
                                defaultChecked={userData.notifications.email}
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="email-notifications" className="font-medium text-gray-700">Email</label>
                              <p className="text-gray-500">Get notified via email for important updates</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="sms-notifications"
                                name="sms-notifications"
                                type="checkbox"
                                defaultChecked={userData.notifications.sms}
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="sms-notifications" className="font-medium text-gray-700">SMS</label>
                              <p className="text-gray-500">Receive text messages for urgent notifications</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="browser-notifications"
                                name="browser-notifications"
                                type="checkbox"
                                defaultChecked={userData.notifications.browser}
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="browser-notifications" className="font-medium text-gray-700">Browser</label>
                              <p className="text-gray-500">Show notifications in your browser when you're online</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Notification Types</h3>
                        <p className="mt-1 text-sm text-gray-500">Choose which events you want to be notified about</p>
                        <div className="mt-4 space-y-4">
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="new-case"
                                name="new-case"
                                type="checkbox"
                                defaultChecked={userData.notifications.newCaseAssigned}
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="new-case" className="font-medium text-gray-700">New Case Assigned</label>
                              <p className="text-gray-500">When a new case is assigned to you</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="report-reviewed"
                                name="report-reviewed"
                                type="checkbox"
                                defaultChecked={userData.notifications.reportReviewed}
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="report-reviewed" className="font-medium text-gray-700">Report Reviewed</label>
                              <p className="text-gray-500">When your report is reviewed by a colleague</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="payment-received"
                                name="payment-received"
                                type="checkbox"
                                defaultChecked={userData.notifications.paymentReceived}
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="payment-received" className="font-medium text-gray-700">Payment Received</label>
                              <p className="text-gray-500">When you receive a payment for your services</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="system-updates"
                                name="system-updates"
                                type="checkbox"
                                defaultChecked={userData.notifications.systemUpdates}
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="system-updates" className="font-medium text-gray-700">System Updates</label>
                              <p className="text-gray-500">Updates about new features and improvements</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          const emailNotify = document.getElementById('email-notifications') as HTMLInputElement;
                          const smsNotify = document.getElementById('sms-notifications') as HTMLInputElement;
                          const browserNotify = document.getElementById('browser-notifications') as HTMLInputElement;
                          const newCase = document.getElementById('new-case') as HTMLInputElement;
                          const reportReviewed = document.getElementById('report-reviewed') as HTMLInputElement;
                          const paymentReceived = document.getElementById('payment-received') as HTMLInputElement;
                          const systemUpdates = document.getElementById('system-updates') as HTMLInputElement;
                          
                          handleSave('notifications', {
                            email: emailNotify?.checked,
                            sms: smsNotify?.checked,
                            browser: browserNotify?.checked,
                            newCaseAssigned: newCase?.checked,
                            reportReviewed: reportReviewed?.checked,
                            paymentReceived: paymentReceived?.checked,
                            systemUpdates: systemUpdates?.checked
                          });
                        }}
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Save Preferences
                      </button>
                    </div>
                  </div>
                )}

                {/* Rest of the tabs (security, billing, privacy, display, reporting) remain the same, 
                just make sure to apply the same type casting pattern for document.getElementById when handling form data */}
                
                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
                        <div className="mt-4 space-y-4">
                          <div>
                            <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">Current Password</label>
                            <input
                              type="password"
                              id="current-password"
                              name="current-password"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                          </div>
                          <div>
                            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
                            <input
                              type="password"
                              id="new-password"
                              name="new-password"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                          </div>
                          <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                            <input
                              type="password"
                              id="confirm-password"
                              name="confirm-password"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <button
                            type="button"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Update Password
                          </button>
                        </div>
                      </div>
                      
                      {/* Rest of security tab content... */}
                    </div>
                  </div>
                )}

                {/* Display Settings */}
                {activeTab === 'display' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Display Settings</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Theme</h3>
                        <p className="mt-1 text-sm text-gray-500">Choose your preferred interface theme</p>
                        <div className="mt-4 space-y-4">
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="light-mode"
                                name="theme-mode"
                                type="radio"
                                defaultChecked={!userData.display.darkMode}
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="light-mode" className="font-medium text-gray-700">Light Mode</label>
                              <p className="text-gray-500">Standard light interface</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="dark-mode"
                                name="theme-mode"
                                type="radio"
                                defaultChecked={userData.display.darkMode}
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="dark-mode" className="font-medium text-gray-700">Dark Mode</label>
                              <p className="text-gray-500">Reduces eye strain in low-light environments</p>
                            </div>
                          </div>
                          
                          {/* More display settings... */}
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            const darkMode = document.getElementById('dark-mode') as HTMLInputElement;
                            const highContrast = document.getElementById('high-contrast') as HTMLInputElement;
                            const fontSize = document.getElementById('font-size') as HTMLSelectElement;
                            const defaultViewMode = document.getElementById('default-view-mode') as HTMLSelectElement;
                            const autoEnhance = document.getElementById('auto-enhance') as HTMLInputElement;
                            
                            handleSave('display', {
                              darkMode: darkMode?.checked,
                              highContrast: highContrast?.checked,
                              fontSize: fontSize?.value,
                              defaultViewMode: defaultViewMode?.value,
                              autoEnhance: autoEnhance?.checked
                            });
                          }}
                          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Save Display Settings
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reporting Settings */}
                {activeTab === 'reporting' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Reporting Preferences</h2>
                    
                    {/* Reporting settings content... */}
                    
                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          const defaultTemplate = document.getElementById('default-template') as HTMLSelectElement;
                          const autoSaveDraft = document.getElementById('auto-save-draft') as HTMLInputElement;
                          const enableAiSuggestions = document.getElementById('enable-ai-suggestions') as HTMLInputElement;
                          const autoAnomalyDetection = document.getElementById('auto-anomaly-detection') as HTMLInputElement;
                          const aiConfidenceThreshold = document.getElementById('ai-confidence-threshold') as HTMLSelectElement;
                          const keyboardShortcuts = document.getElementById('keyboard-shortcuts') as HTMLInputElement;
                          const voiceControl = document.getElementById('voice-control') as HTMLInputElement;
                          
                          handleSave('reporting', {
                            defaultTemplate: defaultTemplate?.value,
                            autoSaveDraft: autoSaveDraft?.checked,
                            enableAiSuggestions: enableAiSuggestions?.checked,
                            autoAnomalyDetection: autoAnomalyDetection?.checked,
                            aiConfidenceThreshold: aiConfidenceThreshold?.value,
                            keyboardShortcuts: keyboardShortcuts?.checked,
                            voiceControl: voiceControl?.checked
                          });
                        }}
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Save Reporting Preferences
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default SettingsPage;



// import { useState } from 'react';
// import { 
//   User, Settings, BellRing, Calendar, FileText, CreditCard, 
//   Shield, Building, Users, Database, Activity, PieChart,
//   ChevronRight, Search, Bell, LogOut, Menu, X
// } from 'lucide-react';



// export default function SettingsPage() {
//   const [userType, setUserType] = useState('radiologist'); // or 'hospital'
//   const [activeTab, setActiveTab] = useState('profile');
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const renderContent = () => {
//     // Radiologist Settings
//     if (userType === 'radiologist') {
//       switch (activeTab) {
//         case 'profile':
//           return <RadiologistProfile />;
//         case 'reporting':
//           return <ReportingPreferences />;
//         case 'notification':
//           return <NotificationSettings />;
//         case 'billing':
//           return <AccountBilling />;
//         case 'security':
//           return <SecuritySettings />;
//         default:
//           return <RadiologistProfile />;
//       }
//     } 
//     // Hospital/Diagnostic Center Settings
//     else {
//       switch (activeTab) {
//         case 'profile':
//           return <OrganizationProfile />;
//         case 'case-management':
//           return <CaseManagementSettings />;
//         case 'user-management':
//           return <UserManagement />;
//         case 'integration':
//           return <IntegrationSettings />;
//         case 'billing':
//           return <BillingPayment />;
//         case 'notification':
//           return <HospitalNotificationSettings />;
//         case 'branding':
//           return <BrandingReports />;
//         default:
//           return <OrganizationProfile />;
//       }
//     }
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       {/* Header */}
//       <header className="bg-white shadow">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
//           <div className="flex items-center">
//             <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
//           </div>
//           <div className="flex items-center space-x-4">
//             <button className="p-2 rounded-full hover:bg-gray-100">
//               <Search size={20} />
//             </button>
//             <button className="p-2 rounded-full hover:bg-gray-100 relative">
//               <Bell size={20} />
//               <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
//             </button>
//             <div className="hidden md:flex items-center space-x-2">
//               <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
//                 <span className="text-white font-semibold">{userType === 'radiologist' ? 'R' : 'H'}</span>
//               </div>
//               <span className="text-sm font-medium">
//                 {userType === 'radiologist' ? 'Dr. Smith' : 'City Hospital'}
//               </span>
//             </div>
//             <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
//               {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* User Type Switcher (for demo purposes) */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//         <div className="inline-flex rounded-md shadow-sm">
//           <button
//             type="button"
//             className={`px-4 py-2 text-sm font-medium rounded-l-md ${
//               userType === 'radiologist' 
//                 ? 'bg-indigo-600 text-white' 
//                 : 'bg-white text-gray-700 hover:bg-gray-50'
//             }`}
//             onClick={() => {
//               setUserType('radiologist');
//               setActiveTab('profile');
//             }}
//           >
//             Radiologist View
//           </button>
//           <button
//             type="button"
//             className={`px-4 py-2 text-sm font-medium rounded-r-md ${
//               userType === 'hospital' 
//                 ? 'bg-indigo-600 text-white' 
//                 : 'bg-white text-gray-700 hover:bg-gray-50'
//             }`}
//             onClick={() => {
//               setUserType('hospital');
//               setActiveTab('profile');
//             }}
//           >
//             Hospital/Diagnostic Center View
//           </button>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
//           {/* Sidebar */}
//           <aside className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:block lg:col-span-3`}>
//             <nav className="space-y-1">
//               {/* Radiologist Navigation */}
//               {userType === 'radiologist' && (
//                 <>
//                   <NavItem 
//                     icon={<User size={20} />} 
//                     title="Profile Settings" 
//                     active={activeTab === 'profile'} 
//                     onClick={() => setActiveTab('profile')}
//                   />
//                   <NavItem 
//                     icon={<FileText size={20} />} 
//                     title="Reporting Preferences" 
//                     active={activeTab === 'reporting'} 
//                     onClick={() => setActiveTab('reporting')}
//                   />
//                   <NavItem 
//                     icon={<BellRing size={20} />} 
//                     title="Notification Settings" 
//                     active={activeTab === 'notification'} 
//                     onClick={() => setActiveTab('notification')}
//                   />
//                   <NavItem 
//                     icon={<CreditCard size={20} />} 
//                     title="Account & Billing" 
//                     active={activeTab === 'billing'} 
//                     onClick={() => setActiveTab('billing')}
//                   />
//                   <NavItem 
//                     icon={<Shield size={20} />} 
//                     title="Security" 
//                     active={activeTab === 'security'} 
//                     onClick={() => setActiveTab('security')}
//                   />
//                 </>
//               )}

//               {/* Hospital Navigation */}
//               {userType === 'hospital' && (
//                 <>
//                   <NavItem 
//                     icon={<Building size={20} />} 
//                     title="Organization Profile" 
//                     active={activeTab === 'profile'} 
//                     onClick={() => setActiveTab('profile')}
//                   />
//                   <NavItem 
//                     icon={<Activity size={20} />} 
//                     title="Case Management" 
//                     active={activeTab === 'case-management'} 
//                     onClick={() => setActiveTab('case-management')}
//                   />
//                   <NavItem 
//                     icon={<Users size={20} />} 
//                     title="User Management" 
//                     active={activeTab === 'user-management'} 
//                     onClick={() => setActiveTab('user-management')}
//                   />
//                   <NavItem 
//                     icon={<Database size={20} />} 
//                     title="Integration Settings" 
//                     active={activeTab === 'integration'} 
//                     onClick={() => setActiveTab('integration')}
//                   />
//                   <NavItem 
//                     icon={<CreditCard size={20} />} 
//                     title="Billing & Payment" 
//                     active={activeTab === 'billing'} 
//                     onClick={() => setActiveTab('billing')}
//                   />
//                   <NavItem 
//                     icon={<BellRing size={20} />} 
//                     title="Notification Preferences" 
//                     active={activeTab === 'notification'} 
//                     onClick={() => setActiveTab('notification')}
//                   />
//                   <NavItem 
//                     icon={<FileText size={20} />} 
//                     title="Branding & Reports" 
//                     active={activeTab === 'branding'} 
//                     onClick={() => setActiveTab('branding')}
//                   />
//                 </>
//               )}

//               <div className="pt-6">
//                 <div className="h-px bg-gray-200"></div>
//                 <button className="mt-6 group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50 w-full">
//                   <LogOut size={20} className="mr-3 text-gray-400 group-hover:text-gray-500" />
//                   Sign Out
//                 </button>
//               </div>
//             </nav>
//           </aside>

//           {/* Main content area */}
//           <div className="mt-6 lg:mt-0 lg:col-span-9">
//             <div className="bg-white shadow sm:rounded-lg">
//               {renderContent()}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Navigation Item Component
// function NavItem({ icon, title, active, onClick }) {
//   return (
//     <a
//       href="#"
//       onClick={(e) => {
//         e.preventDefault();
//         onClick();
//       }}
//       className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
//         active
//           ? 'bg-indigo-50 text-indigo-700'
//           : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//       }`}
//     >
//       <span className={`mr-3 ${active ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}`}>
//         {icon}
//       </span>
//       {title}
//       <ChevronRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 text-gray-300" />
//     </a>
//   );
// }

// // Form Section Component
// function FormSection({ title, description, children }) {
//   return (
//     <div className="px-4 py-5 sm:p-6">
//       <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
//       {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
//       <div className="mt-6">{children}</div>
//     </div>
//   );
// }

// // Form Divider Component
// function FormDivider() {
//   return <div className="border-t border-gray-200 my-6"></div>;
// }

// // Input Group Component
// function InputGroup({ label, id, type = "text", placeholder = "", value = "", onChange = () => {}, options = [] }) {
//   return (
//     <div className="mb-4">
//       <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
//         {label}
//       </label>
//       {type === "select" ? (
//         <select
//           id={id}
//           name={id}
//           className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
//           value={value}
//           onChange={onChange}
//         >
//           {options.map(option => (
//             <option key={option.value} value={option.value}>{option.label}</option>
//           ))}
//         </select>
//       ) : type === "textarea" ? (
//         <textarea
//           id={id}
//           name={id}
//           rows={3}
//           className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
//           placeholder={placeholder}
//           value={value}
//           onChange={onChange}
//         />
//       ) : type === "checkbox" ? (
//         <div className="flex items-center">
//           <input
//             id={id}
//             name={id}
//             type="checkbox"
//             className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//             checked={value}
//             onChange={onChange}
//           />
//           <label htmlFor={id} className="ml-2 block text-sm text-gray-900">
//             {placeholder}
//           </label>
//         </div>
//       ) : (
//         <input
//           type={type}
//           name={id}
//           id={id}
//           className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
//           placeholder={placeholder}
//           value={value}
//           onChange={onChange}
//         />
//       )}
//     </div>
//   );
// }

// // ==================== RADIOLOGIST COMPONENTS ====================

// function RadiologistProfile() {
//   return (
//     <div>
//       <FormSection 
//         title="Personal Information" 
//         description="Manage your personal details and contact information."
//       >
//         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//           <div className="sm:col-span-3">
//             <InputGroup
//               label="First Name"
//               id="firstName"
//               placeholder="John"
//             />
//           </div>
//           <div className="sm:col-span-3">
//             <InputGroup
//               label="Last Name"
//               id="lastName"
//               placeholder="Smith"
//             />
//           </div>
//           <div className="sm:col-span-4">
//             <InputGroup
//               label="Email Address"
//               id="email"
//               type="email"
//               placeholder="john.smith@example.com"
//             />
//           </div>
//           <div className="sm:col-span-3">
//             <InputGroup
//               label="Phone Number"
//               id="phone"
//               placeholder="+1 (555) 987-6543"
//             />
//           </div>
//           <div className="sm:col-span-6">
//             <InputGroup
//               label="Address"
//               id="address"
//               placeholder="123 Medical Center Dr"
//             />
//           </div>
//         </div>
//       </FormSection>
      
//       <FormDivider />

//       <FormSection 
//         title="Professional Credentials" 
//         description="Manage your licenses, certifications, and specialties."
//       >
//         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//           <div className="sm:col-span-3">
//             <InputGroup
//               label="Medical License Number"
//               id="licenseNumber"
//               placeholder="MD12345678"
//             />
//           </div>
//           <div className="sm:col-span-3">
//             <InputGroup
//               label="License Expiration Date"
//               id="licenseExpiration"
//               type="date"
//             />
//           </div>
//           <div className="sm:col-span-6">
//             <InputGroup
//               label="Board Certifications"
//               id="certifications"
//               type="textarea"
//               placeholder="American Board of Radiology, Neuroradiology, etc."
//             />
//           </div>
//           <div className="sm:col-span-3">
//             <InputGroup
//               label="Primary Specialty"
//               id="primarySpecialty"
//               type="select"
//               options={[
//                 { value: "", label: "Select Specialty" },
//                 { value: "neuroradiology", label: "Neuroradiology" },
//                 { value: "musculoskeletal", label: "Musculoskeletal" },
//                 { value: "cardiothoracic", label: "Cardiothoracic" },
//                 { value: "abdominal", label: "Abdominal" },
//                 { value: "pediatric", label: "Pediatric" },
//                 { value: "interventional", label: "Interventional" },
//                 { value: "nuclear", label: "Nuclear Medicine" },
//                 { value: "general", label: "General Radiology" }
//               ]}
//             />
//           </div>
//           <div className="sm:col-span-3">
//             <InputGroup
//               label="Secondary Specialties"
//               id="secondarySpecialties"
//               type="select"
//               options={[
//                 { value: "", label: "Select Secondary Specialty" },
//                 { value: "neuroradiology", label: "Neuroradiology" },
//                 { value: "musculoskeletal", label: "Musculoskeletal" },
//                 { value: "cardiothoracic", label: "Cardiothoracic" },
//                 { value: "abdominal", label: "Abdominal" },
//                 { value: "pediatric", label: "Pediatric" },
//                 { value: "interventional", label: "Interventional" },
//                 { value: "nuclear", label: "Nuclear Medicine" },
//                 { value: "general", label: "General Radiology" }
//               ]}
//             />
//           </div>
//         </div>
//       </FormSection>

//       <FormDivider />

//       <FormSection 
//         title="Availability & Working Hours" 
//         description="Set your working hours and availability for case assignments."
//       >
//         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//           <div className="sm:col-span-3">
//             <InputGroup
//               label="Time Zone"
//               id="timeZone"
//               type="select"
//               options={[
//                 { value: "", label: "Select Time Zone" },
//                 { value: "est", label: "Eastern Time (ET)" },
//                 { value: "cst", label: "Central Time (CT)" },
//                 { value: "mst", label: "Mountain Time (MT)" },
//                 { value: "pst", label: "Pacific Time (PT)" },
//                 { value: "utc", label: "Coordinated Universal Time (UTC)" }
//               ]}
//             />
//           </div>
//           <div className="sm:col-span-6">
//             <h3 className="text-sm font-medium text-gray-700 mb-3">Available Working Days</h3>
//             <div className="flex flex-wrap gap-3">
//               {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
//                 <div key={day} className="flex items-center">
//                   <input
//                     id={`day-${day.toLowerCase()}`}
//                     name={`day-${day.toLowerCase()}`}
//                     type="checkbox"
//                     className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                     defaultChecked={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(day)}
//                   />
//                   <label htmlFor={`day-${day.toLowerCase()}`} className="ml-2 block text-sm text-gray-900">
//                     {day}
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div className="sm:col-span-3">
//             <InputGroup
//               label="Working Hours Start"
//               id="workingHoursStart"
//               type="time"
//               placeholder="09:00"
//             />
//           </div>
//           <div className="sm:col-span-3">
//             <InputGroup
//               label="Working Hours End"
//               id="workingHoursEnd"
//               type="time"
//               placeholder="17:00"
//             />
//           </div>
//         </div>
//       </FormSection>

//       <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 rounded-b-lg">
//         <button
//           type="submit"
//           className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//         >
//           Save Changes
//         </button>
//       </div>
//     </div>
//   );
// }

// function ReportingPreferences() {
//   return (
//     <div>
//       <FormSection 
//         title="Report Templates" 
//         description="Manage your default report templates by modality."
//       >
//         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//           <div className="sm:col-span-6">
//             <InputGroup
//               label="Default Report Structure"
//               id="defaultReportStructure"
//               type="select"
//               options={[
//                 { value: "", label: "Select Default Structure" },
//                 { value: "findings_first", label: "Findings First, Impression Last" },
//                 { value: "impression_first", label: "Impression First, Findings Last" },
//                 { value: "integrated", label: "Integrated (No Separate Sections)" }
//               ]}
//             />
//           </div>
          
//           <div className="sm:col-span-6">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Modality-Specific Templates
//             </label>
//             <div className="mt-1 bg-gray-50 rounded-md p-4">
//               <div className="space-y-4">
//                 {["CT", "MRI", "X-Ray", "Ultrasound", "Mammography"].map((modality) => (
//                   <div key={modality} className="border border-gray-200 rounded-md p-3 bg-white">
//                     <div className="flex items-center justify-between mb-2">
//                       <h4 className="text-sm font-medium text-gray-700">{modality} Template</h4>
//                       <button className="text-xs text-indigo-600 hover:text-indigo-900">
//                         Edit Template
//                       </button>
//                     </div>
//                     <p className="text-xs text-gray-500">
//                       {modality === "CT" 
//                         ? "Standard CT template with sections for technique, comparison, findings, and impression."
//                         : `Default ${modality} report template`}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </FormSection>
      
//       <FormDivider />

//       <FormSection 
//         title="Interface Preferences" 
//         description="Customize your reporting interface settings."
//       >
//         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//           <div className="sm:col-span-3">
//             <InputGroup
//               label="Default View Mode"
//               id="viewMode"
//               type="select"
//               options={[
//                 { value: "light", label: "Light Mode" },
//                 { value: "dark", label: "Dark Mode" },
//                 { value: "system", label: "Follow System Preference" }
//               ]}
//             />
//           </div>
//           <div className="sm:col-span-3">
//             <InputGroup
//               label="Font Size"
//               id="fontSize"
//               type="select"
//               options={[
//                 { value: "small", label: "Small" },
//                 { value: "medium", label: "Medium (Default)" },
//                 { value: "large", label: "Large" }
//               ]}
//             />
//           </div>
//           <div className="sm:col-span-6">
//             <InputGroup
//               label="Enable Voice Recognition"
//               id="voiceRecognition"
//               type="checkbox"
//               placeholder="Use voice recognition for dictation"
//             />
//           </div>
//           <div className="sm:col-span-6">
//             <InputGroup
//               label="Auto-Save Interval (minutes)"
//               id="autoSave"
//               type="number"
//               placeholder="5"
//             />
//           </div>
//         </div>
//       </FormSection>

//       <FormDivider />

//       <FormSection 
//         title="Keyboard Shortcuts" 
//         description="Customize keyboard shortcuts for faster reporting."
//       >
//         <div className="mt-1 bg-gray-50 rounded-md p-4">
//           <div className="space-y-3">
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-gray-700">Save Report</span>
//               <span className="text-sm font-mono bg-gray-200 px-2 py-1 rounded">Ctrl + S</span>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-gray-700">Insert Template</span>
//               <span className="text-sm font-mono bg-gray-200 px-2 py-1 rounded">Ctrl + T</span>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-gray-700">Start/Stop Dictation</span>
//               <span className="text-sm font-mono bg-gray-200 px-2 py-1 rounded">Ctrl + D</span>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-gray-700">Next Case</span>
//               <span className="text-sm font-mono bg-gray-200 px-2 py-1 rounded">Alt + Right</span>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-gray-700">Previous Case</span>
//               <span className="text-sm font-mono bg-gray-200 px-2 py-1 rounded">Alt + Left</span>
//             </div>
//           </div>
//           <button className="mt-4 text-sm text-indigo-600 hover:text-indigo-900">
//             Customize Shortcuts
//           </button>
//         </div>
//       </FormSection>

//       <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 rounded-b-lg">
//         <button
//           type="submit"
//           className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//         >
//           Save Changes
//         </button>
//       </div>
//     </div>
//   );
// }

// function NotificationSettings() {
//   return (
//     <div>
//       <FormSection 
//         title="Notification Preferences" 
//         description="Choose how and when you want to be notified."
//       >
//         <div className="space-y-4">
//           <h3 className="text-sm font-medium text-gray-700">Case Notifications</h3>
//           <div className="ml-4 space-y-2">
//             <InputGroup
//               label="New Case Assignment"
//               id="newCaseNotification"
//               type="checkbox"
//               placeholder="Receive notification when a new case is assigned to you"
//             />
//             <InputGroup
//               label="STAT Cases"
//               id="statCaseNotification"
//               type="checkbox"
//               placeholder="Receive priority notification for STAT cases"
//             />
//             <InputGroup
//               label="Deadline Reminders"
//               id="deadlineReminder"
//               type="checkbox"
//               placeholder="Receive reminders for upcoming report deadlines"
//             />
//             <InputGroup
//               label="Case Review Requests"
//               id="reviewRequest"
//               type="checkbox"
//               placeholder="Receive notification when someone requests your review"
//             />
//           </div>

//           <h3 className="text-sm font-medium text-gray-700 mt-6">Administrative Notifications</h3>
//           <div className="ml-4 space-y-2">
//             <InputGroup
//               label="Payment Received"
//               id="paymentReceived"
//               type="checkbox"
//               placeholder="Receive notification when payment is processed"
//             />
//             <InputGroup
//               label="System Updates"
//               id="systemUpdates"
//               type="checkbox"
//               placeholder="Receive notifications about system updates and maintenance"
//             />
//           </div>
//         </div>
//       </FormSection>
      
//       <FormDivider />

//       <FormSection 
//         title="Delivery Methods" 
//         description="Choose how you would like to receive notifications."
//       >
//         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//           <div className="sm:col-span-6">
//             <InputGroup
//               label="Email Notifications"
//               id="emailNotifications"
//               type="checkbox"
//               placeholder="Receive notifications via email"
//             />
//           </div>
//           <div className="sm:col-span-6">
//             <InputGroup
//               label="SMS Notifications"
//               id="smsNotifications"
//               type="checkbox"
//               placeholder="Receive notifications via SMS"
//             />
//           </div>
//           <div className="sm:col-span-6">
//             <InputGroup
//               label="In-App Notifications"
//               id="inAppNotifications"
//               type="checkbox"
//               placeholder="Receive notifications within the application"
//             />
//           </div>
//           <div className="sm:col-span-6">
//             <InputGroup
//               label="Mobile Push Notifications"
//               id="pushNotifications"
//               type="checkbox"
//               placeholder="Receive push notifications on your mobile device"
//             />
//           </div>
//         </div>
//       </FormSection>

//       <FormDivider />

//       <FormSection 
//         title="Notification Schedule" 
//         description="Configure when you want to receive notifications."
//       >
//         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//           <div className="sm:col-span-6">
//             <InputGroup
//               label="Time of Day Restrictions"
//               id="timeRestrictions"
//               type="checkbox"
//               placeholder="Only send notifications during specific hours"
//             />
//           </div>
//           <div className="sm:col-span-3">
//             <InputGroup
//               label="Quiet Hours Start"
//               id="quietHoursStart"
//               type="time"
//               placeholder="22:00"
//             />
//           </div>
//           <div className="sm:col-span-3">
//             <InputGroup
//               label="Quiet Hours End"
//               id="quietHoursEnd"
//               type="time"
//               placeholder="07:00"
//             />
//           </div>
//           <div className="sm:col-span-6">
//             <InputGroup
//               label="Bundle Non-Urgent Notifications"
//               id="bundleNotifications"
//               type="checkbox"
//               placeholder="Group non-urgent notifications into a daily summary"
//             />
//           </div>
//           <div className="sm:col-span-3">
//             <InputGroup
//               label="Daily Summary Time"
//               id="summaryTime"
//               type="time"
//               placeholder="08:00"
//             />
//           </div>
//         </div>
//       </FormSection>

//       <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 rounded-b-lg">
//         <button
//           type="submit"
//           className="bg-indigo
//           type="submit"
//           className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//         >
//           Save Changes
//         </button>
//       </div>
//     </div>
//   );
// }

// function AccountBilling() {
//   return (
//     <div>
//       <FormSection 
//         title="Payment Information" 
//         description="Manage your payment details and preferences."
//       >
//         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//           <div className="sm:col-span-6">
//             <InputGroup
//               label="Payment Method"
//               id="paymentMethod"
//               type="select"
//               options={[
//                 { value: "direct_deposit", label: "Direct Deposit (ACH)" },
//                 { value: "paypal", label: "PayPal" },
//                 { value: "check", label: "Check" }
//               ]}
//             />
//           </div>
          
//           <div className="sm:col-span-6">
//             <h3 className="text-sm font-medium text-gray-700 mb-2">Bank Account Details (for Direct Deposit)</h3>
//             <div className="grid grid-cols-6 gap-6">
//               <div className="col-span-6 sm:col-span-3">
//                 <InputGroup
//                   label="Bank Name"
//                   id="bankName"
//                   placeholder="Example Bank"
//                 />
//               </div>
//               <div className="col-span-6 sm:col-span-3">
//                 <InputGroup
//                   label="Account Type"
//                   id="accountType"
//                   type="select"
//                   options={[
//                     { value: "checking", label: "Checking" },
//                     { value: "savings", label: "Savings" }
//                   ]}
//                 />
//               </div>
//               <div className="col-span-6 sm:col-span-3">
//                 <InputGroup
//                   label="Routing Number"
//                   id="routingNumber"
//                   placeholder="123456789"
//                 />
//               </div>
//               <div className="col-span-6 sm:col-span-3">
//                 <InputGroup
//                   label="Account Number"
//                   id="accountNumber"
//                   placeholder="•••••••8765"
//                   type="password"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </FormSection>
      
//       <FormDivider />

//       <FormSection 
//         title="Tax Information" 
//         description="Manage your tax documents and information."
//       >
//         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//           <div className="sm:col-span-3">
//             <InputGroup
//               label="Tax ID Type"
//               id="taxIdType"
//               type="select"
//               options={[
//                 { value: "ssn", label: "Social Security Number (SSN)" },
//                 { value: "ein", label: "Employer Identification Number (EIN)" }
//               ]}
//             />
//           </div>
//           <div className="sm:col-span-3">
//             <InputGroup
//               label="Tax ID Number"
//               id="taxIdNumber"
//               placeholder="•••-••-6789"
//               type="password"
//             />
//           </div>
//           <div className="sm:col-span-6">
//             <InputGroup
//               label="W-9 Form"
//               id="w9Form"
//               type="file"
//             />
//             <p className="mt-1 text-sm text-gray-500">
//               Please upload a completed W-9 form. We'll use this information for tax reporting purposes.
//             </p>
//           </div>
//         </div>
//       </FormSection>

//       <FormDivider />

//       <FormSection 
//         title="Rate Settings" 
//         description="View and manage your per-case rates."
//       >
//         <div className="mt-1 bg-gray-50 rounded-md p-4">
//           <div className="space-y-3">
//             <p className="text-sm text-gray-500 mb-2">
//               Your rates are determined by modality and case complexity:
//             </p>
            
//             <div className="border-b border-gray-200">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead>
//                   <tr>
//                     <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Modality
//                     </th>
//                     <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Standard Rate
//                     </th>
//                     <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       STAT Rate
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {[
//                     { modality: "X-Ray", standard: "$25.00", stat: "$35.00" },
//                     { modality: "CT", standard: "$65.00", stat: "$95.00" },
//                     { modality: "MRI", standard: "$75.00", stat: "$110.00" },
//                     { modality: "Ultrasound", standard: "$45.00", stat: "$65.00" },
//                     { modality: "Mammography", standard: "$40.00", stat: "$60.00" }
//                   ].map((item, index) => (
//                     <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
//                       <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {item.modality}
//                       </td>
//                       <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
//                         {item.standard}
//                       </td>
//                       <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
//                         {item.stat}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
            
//             <p className="text-sm text-gray-500 mt-4">
//               Note: Rates are determined by your contract. Please contact the administrator if you have questions about your rates.
//             </p>
//           </div>
//         </div>
//       </FormSection>

//       <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 rounded-b-lg">
//         <button
//           type="submit"
//           className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//         >
//           Save Changes
//         </button>
//       </div>
//     </div>
//   );
// }

// function SecuritySettings() {
//   return (
//     <div>
//       <FormSection 
//         title="Password Management" 
//         description="Update your password and security settings."
//       >
//         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//           <div className="sm:col-span-4">
//             <InputGroup
//               label="Current Password"
//               id="currentPassword"
//               type="password"
//               placeholder="••••••••••••"
//             />
//           </div>
//           <div className="sm:col-span-4">
//             <InputGroup
//               label="New Password"
//               id="newPassword"
//               type="password"
//               placeholder="••••••••••••"
//             />
//           </div>
//           <div className="sm:col-span-4">
//             <InputGroup
//               label="Confirm New Password"
//               id="confirmPassword"
//               type="password"
//               placeholder="••••••••••••"
//             />
//           </div>
//           <div className="sm:col-span-6">
//             <div className="mt-1">
//               <p className="text-sm text-gray-500">
//                 Password requirements:
//               </p>
//               <ul className="list-disc pl-5 mt-1 text-xs text-gray-500">
//                 <li>Minimum 12 characters</li>
//                 <li>At least one uppercase letter</li>
//                 <li>At least one number</li>
//                 <li>At least one special character</li>
//                 <li>Cannot be the same as previous 3 passwords</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </FormSection>
      
//       <FormDivider />

//       <FormSection 
//         title="Two-Factor Authentication" 
//         description="Add an extra layer of security to your account."
//       >
//         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//           <div className="sm:col-span-6">
//             <InputGroup
//               label="Enable Two-Factor Authentication"
//               id="enable2FA"
//               type="checkbox"
//               placeholder="Protect your account with two-factor authentication"
//             />
//           </div>
//           <div className="sm:col-span-6">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Verification Method
//             </label>
//             <div className="mt-1 space-y-2">
//               <div className="flex items-center">
//                 <input
//                   id="auth-app"
//                   name="verification-method"
//                   type="radio"
//                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
//                   defaultChecked
//                 />
//                 <label htmlFor="auth-app" className="ml-2 block text-sm text-gray-900">
//                   Authentication App (Google Authenticator, Authy, etc.)
//                 </label>
//               </div>
//               <div className="flex items-center">
//                 <input
//                   id="sms"
//                   name="verification-method"
//                   type="radio"
//                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
//                 />
//                 <label htmlFor="sms" className="ml-2 block text-sm text-gray-900">
//                   SMS Verification
//                 </label>
//               </div>
//               <div className="flex items-center">
//                 <input
//                   id="email"
//                   name="verification-method"
//                   type="radio"
//                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
//                 />
//                 <label htmlFor="email" className="ml-2 block text-sm text-gray-900">
//                   Email Verification
//                 </label>
//               </div>
//             </div>
//           </div>
//         </div>
//       </FormSection>

//       <FormDivider />

//       <FormSection 
//         title="Session Management" 
//         description="Manage your active sessions and device access."
//       >
//         <div className="mt-1 bg-gray-50 rounded-md p-4">
//           <h3 className="text-sm font-medium text-gray-700 mb-2">Currently Active Sessions</h3>
//           <div className="space-y-3">
//             <div className="bg-white p-3 border border-gray-200 rounded-md">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="text-sm font-medium text-gray-900">Current Device - Chrome on macOS</p>
//                   <p className="text-xs text-gray-500">Last active: Just now</p>
//                   <p className="text-xs text-gray-500">IP: 192.168.1.1</p>
//                 </div>
//                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                   Current
//                 </span>
//               </div>
//             </div>
//             <div className="bg-white p-3 border border-gray-200 rounded-md">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="text-sm font-medium text-gray-900">Mobile App - iOS</p>
//                   <p className="text-xs text-gray-500">Last active: 2 hours ago</p>
//                   <p className="text-xs text-gray-500">IP: 42.188.12.93</p>
//                 </div>
//                 <button className="text-xs text-red-600 hover:text-red-900">
//                   Revoke Access
//                 </button>
//               </div>
//             </div>
//             <div className="bg-white p-3 border border-gray-200 rounded-md">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="text-sm font-medium text-gray-900">Firefox on Windows</p>
//                   <p className="text-xs text-gray-500">Last active: Yesterday at 9:41 PM</p>
//                   <p className="text-xs text-gray-500">IP: 86.45.213.14</p>
//                 </div>
//                 <button className="text-xs text-red-600 hover:text-red-900">
//                   Revoke Access
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div className="mt-4">
//             <button className="text-sm text-red-600 hover:text-red-900 font-medium">
//               Sign Out From All Devices
//             </button>
//           </div>
//         </div>
//       </FormSection>

//       <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 rounded-b-lg">
//         <button
//           type="submit"
//           className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//         >
//           Save Changes
//         </button>
//       </div>
//     </div>
//   );
// }

// // ==================== HOSPITAL COMPONENTS ====================

// function OrganizationProfile() {
//   return (
//     <div>
//       <FormSection 
//         title="Facility Information" 
//         description="Manage your facility details and contact information."
//       >
//         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//           <div className="sm:col-span-4">
//             <InputGroup
//               label="Facility Name"
//               id="facilityName"
//               placeholder="City Medical Center"
//             />
//           </div>
//           <div className="sm:col-span-3">
//             <InputGroup
//               label="Facility Type"
//               id="facilityType"
//               type="select"
//               options={[
//                 { value: "hospital", label: "Hospital" },
//                 { value: "imaging_center", label: "Imaging Center" },
//                 { value: "urgent_care", label: "Urgent Care" },
//                 { value: "clinic", label: "Clinic" }
//               ]}
//             />
//           </div>
//           <div className="sm:col-span-6">
//             <InputGroup
//               label="Address"
//               id="address"
//               placeholder="123 Healthcare Ave"
//             />
//           </div>
//           <div className="sm:col-span-3">
//             <InputGroup
//               label="City"
//               id="city"
//               placeholder="New York"
//             />
//           </div>
//           <div className="sm:col-span-3">
//             <InputGroup
//               label="State/Province"
//               id="state"
//               placeholder="NY"
//             />
//           </div>
//           <div className="sm:col-span-3">
//             <InputGroup
//               label="ZIP/Postal Code"
//               id="zip"
//               placeholder="10001"
//             />
//           </div>
//           <div className="sm:col-span-3">
//             <InputGroup
//               label="Country"
//               id="country"
//               placeholder="United States"
//             />
//           </div>
//           <div className="sm:col-span-4">
//             <InputGroup
//               label="Phone Number"
//               id="phone"
//               placeholder="+1 (555) 123-4567"
//             />
//           </div>
//           <div className="sm:col-span-4">
//             <InputGroup
//               label="Email Address"
//               id="email"
//               type="email"
//               placeholder="info@citymedical.org"
//             />
//           </div>
//           <div className="sm:col-span-4">
//             <InputGroup
//               label="Website"
//               id="website"
//               placeholder="https://www.citymedical.org"
//             />
//           </div>
//         </div>
//       </FormSection>
      
//       <FormDivider />

//       <FormSection 
//         title="Accreditation & Licensing" 
//         description="Manage your facility's accreditation and licensing information."
//       >
//         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//           <div className="sm:col-span-4">
//             <InputGroup
//               label="Facility License Number"
//               id="licenseNumber"
//               placeholder="FL-12345678"
//             />
//           </div>
//           <div className="sm:col-span-3">
//             <InputGroup
//               label="License Expiration Date"
//               id="licenseExpiration"
//               type="date"
//             />
//           </div>
//           <div className="sm:col-span-6">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Accreditations
//             </label>
//             <div className="mt-1 space-y-2">
//               <div className="flex items-center">
//                 <input
//                   id="acr"
//                   name="acr"
//                   type="checkbox"
//                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                   defaultChecked
//                 />
//                 <label htmlFor="acr" className="ml-2 block text-sm text-gray-900">
//                   American College of Radiology (ACR)
//                 </label>
//               </div>
//               <div className="flex items-center">
//                 <input
//                   id="jcaho"
//                   name="jcaho"
//                   type="checkbox"
//                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                   defaultChecked
//                 />
//                 <label htmlFor="jcaho" className="ml-2 block text-sm text-gray-900">
//                   Joint Commission (JCAHO)
//                 </label>
//               </div>
//               <div className="flex items-center">
//                 <input
//                   id="carf"
//                   name="carf"
//                   type="checkbox"
//                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                 />
//                 <label htmlFor="carf" className="ml-2 block text-sm text-gray-900">
//                   Commission on Accreditation of Rehabilitation Facilities (CARF)
//                 </label>
//               </div>
//               <div className="flex items-center">
//                 <input
//                   id="other"
//                   name="other"
//                   type="checkbox"
//                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                 />
//                 <label htmlFor="other" className="ml-2 block text-sm text-gray-900">
//                   Other
//                 </label>
//               </div>
//             </div>
//           </div>
//           <div className="sm:col-span-6">
//             <InputGroup
//               label="Upload License Document"
//               id="licenseDocument"
//               type="file"
//             />
//             <p className="mt-1 text-sm text-gray-500">
//               PDF or image files only (max 10MB)
//             </p>
//           </div>
//         </div>
//       </FormSection>

//       <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 rounded-b-lg">
//         <button
//           type="submit"
//           className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//         >
//           Save Changes
//         </button>
//       </div>
//     </div>
//   );
// }

// function CaseManagementSettings() {
//   return (
//     <div>
//       <FormSection 
//         title="Case Submission Settings" 
//         description="Configure your case upload and submission preferences."
//       >
//         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//           <div className="sm:col-span-6">
//             <h3 className="text-sm font-medium text-gray-700 mb-2">Required Fields for New Cases</h3>
//             <div className="mt-1 space-y-2">
//               {[
//                 { id: "patient_id", label: "Patient ID", default: true, required: true },
//                 { id: "patient_dob", label: "Patient Date of Birth", default: true, required: true },
//                 { id: "patient_gender", label: "Patient Gender", default: true, required: false },
//                 { id: "study_date", label: "Study Date", default: true, required: true },
//                 { id: "referring_physician", label: "Referring Physician", default: true, required: false },
//                 { id: "clinical_indication", label: "Clinical Indication/History", default: true, required: false },
//                 { id: "prior_studies", label: "Prior Relevant Studies", default: false, required: false },
//                 { id: "technologist_notes", label: "Technologist Notes", default: false, required: false }
//               ].map((field) => (
//                 <div key={field.id} className="flex items-center justify-between bg-white p-2 border border-gray-200 rounded-md">
//                   <div className="flex items-center">
//                     <input
//                       id={`field-${field.id}`}
//                       name={`field-${field.id}`}
//                       type="checkbox"
//                       className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                       defaultChecked={field.default}
//                       disabled={field.required}
//                     />
//                     <label htmlFor={`field-${field.id}`} className="ml-2 block text-sm text-gray-900">
//                       {field.label}
//                     </label>
//                     {field.required && (
//                       <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
//                         Required
//                       </span>
//                     )}
//                   </div>
                  
//                   <div className="flex space-x-2">
//                     <select
//                       className="block text-xs border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
//                       defaultValue="text"
//                     >
//                       <option value="text">Text</option>
//                       <option value="dropdown">Dropdown</option>
//                       <option value="date">Date</option>
//                       <option value="number">Number</option>
//                     </select>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <button className="mt-2 text-sm text-indigo-600 hover:text-indigo-900">
//               Add Custom Field
//             </button>
//           </div>
//         </div>
//       </FormSection>
      
//       <FormDivider />

//       <FormSection 
//         title="Priority Levels" 
//         description="Configure the priority levels for your cases."
//       >
//         <div className="mt-1 bg-gray-50 rounded-md p-4">
//           <div className="space-y-3">
//             {[
//               { level: "STAT", color: "red", turnaround: "1 hour", description: "Immediate clinical action required" },
//               { level: "Urgent", color: "orange", turnaround: "4 hours", description: "Prompt clinical action required" },
//               { level: "Routine", color: "green", turnaround: "24 hours", description: "Standard clinical follow-up" }
//             ].map((priority, index) => (
//               <div key={index} className="bg-white p-3 border border-gray-200 rounded-md flex items-center">
//                 <div className={`w-4 h-4 rounded-full bg-${priority.color}-500 mr-3`}></div>
//                 <div className="flex-1">
//                   <div className="flex items-center">
//                     <h4 className="text-sm font-medium text-gray-900">{priority.level}</h4>
//                     <span className="ml-2 text-xs text-gray-500">Target TAT: {priority.turnaround}</span>
//                   </div>
//                   <p className="text-xs text-gray-500">{priority.description}</p>
//                 </div>
//                 <button className="text-xs text-indigo-600 hover:text-indigo-900">
//                   Edit
//                 </button>
//               </div>
//             ))}
//           </div>
//           <button className="mt-4 text-sm text-indigo-600 hover:text-indigo-900">
//             Add Priority Level
//           </button>
//         </div>
//       </FormSection>

//       <FormDivider />

//       <FormSection 
//         title="Radiologist Assignment Rules" 
//         description="Configure how cases are automatically assigned to radiologists."
//       >
//         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//           <div className="sm:col-span-6">
//             <InputGroup
//               label="Enable Auto-Assignment"
//               id="enableAutoAssignment"
//               type="checkbox"
//               placeholder="Automatically assign cases to radiologists based on rules"
//             />
//           </div>
          
//           <div className="sm:col-span-6">
//             <h3 className="text-sm font-medium text-gray-700 mb-2">Assignment Rules</h3>
//             <div className="mt-1 space-y-3">
//               <div className="bg-white p-3 border border-gray-200 rounded-md">
//                 <div className="flex items-center justify-between mb-2">
//                   <h4 className="text-sm font-medium text-gray-900">Rule #1: Subspecialty Matching</h4>
//                   <div className="flex space-x-2">
//                     <button className="text-xs text-indigo-600 hover:text-indigo-900">Edit</button>
//                     <button className="text-xs text-red-600 hover:text-red-900">Delete</button>
//                   </div>
//                 </div>
//                 <p className="text-xs text-gray-500">
//                   Assign cases to radiologists based on their subspecialty (e.g., neuro cases to neuroradiologists).
//                 </p>
//               </div>
              
//               <div className="bg-white p-3 border border-gray-200 rounded-md">
//                 <div className="flex items-center justify-between mb-2">
//                   <h4 className="text-sm font-medium text-gray-900">Rule #2: STAT Priority</h4>
//                   <div className="flex space-x-2">
//                     <button className="text-xs text-indigo-600 hover:text-indigo-900">Edit</button>
//                     <button className="text-xs text-red-600 hover:text-red-900">Delete</button>
//                   </div>
//                 </div>
//                 <p className="text-xs text-gray-500">
//                   STAT cases are assigned to any available radiologist with the matching subspecialty, regardless of queue.
//                 </p>
//               </div>
              
//               <div className="bg-white p-3 border border-gray-200 rounded-md">
//                 <div className="flex items-center justify-between mb-2">
//                   <h4 className="text-sm font-medium text-gray-900">Rule #3: Load Balancing</h4>
//                   <div className="flex space-x-2">
//                     <button className="text-xs text-indigo-600 hover:text-indigo-900">Edit</button>
//                     <button className="text-xs text-red-600 hover:text-red-900">Delete</button>
//                   </div>
//                 </div>
//                 <p className="text-xs text-gray-500">
//                   Distribute routine cases evenly among radiologists with matching subspecialties.
//                 </p>
//               </div>
//             </div>
//             <button className="mt-3 text-sm text-indigo-600 hover:text-indigo-900">
//               Add Assignment Rule
//             </button>
//           </div>
//         </div>
//       </FormSection>

//       <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 rounded-b-lg">
//         <button
//           type="submit"
//           className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//         >
//           Save Changes
//         </button>
//       </div>
//     </div>
//   );
// }

// function UserManagement() {
//   return (
//     <div>
//       <FormSection 
//         title="Staff Accounts" 
//         description="Manage user accounts and access permissions."
//       >
//         <div className="mt-1 bg-gray-50 rounded-md p-4">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-sm font-medium text-gray-700">Active Users</h3>
//             <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
//               Add New User
//             </button>
//           </div>
          
//           <div className="border border-gray-200 rounded-md overflow-hidden">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-3
//                   <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Name
//                   </th>
//                   <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Role
//                   </th>
//                   <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Last Active
//                   </th>
//                   <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {[
//                   { name: "John Smith", role: "Administrator", status: "Active", lastActive: "Just now" },
//                   { name: "Sarah Johnson", role: "Technologist", status: "Active", lastActive: "5 minutes ago" },
//                   { name: "Michael Lee", role: "Front Desk", status: "Active", lastActive: "1 hour ago" },
//                   { name: "Emily Davis", role: "Technologist", status: "Inactive", lastActive: "3 days ago" }
//                 ].map((user, index) => (
//                   <tr key={index}>
//                     <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {user.name}
//                     </td>
//                     <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {user.role}
//                     </td>
//                     <td className="px-3 py-4 whitespace-nowrap text-sm">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         user.status === "Active" 
//                           ? "bg-green-100 text-green-800" 
//                           : "bg-gray-100 text-gray-800"
//                       }`}>
//                         {user.status}
//                       </span>
//                     </td>
//                     <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {user.lastActive}
//                     </td>
//                     <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
//                       <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
//                       <button className="text-red-600 hover:text-red-900">Deactivate</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
          
//           <div className="flex justify-between items-center mt-4">
//             <p className="text-sm text-gray-500">Showing 4 of 4 users</p>
//             <div className="flex items-center space-x-2">
//               <button className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
//                 Previous
//               </button>
//               <button className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       </FormSection>
      
//       <FormDivider />

//       <FormSection 
//         title="Role Management" 
//         description="Configure user roles and permissions."
//       >
//         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//           <div className="sm:col-span-6">
//             <h3 className="text-sm font-medium text-gray-700 mb-2">Defined Roles</h3>
//             <div className="mt-1 space-y-3">
//               <div className="bg-white p-3 border border-gray-200 rounded-md">
//                 <div className="flex items-center justify-between">
//                   <h4 className="text-sm font-medium text-gray-900">Administrator</h4>
//                   <div className="flex space-x-2">
//                     <button className="text-xs text-indigo-600 hover:text-indigo-900">Edit Permissions</button>
//                   </div>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-1">
//                   Full system access including user management, billing, and system configuration.
//                 </p>
//               </div>
              
//               <div className="bg-white p-3 border border-gray-200 rounded-md">
//                 <div className="flex items-center justify-between">
//                   <h4 className="text-sm font-medium text-gray-900">Radiologist</h4>
//                   <div className="flex space-x-2">
//                     <button className="text-xs text-indigo-600 hover:text-indigo-900">Edit Permissions</button>
//                   </div>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-1">
//                   Access to assigned cases, reporting tools, and personal settings.
//                 </p>
//               </div>
              
//               <div className="bg-white p-3 border border-gray-200 rounded-md">
//                 <div className="flex items-center justify-between">
//                   <h4 className="text-sm font-medium text-gray-900">Technologist</h4>
//                   <div className="flex space-x-2">
//                     <button className="text-xs text-indigo-600 hover:text-indigo-900">Edit Permissions</button>
//                   </div>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-1">
//                   Ability to upload studies, add clinical information, and track case status.
//                 </p>
//               </div>
              
//               <div className="bg-white p-3 border border-gray-200 rounded-md">
//                 <div className="flex items-center justify-between">
//                   <h4 className="text-sm font-medium text-gray-900">Front Desk</h4>
//                   <div className="flex space-x-2">
//                     <button className="text-xs text-indigo-600 hover:text-indigo-900">Edit Permissions</button>
//                   </div>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-1">
//                   Patient registration, scheduling, and report access for distribution.
//                 </p>
//               </div>
//             </div>
//             <button className="mt-3 text-sm text-indigo-600 hover:text-indigo-900">
//               Create Custom Role
//             </button>
//           </div>
//         </div>
//       </FormSection>

//       <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 rounded-b-lg">
//         <button
//           type="submit"
//           className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//         >
//           Save Changes
//         </button>
//       </div>
//     </div>
//   );
// }

// function IntegrationSettings() {
//   return (
//     <div>
//       <FormSection 
//         title="PACS Integration" 
//         description="Configure your PACS and imaging system integration."
//       >
//         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//           <div className="sm:col-span-6">
//             <InputGroup
//               label="PACS System"
//               id="pacsSystem"
//               type="select"
//               options={[
//                 { value: "", label: "Select PACS System" },
//                 { value: "ge", label: "GE Centricity" },
//                 { value: "agfa", label: "Agfa Enterprise Imaging" },
//                 { value: "carestream", label: "Carestream Vue" },
//                 { value: "philips", label: "Philips IntelliSpace" },
//                 { value: "sectra", label: "Sectra IDS7" },
//                 { value: "fuji", label: "Fujifilm Synapse" },
//                 { value: "other", label: "Other" }
//               ]}
//             />
//           </div>
//           <div className="sm:col-span-4">
//             <InputGroup
//               label="PACS Server Address"
//               id="pacsServer"
//               placeholder="pacs.hospital.org"
//             />
//           </div>
//           <div className="sm:col-span-2">
//             <InputGroup
//               label="PACS Port"
//               id="pacsPort"
//               placeholder="104"
//             />
//           </div>
//           <div className="sm:col-span-3">
//             <InputGroup
//               label="AE Title (Local)"
//               id="aeTitle"
//               placeholder="RADIOLOGYAI"
//             />
//           </div>
//           <div className="sm:col-span-3">
//             <InputGroup
//               label="AE Title (Remote)"
//               id="remotePACS"
//               placeholder="PACSSCP"
//             />
//           </div>
//           <div className="sm:col-span-6">
//             <button
//               type="button"
//               className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Test PACS Connection
//             </button>
//           </div>
//         </div>
//       </FormSection>
      
//       <FormDivider />

//       <FormSection 
//         title="EHR/RIS Integration" 
//         description="Configure your electronic health record and radiology information system integration."
//       >
//         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//           <div className="sm:col-span-6">
//             <InputGroup
//               label="EHR/RIS System"
//               id="ehrSystem"
//               type="select"
//               options={[
//                 { value: "", label: "Select EHR/RIS System" },
//                 { value: "epic", label: "Epic Radiant" },
//                 { value: "cerner", label: "Cerner Millennium" },
//                 { value: "allscripts", label: "Allscripts" },
//                 { value: "meditech", label: "MEDITECH" },
//                 { value: "nextgen", label: "NextGen Healthcare" },
//                 { value: "other", label: "Other" }
//               ]}
//             />
//           </div>
//           <div className="sm:col-span-6">
//             <InputGroup
//               label="Integration Method"
//               id="integrationMethod"
//               type="select"
//               options={[
//                 { value: "", label: "Select Integration Method" },
//                 { value: "hl7", label: "HL7" },
//                 { value: "fhir", label: "FHIR" },
//                 { value: "api", label: "API" },
//                 { value: "direct_db", label: "Direct Database Connection" },
//                 { value: "manual", label: "Manual Export/Import" }
//               ]}
//             />
//           </div>
//           <div className="sm:col-span-6">
//             <h3 className="text-sm font-medium text-gray-700 mb-2">Integration Options</h3>
//             <div className="mt-1 space-y-2">
//               <div className="flex items-center">
//                 <input
//                   id="order-integration"
//                   name="order-integration"
//                   type="checkbox"
//                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                   defaultChecked
//                 />
//                 <label htmlFor="order-integration" className="ml-2 block text-sm text-gray-900">
//                   Import Orders from EHR/RIS
//                 </label>
//               </div>
//               <div className="flex items-center">
//                 <input
//                   id="results-integration"
//                   name="results-integration"
//                   type="checkbox"
//                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                   defaultChecked
//                 />
//                 <label htmlFor="results-integration" className="ml-2 block text-sm text-gray-900">
//                   Export Results to EHR/RIS
//                 </label>
//               </div>
//               <div className="flex items-center">
//                 <input
//                   id="patient-integration"
//                   name="patient-integration"
//                   type="checkbox"
//                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                   defaultChecked
//                 />
//                 <label htmlFor="patient-integration" className="ml-2 block text-sm text-gray-900">
//                   Sync Patient Demographics
//                 </label>
//               </div>
//               <div className="flex items-center">
//                 <input
//                   id="billing-integration"
//                   name="billing-integration"
//                   type="checkbox"
//                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                 />
//                 <label htmlFor="billing-integration" className="ml-2 block text-sm text-gray-900">
//                   Billing Information Exchange
//                 </label>
//               </div>
//             </div>
//           </div>
//         </div>
//       </FormSection>

//       <FormDivider />

//       <FormSection 
//         title="API Access" 
//         description="Manage API keys and webhooks for third-party integrations."
//       >
//         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//           <div className="sm:col-span-6">
//             <div className="flex items-center justify-between">
//               <InputGroup
//                 label="API Key"
//                 id="apiKey"
//                 placeholder="••••••••••••••••••••••••••••••"
//                 type="password"
//               />
//               <button className="mt-6 ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
//                 Generate New Key
//               </button>
//             </div>
//             <p className="mt-1 text-sm text-gray-500">
//               Last generated: February 25, 2025
//             </p>
//           </div>
          
//           <div className="sm:col-span-6">
//             <h3 className="text-sm font-medium text-gray-700 mb-2">Registered Webhooks</h3>
//             <div className="mt-1 bg-gray-50 rounded-md p-4">
//               <div className="space-y-3">
//                 <div className="bg-white p-3 border border-gray-200 rounded-md">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h4 className="text-sm font-medium text-gray-900">New Report Notification</h4>
//                       <p className="text-xs text-gray-500">https://hms.hospital.org/api/report-webhook</p>
//                     </div>
//                     <div className="flex space-x-2">
//                       <button className="text-xs text-indigo-600 hover:text-indigo-900">Edit</button>
//                       <button className="text-xs text-red-600 hover:text-red-900">Delete</button>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bg-white p-3 border border-gray-200 rounded-md">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h4 className="text-sm font-medium text-gray-900">Critical Finding Alert</h4>
//                       <p className="text-xs text-gray-500">https://hms.hospital.org/api/critical-alert</p>
//                     </div>
//                     <div className="flex space-x-2">
//                       <button className="text-xs text-indigo-600 hover:text-indigo-900">Edit</button>
//                       <button className="text-xs text-red-600 hover:text-red-900">Delete</button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <button className="mt-4 text-sm text-indigo-600 hover:text-indigo-900">
//                 Add Webhook
//               </button>
//             </div>
//           </div>
//         </div>
//       </FormSection>

//       <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 rounded-b-lg">
//         <button
//           type="submit"
//           className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//         >
//           Save Changes
//         </button>
//       </div>
//     </div>
//   );
// }

// function BillingPayment() {
//   return (
//     <div>
//       <FormSection 
//         title="Billing Information" 
//         description="Manage your organization's billing details and payment methods."
//       >
//         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//           <div className="sm:col-span-3">
//             <InputGroup
//               label="Billing Contact Name"
//               id="billingContactName"
//               placeholder="Jane Smith"
//             />
//           </div>
//           <div className="sm:col-span-3">
//             <InputGroup
//               label="Billing Contact Email"
//               id="billingContactEmail"
//               type="email"
//               placeholder="finance@citymedical.org"
//             />
//           </div>
//           <div className="sm:col-span-3">
//             <InputGroup
//               label="Billing Contact Phone"
//               id="billingContactPhone"
//               placeholder="+1 (555) 987-6543"
//             />
//           </div>
//           <div className="sm:col-span-6">
//             <InputGroup
//               label="Billing Address"
//               id="billingAddress"
//               placeholder="123 Healthcare Ave, Suite 400"
//             />
//           </div>
//           <div className="sm:col-span-3">
//             <InputGroup
//               label="City"
//               id="billingCity"
//               placeholder="New York"
//             />
//           </div>
//           <div className="sm:col-span-2">
//             <InputGroup
//               label="State/Province"
//               id="billingState"
//               placeholder="NY"
//             />
//           </div>
//           <div className="sm:col-span-1">
//             <InputGroup
//               label="ZIP/Postal Code"
//               id="billingZip"
//               placeholder="10001"
//             />
//           </div>
//         </div>
//       </FormSection>
      
//       <FormDivider />

//       <FormSection 
//         title="Payment Methods" 
//         description="Manage your payment methods for service subscriptions."
//       >
//         <div className="mt-1 bg-gray-50 rounded-md p-4">
//           <h3 className="text-sm font-medium text-gray-700 mb-3">Saved Payment Methods</h3>
//           <div className="space-y-3">
//             <div className="bg-white p-3 border border-gray-200 rounded-md">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0 h-6 w-10 bg-gray-200 rounded flex items-center justify-center mr-3">
//                     <span className="text-xs font-medium text-gray-900">VISA</span>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">Visa ending in 4242</p>
//                     <p className="text-xs text-gray-500">Expires 09/2027</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center">
//                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
//                     Default
//                   </span>
//                   <div className="flex space-x-2">
//                     <button className="text-xs text-indigo-600 hover:text-indigo-900">Edit</button>
//                     <button className="text-xs text-red-600 hover:text-red-900">Remove</button>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white p-3 border border-gray-200 rounded-md">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0 h-6 w-10 bg-gray-200 rounded flex items-center justify-center mr-3">
//                     <span className="text-xs font-medium text-gray-900">ACH</span>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">Bank Account (ACH)</p>
//                     <p className="text-xs text-gray-500">Account ending in 1234</p>
//                   </div>
//                 </div>
//                 <div className="flex space-x-2">
//                   <button className="text-xs text-indigo-600 hover:text-indigo-900">Edit</button>
//                   <button className="text-xs text-red-600 hover:text-red-900">Remove</button>
//                   <button className="text-xs text-gray-600 hover:text-gray-900">Make Default</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <button className="mt-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
//             Add Payment Method
//           </button>
//         </div>
//       </FormSection>

//       <FormDivider />

//       <FormSection 
//         title="Subscription Details" 
//         description="View and manage your current subscription plan."
//       >
//         <div className="mt-1 bg-gray-50 rounded-md p-4">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h3 className="text-lg font-medium text-gray-900">Enterprise Plan</h3>
//               <p className="text-sm text-gray-500">$1,999/month, billed annually</p>
//             </div>
//             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//               Active
//             </span>
//           </div>
          
//           <div className="border-t border-gray-200 pt-4">
//             <h4 className="text-sm font-medium text-gray-700 mb-2">Plan Features</h4>
//             <ul className="text-sm text-gray-500 space-y-1 mb-4">
//               <li className="flex items-center">
//                 <span className="text-green-500 mr-2">✓</span> Unlimited cases
//               </li>
//               <li className="flex items-center">
//                 <span className="text-green-500 mr-2">✓</span> 50 user accounts
//               </li>
//               <li className="flex items-center">
//                 <span className="text-green-500 mr-2">✓</span> Advanced AI reporting tools
//               </li>
//               <li className="flex items-center">
//                 <span className="text-green-500 mr-2">✓</span> PACS/EHR integrations
//               </li>
//               <li className="flex items-center">
//                 <span className="text-green-500 mr-2">✓</span> Analytics dashboard
//               </li>
//               <li className="flex items-center">
//                 <span className="text-green-500 mr-2">✓</span> 24/7 priority support
//               </li>
//             </ul>
            
//             <div className="flex space-x-3">
//               <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
//                 Upgrade Plan
//               </button>
//               <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
//                 View Invoice History
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-500 mt-4">
//               Next billing date: May 15, 2025
//             </p>
//           </div>
//         </div>
//       </FormSection>

//       <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 rounded-b-lg">
//         <button
//           type="submit"
//           className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//         >
//           Save Changes
//         </button>
//       </div>
//     </div>
//   );
// }

// function HospitalNotificationSettings() {
//   return (
//     <div>
//       <FormSection 
//         title="System Notifications" 
//         description="Configure system-wide notification settings."
//       >
//         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//           <div className="sm:col-span-6">
//             <h3 className="text-sm font-medium text-gray-700 mb-2">Case Status Notifications</h3>
//             <div className="ml-4 space-y-2">
//               <InputGroup
//                 label="New Case Uploaded"
//                 id="newCaseNotification"
//                 type="checkbox"
//                 placeholder="Send notification when a new case is uploaded"
//               />
//               <InputGroup
//                 label="Case Assigned"
//                 id="caseAssignedNotification"
//                 type="checkbox"
//                 placeholder="Send notification when a case is assigned to a radiologist"
//               />
//               <InputGroup
//                 label="Report Completed"
//                 id="reportCompletedNotification"
//                 type="checkbox"
//                 placeholder="Send notification when a report is completed"
//               />
//               <InputGroup
//                 label="Critical Finding"
//                 id="criticalFindingNotification"
//                 type="checkbox"
//                 placeholder="Send urgent notification for critical findings"
//               />
//             </div>
//           </div>
          
//           <div className="sm:col-span-6">
//             <h3 className="text-sm font-medium text-gray-700 mb-2">Administrative Notifications</h3>
//             <div className="ml-4 space-y-2">
//               <InputGroup
//                 label="Billing & Invoices"
//                 id="billingNotification"
//                 type="checkbox"
//                 placeholder="Send notification for billing events and new invoices"
//               />
//               <InputGroup
//                 label="System Updates"
//                 id="systemUpdateNotification"
//                 type="checkbox"
//                 placeholder="Send notification for system updates and maintenance"
//               />
//               <InputGroup
//                 label="User Account Changes"
//                 id="userAccountNotification"
//                 type="checkbox"
//                 placeholder="Send notification when user accounts are created or modified"
//               />
//               <InputGroup
//                 label="Integration Status"
//                 id="integrationStatusNotification"
//                 type="checkbox"
//                 placeholder="Send notification for integration failures or issues"
//               />
//             </div>
//           </div>
//         </div>
//       </FormSection>
      
//       <FormDivider />

//       <FormSection 
//         title="Notification Recipients" 
//         description="Manage who receives system notifications."
//       >
//         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//           <div className="sm:col-span-6">
//             <h3 className="text-sm font-medium text-gray-700 mb-2">Default Recipients by Category</h3>
//             <div className="mt-1 space-y-4">
//               <div className="bg-white p-3 border border-gray-200 rounded-md">
//                 <h4 className="text-sm font-medium text-gray-900 mb-2">Clinical Notifications</h4>
//                 <div className="space-y-2">
//                   <div className="flex items-center">
//                     <input
//                       id="attending-rad"
//                       name="attending-rad"
//                       type="checkbox"
//                       className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                       defaultChecked
//                     />
//                     <label htmlFor="attending-rad" className="ml-2 block text-sm text-gray-900">
//                       Attending Radiologist
//                     </label>
//                   </div>
//                   <div className="flex items-center">
//                     <input
//                       id="referring-phys"
//                       name="referring-phys"
//                       type="checkbox"
//                       className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                       defaultChecked
//                     />
//                     <label htmlFor="referring-phys" className="ml-2 block text-sm text-gray-900">
//                       Referring Physician
//                     </label>
//                   </div>
//                   <div className="flex items-center">
//                     <input
//                       id="dept-head"
//                       name="dept-head"
//                       type="checkbox"
//                       className="id="dept-head"
//                       name="dept-head"
//                       type="checkbox"
//                       className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                     />
//                     <label htmlFor="dept-head" className="ml-2 block text-sm text-gray-900">
//                       Department Head
//                     </label>
//                   </div>
//                   <div className="flex items-center">
//                     <input
//                       id="rad-tech"
//                       name="rad-tech"
//                       type="checkbox"
//                       className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                     />
//                     <label htmlFor="rad-tech" className="ml-2 block text-sm text-gray-900">
//                       Radiology Technicians
//                     </label>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="bg-white p-3 border border-gray-200 rounded-md">
//                 <h4 className="text-sm font-medium text-gray-900 mb-2">Administrative Notifications</h4>
//                 <div className="space-y-2">
//                   <div className="flex items-center">
//                     <input
//                       id="admin-team"
//                       name="admin-team"
//                       type="checkbox"
//                       className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                       defaultChecked
//                     />
//                     <label htmlFor="admin-team" className="ml-2 block text-sm text-gray-900">
//                       Administrative Team
//                     </label>
//                   </div>
//                   <div className="flex items-center">
//                     <input
//                       id="billing-dept"
//                       name="billing-dept"
//                       type="checkbox"
//                       className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                       defaultChecked
//                     />
//                     <label htmlFor="billing-dept" className="ml-2 block text-sm text-gray-900">
//                       Billing Department
//                     </label>
//                   </div>
//                   <div className="flex items-center">
//                     <input
//                       id="it-support"
//                       name="it-support"
//                       type="checkbox"
//                       className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                       defaultChecked
//                     />
//                     <label htmlFor="it-support" className="ml-2 block text-sm text-gray-900">
//                       IT Support Team
//                     </label>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div className="sm:col-span-6">
//             <h3 className="text-sm font-medium text-gray-700 mb-2">Custom Email Recipients</h3>
//             <div className="mt-1 space-y-2">
//               <div className="flex space-x-2">
//                 <input
//                   type="email"
//                   name="custom-email-1"
//                   id="custom-email-1"
//                   className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
//                   placeholder="admin@hospital.org"
//                   defaultValue="admin@hospital.org"
//                 />
//                 <select
//                   id="notification-type-1"
//                   name="notification-type-1"
//                   className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
//                 >
//                   <option>All Notifications</option>
//                   <option>Clinical Only</option>
//                   <option>Administrative Only</option>
//                   <option>Billing Only</option>
//                 </select>
//                 <button className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
//                   <X size={18} />
//                 </button>
//               </div>
//               <div className="flex space-x-2">
//                 <input
//                   type="email"
//                   name="custom-email-2"
//                   id="custom-email-2"
//                   className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
//                   placeholder="it@hospital.org"
//                   defaultValue="it@hospital.org"
//                 />
//                 <select
//                   id="notification-type-2"
//                   name="notification-type-2"
//                   className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
//                 >
//                   <option>All Notifications</option>
//                   <option selected>Clinical Only</option>
//                   <option>Administrative Only</option>
//                   <option>Billing Only</option>
//                 </select>
//                 <button className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
//                   <X size={18} />
//                 </button>
//               </div>
//               <button className="mt-2 text-sm text-indigo-600 hover:text-indigo-900">
//                 + Add Email Recipient
//               </button>
//             </div>
//           </div>
//         </div>
//       </FormSection>

//       <FormDivider />

//       <FormSection 
//         title="Delivery Methods" 
//         description="Configure how notifications are delivered."
//       >
//         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//           <div className="sm:col-span-6">
//             <div className="space-y-4">
//               <div className="relative flex items-start">
//                 <div className="flex items-center h-5">
//                   <input
//                     id="email-notifications"
//                     name="email-notifications"
//                     type="checkbox"
//                     className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
//                     defaultChecked
//                   />
//                 </div>
//                 <div className="ml-3 text-sm">
//                   <label htmlFor="email-notifications" className="font-medium text-gray-700">
//                     Email
//                   </label>
//                   <p className="text-gray-500">Deliver notifications to registered email addresses.</p>
//                 </div>
//               </div>
              
//               <div className="relative flex items-start">
//                 <div className="flex items-center h-5">
//                   <input
//                     id="sms-notifications"
//                     name="sms-notifications"
//                     type="checkbox"
//                     className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
//                     defaultChecked
//                   />
//                 </div>
//                 <div className="ml-3 text-sm">
//                   <label htmlFor="sms-notifications" className="font-medium text-gray-700">
//                     SMS
//                   </label>
//                   <p className="text-gray-500">Send text message alerts for critical notifications.</p>
//                 </div>
//               </div>
              
//               <div className="relative flex items-start">
//                 <div className="flex items-center h-5">
//                   <input
//                     id="in-app-notifications"
//                     name="in-app-notifications"
//                     type="checkbox"
//                     className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
//                     defaultChecked
//                   />
//                 </div>
//                 <div className="ml-3 text-sm">
//                   <label htmlFor="in-app-notifications" className="font-medium text-gray-700">
//                     In-App Notifications
//                   </label>
//                   <p className="text-gray-500">Display notifications in the system dashboard.</p>
//                 </div>
//               </div>
              
//               <div className="relative flex items-start">
//                 <div className="flex items-center h-5">
//                   <input
//                     id="webhook-notifications"
//                     name="webhook-notifications"
//                     type="checkbox"
//                     className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
//                   />
//                 </div>
//                 <div className="ml-3 text-sm">
//                   <label htmlFor="webhook-notifications" className="font-medium text-gray-700">
//                     API Webhooks
//                   </label>
//                   <p className="text-gray-500">Send notifications to registered webhook endpoints.</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </FormSection>

//       <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 rounded-b-lg">
//         <button
//           type="submit"
//           className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//         >
//           Save Changes
//         </button>
//       </div>
//     </div>
//   );
// }

// function BrandingReports() {
//   return (
//     <div>
//       <FormSection 
//         title="Branding Settings" 
//         description="Customize your organization's branding across the platform."
//       >
//         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//           <div className="sm:col-span-6">
//             <label className="block text-sm font-medium text-gray-700">
//               Organization Logo
//             </label>
//             <div className="mt-2 flex items-center">
//               <div className="h-12 w-12 rounded flex items-center justify-center bg-gray-100">
//                 <span className="text-gray-300 text-lg">Logo</span>
//               </div>
//               <div className="ml-4">
//                 <div className="flex space-x-2">
//                   <button
//                     type="button"
//                     className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                   >
//                     Change
//                   </button>
//                   <button
//                     type="button"
//                     className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                   >
//                     Remove
//                   </button>
//                 </div>
//                 <p className="mt-1 text-xs text-gray-500">
//                   PNG, JPG, or SVG. Max 2MB. Recommended 300x100 pixels.
//                 </p>
//               </div>
//             </div>
//           </div>
          
//           <div className="sm:col-span-3">
//             <InputGroup
//               label="Primary Color"
//               id="primaryColor"
//               type="color"
//               placeholder="#4F46E5"
//               value="#4F46E5"
//             />
//             <p className="mt-1 text-xs text-gray-500">
//               Used for buttons, links, and highlights.
//             </p>
//           </div>
          
//           <div className="sm:col-span-3">
//             <InputGroup
//               label="Secondary Color"
//               id="secondaryColor"
//               type="color"
//               placeholder="#60A5FA"
//               value="#60A5FA"
//             />
//             <p className="mt-1 text-xs text-gray-500">
//               Used for accents and secondary elements.
//             </p>
//           </div>
          
//           <div className="sm:col-span-6">
//             <InputGroup
//               label="Custom Domain"
//               id="customDomain"
//               placeholder="radiology.citymedical.org"
//             />
//             <p className="mt-1 text-xs text-gray-500">
//               Custom domain for your portal access. Additional setup may be required.
//             </p>
//           </div>
//         </div>
//       </FormSection>
      
//       <FormDivider />

//       <FormSection 
//         title="Report Customization" 
//         description="Customize the appearance of your radiology reports."
//       >
//         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//           <div className="sm:col-span-6">
//             <h3 className="text-sm font-medium text-gray-700 mb-2">Report Header</h3>
//             <div className="mt-1">
//               <textarea
//                 id="report-header"
//                 name="report-header"
//                 rows={3}
//                 className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
//                 placeholder="City Medical Center - Radiology Department
// 123 Healthcare Ave, New York, NY 10001
// Phone: (555) 123-4567 | Fax: (555) 123-4568"
//                 defaultValue="City Medical Center - Radiology Department
// 123 Healthcare Ave, New York, NY 10001
// Phone: (555) 123-4567 | Fax: (555) 123-4568"
//               ></textarea>
//             </div>
//           </div>
          
//           <div className="sm:col-span-6">
//             <h3 className="text-sm font-medium text-gray-700 mb-2">Report Footer</h3>
//             <div className="mt-1">
//               <textarea
//                 id="report-footer"
//                 name="report-footer"
//                 rows={3}
//                 className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
//                 placeholder="This report is confidential and intended solely for the use of the individual or entity to whom it is addressed. Unauthorized disclosure is prohibited."
//                 defaultValue="This report is confidential and intended solely for the use of the individual or entity to whom it is addressed. Unauthorized disclosure is prohibited."
//               ></textarea>
//             </div>
//           </div>
          
//           <div className="sm:col-span-6">
//             <h3 className="text-sm font-medium text-gray-700 mb-2">Report Sections</h3>
//             <div className="mt-1 space-y-2">
//               <div className="flex items-center">
//                 <input
//                   id="section-clinical-info"
//                   name="section-clinical-info"
//                   type="checkbox"
//                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                   defaultChecked
//                 />
//                 <label htmlFor="section-clinical-info" className="ml-2 block text-sm text-gray-900">
//                   Clinical Information
//                 </label>
//               </div>
//               <div className="flex items-center">
//                 <input
//                   id="section-technique"
//                   name="section-technique"
//                   type="checkbox"
//                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                   defaultChecked
//                 />
//                 <label htmlFor="section-technique" className="ml-2 block text-sm text-gray-900">
//                   Technique
//                 </label>
//               </div>
//               <div className="flex items-center">
//                 <input
//                   id="section-findings"
//                   name="section-findings"
//                   type="checkbox"
//                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                   defaultChecked
//                 />
//                 <label htmlFor="section-findings" className="ml-2 block text-sm text-gray-900">
//                   Findings
//                 </label>
//               </div>
//               <div className="flex items-center">
//                 <input
//                   id="section-impression"
//                   name="section-impression"
//                   type="checkbox"
//                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                   defaultChecked
//                 />
//                 <label htmlFor="section-impression" className="ml-2 block text-sm text-gray-900">
//                   Impression
//                 </label>
//               </div>
//               <div className="flex items-center">
//                 <input
//                   id="section-recommendations"
//                   name="section-recommendations"
//                   type="checkbox"
//                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                   defaultChecked
//                 />
//                 <label htmlFor="section-recommendations" className="ml-2 block text-sm text-gray-900">
//                   Recommendations
//                 </label>
//               </div>
//               <div className="flex items-center">
//                 <input
//                   id="section-comparison"
//                   name="section-comparison"
//                   type="checkbox"
//                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                 />
//                 <label htmlFor="section-comparison" className="ml-2 block text-sm text-gray-900">
//                   Comparison
//                 </label>
//               </div>
//             </div>
//           </div>
          
//           <div className="sm:col-span-3">
//             <InputGroup
//               label="Default Report Format"
//               id="reportFormat"
//               type="select"
//               options={[
//                 { value: "html", label: "HTML" },
//                 { value: "pdf", label: "PDF" },
//                 { value: "docx", label: "Microsoft Word" },
//                 { value: "rtf", label: "Rich Text Format" }
//               ]}
//             />
//           </div>
          
//           <div className="sm:col-span-3">
//             <InputGroup
//               label="Font Family"
//               id="fontFamily"
//               type="select"
//               options={[
//                 { value: "arial", label: "Arial" },
//                 { value: "times", label: "Times New Roman" },
//                 { value: "calibri", label: "Calibri" },
//                 { value: "georgia", label: "Georgia" },
//                 { value: "verdana", label: "Verdana" }
//               ]}
//             />
//           </div>
//         </div>
//       </FormSection>

//       <FormDivider />

//       <FormSection 
//         title="Portal Customization" 
//         description="Customize the appearance of your patient and referrer portals."
//       >
//         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//           <div className="sm:col-span-6">
//             <InputGroup
//               label="Portal Welcome Message"
//               id="welcomeMessage"
//               type="textarea"
//               placeholder="Welcome to City Medical Center's Radiology Portal. Access your reports and images securely."
//               value="Welcome to City Medical Center's Radiology Portal. Access your reports and images securely."
//             />
//           </div>
          
//           <div className="sm:col-span-6">
//             <label className="block text-sm font-medium text-gray-700">
//               Portal Background Image
//             </label>
//             <div className="mt-2 flex items-center">
//               <div className="h-24 w-40 rounded bg-gray-100 flex items-center justify-center">
//                 <span className="text-gray-300">Background</span>
//               </div>
//               <div className="ml-4">
//                 <div className="flex space-x-2">
//                   <button
//                     type="button"
//                     className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                   >
//                     Change
//                   </button>
//                   <button
//                     type="button"
//                     className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                   >
//                     Remove
//                   </button>
//                 </div>
//                 <p className="mt-1 text-xs text-gray-500">
//                   PNG or JPG. Max 5MB. Recommended 1920x1080 pixels.
//                 </p>
//               </div>
//             </div>
//           </div>
          
//           <div className="sm:col-span-6">
//             <InputGroup
//               label="Display Contact Information"
//               id="displayContact"
//               type="checkbox"
//               placeholder="Show contact information on the portal"
//             />
//           </div>
          
//           <div className="sm:col-span-6">
//             <InputGroup
//               label="Enable Custom CSS"
//               id="enableCustomCSS"
//               type="checkbox"
//               placeholder="Apply custom CSS styling to your portal"
//             />
            
//             <div className="mt-2">
//               <textarea
//                 id="custom-css"
//                 name="custom-css"
//                 rows={6}
//                 className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md font-mono"
//                 placeholder="/* Your custom CSS here */
// .header { 
//   background-color: #f0f4f8; 
// }
// .button {
//   border-radius: 4px;
// }"
//               ></textarea>
//               <p className="mt-1 text-xs text-gray-500">
//                 Advanced: Custom CSS will override default styling. Use with caution.
//               </p>
//             </div>
//           </div>
//         </div>
//       </FormSection>

//       <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 rounded-b-lg">
//         <button
//           type="button"
//           className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//         >
//           Preview
//         </button>
//         <button
//           type="submit"
//           className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//         >
//           Save Changes
//         </button>
//       </div>
//     </div>
//   );
// }