import React from 'react';
import './LiveEvents.css';

export const LiveEvents: React.FC = () => {
  return (
    <section className="featured-section">
      <div className="featured-container">
        
        {/* Header */}
        <div className="featured-header">
          <div>
            <h2 className="featured-title">Live Events</h2>
            <p className="featured-subtitle">Curated missions from our network of partners.</p>
          </div>
          <a href="#" className="view-all-link">
             View all events <span className="view-all-arrow">↗</span>
          </a>
        </div>

        {/* Opps Grid */}
        <div className="events-grid">
          
          {/* Card 1 */}
          <article className="event-card">
            <div className="event-image-wrapper">
              <span className="event-badge event-badge-blue">Engineering</span>
              <img 
                alt="Global AI Hack" 
                className="event-img" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAp8YPsSejPInMICvOmgu4F2_EVDQxpbvygjd6wuuOZ7a8D8DtJ9o6s8p9yfaIbEgewA-9EK089KOU2hW_qdUm7zLUBx0C3q4aJoy0BIO6UdTA7RpQh8DVt1DC_zcIZRmjX_eTn-t0OTJVetB8Wf8hyUehicsGiajLA-14XsLVJWMV1Gx_CKvaF6kYW5vCwVLHu_35XtKFy4YbD4gRXAX8BDh8ioh4SCzTaO_6i_BqxIEfAAEogZSJkXccXbX2PxrLuj8TVfwIIS-A" 
              />
            </div>
            <div className="event-content">
              <div className="event-meta-top">
                <h3 className="event-title">Global AI Hack 2028</h3>
                <span className="event-price">$10,000</span>
              </div>
              <div className="event-details">
                <div className="detail-item">
                  <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                  Oct 12-14, 2028
                </div>
                <div className="detail-item">
                  <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                  Remote • Global
                </div>
              </div>
              <button className="btn-apply btn-apply-blue">Apply Now</button>
            </div>
          </article>

          {/* Card 2 */}
          <article className="event-card">
            <div className="event-image-wrapper">
              <span className="event-badge event-badge-emerald">Hiring Track</span>
              <img 
                alt="FinTech Sprint" 
                className="event-img" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBvcqg_z4t5DtImBaF4zDg1paUIXivAjiu0n3bTJpS__wzsQQ8fTjIo5ThuSuTP1puePPfX3W8klgrWopzhwEuo_F-oqNhM-JTwb2UpbOuAUZhtfHZU26mz6tmlCXzTuuDeOEarNRaPPirtfDkzynNPlwErvz5kBvcSfmS3tyGP4nPDxAzdgKIBxLw9YTfzizh4yxi8o76B2l7D0R1Vd8_EZpU5bgTojtkWTtdlExRh-dg2RJ0Ocasmg4phBDl3HFl3k4nK3k3bPk" 
              />
            </div>
            <div className="event-content">
              <div className="event-meta-top">
                <h3 className="event-title">FinTech Sprint</h3>
                <span className="event-tag tag-purple">Internship</span>
              </div>
              <div className="event-details">
                <div className="detail-item">
                  <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                  Nov 05, 2028
                </div>
                <div className="detail-item">
                  <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                  New York, USA
                </div>
              </div>
              <button className="btn-apply btn-apply-blue">Apply Now</button>
            </div>
          </article>

          {/* Card 3 */}
          <article className="event-card">
            <div className="event-image-wrapper">
              <span className="event-badge event-badge-orange">Classic</span>
              <img 
                alt="GreenTech Challenge" 
                className="event-img" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMNTMxFVNiPSo8MUlXc8JR2kZrtb7U0VEUPXMmSUuf2fORIlhTuNr6aaWdJfnIemPfYBQcAiANYZR26bD4e1OUiKj2txAOKNl1NDWJpymLYF-aWdQ3E2Upw0fCGNAK7m4aChDmbyQXF8qLrgrrKlIL2lQiaf3HgOczH7onaZ0UX500J_bFsJC8YB1go4W9XpZtrU8AdMbM3ZFNMD10oXkBOSTOAjao9v8P34FJcNrS6q1dz4AkyCOaSFVMxoy1Favi1u2Oc01WObk" 
              />
            </div>
            <div className="event-content">
              <div className="event-meta-top">
                <h3 className="event-title">GreenTech Challenge</h3>
                <span className="event-tag tag-teal">Credits</span>
              </div>
              <div className="event-details">
                <div className="detail-item">
                  <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                  Dec 01, 2028
                </div>
                <div className="detail-item">
                  <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                  London, UK
                </div>
              </div>
              <button className="btn-apply btn-apply-blue">Apply Now</button>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
};
