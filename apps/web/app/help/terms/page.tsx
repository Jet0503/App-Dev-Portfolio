'use client';

import { useRouter } from 'next/navigation';
import BottomNav from '@/app/components/BottomNav';

export default function TermsPage() {
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
          <h1 className="text-xl font-bold text-slate-900">Terms & Conditions</h1>
          <div className="w-10"></div>
        </header>

        <div className="px-6">
          <div className="bg-white rounded-3xl shadow-soft p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-3">1. Acceptance of Terms</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                By accessing and using KONZA, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-3">2. Use License</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Permission is granted to temporarily use KONZA for personal, non-commercial use only. This is the grant of a license, not a transfer of title.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-3">3. Contractor Information</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                KONZA serves as a platform to connect users with contractors. We do not guarantee the quality of work, availability, or reliability of contractors listed on the platform. Users are responsible for verifying contractor credentials and agreements.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-3">4. User Responsibilities</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Users agree to provide accurate information when creating profiles and leaving reviews. Any false or misleading information may result in account suspension.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-3">5. Privacy</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Your privacy is important to us. We collect and store only the information necessary to provide our services. We do not share your personal information with third parties without your consent.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-3">6. Limitation of Liability</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                KONZA shall not be held liable for any damages arising from the use of this platform or interactions with contractors listed on the platform.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-3">7. Modifications</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                KONZA reserves the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
