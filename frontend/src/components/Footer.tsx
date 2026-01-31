import React from 'react';
import { Github, Twitter, Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
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
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDruz-Z1rxJw2B99u929C03U08fcvdxSK_JROTw_OzxOSsBmN5Xz9oXGwKxDzCFurTlEI1bH3irhCJkHZzVjUE68rhJYJY98VFJbXhXkEHb3hn_iYaF1rQNa59tTo8Y3gOV6canfBt7zn-KKQHlBggral3oWAH6w6vYHO-huFlrtFDuLD9wvwmetKoYCj-3cXISGEQJDtXhFTo7pP8j1iredjzJpusDMEqGs-IVY0k2K8LxPY"
              />
              <span className="footer-logo-text">Vertex</span>
            </div>
            <p className="footer-desc">
              The premier hub for high-impact professional development and collaborative innovation. Powered by AI, driven by talent.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link"><Github size={18} /></a>
              <a href="#" className="social-link"><Twitter size={18} /></a>
              <a href="#" className="social-link"><Linkedin size={18} /></a>
              <a href="#" className="social-link"><Mail size={18} /></a>
            </div>
          </div>

          {/* Column 2: Platform */}
          <div className="footer-col">
            <h4 className="footer-heading">Platform</h4>
            <ul className="footer-links">
              <li><a href="/#opportunities">Opportunities</a></li>
              <li><Link to="/student-dashboard">Team Formations</Link></li>
              <li><Link to="/student-dashboard">Profile Analytics</Link></li>
              <li><a href="/#path-to-mastery">Success Stories</a></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="footer-col">
            <h4 className="footer-heading">Ecosystem</h4>
            <ul className="footer-links">
              <li><a href="/#path-to-mastery">Partner Network</a></li>
              <li><a href="/#path-to-mastery">University Hub</a></li>
              <li><Link to="/company-dashboard">Investor Relations</Link></li>
              <li><a href="/#path-to-mastery">Impact Report</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="footer-col-newsletter">
            <h4 className="footer-heading">Stay Connected</h4>
            <div className="footer-newsletter-card">
              <p className="newsletter-desc">Get the latest missions delivered to your inbox.</p>
              <div className="newsletter-form">
                <input type="email" placeholder="Email address" className="newsletter-input" />
                <button
                  onClick={() => toast.success("Successfully subscribed to missions!")}
                  className="newsletter-submit"
                >
                  <ArrowUpRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            © 2024 Vertex Headquarters. Crafted for high-impact performers.
          </div>
          <div className="footer-legal">
            <a href="#">Privacy Protocol</a>
            <span className="footer-dot"></span>
            <a href="#">Terms of Engagement</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
