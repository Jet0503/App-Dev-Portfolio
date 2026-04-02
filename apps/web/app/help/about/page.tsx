'use client';

import { useRouter } from 'next/navigation';
import BottomNav from '@/app/components/BottomNav';

export default function AboutPage() {
  const router = useRouter();

  return (
    <>
      <div className="min-h-screen bg-canvas pb-32">
        {/* Header */}
        <header className="px-6 pt-[55px] pb-6 flex items-center justify-between sticky top-0 z-40 bg-canvas/80 backdrop-blur-sm">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center text-slate-600 hover:text-brand-600 transition-colors"
          >
            <i className="ph ph-caret-left text-xl"></i>
          </button>
          <h1 className="text-xl font-bold text-slate-900">About KONZA</h1>
          <div className="w-10"></div>
        </header>

        <div className="px-6 space-y-4">
          {/* App Info */}
          <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-3xl shadow-soft p-8 text-white text-center">
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4 border-4 border-white/30">
              <i className="ph ph-wrench"></i>
            </div>
            <h2 className="text-2xl font-bold mb-2">KONZA</h2>
            <p className="text-white/90 text-sm">Find Your Zam Contractor</p>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-xs text-white/70">Version 1.0.0</p>
            </div>
          </div>

          {/* Mission */}
          <div className="bg-white rounded-3xl shadow-soft p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Our Mission</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              KONZA is dedicated to connecting people in Lusaka, Zambia with skilled and reliable contractors across various fields including building, electrical, plumbing, road construction, carpentry, and information technology.
            </p>
          </div>

          {/* Features */}
          <div className="bg-white rounded-3xl shadow-soft p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">What We Offer</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="ph ph-star text-brand-600"></i>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Tiered Contractors</p>
                  <p className="text-xs text-slate-600">Gold, Silver, and Bronze tiers based on experience</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="ph ph-magnifying-glass text-brand-600"></i>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Easy Search</p>
                  <p className="text-xs text-slate-600">Find contractors by category or name</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="ph ph-chat-circle-dots text-brand-600"></i>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Ratings & Reviews</p>
                  <p className="text-xs text-slate-600">Share and read experiences from other users</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="ph ph-shield-check text-brand-600"></i>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Verified Credentials</p>
                  <p className="text-xs text-slate-600">Contractors can upload licenses and certifications</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-3xl shadow-soft p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Get in Touch</h3>
            <p className="text-sm text-slate-600 mb-4">
              Have questions or feedback? We'd love to hear from you!
            </p>
            <button
              onClick={() => router.push('/help/contact')}
              className="w-full bg-brand-600 text-white py-3 rounded-xl font-semibold hover:bg-brand-700 transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
