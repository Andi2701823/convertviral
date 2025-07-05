'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'appearance'>('profile');
  const [formState, setFormState] = useState({
    name: 'Guest User',
    email: 'user@example.com',
    bio: '',
    emailNotifications: true,
    conversionAlerts: true,
    weeklyDigest: false,
    marketingEmails: false,
    publicProfile: true,
    showConversions: false,
    showBadges: true,
    theme: 'system',
    colorScheme: 'blue',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormState({
      ...formState,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to the backend
    alert('Settings saved successfully!');
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          {/* Sidebar */}
          <div className="sm:w-64 bg-gray-50 p-6 border-r">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-primary-100 text-primary-800' : 'hover:bg-gray-100'}`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeTab === 'notifications' ? 'bg-primary-100 text-primary-800' : 'hover:bg-gray-100'}`}
              >
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeTab === 'privacy' ? 'bg-primary-100 text-primary-800' : 'hover:bg-gray-100'}`}
              >
                Privacy
              </button>
              <button
                onClick={() => setActiveTab('appearance')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeTab === 'appearance' ? 'bg-primary-100 text-primary-800' : 'hover:bg-gray-100'}`}
              >
                Appearance
              </button>
            </nav>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-6">
            <form onSubmit={handleSubmit}>
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
                  
                  <div className="mb-6">
                    <div className="flex items-center mb-4">
                      <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl mr-4">
                        👤
                      </div>
                      <button type="button" className="btn-secondary text-sm">
                        Change Avatar
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleInputChange}
                      className="input-field w-full"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleInputChange}
                      className="input-field w-full"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formState.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className="input-field w-full"
                      placeholder="Tell us a bit about yourself"
                    />
                  </div>
                </motion.div>
              )}
              
              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="emailNotifications"
                          name="emailNotifications"
                          type="checkbox"
                          checked={formState.emailNotifications}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="emailNotifications" className="font-medium text-gray-700">
                          Email Notifications
                        </label>
                        <p className="text-gray-500">Receive email notifications for important updates</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="conversionAlerts"
                          name="conversionAlerts"
                          type="checkbox"
                          checked={formState.conversionAlerts}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="conversionAlerts" className="font-medium text-gray-700">
                          Conversion Alerts
                        </label>
                        <p className="text-gray-500">Get notified when your file conversions are complete</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="weeklyDigest"
                          name="weeklyDigest"
                          type="checkbox"
                          checked={formState.weeklyDigest}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="weeklyDigest" className="font-medium text-gray-700">
                          Weekly Digest
                        </label>
                        <p className="text-gray-500">Receive a weekly summary of your activity and new badges</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="marketingEmails"
                          name="marketingEmails"
                          type="checkbox"
                          checked={formState.marketingEmails}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="marketingEmails" className="font-medium text-gray-700">
                          Marketing Emails
                        </label>
                        <p className="text-gray-500">Receive updates about new features and promotions</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="publicProfile"
                          name="publicProfile"
                          type="checkbox"
                          checked={formState.publicProfile}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="publicProfile" className="font-medium text-gray-700">
                          Public Profile
                        </label>
                        <p className="text-gray-500">Allow others to see your profile and achievements</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="showConversions"
                          name="showConversions"
                          type="checkbox"
                          checked={formState.showConversions}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="showConversions" className="font-medium text-gray-700">
                          Show Conversions
                        </label>
                        <p className="text-gray-500">Display your conversion history on your public profile</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="showBadges"
                          name="showBadges"
                          type="checkbox"
                          checked={formState.showBadges}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="showBadges" className="font-medium text-gray-700">
                          Show Badges
                        </label>
                        <p className="text-gray-500">Display your earned badges on your public profile</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-red-50 rounded-lg">
                    <h3 className="text-md font-medium text-red-800">Danger Zone</h3>
                    <p className="text-sm text-red-600 mt-1 mb-3">
                      These actions are irreversible. Please proceed with caution.
                    </p>
                    <div className="space-y-3">
                      <button
                        type="button"
                        className="px-4 py-2 bg-white text-red-600 border border-red-300 rounded-md text-sm hover:bg-red-50 transition-colors"
                      >
                        Delete All Conversion History
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 bg-white text-red-600 border border-red-300 rounded-md text-sm hover:bg-red-50 transition-colors"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold mb-4">Appearance Settings</h2>
                  
                  <div className="mb-4">
                    <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
                      Theme
                    </label>
                    <select
                      id="theme"
                      name="theme"
                      value={formState.theme}
                      onChange={handleInputChange}
                      className="input-field w-full"
                    >
                      <option value="system">System Default</option>
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="colorScheme" className="block text-sm font-medium text-gray-700 mb-1">
                      Color Scheme
                    </label>
                    <select
                      id="colorScheme"
                      name="colorScheme"
                      value={formState.colorScheme}
                      onChange={handleInputChange}
                      className="input-field w-full"
                    >
                      <option value="blue">Blue (Default)</option>
                      <option value="purple">Purple</option>
                      <option value="green">Green</option>
                      <option value="orange">Orange</option>
                    </select>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-md font-medium mb-2">Preview</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-primary-50 rounded-lg">
                        <div className="h-4 w-24 bg-primary-200 rounded mb-2"></div>
                        <div className="h-4 w-32 bg-primary-300 rounded mb-2"></div>
                        <div className="h-4 w-20 bg-primary-400 rounded"></div>
                      </div>
                      <div className="p-4 bg-primary-100 rounded-lg">
                        <div className="h-8 w-full bg-primary-500 rounded mb-2"></div>
                        <div className="h-4 w-full bg-primary-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div className="mt-8 pt-6 border-t">
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
                <button type="button" className="btn-secondary ml-4">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}