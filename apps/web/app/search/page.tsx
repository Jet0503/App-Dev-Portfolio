'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
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

interface Contractor {
  id: number;
  name: string;
  category: string;
  tier: string;
  phone: string;
  email: string;
  experience_years: number;
  location: string;
  company_name?: string;
  average_rating: number;
  total_ratings: number;
}

export default function SearchPage() {
  const router = useRouter();
  const darkMode = useDarkMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [filteredContractors, setFilteredContractors] = useState<Contractor[]>([]);
  const [showTopRated, setShowTopRated] = useState(false);

  useEffect(() => {
    fetchContractors();
  }, []);

  useEffect(() => {
    filterContractors();
  }, [searchQuery, showTopRated, contractors]);

  const fetchContractors = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contractors`);
      if (response.ok) {
        const data = await response.json();
        // Ensure data is an array
        setContractors(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching contractors:', error);
      setContractors([]);
    }
  };

  const filterContractors = () => {
    let filtered = [...contractors];

    // Filter by search query (category search - exact match prioritized)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(contractor =>
        contractor.category.toLowerCase().includes(query) ||
        contractor.name.toLowerCase().includes(query) ||
        (contractor.company_name && contractor.company_name.toLowerCase().includes(query))
      );
      
      // Sort by exact category match first
      filtered.sort((a, b) => {
        const aExactMatch = a.category.toLowerCase() === query;
        const bExactMatch = b.category.toLowerCase() === query;
        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;
        return 0;
      });
    }

    // Filter by top rated (across all categories)
    if (showTopRated) {
      filtered = filtered
        .filter(c => c.total_ratings > 0)
        .sort((a, b) => b.average_rating - a.average_rating)
        .slice(0, 10); // Top 10 rated contractors
    }

    setFilteredContractors(filtered);
  };

    return (
      <>
        <div className={`antialiased pt-[55px] pb-32 ${darkMode ? 'bg-slate-900 text-white' : 'bg-canvas text-slate-800'}`}>
          {/* 
      AESTHETIC DNA:
      Matched to previous screens (Home, Categories, Details)
      Core: Clean Utility / Modern Marketplace
    */}

    {/* Header */}
    <header className="px-6 mb-4 flex items-center justify-between fade-in-up">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Search</h1>
        <div className="flex items-center gap-2">
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

    {/* Search Input Area */}
    <div className="px-6 mb-6 fade-in-up fade-delay-1 relative z-20">
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className={`ph-bold ph-magnifying-glass text-xl ${darkMode ? 'text-red-500' : 'text-brand-600'}`}></i>
            </div>
            <input 
                type="text" 
                placeholder="Search by category (e.g., Plumbing, Electrical)" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`block w-full pl-12 pr-12 py-4 border-2 shadow-soft rounded-2xl placeholder-slate-400 focus:outline-none focus:ring-4 transition-all text-base font-medium ${darkMode ? 'bg-slate-800 border-slate-700 text-white focus:ring-red-500/10 focus:border-red-500' : 'bg-white border-brand-100 text-slate-900 focus:ring-brand-500/10 focus:border-brand-500'}`} />
            
            {/* Clear Button */}
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className={`absolute inset-y-0 right-0 pr-4 flex items-center transition-colors ${darkMode ? 'text-slate-600 hover:text-slate-400' : 'text-slate-300 hover:text-slate-500'}`}>
                  <i className="ph-fill ph-x-circle text-xl"></i>
              </button>
            )}
        </div>
    </div>

    {/* Filters Row */}
    <div className="px-6 mb-8 flex gap-3 overflow-x-auto no-scrollbar fade-in-up fade-delay-1 pb-2">
        <button 
          onClick={() => setShowTopRated(!showTopRated)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-md active:scale-95 transition-all whitespace-nowrap ${
            showTopRated 
              ? darkMode ? 'bg-red-600 text-white shadow-red-500/20' : 'bg-brand-600 text-white shadow-brand-500/20'
              : darkMode ? 'bg-slate-800 border border-slate-700 text-slate-300 hover:border-red-500 hover:text-red-400' : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-200 hover:text-brand-600'
          }`}>
            <i className="ph-bold ph-star"></i>
            Top Rated
        </button>
    </div>

    {/* Main Content */}
    <main className="px-6 fade-in-up fade-delay-2">
        
        {/* Search Results */}
        {searchQuery || showTopRated ? (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {showTopRated ? 'Top Rated Contractors' : 'Search Results'}
                <span className={`font-normal ml-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>({filteredContractors.length})</span>
              </h3>
            </div>
            
            {filteredContractors.length === 0 ? (
              <div className={`rounded-3xl p-8 shadow-card border text-center ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                <i className={`ph-duotone ph-magnifying-glass text-4xl mb-2 ${darkMode ? 'text-slate-600' : 'text-slate-300'}`}></i>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>No contractors found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredContractors.map((contractor) => (
                  <div 
                    key={contractor.id}
                    onClick={() => router.push(`/contractor-details?id=${contractor.id}`)} 
                    className={`rounded-3xl p-4 shadow-soft border flex items-center space-x-4 active:scale-[0.98] transition-transform duration-200 cursor-pointer ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-xl">
                        {contractor.name.charAt(0)}
                      </div>
                      {contractor.tier === 'Gold' && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 rounded-full flex items-center justify-center">
                          <i className="ph-fill ph-crown text-white text-xs"></i>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className={`text-sm font-bold truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          {contractor.company_name || contractor.name}
                        </h3>
                        {contractor.total_ratings > 0 && (
                          <div className="flex items-center space-x-1">
                            <i className="ph-fill ph-star text-accent-500 text-xs"></i>
                            <span className={`text-xs font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{contractor.average_rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      <p className={`text-xs truncate ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {contractor.category} • {contractor.tier} • {contractor.experience_years} years exp.
                      </p>
                    </div>
                    <button className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-red-500/20 text-red-400' : 'bg-brand-50 text-brand-600'}`}>
                      <i className="ph-bold ph-caret-right"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            {/* Categories Quick Search */}
            <section className="mb-8">
              <h3 className={`text-sm font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Search by Category</h3>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => setSearchQuery('Building')} className={`flex items-center gap-2 px-4 py-3 border rounded-2xl shadow-sm text-sm font-medium active:scale-95 transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-red-500 hover:text-red-400' : 'bg-white border-slate-200 text-slate-700 hover:border-brand-200 hover:text-brand-600'}`}>
                  <i className={`ph-duotone ph-buildings text-lg ${darkMode ? 'text-red-400' : 'text-brand-500'}`}></i>
                  Building
                </button>
                <button onClick={() => setSearchQuery('Electrical')} className={`flex items-center gap-2 px-4 py-3 border rounded-2xl shadow-sm text-sm font-medium active:scale-95 transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-red-500 hover:text-red-400' : 'bg-white border-slate-200 text-slate-700 hover:border-brand-200 hover:text-brand-600'}`}>
                  <i className={`ph-duotone ph-lightning text-lg ${darkMode ? 'text-red-400' : 'text-accent-500'}`}></i>
                  Electrical
                </button>
                <button onClick={() => setSearchQuery('Plumbing')} className={`flex items-center gap-2 px-4 py-3 border rounded-2xl shadow-sm text-sm font-medium active:scale-95 transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-red-500 hover:text-red-400' : 'bg-white border-slate-200 text-slate-700 hover:border-brand-200 hover:text-brand-600'}`}>
                  <i className={`ph-duotone ph-drop text-lg ${darkMode ? 'text-red-400' : 'text-blue-500'}`}></i>
                  Plumbing
                </button>
                <button onClick={() => setSearchQuery('Road')} className={`flex items-center gap-2 px-4 py-3 border rounded-2xl shadow-sm text-sm font-medium active:scale-95 transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-red-500 hover:text-red-400' : 'bg-white border-slate-200 text-slate-700 hover:border-brand-200 hover:text-brand-600'}`}>
                  <i className={`ph-duotone ph-road-horizon text-lg ${darkMode ? 'text-red-400' : 'text-slate-500'}`}></i>
                  Road
                </button>
                <button onClick={() => setSearchQuery('Carpenter')} className={`flex items-center gap-2 px-4 py-3 border rounded-2xl shadow-sm text-sm font-medium active:scale-95 transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-red-500 hover:text-red-400' : 'bg-white border-slate-200 text-slate-700 hover:border-brand-200 hover:text-brand-600'}`}>
                  <i className={`ph-duotone ph-hammer text-lg ${darkMode ? 'text-red-400' : 'text-orange-500'}`}></i>
                  Carpenter
                </button>
                <button onClick={() => setSearchQuery('Car Repair')} className={`flex items-center gap-2 px-4 py-3 border rounded-2xl shadow-sm text-sm font-medium active:scale-95 transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-red-500 hover:text-red-400' : 'bg-white border-slate-200 text-slate-700 hover:border-brand-200 hover:text-brand-600'}`}>
                  <i className={`ph-duotone ph-car text-lg ${darkMode ? 'text-red-400' : 'text-purple-500'}`}></i>
                  Car Repair
                </button>
                <button onClick={() => setSearchQuery('IT')} className={`flex items-center gap-2 px-4 py-3 border rounded-2xl shadow-sm text-sm font-medium active:scale-95 transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-red-500 hover:text-red-400' : 'bg-white border-slate-200 text-slate-700 hover:border-brand-200 hover:text-brand-600'}`}>
                  <i className={`ph-duotone ph-laptop text-lg ${darkMode ? 'text-red-400' : 'text-green-500'}`}></i>
                  IT
                </button>
              </div>
            </section>
          </>
        )}

    </main>

    {/* Bottom Navigation */}
        </div>
      <BottomNav />
      </>
    );
}
