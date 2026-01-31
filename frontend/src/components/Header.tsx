import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import './Header.css';

export const Header: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/opportunities/count')
      .then(res => res.json())
      .then(data => setCount(data.count))
      .catch(() => setCount(124));
  }, []);

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="header-container">
        {/* Logo Area */}
        <Link to="/" className="logo-area">
          <div className="logo-icon-wrapper">
            <img
              alt="Vertex Logo"
              className="logo-img"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDruz-Z1rxJw2B99u929C03U08fcvdxSK_JROTw_OzxOSsBmN5XzbwguREzreQuwCd4E7AbD8loZK5nPz9oXGwKxDzCFurTlEI1bH3irhCJkHZzVjUE68rhJYJY98VFJbXhXkEHb3hn_iYaF1rQNa59tTo8Y3gOV6canfBt7zn-KKQHlBggral3oWAH6w6vYHO-huFlrtFDuLD9wvwmetKoYCj-3cXISGEQJDtXhFTo7pP8j1iredjzJpusDMEqGs-IVY0k2K8LxPY"
            />
          </div>
          <span className="logo-text">Vertex</span>
        </Link>

        {/* Navigation Links */}
        <nav className="desktop-nav">
          <Link to="/opportunities" className="nav-link">
            Missions
            <span className="nav-badge">{count}</span>
          </Link>
          <a href="/#path-to-mastery" className="nav-link">Ecosystem</a>
          <a href="/#path-to-mastery" className="nav-link">Partners</a>
        </nav>

        {/* Auth Buttons */}
        <div className="auth-buttons">
          <Link to="/signin" className="login-btn">Log in</Link>
          <Link to="/signup" className="btn-primary-premium">
            Join Platform
            <Sparkles className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </header>
  );
};
