'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          type: 'user'
        }),
        credentials: 'include' // Important for cookies
      });

      const data = await response.json();

      if (data.success) {
        // Save to localStorage for quick access
        localStorage.setItem('userProfile', JSON.stringify(data.user));
        alert('Login successful! Welcome back.');
        router.push('/profile');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas">
      {/* Header */}
      <div className="bg-gradient-to-br from-brand-600 to-brand-700 text-white p-6 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-white/80 text-sm">Login to your KONZA account</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-6 max-w-md mx-auto">
        <form onSubmit={handleLogin} className="bg-white rounded-3xl shadow-soft p-6 space-y-4 mt-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 text-white py-4 rounded-2xl font-semibold hover:bg-brand-700 transition-colors shadow-soft disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="text-center text-sm text-slate-600 pt-2">
            Don't have an account?{' '}
            <Link href="/profile" className="text-brand-600 font-semibold hover:underline">
              Create Profile
            </Link>
          </div>

          <div className="text-center pt-3">
            <button 
              type="button"
              onClick={() => {
                const email = prompt('Enter your email address:');
                if (email) {
                  fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, type: 'user' })
                  })
                  .then(res => res.json())
                  .then(data => {
                    if (data.success) {
                      alert('Password reset instructions have been sent to your email.');
                    }
                  });
                }
              }}
              className="text-sm text-brand-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
