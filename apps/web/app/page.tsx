'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import BottomNav from '@/app/components/BottomNav';

function useDarkMode() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    
    const handleDarkModeChange = () => {
      const newDarkMode = localStorage.getItem('darkMode') === 'true';
      setDarkMode(newDarkMode);
    };
    
    window.addEventListener('storage', handleDarkModeChange);
    window.addEventListener('darkModeChange', handleDarkModeChange);
    
    return () => {
      window.removeEventListener('storage', handleDarkModeChange);
      window.removeEventListener('darkModeChange', handleDarkModeChange);
    };
  }, []);

  return darkMode;
}

type Contractor = {
  id: number;
  name: string;
  category: string;
  tier: string;
  phone: string;
  email?: string;
  experience_years: number;
  location: string;
};

function FeaturedContractors() {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const router = useRouter();
  const darkMode = useDarkMode(); // Must be called before any conditional returns

  useEffect(() => {
    async function fetchContractors() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contractors`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // API returns array directly, not wrapped in success object
        if (Array.isArray(data)) {
          // Show only top 3 contractors
          setContractors(data.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching contractors:', error instanceof Error ? error.message : String(error));
      }
    }
    fetchContractors();
  }, []);

  const getTierColor = (tier: string) => {
    if (tier === 'Gold') return 'bg-amber-500';
    if (tier === 'Silver') return 'bg-gray-400';
    return 'bg-orange-700';
  };

  if (contractors.length === 0) {
    return null; // Don't show section if no contractors
  }

  return (
    <section className="fade-in-up fade-delay-3">
      <div className="flex items-center justify-between px-6 mb-4">
        <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Featured Contractors</h2>
      </div>

      <div className="px-6 space-y-4">
        {contractors.map((contractor) => (
          <div
            key={contractor.id}
            onClick={() => router.push(`/contractor-details?id=${contractor.id}`)}
            className={`rounded-3xl p-4 shadow-soft border flex items-start space-x-4 active:scale-[0.98] transition-transform duration-200 cursor-pointer ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                {contractor.name.charAt(0)}
              </div>
              <div className={`absolute -bottom-2 -right-2 p-1 rounded-full shadow-sm ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                <div className={`w-6 h-6 ${getTierColor(contractor.tier)} rounded-full flex items-center justify-center`}>
                  <i className="ph-fill ph-star text-white text-xs"></i>
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className={`text-base font-bold truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>{contractor.name}</h3>
                <span className={`px-2 py-0.5 ${getTierColor(contractor.tier)} text-white text-xs font-bold rounded-md`}>
                  {contractor.tier}
                </span>
              </div>
              <p className={`text-xs mb-2 truncate ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{contractor.category} • {contractor.location}</p>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-lg text-[10px] font-medium border ${darkMode ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                  {contractor.experience_years} years exp
                </span>
                <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{contractor.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const router = useRouter();
  const darkMode = useDarkMode();

    return (
      <>
        <div className={`antialiased pt-[55px] pb-32 ${darkMode ? 'bg-slate-900 text-white' : 'bg-canvas text-slate-800'}`}>
          {/* 
      AESTHETIC DNA:
      Trend Core: Clean Utility / Modern Marketplace
      Spice: Trustworthy Professionalism
      Palette: Royal Blue, Slate, White, Amber Accent
      Type: Satoshi (Geometric Sans)
    */}

    {/* Header */}
    <header className="px-6 mb-6 flex items-center justify-between fade-in-up">
        <div>
            <div className={`flex items-center text-sm font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <i className={`ph-fill ph-map-pin mr-1 ${darkMode ? 'text-red-500' : 'text-brand-600'}`}></i>
                <span>Lusaka, Zambia</span>
                <i className="ph ph-caret-down ml-1 text-xs"></i>
            </div>
            <h1 className={`text-2xl font-bold leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Welcome to KONZA!</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => router.push('/settings')} className={`p-2 rounded-full shadow-card transition-colors ${darkMode ? 'bg-slate-800 text-slate-300 hover:text-red-500' : 'bg-white text-slate-600 hover:text-brand-600'}`} title="Settings">
              <i className="ph ph-gear text-xl"></i>
          </button>
          <button onClick={() => router.push('/login')} className={`p-2 rounded-full shadow-card transition-colors ${darkMode ? 'bg-slate-800 text-slate-300 hover:text-red-500' : 'bg-white text-slate-600 hover:text-brand-600'}`} title="Login">
              <i className="ph ph-sign-in text-xl"></i>
          </button>
          <button onClick={() => router.push('/join')} className={`p-2 rounded-full shadow-card transition-colors ${darkMode ? 'bg-slate-800 text-slate-300 hover:text-red-500' : 'bg-white text-slate-600 hover:text-brand-600'}`} title="Register as Contractor">
              <i className="ph ph-plus text-xl"></i>
          </button>
          <button className={`relative p-2 rounded-full shadow-card transition-colors ${darkMode ? 'bg-slate-800 text-slate-300 hover:text-red-500' : 'bg-white text-slate-600 hover:text-brand-600'}`}>
              <i className="ph ph-bell text-xl"></i>
              <span className={`absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 ${darkMode ? 'border-slate-800' : 'border-white'}`}></span>
          </button>
        </div>
    </header>

    {/* Search Fake Input (Hero) */}
    <div className="px-6 mb-8 fade-in-up fade-delay-1">
        <div className="relative group" onClick={() => router.push('/search')}>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className={`ph ph-magnifying-glass text-xl transition-colors ${darkMode ? 'text-slate-500 group-hover:text-red-500' : 'text-slate-400 group-hover:text-brand-600'}`}></i>
            </div>
            <input type="text" readOnly placeholder="What do you need help with?" 
                className={`block w-full pl-12 pr-4 py-4 border shadow-soft rounded-2xl placeholder-slate-400 focus:outline-none transition-all text-sm font-medium cursor-pointer ${darkMode ? 'bg-slate-800 border-slate-700 text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500' : 'bg-white border-transparent text-slate-700 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-200'}`} />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <div className={`rounded-lg p-1.5 ${darkMode ? 'bg-red-500/20' : 'bg-brand-50'}`}>
                    <i className={`ph ph-sliders-horizontal ${darkMode ? 'text-red-400' : 'text-brand-600'}`}></i>
                </div>
            </div>
        </div>
    </div>

    {/* Quick Categories */}
    <section className="mb-8 fade-in-up fade-delay-2">
        <div className="flex items-center justify-between px-6 mb-4">
            <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Categories</h2>
            <button onClick={() => router.push('/contractor-categories')} className={`text-sm font-semibold ${darkMode ? 'text-red-400 hover:text-red-500' : 'text-brand-600 hover:text-brand-700'}`}>See All</button>
        </div>
        
        <div className="flex overflow-x-auto px-6 pb-4 space-x-4 no-scrollbar">
            {/* Active Filter */}
            <button className="flex flex-col items-center space-y-2 min-w-[72px]">
                <div className={`w-16 h-16 rounded-2xl text-white flex items-center justify-center shadow-lg transform transition active:scale-95 ${darkMode ? 'bg-red-600 shadow-red-600/20' : 'bg-brand-600 shadow-brand-600/20'}`}>
                    <i className="ph-fill ph-house text-2xl"></i>
                </div>
                <span className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>All</span>
            </button>

            {/* Category Item */}
            <button onClick={() => router.push('/contractor-categories')} className="flex flex-col items-center space-y-2 min-w-[72px] group">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-card border transition-all active:scale-95 ${darkMode ? 'bg-slate-800 text-slate-400 border-slate-700 group-hover:border-red-500' : 'bg-white text-slate-500 border-slate-100 group-hover:border-brand-200'}`}>
                    <i className={`ph-duotone ph-drop text-2xl transition-colors ${darkMode ? 'group-hover:text-red-400' : 'group-hover:text-brand-600'}`}></i>
                </div>
                <span className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Plumbing</span>
            </button>

            {/* Category Item */}
            <button onClick={() => router.push('/contractor-categories')} className="flex flex-col items-center space-y-2 min-w-[72px] group">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-card border transition-all active:scale-95 ${darkMode ? 'bg-slate-800 text-slate-400 border-slate-700 group-hover:border-red-500' : 'bg-white text-slate-500 border-slate-100 group-hover:border-brand-200'}`}>
                    <i className={`ph-duotone ph-lightning text-2xl transition-colors ${darkMode ? 'group-hover:text-red-400' : 'group-hover:text-brand-600'}`}></i>
                </div>
                <span className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Electric</span>
            </button>

             {/* Category Item */}
             <button onClick={() => router.push('/contractor-categories')} className="flex flex-col items-center space-y-2 min-w-[72px] group">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-card border transition-all active:scale-95 ${darkMode ? 'bg-slate-800 text-slate-400 border-slate-700 group-hover:border-red-500' : 'bg-white text-slate-500 border-slate-100 group-hover:border-brand-200'}`}>
                    <i className={`ph-duotone ph-paint-brush text-2xl transition-colors ${darkMode ? 'group-hover:text-red-400' : 'group-hover:text-brand-600'}`}></i>
                </div>
                <span className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Painting</span>
            </button>

            {/* Category Item */}
            <button onClick={() => router.push('/contractor-categories')} className="flex flex-col items-center space-y-2 min-w-[72px] group">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-card border transition-all active:scale-95 ${darkMode ? 'bg-slate-800 text-slate-400 border-slate-700 group-hover:border-red-500' : 'bg-white text-slate-500 border-slate-100 group-hover:border-brand-200'}`}>
                    <i className={`ph-duotone ph-laptop text-2xl transition-colors ${darkMode ? 'group-hover:text-red-400' : 'group-hover:text-brand-600'}`}></i>
                </div>
                <span className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>IT</span>
            </button>

            {/* Category Item */}
            <button onClick={() => router.push('/contractor-categories')} className="flex flex-col items-center space-y-2 min-w-[72px] group">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-card border transition-all active:scale-95 ${darkMode ? 'bg-slate-800 text-slate-400 border-slate-700 group-hover:border-red-500' : 'bg-white text-slate-500 border-slate-100 group-hover:border-brand-200'}`}>
                    <i className={`ph-duotone ph-hammer text-2xl transition-colors ${darkMode ? 'group-hover:text-red-400' : 'group-hover:text-brand-600'}`}></i>
                </div>
                <span className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Carpenter</span>
            </button>

            {/* Category Item */}
            <button onClick={() => router.push('/contractor-categories')} className="flex flex-col items-center space-y-2 min-w-[72px] group">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-card border transition-all active:scale-95 ${darkMode ? 'bg-slate-800 text-slate-400 border-slate-700 group-hover:border-red-500' : 'bg-white text-slate-500 border-slate-100 group-hover:border-brand-200'}`}>
                    <i className={`ph-duotone ph-hard-hat text-2xl transition-colors ${darkMode ? 'group-hover:text-red-400' : 'group-hover:text-brand-600'}`}></i>
                </div>
                <span className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Builder</span>
            </button>
        </div>
    </section>

    {/* Contractor Showcase Gallery */}
    <div className="px-6 mb-8 fade-in-up fade-delay-2">
        <div className="bg-gradient-to-br from-brand-600 to-purple-700 rounded-3xl overflow-hidden shadow-2xl p-6">
            <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold text-white leading-tight mb-2">Get Recognized as a<br />Zambian Contractor Today!</h3>
                <p className="text-white/90 text-sm font-medium">Join hundreds of trusted professionals across Lusaka</p>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="aspect-square rounded-xl overflow-hidden shadow-lg">
                    <img src="https://app-cdn.appgen.com/74e8cc4b-1e4b-41a9-b07e-3111bcd989dc/assets/uploaded_1774167769084_95surh.jpeg" alt="Professional Electrician" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-square rounded-xl overflow-hidden shadow-lg">
                    <img src="https://app-cdn.appgen.com/74e8cc4b-1e4b-41a9-b07e-3111bcd989dc/assets/uploaded_1774167769092_5rujcc.jpeg" alt="Skilled Carpenter" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-square rounded-xl overflow-hidden shadow-lg">
                    <img src="https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=300&h=300&fit=crop" alt="Professional Builder" className="w-full h-full object-cover" />
                </div>
            </div>

            {/* Benefits List */}
            <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                        <i className="ph-fill ph-check text-white text-sm"></i>
                    </div>
                    <p className="text-white text-sm font-medium">Reach thousands of potential clients in Lusaka</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                        <i className="ph-fill ph-check text-white text-sm"></i>
                    </div>
                    <p className="text-white text-sm font-medium">Build your reputation with verified ratings</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                        <i className="ph-fill ph-check text-white text-sm"></i>
                    </div>
                    <p className="text-white text-sm font-medium">Get tiered based on your experience (Bronze/Silver/Gold)</p>
                </div>
            </div>

            <button onClick={() => router.push('/join')} className="w-full px-6 py-4 bg-white text-brand-600 text-base font-bold rounded-2xl hover:bg-brand-50 transition-all active:scale-[0.98] shadow-lg flex items-center justify-center space-x-2">
                <i className="ph-fill ph-user-plus text-xl"></i>
                <span>Register as a Contractor</span>
            </button>
        </div>
    </div>

    {/* Featured Contractors - Only show if contractors exist */}
    <FeaturedContractors />

    {/* Bottom Navigation */}
        </div>
      <BottomNav />
      </>
    );
}
