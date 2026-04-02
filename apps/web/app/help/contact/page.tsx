'use client';

import { useRouter } from 'next/navigation';
import BottomNav from '@/app/components/BottomNav';

export default function ContactPage() {
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
          <h1 className="text-xl font-bold text-slate-900">Contact Support</h1>
          <div className="w-10"></div>
        </header>

        <div className="px-6 space-y-4">
          <div className="bg-white rounded-3xl shadow-soft p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Get in Touch</h2>
            <p className="text-sm text-slate-600 mb-6">
              Our support team is here to help you with any questions or issues you may have.
            </p>

            <div className="space-y-4">
              <a 
                href="tel:+260570912020"
                className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="ph ph-phone text-green-600 text-2xl"></i>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Phone</p>
                  <p className="text-sm text-slate-900 font-semibold">+260 570 912 020</p>
                </div>
              </a>

              <a 
                href="tel:+260960596223"
                className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="ph ph-phone text-green-600 text-2xl"></i>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Phone</p>
                  <p className="text-sm text-slate-900 font-semibold">+260 960 596 223</p>
                </div>
              </a>

              <a 
                href="mailto:chinyamaamosm451@gmail.com"
                className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="ph ph-envelope text-blue-600 text-2xl"></i>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Email</p>
                  <p className="text-sm text-slate-900 font-semibold">chinyamaamosm451@gmail.com</p>
                </div>
              </a>
            </div>
          </div>

          <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-3xl shadow-soft p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <i className="ph ph-clock text-xl"></i>
              </div>
              <h3 className="text-lg font-bold">Support Hours</h3>
            </div>
            <p className="text-white/90 text-sm">
              Monday - Friday: 8:00 AM - 6:00 PM<br />
              Saturday: 9:00 AM - 2:00 PM<br />
              Sunday: Closed
            </p>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
