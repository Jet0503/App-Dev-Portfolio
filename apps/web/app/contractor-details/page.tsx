'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import BottomNav from '@/app/components/BottomNav';

type Rating = {
  id: number;
  rating: number;
  comment: string;
  user_name: string;
  created_at: string;
};

function ContractorDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [contractor, setContractor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const [newRating, setNewRating] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    // Check if user has a profile
    const userProfile = localStorage.getItem('userProfile');
    if (!userProfile) {
      setShowProfilePrompt(true);
      setLoading(false);
      return;
    }

    const fetchContractor = async () => {
      if (!id) {
        setError('No contractor ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contractors/${id}`);
        const data = await response.json();
        if (data.success) {
          setContractor(data.contractor);
        } else {
          setError(data.error || 'Contractor not found');
        }
      } catch (err) {
        setError('Failed to load contractor details');
      } finally {
        setLoading(false);
      }
    };

    const fetchRatings = async () => {
      if (!id) return;
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ratings?contractor_id=${id}`);
        const data = await response.json();
        
        if (data.success) {
          setRatings(data.ratings);
        }
      } catch (error) {
        console.error('Error fetching ratings:', error);
      }
    };

    fetchContractor();
    fetchRatings();
  }, [id]);

  const submitRating = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractor_id: id,
          user_id: null, // Guest user
          rating: newRating.rating,
          comment: newRating.comment
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setShowRatingModal(false);
        setNewRating({ rating: 5, comment: '' });
        // Refresh ratings and contractor data
        const ratingsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ratings?contractor_id=${id}`);
        const ratingsData = await ratingsResponse.json();
        if (ratingsData.success) {
          setRatings(ratingsData.ratings);
        }
        
        const contractorResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contractors/${id}`);
        const contractorData = await contractorResponse.json();
        if (contractorData.success) {
          setContractor(contractorData.contractor);
        }
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

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

  // Profile creation prompt
  if (showProfilePrompt) {
    return (
      <>
        <div className="bg-canvas text-slate-800 antialiased pt-[55px] pb-32 min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-50 flex items-center justify-center">
              <i className="ph ph-user-plus text-4xl text-brand-600"></i>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Create Your Profile</h2>
            <p className="text-slate-600 mb-8">You need to create a user profile before you can view contractor details and leave ratings.</p>
            <button 
              onClick={() => router.push('/profile')}
              className="w-full bg-brand-600 text-white py-4 rounded-2xl font-semibold hover:bg-brand-700 transition-colors mb-3"
            >
              Create Profile
            </button>
            <button 
              onClick={() => router.push('/')}
              className="w-full bg-white text-slate-900 py-4 rounded-2xl font-semibold border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
        <BottomNav />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <div className="bg-canvas text-slate-800 antialiased pt-[55px] pb-32 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mb-4"></div>
            <p className="text-slate-500">Loading contractor details...</p>
          </div>
        </div>
        <BottomNav />
      </>
    );
  }

  if (error || !contractor) {
    return (
      <>
        <div className="bg-canvas text-slate-800 antialiased pt-[55px] pb-32">
          <header className="px-6 mb-6 flex items-center justify-between fade-in-up sticky top-0 z-40 py-2 bg-canvas/80 backdrop-blur-sm">
            <button onClick={() => router.push('/')} className="w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center text-slate-600 hover:text-brand-600 transition-colors">
              <i className="ph ph-caret-left text-xl"></i>
            </button>
            <h1 className="text-xl font-bold text-slate-900">Error</h1>
            <div className="w-10"></div>
          </header>
          <div className="px-6 text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <i className="ph ph-warning text-3xl text-red-500"></i>
            </div>
            <p className="text-slate-600 font-medium mb-4">{error || 'Contractor not found'}</p>
            <button onClick={() => router.push('/')} className="px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors">
              Go to Home
            </button>
          </div>
        </div>
        <BottomNav />
      </>
    );
  }

    return (
      <>
        <div className="bg-canvas text-slate-800 antialiased pt-[55px] pb-32">
          {/* 
      AESTHETIC DNA:
      Matched to Previous Screens
    */}

    {/* Header */}
    <header className="px-6 mb-2 flex items-center justify-between fade-in-up sticky top-0 z-40 py-2 bg-canvas/80 backdrop-blur-sm">
        <button onClick={() => router.push(`/contractor-categories?category=${contractor.category}`)} className="w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center text-slate-600 hover:text-brand-600 transition-colors">
            <i className="ph ph-caret-left text-xl"></i>
        </button>
        <h1 className="text-xl font-bold text-slate-900">Contractor Profile</h1>
        <button className="w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center text-slate-600 hover:text-brand-600 transition-colors">
            <i className="ph ph-heart text-xl"></i>
        </button>
    </header>

    <main className="px-6">

        {/* Profile Hero Card */}
        <section className="bg-white rounded-[2rem] p-6 shadow-soft mb-6 relative overflow-hidden fade-in-up fade-delay-1">
            {/* Tier Badge (Floating) */}
            <div className={`absolute top-6 right-6 flex items-center gap-1 px-3 py-1 rounded-full border ${getTierColor(contractor.tier)}`}>
                <i className="ph-fill ph-crown text-sm"></i>
                <span className="text-xs font-bold uppercase tracking-wide">{contractor.tier} Tier</span>
            </div>

            <div className="flex flex-col items-center text-center">
                {/* Avatar with Status Dot */}
                <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center shadow-lg">
                        <i className="ph-bold ph-user text-5xl text-slate-400"></i>
                    </div>
                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-brand-600 border-2 border-white rounded-full flex items-center justify-center">
                        <i className="ph-bold ph-check text-white text-[10px]"></i>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-1">{contractor.name}</h2>
                <p className="text-slate-500 text-sm mb-4">{contractor.category} • {contractor.location}</p>

                {/* Key Stats */}
                <div className="flex items-center justify-center gap-8 w-full mb-2">
                  {contractor.experience_years && (
                    <div className="px-4">
                        <div className="text-slate-900 font-bold text-lg">{contractor.experience_years} yrs</div>
                        <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Experience</div>
                    </div>
                  )}
                  <div className="px-4 border-l border-slate-200">
                      <div className="flex items-center gap-1 justify-center mb-1">
                        <span className="text-slate-900 font-bold text-lg">{contractor.average_rating || '0.0'}</span>
                        <i className="ph-fill ph-star text-amber-400 text-sm"></i>
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                        {contractor.total_ratings || 0} {contractor.total_ratings === 1 ? 'Rating' : 'Ratings'}
                      </div>
                  </div>
                </div>
            </div>
        </section>

        {/* Contact & Bio */}
        <section className="grid grid-cols-1 gap-4 mb-6 fade-in-up fade-delay-2">
            {/* Contact Card */}
            <div className="bg-brand-900 rounded-3xl p-5 shadow-lg text-white relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-500/20 rounded-full blur-xl"></div>
                
                <h3 className="text-brand-100 text-xs font-medium mb-3">Contact Information</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <i className="ph ph-phone text-lg"></i>
                    <a href={`tel:${contractor.phone}`} className="text-sm">{contractor.phone}</a>
                  </div>
                  {contractor.email && (
                    <div className="flex items-center gap-2">
                      <i className="ph ph-envelope text-lg"></i>
                      <a href={`mailto:${contractor.email}`} className="text-sm">{contractor.email}</a>
                    </div>
                  )}
                </div>
            </div>

            {/* Certification Document */}
            {contractor.document_url && (
              <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <i className="ph ph-certificate text-lg text-brand-600"></i>
                    Certification/License
                  </h3>
                  <div className="mt-4">
                    {contractor.document_url.match(/\\.(jpg|jpeg|png|gif)$/i) ? (
                      // Image preview
                      <div className="relative">
                        <img 
                          src={contractor.document_url} 
                          alt="Contractor certification" 
                          className="w-full rounded-xl border border-slate-200"
                        />
                        <a 
                          href={contractor.document_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="absolute top-2 right-2 bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
                        >
                          <i className="ph ph-arrow-square-out text-lg text-slate-600"></i>
                        </a>
                      </div>
                    ) : (
                      // PDF or other document link
                      <a 
                        href={contractor.document_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-slate-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center">
                            <i className="ph ph-file-pdf text-xl text-brand-600"></i>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">View Document</p>
                            <p className="text-xs text-slate-500">Certification/License</p>
                          </div>
                        </div>
                        <i className="ph ph-arrow-square-out text-lg text-slate-400"></i>
                      </a>
                    )}
                  </div>
              </div>
            )}
        </section>

        {/* Ratings Section */}
        <section className="mb-6 fade-in-up fade-delay-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Customer Ratings</h3>
            <button 
              onClick={() => setShowRatingModal(true)}
              className="px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors flex items-center gap-2"
            >
              <i className="ph ph-star text-sm"></i>
              Rate
            </button>
          </div>

          {ratings.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 shadow-card border border-slate-100 text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
                <i className="ph ph-star text-3xl text-slate-400"></i>
              </div>
              <p className="text-slate-600 font-medium mb-1">No ratings yet</p>
              <p className="text-sm text-slate-400">Be the first to rate this contractor!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {ratings.map((rating) => (
                <div key={rating.id} className="bg-white rounded-2xl p-4 shadow-card border border-slate-100">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{rating.user_name || 'Anonymous'}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(rating.created_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <i 
                          key={i} 
                          className={`ph-fill ph-star text-sm ${i < rating.rating ? 'text-amber-400' : 'text-slate-200'}`}
                        ></i>
                      ))}
                    </div>
                  </div>
                  {rating.comment && (
                    <p className="text-sm text-slate-600 mt-2">{rating.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

    </main>

    {/* Floating Action Buttons (Sticky above nav) */}
    <div className="fixed bottom-28 left-6 right-6 z-40 flex gap-3 fade-in-up fade-delay-3">
        <a href={`tel:${contractor.phone}`} className="flex-1 bg-white text-slate-900 font-bold py-4 rounded-2xl shadow-float border border-slate-100 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
            <i className="ph-bold ph-phone text-lg"></i>
            Call
        </a>
        {contractor.email && (
          <a href={`mailto:${contractor.email}`} className="flex-[2] bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-float flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
              Send Email
              <i className="ph-bold ph-envelope"></i>
          </a>
        )}
    </div>

    {/* Rating Modal */}
    {showRatingModal && (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end justify-center p-6">
        <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Rate Contractor</h3>
            <button 
              onClick={() => setShowRatingModal(false)}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <i className="ph ph-x text-lg text-slate-600"></i>
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">Your Rating</label>
            <div className="flex items-center justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setNewRating({ ...newRating, rating: star })}
                  className="transition-transform hover:scale-110 active:scale-95"
                >
                  <i 
                    className={`ph-fill ph-star text-4xl ${star <= newRating.rating ? 'text-amber-400' : 'text-slate-200'}`}
                  ></i>
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-slate-500">
              {newRating.rating === 5 ? 'Excellent!' : 
               newRating.rating === 4 ? 'Very Good' : 
               newRating.rating === 3 ? 'Good' : 
               newRating.rating === 2 ? 'Fair' : 'Poor'}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Comment (optional)</label>
            <textarea
              value={newRating.comment}
              onChange={(e) => setNewRating({ ...newRating, comment: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="Share your experience..."
            ></textarea>
          </div>

          <button
            onClick={submitRating}
            className="w-full bg-brand-600 text-white py-4 rounded-xl font-semibold hover:bg-brand-700 transition-colors"
          >
            Submit Rating
          </button>
        </div>
      </div>
    )}

    {/* Bottom Navigation */}
        </div>
      <BottomNav />
      </>
    );
}

export default function ContractorDetailsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    }>
      <ContractorDetailsContent />
    </Suspense>
  );
}
