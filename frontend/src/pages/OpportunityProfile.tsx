import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { StudentOpenMatch } from '../components/student/StudentOpenMatch';
import { OpportunityRules } from './OpportunityRules';
import { OpportunityJudging } from './OpportunityJudging';
import { AIEligibility } from './AIEligibility';
import { JoinHackathonModal } from '../components/student/JoinHackathonModal';
import { getAuthToken } from '../lib/api/config';
// import axios from 'axios';

// Interfaces for type safety
interface Opportunity {
  opportunity_id: string;
  title: string;
  type: string;
  description: {
    text?: string;
    date?: string;
    endDate?: string;
    location?: string;
    prizes?: string[];
    requirements?: string[];
    judgingCriteria?: string[];
    rules?: string[];
    applicationLink?: string;
    maxParticipants?: string;
    registrationDeadline?: string;
    host?: string;
    image?: string;
    enrolled_teams_count?: number;
    hosted_by?: {
      name: string;
      type: string;
      profile_photo_url?: string;
    };
  };
  is_enrolled?: boolean;
}

export function OpportunityProfile() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'rooms' | 'rules' | 'judging' | 'eligibility_ai'>('overview');
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    const fetchOpportunity = async () => {
      if (!id) return;
      try {
        const token = getAuthToken();
        const response = await fetch(`http://localhost:8000/api/opportunities/${id}`, {
            method: 'GET',
            headers: token ? { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            } : {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            setOpportunity(data);
        } else {
            console.error("Failed to fetch opportunity:", response.statusText);
        }
      } catch (err) {
        console.error("Failed to fetch opportunity", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunity();
  }, [id]);

  // Listen for navigate-to-open-match event
  useEffect(() => {
    const handleNavigateToOpenMatch = () => {
      setActiveTab('rooms');
    };

    window.addEventListener('navigate-to-open-match', handleNavigateToOpenMatch);
    return () => window.removeEventListener('navigate-to-open-match', handleNavigateToOpenMatch);
  }, []);

  const handleTabClick = (tab: string) => {
    if (tab === 'submission' || tab === 'prizes') {
      setActiveTab('overview');
      setTimeout(() => {
        const element = document.getElementById(tab);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
    } else {
      setActiveTab(tab as any);
      setTimeout(() => {
        const navBar = document.querySelector('.nav-bar');
        if (navBar) {
          navBar.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 0);
    }
  };

  if (loading) {
      return (
          <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
      );
  }

  if (!opportunity) {
      return <div className="text-center py-20 text-xl font-bold text-slate-600">Event not found</div>;
  }

  const desc = opportunity.description || {};
  
  // Parse Prizes
  const prizes = opportunity.description.prizes || [];
  
  // Track which prizes are used in the main grid
  const usedPrizes = new Set<number>(); // Store indices
  
  // Helper to find prize by keyword
  const findPrizeIndex = (keywords: string[]) => {
      return prizes.findIndex((p, idx) => 
          !usedPrizes.has(idx) && keywords.some(k => p.toLowerCase().includes(k.toLowerCase()))
      );
  };

  // 1. Grand Prize (Winner - Yellow)
  let grandPrizeIdx = findPrizeIndex(["1st Place", "Grand Prize"]);
  if (grandPrizeIdx === -1 && prizes.length > 0 && !usedPrizes.has(0)) grandPrizeIdx = 0; // Fallback to first
  if (grandPrizeIdx !== -1) usedPrizes.add(grandPrizeIdx);
  const grandPrize = grandPrizeIdx !== -1 ? prizes[grandPrizeIdx] : "TBA";

  // 2. Runner Up (Second Place - Gray)
  let runnerUpIdx = findPrizeIndex(["2nd Place", "Runner Up"]);
  if (runnerUpIdx === -1 && prizes.length > 1 && !usedPrizes.has(1)) runnerUpIdx = 1; // Fallback to second
  if (runnerUpIdx !== -1) usedPrizes.add(runnerUpIdx);
  const runnerUp = runnerUpIdx !== -1 ? prizes[runnerUpIdx] : "";
  
  // 3. Third Card (Blue - 3rd Place OR Best UX)
  let thirdCardIdx = findPrizeIndex(["3rd Place"]);
  if (thirdCardIdx === -1) {
      // Try finding special categories if 3rd place not explicit
      thirdCardIdx = findPrizeIndex(["Best UX", "Innovation"]);
  }
  if (thirdCardIdx === -1 && prizes.length > 2 && !usedPrizes.has(2)) thirdCardIdx = 2; // Fallback to third
  if (thirdCardIdx !== -1) usedPrizes.add(thirdCardIdx);
  const bestUx = thirdCardIdx !== -1 ? prizes[thirdCardIdx] : ""; // Labelled as 'bestUx' for legacy, represents 3rd card

  // Collect Secondary Prizes (Everything else)
  const secondaryPrizes = prizes.filter((_, idx) => !usedPrizes.has(idx));

  const getPriceAmount = (p: string) => p.includes(':') ? p.split(':')[1].trim() : p;
  const getPriceTitle = (p: string) => p.includes(':') ? p.split(':')[0].trim() : "Winner";

  return (
    <div className="opportunity-profile">

      <div className="hero-wrapper">
        <div className="profile-container">
          {/* Hero Image */}
          <div className="hero-image-container">
            <div
              className="hero-image"
              style={{ backgroundImage: `url("${desc.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuBU55NNo_2EK95iIVEslKU2wLu3cOw5TYqftYx7zpHMqKUElWxw0eeWAKLU0cXzyo6deD9ulB-9ckAwuWAp9gs3LnFQGfcXMcW9FZLmyExjYCNwcf0niAU-LWQrvYNKmJOzwH4lGHK7WGvQ8a7deM2raiKN45vNxEkxIM0Ay0xPAi08-wHjkc4xDHls4FLGC3NrGjZlWZ3E2-En3kJ3yRy2l7ooA1FIHfe-elBuX8TSarJxY-vxwoRPcNg0D816EMZosPCtR11OklE"}")` }}
            ></div>
            <div className="hero-overlay"></div>
          </div>

          {/* Hero Content */}
          <div className="hero-content">
            <div className="hero-header">
              <div className="hero-logo-box">
                <div className="hero-logo-inner">
                  <span className="material-symbols-outlined" style={{ fontSize: '40px' }}>smart_toy</span>
                </div>
              </div>
              <div>
                <div className="hero-badges">
                  <span className="badge badge-primary">{opportunity.type.toUpperCase()}</span>
                  <span className="badge badge-green">Open for Registration</span>
                </div>
                <h2 className="hero-title">{opportunity.title}</h2>
                <div className="hero-meta">
                  <div className="meta-item">
                    <span className="material-symbols-outlined">calendar_today</span>
                    <span className="meta-text">{desc.date} {desc.endDate ? `- ${desc.endDate}` : ''}</span>
                  </div>
                  <div className="meta-item">
                    <span className="material-symbols-outlined">location_on</span>
                    <span className="meta-text">{desc.location || "Remote"}</span>
                  </div>
                </div>
              </div>
            </div>

            {opportunity.is_enrolled ? (
              <button 
                disabled
                style={{ minHeight: '64px', minWidth: '240px', padding: '0 40px', fontSize: '1.125rem' }}
                className="rounded-xl font-bold bg-slate-100 text-slate-400 cursor-not-allowed flex items-center justify-center gap-2"
              >
                Joined <span className="material-symbols-outlined text-slate-400">check_circle</span>
              </button>
            ) : (
              <button 
                onClick={() => setShowJoinModal(true)}
                className="cta-button"
              >
                Join <span className="material-symbols-outlined">rocket_launch</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Nav */}
      <div className="nav-bar">
        <div className="profile-container" style={{ padding: '0 1.5rem' }}>
          <div className="nav-scroll no-scrollbar">
            <button
              className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => handleTabClick('overview')}
              style={{ background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer' }}
            >
              Overview
            </button>
            <button
              className="nav-link"
              onClick={() => handleTabClick('submission')}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Submission
            </button>
            <button
              className="nav-link"
              onClick={() => handleTabClick('prizes')}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Prizes
            </button>
            <button
              className={`nav-link ${activeTab === 'rules' ? 'active' : ''}`}
              onClick={() => handleTabClick('rules')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', borderBottom: activeTab === 'rules' ? '2px solid var(--primary)' : '2px solid transparent' }}
            >
              Rules
            </button>
            <button
              className={`nav-link ${activeTab === 'judging' ? 'active' : ''}`}
              onClick={() => handleTabClick('judging')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', borderBottom: activeTab === 'judging' ? '2px solid var(--primary)' : '2px solid transparent' }}
            >
              Judging
            </button>
            <button
              className={`nav-link ${activeTab === 'rooms' ? 'active' : ''}`}
              onClick={() => handleTabClick('rooms')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', borderBottom: activeTab === 'rooms' ? '2px solid var(--primary)' : '2px solid transparent' }}
            >
              Open Match Rooms
              <span style={{ display: 'flex', width: '8px', height: '8px', backgroundColor: '#22c55e', borderRadius: '50%', marginLeft: '4px' }}></span>
            </button>
            <button
              className="nav-link"
              onClick={() => handleTabClick('eligibility_ai')}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>auto_awesome</span> Eligibility AI
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      {activeTab === 'overview' && (
        <div className="content-grid">
          {/* Left Column (Main) */}
          <div className="main-column">

            <section id="overview" className="section-card">
              <h3 className="section-title">
                <span className="material-symbols-outlined text-primary" style={{ color: 'var(--primary)' }}>description</span> Overview
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h4 className="card-subtitle">The Challenge</h4>
                  <p className="card-text">
                    {desc.text || "No description provided."}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', paddingTop: '1rem' }}>
                  {/* Dynamically hide Categories if needed, for now keeping static structure or mock */}
                  <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #f1f5f9' }}>
                    <h4 className="font-bold mb-4 flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--primary)' }}>category</span> Categories
                    </h4>
                    <ul className="info-list">
                       {/* Mock categories for now as they aren't in schema properly yet besides tags */}
                      <li className="info-item"><span className="dot"></span> Smart Energy Grids</li>
                      <li className="info-item"><span className="dot"></span> Carbon Footprint Tracking</li>
                      <li className="info-item"><span className="dot"></span> Circular Economy AI</li>
                    </ul>
                  </div>

                  <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #f1f5f9' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#ea580c' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>construction</span> Requirements
                    </h4>
                    <div className="requirements-box">
                      {desc.requirements && desc.requirements.length > 0 ? (
                          desc.requirements.map((req, i) => (
                             <p key={i} className="req-desc" style={{marginBottom: '0.5rem'}}>• {req}</p>
                          ))
                      ) : (
                          <p className="req-desc">No specific requirements listed.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Prize Distribution */}
            <section id="prizes" className="section-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 className="section-title" style={{ marginBottom: 0 }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>emoji_events</span> Prize Distribution
                </h3>
                {/* Dynamically calc total pool if possible, or hide */}
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Prize Pool</span>
              </div>

              <div className="prizes-grid">
                {grandPrize && (
                    <div className="prize-card prize-yellow">
                    <div className="prize-icon-circle prize-icon-yellow">
                        <span className="material-symbols-outlined">workspace_premium</span>
                    </div>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{getPriceAmount(grandPrize)}</h4>
                    <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#ca8a04', marginBottom: '0.5rem' }}>{getPriceTitle(grandPrize).replace(/1st Place/i, 'Grand Prize')}</p>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Winner</p>
                    </div>
                )}

                {runnerUp && (
                    <div className="prize-card prize-slate">
                    <div className="prize-icon-circle prize-icon-slate">
                        <span className="material-symbols-outlined">award_star</span>
                    </div>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{getPriceAmount(runnerUp)}</h4>
                    <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#64748b', marginBottom: '0.5rem' }}>{getPriceTitle(runnerUp).replace(/2nd Place/i, 'Runner Up')}</p>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Second Place</p>
                    </div>
                )}

                {bestUx && (
                    <div className="prize-card prize-blue">
                    <div className="prize-icon-circle prize-icon-blue">
                        <span className="material-symbols-outlined">featured_video</span>
                    </div>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{getPriceAmount(bestUx)}</h4>
                    <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '0.5rem' }}>{getPriceTitle(bestUx)}</p>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Third Place / Special</p>
                    </div>
                )}
              </div>

              {/* Secondary Prizes */}
              {secondaryPrizes.length > 0 && (
                  <div className="secondary-prizes-grid">
                    {secondaryPrizes.map((prize, i) => (
                        <div key={i} className="prize-card-small">
                            <div className="prize-icon-small">
                                <span className="material-symbols-outlined" style={{ color: '#2563eb' }}>card_giftcard</span>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#64748b' }}>{getPriceTitle(prize)}</p>
                                <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#0f172a' }}>{getPriceAmount(prize)}</p>
                            </div>
                        </div>
                    ))}
                  </div>
              )}
            </section>

            <section id="submission" className="section-card">
              <h3 className="section-title">
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>upload_file</span> Rules & Submission
              </h3>
              <div className="submission-grid">
                 {desc.rules && desc.rules.length > 0 ? (
                     desc.rules.map((rule, i) => (
                        <div key={i} className="sub-card">
                            <span className="material-symbols-outlined" style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>gavel</span>
                            <h4 style={{ fontWeight: 'bold', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Rule {i+1}</h4>
                            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{rule}</p>
                        </div>
                     ))
                 ) : (
                    <div className="sub-card">
                        <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Standard Submission Rules Apply.</p>
                    </div>
                 )}
              </div>
            </section>

            <div className="bottom-grid">
              {/* Eligibility Section (Moved to Bottom Grid) */}
              <section id="compatibility" className="section-card">
                <h3 className="section-title" style={{ fontSize: '1.25rem' }}>Eligibility</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--primary)', padding: '0.5rem', backgroundColor: 'rgba(59,130,246,0.1)', borderRadius: '0.5rem' }}>person_search</span>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Max Team Size</p>
                      <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{desc.maxParticipants || "Unlimited"} members per team.</p>
                    </div>
                  </div>
                </div>

                <div className="eligibility-check group">
                  <div style={{ position: 'relative', zIndex: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span className="material-symbols-outlined animate-pulse" style={{ fontSize: '1.125rem' }}>auto_awesome</span>
                      <span style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>Vertex AI Engine</span>
                    </div>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', lineHeight: 1.25, marginBottom: '0.5rem' }}>AI Eligibility Check</h4>
                    <p style={{ fontSize: '0.75rem', opacity: 0.9, marginBottom: '1rem' }}>Analyze your GitHub profile and skills against this event's requirements with AI.</p>
                    <button className="eligibility-btn">
                      Verify Qualifications <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>arrow_forward</span>
                    </button>
                  </div>
                  <span className="material-symbols-outlined" style={{ position: 'absolute', bottom: '-1rem', right: '-1rem', fontSize: '6rem', opacity: 0.1, transform: 'rotate(0deg)', transition: 'transform 0.5s' }}>psychology</span>
                </div>
              </section>

              {/* Schedule Section (Moved to Bottom Grid) */}
              <div className="section-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <h3 className="section-title" style={{ fontSize: '1.25rem', marginBottom: 0 }}>Schedule</h3>
                  <a href="#" style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)', textDecoration: 'none' }}>Full calendar</a>
                </div>

                <div className="schedule-list">
                  <div className="schedule-item">
                    <div className="schedule-dot dot-primary"></div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)' }}>Registration Ends</p>
                    <p style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>{desc.registrationDeadline || "TBA"}</p>
                  </div>
                  <div className="schedule-item">
                    <div className="schedule-dot dot-slate"></div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8' }}>Event Period</p>
                    <p style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>{desc.date || "TBA"}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Sidebar) */}
          <div className="sidebar-column">

            {/* Event Details Widget */}
            <div className="details-card">
              <h4 className="details-title">Event Details</h4>
              <div className="details-list">
                <div className="details-item">
                  <div className="details-label">
                    <span className="material-symbols-outlined details-icon">payments</span>
                    <span>Top Prize</span>
                  </div>
                  <span className="details-val" style={{ color: 'var(--primary)' }}>{getPriceAmount(grandPrize)}</span>
                </div>
                <div className="details-item">
                  <div className="details-label">
                    <span className="material-symbols-outlined details-icon">public</span>
                    <span>Location</span>
                  </div>
                  <span className="details-val">{desc.location || "Remote"}</span>
                </div>
                <div className="details-item">
                  <div className="details-label">
                    <span className="material-symbols-outlined details-icon">lock_open</span>
                    <span>Visibility</span>
                  </div>
                  <span className="details-val">Public</span>
                </div>
                <div className="details-item">
                  <div className="details-label">
                    <span className="material-symbols-outlined details-icon">groups</span>
                    <span>Max Size</span>
                  </div>
                  <span className="details-val">{desc.maxParticipants || "Unlimited"}</span>
                </div>
                <div className="details-item">
                  <div className="details-label">
                    <span className="material-symbols-outlined details-icon">group_add</span>
                    <span>Enrolled Teams</span>
                  </div>
                  <span className="details-val" style={{ color: '#10b981', fontWeight: 'bold' }}>
                    {desc.enrolled_teams_count || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Hosted By */}
            <div className="section-card">
              <h4 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '1rem' }}>Hosted By</h4>
              <div className="host-card">
                <div className="host-img-box">
                  <div 
                    className="host-img" 
                    style={{ 
                      backgroundImage: desc.hosted_by?.profile_photo_url 
                        ? `url("${desc.hosted_by.profile_photo_url}")` 
                        : `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAwi2bPE1U55tlZMUGpuLPWo39dq6jDPh_2WKZ0gJxeSeNPsMJBhnm6ZrV5Y4LMeS0tEv9_l8gq7H3fty3sW19IeiZ4l6ab01Gwq0TsBe49m5r7c2j7vd2uPPZU3h4PtLRFptsB2dqOdVHXdhi8LAjyg8OV-3OT1UCkHBrSARkw3ThlxoyAnODnaAtiszeigPzDiIvlKdHN3u-MU8sTuGtbRPb2g6rWy4YIX5NBjEMpNwXm5iqlLsiFrgA2IoBw93hK2olnQE6TZ3Q")`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  ></div>
                </div>
                <div>
                  <p style={{ fontWeight: 'bold', fontSize: '0.875rem', lineHeight: 1.25 }}>
                    {desc.hosted_by?.name || desc.host || "Unknown Host"}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {desc.hosted_by?.type || "Organization"}
                  </p>
                </div>
              </div>
              <button className="view-profile-btn">View Profile</button>
            </div>

            {/* Match Rooms */}
            <div className="section-card" id="rooms">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h4 style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>Match Rooms</h4>
                <span style={{ fontSize: '10px', padding: '0.125rem 0.5rem', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '9999px', fontWeight: 'bold', textTransform: 'uppercase' }}>Active</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>Find teammates in real-time chat rooms.</p>

              <div className="room-card group">
                <div className="room-header">
                  <h5 style={{ fontSize: '0.875rem', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>#general</h5>
                  <span className="material-symbols-outlined" style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>sensors</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div className="avatars">
                     {/* Mock avatars */}
                    <div className="avatar" style={{ backgroundColor: '#ccc' }}></div>
                    <div className="avatar" style={{ backgroundColor: '#999' }}></div>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)' }}>Enter</span>
                </div>
              </div>

              <button
                style={{ width: '100%', marginTop: '1rem', padding: '0.75rem', borderRadius: '0.75rem', color: 'white', fontSize: '0.875rem', fontWeight: 'bold', backgroundColor: 'var(--primary)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)' }}
                onClick={() => setActiveTab('rooms')}
              >
                View All Rooms
              </button>
            </div>

          </div>
        </div>
      )}

      {activeTab === 'rooms' && <StudentOpenMatch opportunityId={id!} />}
      {activeTab === 'rules' && <OpportunityRules rules={desc.rules} />}
      {activeTab === 'judging' && <OpportunityJudging criteria={desc.judgingCriteria} />}
      {activeTab === 'eligibility_ai' && <AIEligibility />}

      {/* Join Modal */}
      {showJoinModal && (
        <JoinHackathonModal
          opportunityId={id!}
          opportunityTitle={opportunity.title}
          maxParticipants={desc.maxParticipants}
          onClose={() => setShowJoinModal(false)}
          onSuccess={() => {
            setShowJoinModal(false);
            window.location.reload(); // Reload to refresh state and show "Joined" button
          }}
        />
      )}
    </div>
  );
}
