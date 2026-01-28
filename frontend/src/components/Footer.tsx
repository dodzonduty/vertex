import React from 'react';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          
          {/* Column 1: Brand */}
          <div className="footer-col-brand">
            <div className="footer-logo">
              <img 
                alt="Vertex Logo" 
                className="footer-logo-img" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDruz-Z1rxJw2B99u929C03U08fcvdxSK_JROTw_OzxOSsBmN5XzbwguREzreQuwCd4E7AbD8loZK5nPz9oXGwKxDzCFurTlEI1bH3irhCJkHZzVjUE68rhJYJY98VFJbXhXkEHb3hn_iYaF1rQNa59tTo8Y3gOV6canfBt7zn-KKQHlBggral3oWAH6w6vYHO-huFlrtFDuLD9wvwmetKoYCj-3cXISGEQJDtXhFTo7pP8j1iredjzJpusDMEqGs-IVY0k2K8LxPY" 
              />
              <span className="footer-logo-text">Vertex</span>
            </div>
            <p className="footer-desc">
              The premier hub for high-impact professional development and collaborative innovation.
            </p>
            <div className="social-links">
              <div className="social-icon">●</div>
              <div className="social-icon">●</div>
            </div>
          </div>

          {/* Column 2: Platform */}
          <div className="footer-col">
            <h4 className="footer-heading">Platform</h4>
            <ul className="footer-links">
              <li><a href="#">Events</a></li>
              <li><a href="#">Companies</a></li>
              <li><a href="#">Professors</a></li>
              <li><a href="#">Projects</a></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="footer-col">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Privacy</a></li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div className="footer-col">
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-links">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Guidelines</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="footer-copyright">
          © 2028 Vertex Platforms Inc. High Impact Ecosystem.
        </div>
      </div>
    </footer>
  );
};
