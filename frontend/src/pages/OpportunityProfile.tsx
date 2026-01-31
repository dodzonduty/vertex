import { useState } from 'react';
// import { useParams } from 'react-router-dom';
import { OpenMatchRooms } from './OpenMatchRooms';
import './OpportunityProfile.css';

export function OpportunityProfile() {
  // const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'rooms'>('overview');

  // In a real app, fetch data based on ID. For now, static content matching the design.
  
  return (
    <div className="opportunity-profile">
      
      <div className="hero-wrapper">
        <div className="profile-container">
            {/* Hero Image */}
            <div className="hero-image-container">
              <div 
                className="hero-image" 
                style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBU55NNo_2EK95iIVEslKU2wLu3cOw5TYqftYx7zpHMqKUElWxw0eeWAKLU0cXzyo6deD9ulB-9ckAwuWAp9gs3LnFQGfcXMcW9FZLmyExjYCNwcf0niAU-LWQrvYNKmJOzwH4lGHK7WGvQ8a7deM2raiKN45vNxEkxIM0Ay0xPAi08-wHjkc4xDHls4FLGC3NrGjZlWZ3E2-En3kJ3yRy2l7ooA1FIHfe-elBuX8TSarJxY-vxwoRPcNg0D816EMZosPCtR11OklE")` }}
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
                    <span className="badge badge-primary">Featured Event</span>
                    <span className="badge badge-green">Open for Registration</span>
                  </div>
                  <h2 className="hero-title">Global AI Innovation 2026</h2>
                  <div className="hero-meta">
                    <div className="meta-item">
                      <span className="material-symbols-outlined">calendar_today</span>
                      <span className="meta-text">Oct 15 - Oct 17, 2026</span>
                    </div>
                    <div className="meta-item">
                      <span className="material-symbols-outlined">location_on</span>
                      <span className="meta-text">San Francisco / Hybrid</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <button className="cta-button">
                Join <span className="material-symbols-outlined">rocket_launch</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sticky Nav */}
        <div className="nav-bar">
          <div className="profile-container" style={{ padding: '0 1.5rem' }}>
            <div className="nav-scroll no-scrollbar">
              <button 
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
                style={{ background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer' }}
              >
                Overview
              </button>
              <button className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>auto_awesome</span> Eligibility AI
              </button>
              <button className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Submission</button>
              <button className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Judging</button>
              <button className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Rules</button>
              <button 
                className={`nav-link ${activeTab === 'rooms' ? 'active' : ''}`}
                onClick={() => setActiveTab('rooms')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', borderBottom: activeTab === 'rooms' ? '2px solid var(--primary)' : '2px solid transparent' }}
              >
                Open Match Rooms 
                <span style={{ display: 'flex', width: '8px', height: '8px', backgroundColor: '#22c55e', borderRadius: '50%', marginLeft: '4px' }}></span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        {activeTab === 'overview' ? (
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
                      Build the next generation of AI agents that bridge the gap between digital reasoning and real-world physical sustainability. Use generative models to optimize supply chains, reduce energy consumption, or design carbon-neutral urban infrastructures.
                    </p>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', paddingTop: '1rem' }}>
                    <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #f1f5f9' }}>
                       <h4 className="font-bold mb-4 flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--primary)' }}>category</span> Categories
                       </h4>
                       <ul className="info-list">
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
                        <p className="req-title">Must use Gemini 1.5 Pro API</p>
                        <p className="req-desc">Projects without integration will not be eligible for the main track prizes.</p>
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
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>$50,000 Total Pool</span>
                </div>

                <div className="prizes-grid">
                  <div className="prize-card prize-yellow">
                    <div className="prize-icon-circle prize-icon-yellow">
                      <span className="material-symbols-outlined">workspace_premium</span>
                    </div>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>$25,000</h4>
                    <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#ca8a04', marginBottom: '0.5rem' }}>Grand Prize</p>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Overall best AI-integrated sustainability solution.</p>
                  </div>
                  
                  <div className="prize-card prize-slate">
                    <div className="prize-icon-circle prize-icon-slate">
                      <span className="material-symbols-outlined">award_star</span>
                    </div>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>$10,000</h4>
                    <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#64748b', marginBottom: '0.5rem' }}>Runner Up</p>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>High technical complexity and execution.</p>
                  </div>

                  <div className="prize-card prize-blue">
                     <div className="prize-icon-circle prize-icon-blue">
                      <span className="material-symbols-outlined">featured_video</span>
                    </div>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>$5,000</h4>
                    <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '0.5rem' }}>Best UX</p>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Superior design and presentation quality.</p>
                  </div>
                </div>

                {/* Secondary Prizes */}
                <div className="secondary-prizes-grid">
                  <div className="prize-card-small">
                     <div className="prize-icon-small">
                        <span className="material-symbols-outlined" style={{ color: '#2563eb' }}>groups</span>
                     </div>
                     <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#64748b' }}>Social Impact</p>
                        <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#0f172a' }}>$5,000</p>
                     </div>
                  </div>

                  <div className="prize-card-small">
                     <div className="prize-icon-small">
                        <span className="material-symbols-outlined" style={{ color: '#2563eb' }}>psychology</span>
                     </div>
                     <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#64748b' }}>Most Creative AI Use</p>
                        <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#0f172a' }}>$5,000</p>
                     </div>
                  </div>
                </div>
              </section>

              <section id="submission" className="section-card">
                <h3 className="section-title">
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>upload_file</span> Submission Requirements
                </h3>
                <div className="submission-grid">
                  <div className="sub-card">
                    <span className="material-symbols-outlined" style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>text_fields</span>
                    <h4 style={{ fontWeight: 'bold', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Project Description</h4>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>A clear explanation of the problem, your solution, and how Gemini API was used.</p>
                  </div>
                  <div className="sub-card">
                     <span className="material-symbols-outlined" style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>link</span>
                     <h4 style={{ fontWeight: 'bold', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Live Demo Link</h4>
                     <p style={{ fontSize: '0.75rem', color: '#64748b' }}>A working URL where judges can test your application in real-time.</p>
                  </div>
                  <div className="sub-card">
                     <span className="material-symbols-outlined" style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>code</span>
                     <h4 style={{ fontWeight: 'bold', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Repo Link</h4>
                     <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Public GitHub or GitLab repository containing all project code.</p>
                  </div>
                   <div className="sub-card">
                     <span className="material-symbols-outlined" style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>videocam</span>
                     <h4 style={{ fontWeight: 'bold', fontSize: '0.875rem', marginBottom: '0.25rem' }}>3-min Video</h4>
                     <p style={{ fontSize: '0.75rem', color: '#64748b' }}>A YouTube or Vimeo walkthrough showcasing the features and UI.</p>
                  </div>
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
                        <p style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Age & Status</p>
                         <p style={{ fontSize: '0.75rem', color: '#64748b' }}>18+ years old. Open to both students and professionals globally.</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                       <span className="material-symbols-outlined" style={{ color: 'var(--primary)', padding: '0.5rem', backgroundColor: 'rgba(59,130,246,0.1)', borderRadius: '0.5rem' }}>groups</span>
                       <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Team Size</p>
                         <p style={{ fontSize: '0.75rem', color: '#64748b' }}>1 - 4 members per team. Cross-country teams allowed.</p>
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
                       <p style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Oct 10, 2026</p>
                     </div>
                     <div className="schedule-item">
                       <div className="schedule-dot dot-slate"></div>
                       <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8' }}>Hacking Period</p>
                       <p style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Oct 15 - Oct 17</p>
                     </div>
                     <div className="schedule-item">
                       <div className="schedule-dot dot-slate"></div>
                       <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8' }}>Judging Starts</p>
                       <p style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Oct 18, 2026</p>
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
                      <span>Total Prize Pool</span>
                    </div>
                    <span className="details-val" style={{ color: 'var(--primary)' }}>$50,000</span>
                  </div>
                  <div className="details-item">
                    <div className="details-label">
                      <span className="material-symbols-outlined details-icon">public</span>
                      <span>Location</span>
                    </div>
                    <span className="details-val">Hybrid / SF</span>
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
                      <span>Participants</span>
                    </div>
                     <span className="details-val">1,534</span>
                  </div>
                </div>
              </div>

               {/* Hosted By */}
               <div className="section-card">
                <h4 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '1rem' }}>Hosted By</h4>
                <div className="host-card">
                  <div className="host-img-box">
                    <div className="host-img" style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAwi2bPE1U55tlZMUGpuLPWo39dq6jDPh_2WKZ0gJxeSeNPsMJBhnm6ZrV5Y4LMeS0tEv9_l8gq7H3fty3sW19IeiZ4l6ab01Gwq0TsBe49m5r7c2j7vd2uPPZU3h4PtLRFptsB2dqOdVHXdhi8LAjyg8OV-3OT1UCkHBrSARkw3ThlxoyAnODnaAtiszeigPzDiIvlKdHN3u-MU8sTuGtbRPb2g6rWy4YIX5NBjEMpNwXm5iqlLsiFrgA2IoBw93hK2olnQE6TZ3Q")` }}></div>
                  </div>
                  <div>
                    <p style={{ fontWeight: 'bold', fontSize: '0.875rem', lineHeight: 1.25 }}>Dr. Elena Sterling</p>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Vertex AI Lead</p>
                  </div>
                </div>
                <button className="view-profile-btn">View Profile</button>
              </div>

              {/* Match Rooms */}
              <div className="section-card" id="rooms">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h4 style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>Match Rooms</h4>
                  <span style={{ fontSize: '10px', padding: '0.125rem 0.5rem', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '9999px', fontWeight: 'bold', textTransform: 'uppercase' }}>128 Active</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>Find teammates in real-time chat rooms.</p>
                
                <div className="room-card group">
                  <div className="room-header">
                    <h5 style={{ fontSize: '0.875rem', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>#frontend-experts</h5>
                    <span className="material-symbols-outlined" style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>sensors</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className="avatars">
                      <div className="avatar" style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBfE5vUKtzCFtsC7oQmEkGqW_uOKQ3BqWGfe_K7wavtR-oEDO9rqBfDJ5tbF4x20vaERy4-1vMJ7X-GbFfKXwFOcG9K2U02ngz9PCbrmjsZvFiZL8GPbqKyBVw7kgaBw1nL9h6G1OLyfQ6NlTc8aSl1cmt3c81CMEnbdSy1RxdI6wHHO0AcXQdGhEJLr-ZfX74c9jTGLKDNW_M7HAKgWY3tPbVlE-U41t6sR5hgA9_33-d9Uv0PgV5ScAoL3QPtLDxJzAwlMYoKhM0")` }}></div>
                       <div className="avatar" style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBglYmdFKz-CT_MHHpEoDt0MsPxeqaUBueBnoLmpFKDSt9oK73Zqu3Xc-CFhCl8VM-SySXPvIn5ggV8JjNw82QnSnDUjAbO4zCSYvuRtD4ba5_t394dWy4KbupF0DKO4sg3DfafDQAUhjgAZzHl7GxaFoC4BOt5uku0XoGOKKX0kxDfEU9e8byrq9hMD7ltjHugnWEqqHD9oNA4JYQ10GVBk_VY8u9eXEK6rP9gECEw_OBV9MZFActl1VVtkPdFyDv7rOnGOqDhRXQ")` }}></div>
                      <div className="avatar-more">+12</div>
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
        ) : (
          <OpenMatchRooms />
        )}
    </div>
  );
}
