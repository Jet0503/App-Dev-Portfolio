'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import BottomNav from '@/app/components/BottomNav';

export default function SettingsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [changingContractorPassword, setChangingContractorPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [isContractor, setIsContractor] = useState(false);
  const [contractorData, setContractorData] = useState<any>(null);

  useEffect(() => {
    // Check if user is a contractor
    const savedContractor = localStorage.getItem('contractorProfile');
    if (savedContractor) {
      const contractor = JSON.parse(savedContractor);
      setIsContractor(true);
      setContractorData(contractor);
    }
    
    // Load user profile from localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
    
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    
    // Load language preference
    const savedLanguage = localStorage.getItem('language') || 'English';
    setLanguage(savedLanguage);
  }, []);

  const handleSaveProfile = () => {
    // Save to localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      const updatedProfile = {
        ...profile,
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      };
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    }
    setEditing(false);
    alert('Profile updated successfully!');
  };

  const handleChangePassword = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    
    // Save new password to localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      profile.password = formData.newPassword;
      localStorage.setItem('userProfile', JSON.stringify(profile));
    }
    
    setChangingPassword(false);
    setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
    alert('Password changed successfully!');
  };

  const handleResetData = async () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      // Logout from server
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      localStorage.clear();
      alert('All data has been cleared. You will need to create a new profile.');
      router.push('/');
    }
  };

  const handleToggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    // Trigger custom event for same-page updates
    window.dispatchEvent(new Event('darkModeChange'));
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const handleChangeContractorPassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    
    if (!contractorData?.id) {
      alert('Contractor profile not found');
      return;
    }
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contractors/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: contractorData.id,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setChangingContractorPassword(false);
        setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
        alert('Contractor password changed successfully!');
      } else {
        alert(data.error || 'Failed to change password');
      }
    } catch (error) {
      alert('Failed to change password. Please try again.');
    }
  };

  const handleDeleteContractorProfile = async () => {
    const password = prompt('Enter your contractor password to confirm deletion:');
    
    if (!password) {
      return;
    }
    
    if (!contractorData?.id) {
      alert('Contractor profile not found');
      return;
    }
    
    if (!confirm('Are you sure you want to delete your contractor profile? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contractors`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: contractorData.id,
          password: password
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.removeItem('contractorProfile');
        alert('Contractor profile deleted successfully!');
        router.push('/');
      } else {
        alert(data.error || 'Failed to delete profile');
      }
    } catch (error) {
      alert('Failed to delete profile. Please try again.');
    }
  };

  return (
    <>
      <div className={`min-h-screen pb-32 ${darkMode ? 'bg-slate-900' : 'bg-canvas'}`}>
        {/* Header */}
        <header className={`px-6 pt-[55px] pb-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-sm ${darkMode ? 'bg-slate-900/80' : 'bg-canvas/80'}`}>
          <button 
            onClick={() => router.back()}
            className={`w-10 h-10 rounded-full shadow-card flex items-center justify-center transition-colors ${darkMode ? 'bg-slate-800 text-slate-300 hover:text-red-500' : 'bg-white text-slate-600 hover:text-brand-600'}`}
          >
            <i className="ph ph-caret-left text-xl"></i>
          </button>
          <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Settings</h1>
          <div className="w-10"></div>
        </header>

        <div className="px-6 space-y-6">
          {/* Account Settings */}
          <div className={`rounded-3xl shadow-soft p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Account Information</h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${darkMode ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-brand-50 text-brand-600 hover:bg-brand-100'}`}
                >
                  Edit
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!editing}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent ${darkMode ? 'bg-slate-700 border-slate-600 text-white focus:ring-red-500 disabled:bg-slate-800 disabled:text-slate-500' : 'bg-white border-slate-200 text-slate-900 focus:ring-brand-500 disabled:bg-slate-50 disabled:text-slate-500'}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!editing}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent ${darkMode ? 'bg-slate-700 border-slate-600 text-white focus:ring-red-500 disabled:bg-slate-800 disabled:text-slate-500' : 'bg-white border-slate-200 text-slate-900 focus:ring-brand-500 disabled:bg-slate-50 disabled:text-slate-500'}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!editing}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent ${darkMode ? 'bg-slate-700 border-slate-600 text-white focus:ring-red-500 disabled:bg-slate-800 disabled:text-slate-500' : 'bg-white border-slate-200 text-slate-900 focus:ring-brand-500 disabled:bg-slate-50 disabled:text-slate-500'}`}
                />
              </div>

              {editing && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSaveProfile}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${darkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-brand-600 text-white hover:bg-brand-700'}`}
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Change User Password */}
          {!isContractor && (
            <div className={`rounded-3xl shadow-soft p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Change Password</h2>
                {!changingPassword && (
                  <button
                    onClick={() => setChangingPassword(true)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${darkMode ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-brand-50 text-brand-600 hover:bg-brand-100'}`}
                  >
                    Change
                  </button>
                )}
              </div>

              {changingPassword ? (
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Current Password</label>
                    <input
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent ${darkMode ? 'bg-slate-700 border-slate-600 text-white focus:ring-red-500' : 'bg-white border-slate-200 text-slate-900 focus:ring-brand-500'}`}
                      placeholder="Enter current password"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>New Password</label>
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent ${darkMode ? 'bg-slate-700 border-slate-600 text-white focus:ring-red-500' : 'bg-white border-slate-200 text-slate-900 focus:ring-brand-500'}`}
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Confirm New Password</label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent ${darkMode ? 'bg-slate-700 border-slate-600 text-white focus:ring-red-500' : 'bg-white border-slate-200 text-slate-900 focus:ring-brand-500'}`}
                      placeholder="Confirm new password"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleChangePassword}
                      className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${darkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-brand-600 text-white hover:bg-brand-700'}`}
                    >
                      Update Password
                    </button>
                    <button
                      onClick={() => {
                        setChangingPassword(false);
                        setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
                      }}
                      className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Keep your account secure by using a strong password
                </p>
              )}
            </div>
          )}

          {/* Change Contractor Password */}
          {isContractor && (
            <div className={`rounded-3xl shadow-soft p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Change Contractor Password</h2>
                {!changingContractorPassword && (
                  <button
                    onClick={() => setChangingContractorPassword(true)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${darkMode ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-brand-50 text-brand-600 hover:bg-brand-100'}`}
                  >
                    Change
                  </button>
                )}
              </div>

              {changingContractorPassword ? (
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Current Password</label>
                    <input
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent ${darkMode ? 'bg-slate-700 border-slate-600 text-white focus:ring-red-500' : 'bg-white border-slate-200 text-slate-900 focus:ring-brand-500'}`}
                      placeholder="Enter current password"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>New Password</label>
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent ${darkMode ? 'bg-slate-700 border-slate-600 text-white focus:ring-red-500' : 'bg-white border-slate-200 text-slate-900 focus:ring-brand-500'}`}
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Confirm New Password</label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent ${darkMode ? 'bg-slate-700 border-slate-600 text-white focus:ring-red-500' : 'bg-white border-slate-200 text-slate-900 focus:ring-brand-500'}`}
                      placeholder="Confirm new password"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleChangeContractorPassword}
                      className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${darkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-brand-600 text-white hover:bg-brand-700'}`}
                    >
                      Update Password
                    </button>
                    <button
                      onClick={() => {
                        setChangingContractorPassword(false);
                        setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
                      }}
                      className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Keep your contractor account secure by using a strong password
                </p>
              )}
            </div>
          )}

          {/* Delete Contractor Profile */}
          {isContractor && (
            <div className={`rounded-3xl shadow-soft p-6 border-2 ${darkMode ? 'bg-slate-800 border-red-900/50' : 'bg-white border-red-100'}`}>
              <h2 className="text-lg font-bold text-red-600 mb-2">Delete Contractor Profile</h2>
              <p className={`text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Permanently delete your contractor profile. This action cannot be undone.
              </p>
              <button
                onClick={handleDeleteContractorProfile}
                className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                Delete Contractor Profile
              </button>
            </div>
          )}

          {/* Notifications */}
          <div className={`rounded-3xl shadow-soft p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Notifications</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>New Job Requests</p>
                  <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Get notified of new job requests</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className={`w-11 h-6 peer-focus:outline-none peer-focus:ring-2 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${darkMode ? 'bg-slate-700 after:border-slate-600 peer-focus:ring-red-500 peer-checked:bg-red-600' : 'bg-slate-200 after:border-slate-300 peer-focus:ring-brand-300 peer-checked:bg-brand-600'}`}></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Messages from Clients</p>
                  <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Receive client message notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className={`w-11 h-6 peer-focus:outline-none peer-focus:ring-2 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${darkMode ? 'bg-slate-700 after:border-slate-600 peer-focus:ring-red-500 peer-checked:bg-red-600' : 'bg-slate-200 after:border-slate-300 peer-focus:ring-brand-300 peer-checked:bg-brand-600'}`}></div>
                </label>
              </div>
            </div>
          </div>

          {/* App Settings */}
          <div className={`rounded-3xl shadow-soft p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>App Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Dark Mode</p>
                  <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Switch between light and dark theme</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={darkMode}
                    onChange={handleToggleDarkMode}
                  />
                  <div className={`w-11 h-6 peer-focus:outline-none peer-focus:ring-2 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${darkMode ? 'bg-slate-700 after:border-slate-600 peer-focus:ring-red-500 peer-checked:bg-red-600' : 'bg-slate-200 after:border-slate-300 peer-focus:ring-brand-300 peer-checked:bg-brand-600'}`}></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Language</p>
                  <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Choose your preferred language</p>
                </div>
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className={`px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:border-transparent ${darkMode ? 'bg-slate-700 border-slate-600 text-white focus:ring-red-500' : 'bg-white border-slate-200 text-slate-900 focus:ring-brand-500'}`}
                >
                  <option value="English">English</option>
                  <option value="Bemba">Bemba</option>
                  <option value="Nyanja">Nyanja</option>
                </select>
              </div>

              <button
                onClick={handleResetData}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${darkMode ? 'bg-red-900/30 hover:bg-red-900/40' : 'bg-red-50 hover:bg-red-100'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-red-900/50' : 'bg-red-100'}`}>
                    <i className="ph ph-trash text-red-600 text-xl"></i>
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-semibold ${darkMode ? 'text-red-400' : 'text-red-900'}`}>Reset / Clear Data</p>
                    <p className="text-xs text-red-600">Clear all app data</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Help & Support */}
          <div className={`rounded-3xl shadow-soft p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Help & Support</h2>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/help/faqs')}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                    <i className={`ph ph-question text-xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}></i>
                  </div>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>FAQs</p>
                </div>
                <i className={`ph ph-caret-right ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}></i>
              </button>

              <button
                onClick={() => router.push('/help/contact')}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-green-900/30' : 'bg-green-50'}`}>
                    <i className={`ph ph-chat-circle-dots text-xl ${darkMode ? 'text-green-400' : 'text-green-600'}`}></i>
                  </div>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Contact Support</p>
                </div>
                <i className={`ph ph-caret-right ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}></i>
              </button>

              <button
                onClick={() => alert('You are running the latest version!')}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-purple-900/30' : 'bg-purple-50'}`}>
                    <i className={`ph ph-download-simple text-xl ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}></i>
                  </div>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Check for Updates</p>
                </div>
                <i className={`ph ph-caret-right ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}></i>
              </button>

              <button
                onClick={() => router.push('/help/privacy')}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'}`}>
                    <i className={`ph ph-shield-check text-xl ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}></i>
                  </div>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Privacy Policy</p>
                </div>
                <i className={`ph ph-caret-right ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}></i>
              </button>

              <button
                onClick={() => router.push('/help/terms')}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-amber-900/30' : 'bg-amber-50'}`}>
                    <i className={`ph ph-file-text text-xl ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}></i>
                  </div>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Terms & Conditions</p>
                </div>
                <i className={`ph ph-caret-right ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}></i>
              </button>

              <button
                onClick={() => router.push('/help/about')}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                    <i className={`ph ph-info text-xl ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}></i>
                  </div>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>About App</p>
                </div>
                <i className={`ph ph-caret-right ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
