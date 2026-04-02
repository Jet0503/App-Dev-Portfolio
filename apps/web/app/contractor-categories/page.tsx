'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import BottomNav from '@/app/components/BottomNav';

function ContractorCategoriesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'All';
  const [contractors, setContractors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const url =
          category === 'All'
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/contractors`
            : `${process.env.NEXT_PUBLIC_API_URL}/api/contractors?category=${category}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.success) {
          setContractors(data.contractors);
        }
      } catch (error) {
        console.error('Error fetching contractors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContractors();
  }, [category]);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Gold':
        return 'bg-yellow-100 border-yellow-300 text-yellow-700';
      case 'Silver':
        return 'bg-gray-100 border-gray-300 text-gray-700';
      case 'Bronze':
        return 'bg-orange-100 border-orange-300 text-orange-700';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-700';
    }
  };

    return (
      <>
        <div className="bg-canvas text-slate-800 antialiased pt-[55px] pb-32">
          {/* 
      AESTHETIC DNA:
      Matched to Home Screen
    */}

    {/* Header */}
    <header className="px-6 mb-6 flex items-center justify-between fade-in-up sticky top-0 z-40 py-2 bg-canvas/80 backdrop-blur-sm">
        <button onClick={() => router.push('/')} className="w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center text-slate-600 hover:text-brand-600 transition-colors">
            <i className="ph ph-caret-left text-xl"></i>
        </button>
        <h1 className="text-xl font-bold text-slate-900">{category !== 'All' ? `${category} Contractors` : 'All Categories'}</h1>
        <button className="w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center text-slate-600 hover:text-brand-600 transition-colors">
            <i className="ph ph-sliders-horizontal text-xl"></i>
        </button>
    </header>

    {/* Search / Filter Hint */}
    <div className="px-6 mb-8 fade-in-up fade-delay-1">
        <div className="relative group" onClick={() => router.push('/search')}>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="ph ph-magnifying-glass text-slate-400 text-lg"></i>
            </div>
            <input type="text" readOnly placeholder="Search services..." 
                className="block w-full pl-10 pr-4 py-3 bg-white border border-transparent shadow-card rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-200 transition-all text-sm font-medium cursor-pointer" />
        </div>
    </div>

    {/* Contractors List or Loading */}
    <main className="px-6 pb-8 fade-in-up fade-delay-2">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
            <p className="text-slate-500 mt-4">Loading contractors...</p>
          </div>
        ) : contractors.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <i className="ph ph-users text-3xl text-slate-400"></i>
            </div>
            <p className="text-slate-600 font-medium mb-2">No contractors found</p>
            <p className="text-sm text-slate-400 mb-4">Be the first to join in this category!</p>
            <button onClick={() => router.push('/join')} className="px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors">
              Join as Contractor
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {contractors.map((contractor) => (
              <div 
                key={contractor.id} 
                onClick={() => router.push(`/contractor-details?id=${contractor.id}`)} 
                className="bg-white rounded-3xl p-5 shadow-card hover:shadow-float border border-slate-100 transition-all duration-300 active:scale-[0.98] cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{contractor.name}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getTierColor(contractor.tier)}`}>
                      {contractor.tier} Tier
                    </span>
                  </div>
                  {contractor.experience_years && (
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">{contractor.experience_years} yrs</p>
                      <p className="text-xs text-slate-400">exp.</p>
                    </div>
                  )}
                </div>

                {contractor.description && (
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">{contractor.description}</p>
                )}

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <i className="ph ph-map-pin"></i>
                    <span>{contractor.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="ph ph-phone"></i>
                    <span>{contractor.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </main>

    {/* Bottom Navigation */}
        </div>
      <BottomNav />
      </>
    );
}

export default function ContractorCategoriesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    }>
      <ContractorCategoriesContent />
    </Suspense>
  );
}
