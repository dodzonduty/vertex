import React, { useEffect, useState } from 'react';
import './Opportunities.css';

interface Opportunity {
  opportunity_id: string;
  title: string;
  type: string;
  price: string;
  date: string;
  location: string;
  badge_text: string;
  badge_color: string;
  image: string;
}

const FALLBACK_OPPORTUNITIES: Opportunity[] = [
    {
        opportunity_id: "opp-1",
        title: "Global AI Hack 2028",
        type: "hackathon",
        price: "$10,000",
        date: "Oct 12-14, 2028",
        location: "Remote • Global",
        badge_text: "Engineering",
        badge_color: "blue",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAp8YPsSejPInMICvOmgu4F2_EVDQxpbvygjd6wuuOZ7a8D8DtJ9o6s8p9yfaIbEgewA-9EK089KOU2hW_qdUm7zLUBx0C3q4aJoy0BIO6UdTA7RpQh8DVt1DC_zcIZRmjX_eTn-t0OTJVetB8Wf8hyUehicsGiajLA-14XsLVJWMV1Gx_CKvaF6kYW5vCwVLHu_35XtKFy4YbD4gRXAX8BDh8ioh4SCzTaO_6i_BqxIEfAAEogZSJkXccXbX2PxrLuj8TVfwIIS-A"
    },
    {
        opportunity_id: "opp-2",
        title: "FinTech Sprint",
        type: "sponsorship",
        price: "Internship",
        date: "Nov 05, 2028",
        location: "New York, USA",
        badge_text: "Hiring Track",
        badge_color: "emerald",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBvcqg_z4t5DtImBaF4zDg1paUIXivAjiu0n3bTJpS__wzsQQ8fTjIo5ThuSuTP1puePPfX3W8klgrWopzhwEuo_F-oqNhM-JTwb2UpbOuAUZhtfHZU26mz6tmlCXzTuuDeOEarNRaPPirtfDkzynNPlwErvz5kBvcSfmS3tyGP4nPDxAzdgKIBxLw9YTfzizh4yxi8o76B2l7D0R1Vd8_EZpU5bgTojtkWTtdlExRh-dg2RJ0Ocasmg4phBDl3HFl3k4nK3k3bPk"
    },
    {
        opportunity_id: "opp-3",
        title: "GreenTech Challenge",
        type: "hackathon",
        price: "Credits",
        date: "Dec 01, 2028",
        location: "London, UK",
        badge_text: "Classic",
        badge_color: "orange",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMNTMxFVNiPSo8MUlXc8JR2kZrtb7U0VEUPXMmSUuf2fORIlhTuNr6aaWdJfnIemPfYBQcAiANYZR26bD4e1OUiKj2txAOKNl1NDWJpymLYF-aWdQ3E2Upw0fCGNAK7m4aChDmbyQXF8qLrgrrKlIL2lQiaf3HgOczH7onaZ0UX500J_bFsJC8YB1go4W9XpZtrU8AdMbM3ZFNMD10oXkBOSTOAjao9v8P34FJcNrS6q1dz4AkyCOaSFVMxoy1Favi1u2Oc01WObk"
    }
];

export const Opportunities: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(FALLBACK_OPPORTUNITIES);

  useEffect(() => {
    fetch('/api/opportunities/top')
      .then(res => res.json())
      .then(data => {
          if (Array.isArray(data)) {
              setOpportunities(data);
          }
      })
      .catch(() => {
        // Keep fallback data if fetch fails
        console.warn('Failed to fetch opportunities, using fallback data');
      });
  }, []);

  return (
    <section className="opportunities-section">
      <div className="opportunities-container">
        
        {/* Header */}
        <div className="opportunities-header">
          <div>
            <h2 className="opportunities-title">Opportunities</h2>
            <p className="opportunities-subtitle">Curated missions from our network of partners.</p>
          </div>
          <a href="#" className="view-all-link">
             View all opportunities <span className="view-all-arrow">↗</span>
          </a>
        </div>

        {/* Opps Grid */}
        <div className="opportunities-grid">
          {opportunities.map((opp) => (
            <article key={opp.opportunity_id} className="opportunity-card">
                <div className="opportunity-image-wrapper">
                <span className={`opportunity-badge opportunity-badge-${opp.badge_color}`}>{opp.badge_text}</span>
                <img 
                    alt={opp.title}
                    className="opportunity-img" 
                    src={opp.image} 
                />
                </div>
                <div className="opportunity-content">
                <div className="opportunity-meta-top">
                    <h3 className="opportunity-title">{opp.title}</h3>
                    <span className="opportunity-price">{opp.price}</span>
                </div>
                <div className="opportunity-details">
                    <div className="detail-item">
                    <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                    {opp.date}
                    </div>
                    <div className="detail-item">
                    <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                    {opp.location}
                    </div>
                </div>
                <button className="btn-apply btn-apply-blue">Join</button>
                </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
