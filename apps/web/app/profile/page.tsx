'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import BottomNav from '@/app/components/BottomNav';

export default function ProfilePage() {
  const router = useRouter();
  const [hasProfile, setHasProfile] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  useEffect(() => {
    // Check if user profile exists
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUser(JSON.parse(savedProfile));
      setHasProfile(true);
    } else {
      setIsCreating(true);
    }
  }, []);

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  const handleCreateProfile = async () => {
    if (!user.name || !user.email || !user.phone || !user.password) {
      alert('Please fill in all fields');
      return;
    }
    
    try {
      // First, create user in database
      const createResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          phone: user.phone,
          password: user.password
        })
      });

      const createData = await createResponse.json();

      if (!createData.success) {
        alert(createData.error || 'Failed to create profile');
        return;
      }

      // Then login to create session
      const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          password: user.password,
          type: 'user'
        }),
        credentials: 'include'
      });

      const loginData = await loginResponse.json();

      if (loginData.success) {
        localStorage.setItem('userProfile', JSON.stringify(loginData.user));
        setUser(loginData.user);
        setHasProfile(true);
        setIsCreating(false);
        alert('Profile created successfully!');
      }
    } catch (error) {
      alert('Failed to create profile. Please try again.');
    }
  };

  // Profile creation form
  if (isCreating) {
    return (
      <>
        <div className="min-h-screen bg-canvas pb-32">
          {/* Header */}
          <header className="px-6 pt-[55px] pb-6 bg-gradient-to-br from-brand-600 to-brand-700 text-white">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => router.push('/')}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <i className="ph ph-caret-left text-xl"></i>
              </button>
              <h1 className="text-2xl font-bold">Create Profile</h1>
              <div className="w-10"></div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl border-4 border-white/30">
                <i className="ph ph-user-plus"></i>
              </div>
              <p className="text-white/90 text-sm mt-4 text-center">Create your profile to view contractors and leave ratings</p>
            </div>
          </header>

          {/* Form */}
          <div className="px-6 -mt-6">
            <div className="bg-white rounded-3xl shadow-soft p-6 mb-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Your Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={user.phone}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="+260 97 123 4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="Create a strong password"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleCreateProfile}
              className="w-full bg-brand-600 text-white py-4 rounded-2xl font-semibold hover:bg-brand-700 transition-colors shadow-soft mb-4"
            >
              Create Profile
            </button>

            <div className="text-center text-sm text-slate-600">
              Already have an account?{' '}
              <button onClick={handleLoginRedirect} className="text-brand-600 font-semibold hover:underline">
                Login
              </button>
            </div>
          </div>
        </div>
        <BottomNav />
      </>
    );
  }

  // Existing profile view
  if (!hasProfile) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-canvas pb-32">
        {/* Header */}
        <header className="px-6 pt-[55px] pb-6 bg-gradient-to-br from-brand-600 to-brand-700 text-white">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Profile</h1>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => router.push('/join')}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <i className="ph ph-plus text-xl"></i>
              </button>
              <button 
                className="relative w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <i className="ph ph-bell text-xl"></i>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <button 
                onClick={() => router.push('/settings')}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <i className="ph ph-gear text-xl"></i>
              </button>
            </div>
          </div>

          {/* Profile Avatar */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold mb-3 border-4 border-white/30">
              {user.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold mb-1">{user.name}</h2>
            <p className="text-white/80 text-sm">{user.email}</p>
          </div>
        </header>

        {/* Profile Content */}
        <div className="px-6 -mt-6">
          {/* Info Card */}
          <div className="bg-white rounded-3xl shadow-soft p-6 mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Contact Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                  <i className="ph ph-envelope text-brand-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Email</p>
                  <p className="text-sm text-slate-900 font-semibold">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                  <i className="ph ph-phone text-brand-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Phone</p>
                  <p className="text-sm text-slate-900 font-semibold">{user.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="space-y-3">
            <button 
              onClick={() => router.push('/settings')}
              className="w-full bg-white rounded-2xl shadow-card p-4 flex items-center justify-between hover:shadow-float transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-50 rounded-full flex items-center justify-center">
                  <i className="ph ph-gear text-brand-600 text-xl"></i>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900">Settings</p>
                  <p className="text-xs text-slate-500">Manage your account</p>
                </div>
              </div>
              <i className="ph ph-caret-right text-slate-400"></i>
            </button>

            <button className="w-full bg-white rounded-2xl shadow-card p-4 flex items-center justify-between hover:shadow-float transition-all active:scale-[0.98]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center">
                  <i className="ph ph-star text-amber-600 text-xl"></i>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900">My Ratings</p>
                  <p className="text-xs text-slate-500">View ratings you've given</p>
                </div>
              </div>
              <i className="ph ph-caret-right text-slate-400"></i>
            </button>

            <button className="w-full bg-white rounded-2xl shadow-card p-4 flex items-center justify-between hover:shadow-float transition-all active:scale-[0.98]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                  <i className="ph ph-question text-blue-600 text-xl"></i>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900">Help & Support</p>
                  <p className="text-xs text-slate-500">Get help with KONZA</p>
                </div>
              </div>
              <i className="ph ph-caret-right text-slate-400"></i>
            </button>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
