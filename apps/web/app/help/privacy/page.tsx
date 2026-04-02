'use client';

import { useRouter } from 'next/navigation';
import BottomNav from '@/app/components/BottomNav';

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <>
      <div className="min-h-screen bg-canvas pb-32">
        {/* Header */}
        <header className="px-6 pt-[55px] pb-6 bg-gradient-to-br from-brand-600 to-brand-700 text-white">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <i className="ph ph-caret-left text-xl"></i>
            </button>
            <h1 className="text-2xl font-bold">Privacy Policy</h1>
          </div>
        </header>

        {/* Content */}
        <div className="px-6 -mt-6">
          <div className="bg-white rounded-3xl shadow-soft p-6 space-y-6">
            <div>
              <p className="text-sm text-slate-500 mb-4">Last updated: {new Date().toLocaleDateString()}</p>
              
              <h2 className="text-lg font-bold text-slate-900 mb-3">Introduction</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                KONZA ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
              </p>

              <h2 className="text-lg font-bold text-slate-900 mb-3">Information We Collect</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-2">We collect information that you provide directly to us, including:</p>
              <ul className="list-disc list-inside text-slate-600 text-sm leading-relaxed mb-4 space-y-1">
                <li>Name, email address, and phone number</li>
                <li>Contractor license/certification documents</li>
                <li>Years of experience and location information</li>
                <li>Ratings and reviews you provide</li>
                <li>Company name (for contractors)</li>
              </ul>

              <h2 className="text-lg font-bold text-slate-900 mb-3">How We Use Your Information</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-2">We use the information we collect to:</p>
              <ul className="list-disc list-inside text-slate-600 text-sm leading-relaxed mb-4 space-y-1">
                <li>Provide, maintain, and improve our services</li>
                <li>Connect users with qualified contractors</li>
                <li>Send you updates about your account</li>
                <li>Respond to your comments and questions</li>
                <li>Verify contractor credentials and experience</li>
              </ul>

              <h2 className="text-lg font-bold text-slate-900 mb-3">Information Sharing</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information with:
              </p>
              <ul className="list-disc list-inside text-slate-600 text-sm leading-relaxed mb-4 space-y-1">
                <li>Other users (contractors' public profiles are visible to users)</li>
                <li>Service providers who assist in operating our app</li>
                <li>Law enforcement when required by law</li>
              </ul>

              <h2 className="text-lg font-bold text-slate-900 mb-3">Data Security</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>

              <h2 className="text-lg font-bold text-slate-900 mb-3">Your Rights</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-2">You have the right to:</p>
              <ul className="list-disc list-inside text-slate-600 text-sm leading-relaxed mb-4 space-y-1">
                <li>Access your personal information</li>
                <li>Update or correct your information</li>
                <li>Delete your account and associated data</li>
                <li>Opt out of promotional communications</li>
              </ul>

              <h2 className="text-lg font-bold text-slate-900 mb-3">Children's Privacy</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                KONZA is not intended for users under the age of 18. We do not knowingly collect personal information from children under 18.
              </p>

              <h2 className="text-lg font-bold text-slate-900 mb-3">Changes to This Policy</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>

              <h2 className="text-lg font-bold text-slate-900 mb-3">Contact Us</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                If you have questions about this Privacy Policy, please contact us through the Contact Support page in the app or email us at privacy@konza.app.
              </p>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
