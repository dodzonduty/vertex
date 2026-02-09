import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import './Opportunities.css';
import { getOpportunitiesList, getTags, getTrending, getPerfectMatch, getVertexConnect } from '../lib/api/opportunities';
import { askAI } from '../lib/api/ai';

export const Opportunities: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'hackathons' | 'sponsorships'>('hackathons');
  const [tags, setTags] = useState<string[]>([]);
  const [activeTag, setActiveTag] = useState<string>('#All');

  const [activeTags, setActiveTags] = useState<string[]>(['#All']); // Multi-select state

  const [trendingTags, setTrendingTags] = useState<{ tag: string, count: number }[]>([]);
  const [perfectMatches, setPerfectMatches] = useState<{ title: string, match: string, tech: string }[]>([]);
  const [networkData, setNetworkData] = useState<{ context: string, avatars: string[], more_count: number }[]>([]);

  // New state for Listings
  const [oppList, setOppList] = useState<any[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('Most Recent');

  // AI State
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<any | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Fetch all widget data when activeTab changes
  React.useEffect(() => {
    // 1. Tags
    getTags(activeTab)
      .then(data => {
        if (data.tags) {
          setTags(data.tags);
          if (activeTag === '#All') setActiveTag(data.tags[0]);
        }
      })
      .catch(err => {
        console.error("Failed to fetch tags", err);
        setTags(['#All', '#AI_Safety', '#Frontend', '#Web3', '#Sustainability']);
      });

    // 2. Trending
    getTrending(activeTab)
      .then(data => setTrendingTags(data))
      .catch(err => {
        console.error("Failed to fetch trending", err);
        setTrendingTags([
          { tag: '#AI_Safety', count: 24 },
          { tag: '#Web3_Gaming', count: 18 },
          { tag: '#Neurotech', count: 8 }
        ]);
      });

    // 3. Perfect Match
    getPerfectMatch(activeTab)
      .then(data => setPerfectMatches(data))
      .catch(err => {
        console.error("Failed to fetch perfect matches", err);
        setPerfectMatches([
          { title: 'Neural Dev Summit', match: '98%', tech: 'AI/ML' },
          { title: 'Web3 Frontier Hack', match: '92%', tech: 'Solidity' },
          { title: 'Privacy Shield Grant', match: '85%', tech: 'Research' },
        ]);
      });

    // 4. Vertex Connect
    getVertexConnect(activeTab)
      .then(data => setNetworkData(data))
      .catch(err => {
        console.error("Failed to fetch vertex connect", err);
        setNetworkData([
          {
            context: "3 Stanford Alumni attending",
            avatars: [
              "https://lh3.googleusercontent.com/aida-public/AB6AXuCLIp0CIanjTtvkxnyAXdaEozBHpAQHExEEx64XXLNm5_a8vX1Jq4FROlTxUjfTU7_DfcJVXzcxIPqI8QWg3aiqPxsfpDywiM4-xztZzL1bl1vDbYuMLSFx8Dtm7z1bzXL-JTDJyoJybgPXWS8IDs3rqa3sr9-YDgJEnPraB-FGQpcwXBTj6awOxOBbp1bfbFFDcIGVafaWIiJVSPw8xfPupvatbR7mu76CQgSr9JyUonggUOyh-8px8lUrE9kVRCmm4wn2bJAfHyA",
              "https://lh3.googleusercontent.com/aida-public/AB6AXuDBvcqg_z4t5DtImBaF4zDg1paUIXivAjiu0n3bTJpS__wzsQQ8fTjIo5ThuSuTP1puePPfX3W8klgrWopzhwEuo_F-oqNhM-JTwb2UpbOuAUZhtfHZU26mz6tmlCXzTuuDeOEarNRaPPirtfDkzynNPlwErvz5kBvcSfmS3tyGP4nPDxAzdgKIBxLw9YTfzizh4yxi8o76B2l7D0R1Vd8_EZpU5bgTojtkWTtdlExRh-dg2RJ0Ocasmg4phBDl3HFl3k4nK3k3bPk"
            ],
            more_count: 1
          },
          {
            context: "5 Connections interested",
            avatars: [
              "https://lh3.googleusercontent.com/aida-public/AB6AXuAp8YPsSejPInMICvOmgu4F2_EVDQxpbvygjd6wuuOZ7a8D8DtJ9o6s8p9yfaIbEgewA-9EK089KOU2hW_qdUm7zLUBx0C3q4aJoy0BIO6UdTA7RpQh8DVt1DC_zcIZRmjX_eTn-t0OTJVetB8Wf8hyUehicsGiajLA-14XsLVJWMV1Gx_CKvaF6kYW5vCwVLHu_35XtKFy4YbD4gRXAX8BDh8ioh4SCzTaO_6i_BqxIEfAAEogZSJkXccXbX2PxrLuj8TVfwIIS-A"
            ],
            more_count: 4
          }
        ]);
      });
  }, [activeTab]);


  // Separate effect for the list to include activeTags dependency
  React.useEffect(() => {
    getOpportunitiesList(activeTab, activeTags)
      .then(data => {
        if (data.results) {
          setOppList(data.results);
          setTotalResults(data.count);
        } else {
          throw new Error("No results found");
        }
      })
      .catch(err => {
        console.error("Failed to fetch opportunities list, using fallback", err);
        // Fallback Data
        const fallbackHackathons = [
          {
            id: "h1",
            title: "Global AI Hack 2026",
            host: "AI Nexus Foundation",
            badges: [{ text: "Recommended", style: "blue-solid" }, { text: "Hackathon", style: "blue-soft" }],
            summary: "Build the next generation of autonomous agents in this 48-hour global challenge.",
            date: "Oct 12-14, 2026",
            price: "$10,000 Prize",
            location: "Remote",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQWjvyaaToRihbJ_vk23_-pbgti7yXe_itSyT5IuWwTW7luvIYPkAXx0uWXmU8YGmIxUSyQyMDWPoFd9WU5R5WkE-D-OzFGOvZqBn53B9Qnzlrdgb9dor5o6tXMiSxNw-J6tCnQDGmEycAGGQwK48B-PyhKJn60UoLIy8jx0-IdcMfjqpR17JGHbzocYwsMJ8nfrPWF44hSTwvcfZCRxMkWLopysgLqp3SiJp_WgVkFMQehQgzeB6kqmONX5tLJESi0mdrYNMr7NA"
          },
          {
            id: "h2",
            title: "GreenTech Sprint",
            host: "EcoInnovate",
            badges: [{ text: "Hackathon", style: "amber-soft" }, { text: "#Sustainability", style: "gray-soft" }],
            summary: "Accelerating sustainable solutions through rapid prototyping and deep tech.",
            date: "Dec 01-05, 2026",
            price: "$7,500 Prize",
            location: "Hybrid • London",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLIp0CIanjTtvkxnyAXdaEozBHpAQHExEEx64XXLNm5_a8vX1Jq4FROlTxUjfTU7_DfcJVXzcxIPqI8QWg3aiqPxsfpDywiM4-xztZzL1bl1vDbYuMLSFx8Dtm7z1bzXL-JTDJyoJybgPXWS8IDs3rqa3sr9-YDgJEnPraB-FGQpcwXBTj6awOxOBbp1bfbFFDcIGVafaWIiJVSPw8xfPupvatbR7mu76CQgSr9JyUonggUOyh-8px8lUrE9kVRCmm4wn2bJAfHyA"
          }
        ];

        const fallbackSponsorships = [
          {
            id: "s1",
            title: "Future Finance Fellowship",
            host: "Global Bank Corp",
            badges: [{ text: "Fellowship", style: "purple-solid" }, { text: "Finance", style: "amber-soft" }],
            summary: "A 6-month fellowship for students interested in the intersection of AI and Finance.",
            date: "Apply by Nov 15",
            price: "$5,000 Grant",
            location: "New York",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBvcqg_z4t5DtImBaF4zDg1paUIXivAjiu0n3bTJpS__wzsQQ8fTjIo5ThuSuTP1puePPfX3W8klgrWopzhwEuo_F-oqNhM-JTwb2UpbOuAUZhtfHZU26mz6tmlCXzTuuDeOEarNRaPPirtfDkzynNPlwErvz5kBvcSfmS3tyGP4nPDxAzdgKIBxLw9YTfzizh4yxi8o76B2l7D0R1Vd8_EZpU5bgTojtkWTtdlExRh-dg2RJ0Ocasmg4phBDl3HFl3k4nK3k3bPk"
          },
          {
            id: "s2",
            title: "Open Source Grant",
            host: "Linux Foundation",
            badges: [{ text: "Grant", "style": "emerald-solid" }, { text: "Open Source", "style": "blue-soft" }],
            summary: "Supporting developers who are building critical open source infrastructure.",
            date: "Rolling Basis",
            price: "$2,000/mo",
            location: "Remote",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQWjvyaaToRihbJ_vk23_-pbgti7yXe_itSyT5IuWwTW7luvIYPkAXx0uWXmU8YGmIxUSyQyMDWPoFd9WU5R5WkE-D-OzFGOvZqBn53B9Qnzlrdgb9dor5o6tXMiSxNw-J6tCnQDGmEycAGGQwK48B-PyhKJn60UoLIy8jx0-IdcMfjqpR17JGHbzocYwsMJ8nfrPWF44hSTwvcfZCRxMkWLopysgLqp3SiJp_WgVkFMQehQgzeB6kqmONX5tLJESi0mdrYNMr7NA"
          }
        ];

        const data = activeTab === 'hackathons' ? fallbackHackathons : fallbackSponsorships;
        setOppList(data);
        setTotalResults(128);
      });
  }, [activeTab, activeTags]);

  const getSortedOppList = () => {
    return [...oppList].sort((a, b) => {
      if (!a || !b) return 0;
      if (sortBy === 'Prize Pool') {
        const getPrice = (p: any) => {
          if (typeof p !== 'string') return 0;
          return parseInt(p.replace(/[^0-9]/g, '')) || 0;
        };
        return getPrice(b.price) - getPrice(a.price);
      }
      if (sortBy === 'Deadline') {
        const dateA = a.date || '';
        const dateB = b.date || '';
        return dateA.localeCompare(dateB);
      }
      const idA = String(a.id || '');
      const idB = String(b.id || '');
      return idB.localeCompare(idA);
    });
  };

  const sortedList = getSortedOppList();

  const toggleTag = (tag: string) => {
    if (tag === '#All') {
      setActiveTags(['#All']);
      return;
    }

    let newTags = [...activeTags];
    if (newTags.includes('#All')) newTags = [];

    if (newTags.includes(tag)) {
      newTags = newTags.filter(t => t !== tag);
    } else {
      newTags.push(tag);
    }

    if (newTags.length === 0) newTags = ['#All'];
    setActiveTags(newTags);
  };

  // ... scrollTags and other functions ...




  const handleTrendingClick = (tag: string) => {
    // 1. Add to tags list if not present
    if (!tags.includes(tag)) {
      setTags(prev => {
        const newTags = [...prev];
        const allIndex = newTags.indexOf('#All');
        // Insert after #All if it exists, otherwise at start
        if (allIndex !== -1) {
          newTags.splice(allIndex + 1, 0, tag);
        } else {
          newTags.unshift(tag);
        }
        return newTags;
      });
    }

    // 2. Set as active (clearing #All or others to focus on this trend)
    setActiveTags([tag]);

    // 3. Scroll to start to show the new tag? 
    const container = document.getElementById('tags-container');
    if (container) container.scrollTo({ left: 0, behavior: 'smooth' });
  };

  const scrollTags = (direction: 'left' | 'right') => {
    const container = document.getElementById('tags-container');
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleAskAI = async () => {
    if (!aiQuery.trim()) return;

    setIsAiLoading(true);
    try {
      const response = await askAI(aiQuery, `User is looking at high-impact ${activeTab}.`);
      setAiResponse(response);
    } catch (err) {
      console.error("AI Error:", err);
      // Fallback message
      setAiResponse({
        answer: "I'm sorry, I'm having trouble connecting to my neural core right now. Please try again in a moment.",
        recommended_students: [],
        recommended_companies: [],
        recommended_opportunities: []
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="opp-page-container">
      <Header />

      <main className="opp-main">
        {/* Hero Section */}
        <section className="opp-hero-section">
          <div className="opp-hero-container">
            <h1 className="opp-hero-title">
              Explore Your Next <br />
              <span className="vibrant-text-gradient">
                Opportunity
              </span>
            </h1>
            <p className="opp-hero-desc">
              Vertex AI matches your skills with world-class hackathons and high-impact sponsorships.
            </p>
          </div>
        </section>

        {/* Search Section */}
        <section className="opp-search-section">
          <div className="opp-search-width-container">
            <div className="opp-search-group">
              <div className="opp-search-bg-blur"></div>
              <div className="opp-search-box">
                <span className="material-symbols-outlined opp-search-icon">search</span>
                <input
                  className="opp-search-input"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAskAI(); }}
                />
                <button
                  className={`opp-ask-ai-btn vibrant-gradient ${isAiLoading ? 'opacity-70' : ''}`}
                  onClick={handleAskAI}
                  disabled={isAiLoading}
                >
                  <span className="material-symbols-outlined">{isAiLoading ? 'progress_activity' : 'auto_awesome'}</span>
                  {isAiLoading ? 'Thinking...' : 'Ask AI'}
                </button>
              </div>
            </div>

            {/* AI Response Box */}
            {aiResponse && (
              <div className="ai-response-container animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="glass-card ai-response-box">
                  <div className="ai-response-header">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined ai-sparkle">auto_awesome</span>
                      <span className="ai-response-title">Vertex AI Assistant</span>
                    </div>
                    <button className="ai-close-btn" onClick={() => setAiResponse(null)}>
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                  <div className="ai-response-content">
                    <div className="whitespace-pre-wrap mb-4">
                      {aiResponse.answer}
                    </div>

                    {/* Render Recommended Opportunities if any */}
                    {aiResponse.recommended_opportunities && aiResponse.recommended_opportunities.length > 0 && (
                      <div className="mt-4 flex flex-col gap-4">
                        <div className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">Top Matches For You</div>
                        <div className="grid grid-cols-1 gap-4">
                          {aiResponse.recommended_opportunities.map((opp: any) => (
                            <div
                              key={opp.opportunity_id}
                              onClick={() => navigate(`/opportunities/${opp.opportunity_id}`)}
                              className="group bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-indigo-100 hover:border-indigo-300 transition-all cursor-pointer flex gap-4 items-center"
                            >
                              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-indigo-600">rocket_launch</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-900 truncate">{opp.title}</h4>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold uppercase py-0.5 px-2 bg-indigo-100 text-indigo-600 rounded-full">
                                    {opp.type}
                                  </span>
                                  {opp.description && (
                                    <span className="text-[10px] text-slate-500 truncate block">
                                      {opp.description.substring(0, 60)}...
                                    </span>
                                  )}
                                </div>
                              </div>
                              <span className="material-symbols-outlined text-slate-300 group-hover:text-indigo-600 transition-colors">arrow_forward_ios</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Render Recommended Companies if any */}
                    {aiResponse.recommended_companies && aiResponse.recommended_companies.length > 0 && (
                      <div className="mt-6 flex flex-col gap-4">
                        <div className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2">Recommended Organizations</div>
                        <div className="grid grid-cols-1 gap-4">
                          {aiResponse.recommended_companies.map((company: any) => (
                            <div
                              key={company.company_id}
                              onClick={() => navigate(`/company/profile/${company.company_id}`)}
                              className="group bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-blue-100 hover:border-blue-300 transition-all cursor-pointer flex gap-4 items-center"
                            >
                              {company.photo_url ? (
                                <img src={company.photo_url} alt={company.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                              ) : (
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                                  <span className="material-symbols-outlined text-blue-600">corporate_fare</span>
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-900 truncate">{company.name}</h4>
                                <span className="text-[10px] font-bold uppercase py-0.5 px-2 bg-blue-100 text-blue-600 rounded-full">
                                  {company.industry}
                                </span>
                              </div>
                              <span className="material-symbols-outlined text-slate-300 group-hover:text-blue-600 transition-colors">arrow_forward_ios</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="ai-response-footer">
                    Powered by Gemini 2.0
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Filters Section */}
        <section className="opp-filters-section">
          <div className="opp-filters-container">
            <div className="opp-filter-toggle">
              <button
                onClick={() => setActiveTab('hackathons')}
                className={`opp-toggle-option ${activeTab === 'hackathons' ? 'active' : ''}`}
              >
                Hackathons
              </button>
              <button
                onClick={() => setActiveTab('sponsorships')}
                className={`opp-toggle-option ${activeTab === 'sponsorships' ? 'active' : ''}`}
              >
                Sponsorships
              </button>
            </div>

            <div className="opp-tags-wrapper">


              <button className="opp-scroll-btn" onClick={() => scrollTags('left')}>
                <span className="material-symbols-outlined">chevron_left</span>
              </button>

              <div className="opp-tags-row" id="tags-container">
                {tags.map(tag => (
                  <button
                    key={tag}
                    className={`opp-chip ${activeTags.includes(tag) ? 'active' : 'inactive'}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <button className="opp-scroll-btn" onClick={() => scrollTags('right')}>
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </section>


        {/* Main Content Grid */}
        <section className="opp-content-section">
          <div className="opp-content-grid">

            {/* Left Column: Listings */}
            <div className="opp-listing-column">
              <div className="opp-listing-header-row">
                <h3 className="opp-listing-title">Showing {totalResults} {activeTab === 'hackathons' ? 'Hackathons' : 'Sponsorships'}</h3>

                <div className="opp-sort-dropdown">
                  <span className="material-symbols-outlined">sort</span>
                  <span className="opp-sort-label">Sort by:</span>
                  <select
                    className="opp-sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option>Most Recent</option>
                    <option>Prize Pool</option>
                    <option>Deadline</option>
                  </select>
                </div>
              </div>

              <div className="opp-listings-list">
                {sortedList.map((opp) => (
                  <div
                    key={opp.id}
                    className="opp-event-card"
                    onClick={() => navigate(`/opportunities/${opp.id}`)}
                  >
                    <div className="opp-card-img-container">
                      <img
                        alt="Event"
                        className="opp-card-img"
                        src={opp.image}
                      />
                    </div>
                    <div className="opp-card-main">
                      <div className="opp-card-badges">
                        {opp.badges.map((b: any, i: number) => (
                          <span key={i} className={`opp-badge-pill badge-${b.style}`}>{b.text}</span>
                        ))}
                      </div>
                      <h5 className="opp-card-title">{opp.title}</h5>
                      <p className="opp-card-host">Hosted by {opp.host}</p>
                      <p className="opp-card-summary">{opp.summary}</p>
                    </div>
                    <div className="opp-card-meta-col">
                      <div className="opp-meta-item">
                        <span className="material-symbols-outlined text-brand-blue opp-meta-icon">event</span>
                        <span className="opp-meta-text">{opp.date}</span>
                      </div>
                      <div className="opp-meta-item">
                        <span className="material-symbols-outlined text-brand-blue opp-meta-icon">payments</span>
                        <span className="opp-meta-text-bold">{opp.price}</span>
                      </div>
                      <div className="opp-meta-item">
                        <span className="material-symbols-outlined text-brand-blue opp-meta-icon">public</span>
                        <span className="opp-meta-text">{opp.location}</span>
                      </div>
                      <button
                        className={`opp-apply-btn ${localStorage.getItem('user_type') === 'company' ? 'opacity-50 cursor-not-allowed bg-slate-400 hover:bg-slate-400' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (localStorage.getItem('user_type') === 'company') return;
                          navigate(`/opportunities/${opp.id}`);
                        }}
                        disabled={localStorage.getItem('user_type') === 'company'}
                        title={localStorage.getItem('user_type') === 'company' ? "Companies cannot join opportunities" : "Join this opportunity"}
                      >
                        Join
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Sidebar */}
            <aside className="opp-sidebar-column">
              <div className="opp-sticky-wrapper">

                {/* Trending Widget (Glass Card) */}
                <div className="glass-card opp-trending-widget">
                  <h4 className="opp-widget-heading">
                    <span className="material-symbols-outlined text-purple-600">trending_up</span>
                    Trending
                  </h4>
                  <div className="opp-trending-list">
                    {trendingTags.map((item, i) => (
                      <a
                        key={i}
                        href="#"
                        className="opp-trending-item"
                        onClick={(e) => {
                          e.preventDefault();
                          handleTrendingClick(item.tag);
                        }}
                      >
                        <span className="opp-trending-tag">{item.tag}</span>
                        <span className="opp-trending-count">{item.count}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Perfect Match Widget (Pulse Glow) */}
                <div className="ai-pulse-glow opp-match-widget">
                  <div className="opp-match-header">
                    <div className="opp-match-header-title-group">
                      <span className="material-symbols-outlined text-brand-blue">auto_awesome</span>
                      <h4 className="opp-match-title">Perfect Match</h4>
                    </div>
                    <span className="opp-badge-pill badge-blue-soft border-blue-100">AI DRIVEN</span>
                  </div>
                  <p className="opp-match-desc">Top 3 Matches for You based on your profile and skills.</p>
                  <div className="opp-match-list">
                    {perfectMatches.map((item, i) => (
                      <div key={i} className="opp-match-item">
                        <div className="opp-match-rank">
                          <span>0{i + 1}</span>
                        </div>
                        <div className="opp-match-content">
                          <h5 className="opp-match-item-title">{item.title}</h5>
                          <p className="opp-match-item-subtitle">{item.match} Match • {item.tech}</p>
                        </div>
                        <span className="material-symbols-outlined opp-chevron-icon">chevron_right</span>
                      </div>
                    ))}
                  </div>
                  <button className="opp-refine-btn">Refine My Profile</button>
                </div>

                {/* Network Widget */}
                <div className="opp-network-widget">
                  <h4 className="opp-widget-heading">
                    <span className="material-symbols-outlined text-blue-600">group</span>
                    Vertex Connect
                  </h4>
                  <p className="opp-network-desc">People from your university or network attending these events.</p>

                  <div className="opp-network-rows">
                    {networkData.map((row, i) => (
                      <div key={i} className="opp-network-row">
                        <div className="opp-avatar-group">
                          {row.avatars.map((url, j) => (
                            <img key={j} alt="Avatar" className="opp-avatar" src={url} />
                          ))}
                          <div className="opp-avatar-more">+{row.more_count}</div>
                        </div>
                        <span className="opp-context-text">{row.context}</span>
                      </div>
                    ))}
                  </div>

                  <button className="opp-widget-btn">See Network</button>
                </div>

              </div>
            </aside>
          </div>
        </section>
      </main>

      {/* <Footer /> */}
    </div>
  );
};
