import React from 'react';
import './HeroSection.css';

export const HeroSection: React.FC = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        
        {/* Text Content */}
        <div className="hero-content">
          <div className="hero-pill">
            <span className="hero-pill-dot"></span>
            WINTER AI CHALLENGE 2024 IS LIVE
          </div>
          
          <h1 className="hero-title">
            Powering the <br />
            <span className="hero-title-gradient">Next Generation of Innovators</span>
          </h1>
          
          <p className="hero-description">
            A high-fidelity ecosystem bridging the gap between ambitious students, top-tier companies, and world-class research.
          </p>
          
          <div className="hero-buttons">
            <button className="btn-hero-primary">Get Started</button>
            <button className="btn-hero-secondary">Explore Features</button>
          </div>
        </div>

        {/* Image Content */}
        <div className="hero-image-wrapper">
          {/* Blobs */}
          <div className="hero-blob blob-purple"></div>
          <div className="hero-blob blob-indigo"></div>
          
          <img 
            alt="Students collaborating" 
            className="hero-img" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAestOiPbIzWjttCMYNd2fl0w_SZXXdqW_7dnMSIQFzAlJu9SQUmarHfg650G4LQHgAYazt6qQf_ixUk2cNQCR8_-_7Db5xWsOILIfKKf02APDfCFm1kAdNJYfaoSSsNfyHQlamO7WDc4DkVsmg5aU1K3Xkx2XICnel7jEOTqhJiQ23rTj23UkKaxNCjzEw2tWmY0SMrqF1JIZvQk33QWbIPDQ4SizPMAwflSHaPfR85oQmj_swh4_n-_v2vYwIvHiAEwvLXhQXtbw" 
          />
        </div>
      </div>
    </section>
  );
};
