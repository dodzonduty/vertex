import React, { useEffect, useState } from 'react';
import './Header.css';

export const Header: React.FC = () => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    // Attempt API call, fallback to 101 if backend not running (mock mode)
    fetch('/api/opportunities/count')
      .then(res => res.json())
      .then(data => setCount(data.count))
      .catch(() => setCount(101)); // Fallback for dev without backend
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo Area */}
        <div className="logo-area">
          <img 
            alt="Vertex Logo" 
            className="logo-img" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDruz-Z1rxJw2B99u929C03U08fcvdxSK_JROTw_OzxOSsBmN5XzbwguREzreQuwCd4E7AbD8loZK5nPz9oXGwKxDzCFurTlEI1bH3irhCJkHZzVjUE68rhJYJY98VFJbXhXkEHb3hn_iYaF1rQNa59tTo8Y3gOV6canfBt7zn-KKQHlBggral3oWAH6w6vYHO-huFlrtFDuLD9wvwmetKoYCj-3cXISGEQJDtXhFTo7pP8j1iredjzJpusDMEqGs-IVY0k2K8LxPY" 
          />
          <span className="logo-text">Vertex</span>
        </div>

        {/* Navigation Links */}
        <nav className="desktop-nav">
          <a href="#" className="nav-link">
            Opportunities
            <span className="header-badge header-badge-blue">{count > 100 ? '+100' : count}</span>
          </a>
          <a href="#" className="nav-link">
            Companies
            <span className="header-badge header-badge-purple">NEW</span>
          </a>
          <a href="#" className="nav-link">Professors</a>
        </nav>

        {/* Auth Buttons */}
        <div className="auth-buttons">
          <a href="#" className="login-link">Company Login</a>
          <a href="#" className="btn-primary">Student Login</a>
        </div>
      </div>
    </header>
  );
};
