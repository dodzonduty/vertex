import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import './CallToAction.css';

export const CallToAction: React.FC = () => {
  return (
    <section className="cta-section">
      <div className="cta-glow"></div>
      <div className="cta-container">
        <div className="cta-badge">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Join the Elite Network</span>
        </div>
        <h2 className="cta-title">Ready to define the future of technology?</h2>
        <p className="cta-desc">
          Collaborate with top-tier talent and industry leaders in a high-impact ecosystem built for performance.
        </p>
        <div className="cta-buttons">
          <Link to="/signup" className="btn-cta-main">
            Start Your Journey
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/signup" className="btn-cta-secondary">Partner With Us</Link>
        </div>
      </div>
    </section>
  );
};
