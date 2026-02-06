import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react';
import { apiRequest } from '../lib/api/config';
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

export const Opportunities: React.FC = () => {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    apiRequest<Opportunity[]>('/api/opportunities/top')
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setOpportunities(data);
        }
      })
      .catch(() => {
        console.warn('Failed to fetch opportunities');
      });
  }, []);

  return (
    <section id="opportunities" className="opportunities-section">
      <div className="opportunities-container">
        {/* Header */}
        <div className="opportunities-header">
          <div>
            <h2 className="opportunities-title">Opportunities</h2>
            <p className="opportunities-subtitle">Curated missions from our network of partners.</p>
          </div>
          <button onClick={() => navigate('/signin')} className="view-all-link bg-transparent border-none cursor-pointer flex items-center">
            View all opportunities <ArrowUpRight className="w-4 h-4 ml-1" />
          </button>
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
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {opp.date}
                  </div>
                  <div className="detail-item">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {opp.location}
                  </div>
                </div>
                <button onClick={() => navigate('/signin')} className="btn-join">Join Now</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
