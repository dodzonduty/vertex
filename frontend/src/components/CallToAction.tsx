import React from 'react';
import './CallToAction.css';

export const CallToAction: React.FC = () => {
  return (
    <section className="cta-section">
      <div className="cta-container">
        <h2 className="cta-title">Ready to build the future?</h2>
        <p className="cta-desc">
          Join 50,000+ pioneers redefining the boundaries of technology and research.
        </p>
        <div className="cta-buttons">
          <button className="btn-cta-white">Create Student Profile</button>
          <button className="btn-cta-transparent">Register as Company</button>
        </div>
      </div>
    </section>
  );
};
