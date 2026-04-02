'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import BottomNav from '@/app/components/BottomNav';

const faqs = [
  {
    question: 'How do I find a contractor?',
    answer: 'You can browse contractors by category from the home page, or use the search feature to find specific contractors by name or category.'
  },
  {
    question: 'What do the tier levels mean?',
    answer: 'Bronze tier: Less than 5 years experience, Silver tier: 5-10 years experience, Gold tier: 10+ years experience. Tiers are automatically assigned based on years of experience.'
  },
  {
    question: 'How do I rate a contractor?',
    answer: 'After creating your profile, you can view contractor profiles and leave ratings and reviews based on your experience with them.'
  },
  {
    question: 'Can I register as a contractor?',
    answer: 'Yes! Tap the + button in the top navigation and fill out the registration form with your details, including your category, experience, and contact information.'
  },
  {
    question: 'How do I contact a contractor?',
    answer: 'Each contractor profile displays their phone number and email address. You can call or email them directly through the app.'
  },
  {
    question: 'Is my data safe?',
    answer: 'Yes, your information is stored securely. You can clear all your data at any time from the Settings page.'
  }
];

export default function FAQsPage() {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
          <h1 className="text-xl font-bold text-slate-900">FAQs</h1>
          <div className="w-10"></div>
        </header>

        <div className="px-6 space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-card overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
              >
                <p className="text-sm font-semibold text-slate-900 pr-4">{faq.question}</p>
                <i className={`ph ${openIndex === index ? 'ph-caret-up' : 'ph-caret-down'} text-slate-400 text-xl flex-shrink-0`}></i>
              </button>
              {openIndex === index && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
