import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest, getUserData } from '../lib/api/config';
import { logout } from '../lib/api/auth';
import { User, LogOut, LayoutDashboard, Building2 } from 'lucide-react';
import './Header.css';

export const Header: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const [user, setUser] = useState<any>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);

  useEffect(() => {
    const userData = getUserData();
    setUser(userData);

    if (userData?.user_id) {
      apiRequest<{ profile_picture_url: string }>(`/api/mocks/profile-picture/${userData.user_id}`)
        .then(data => setProfilePic(data.profile_picture_url))
        .catch(() => { });
    }

    // Attempt API call, fallback to 101 if backend not running (mock mode)
    apiRequest<{ count: number }>('/api/opportunities/count')
      .then(data => setCount(data.count))
      .catch(() => setCount(101)); // Fallback for dev without backend
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo Area */}
        <Link to="/" className="logo-link">
          <img
            alt="Vertex Logo"
            className="logo-img"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDruz-Z1rxJw2B99u929C03U08fcvdxSK_JROTw_OzxOSsBmN5XzbwguREzreQuwCd4E7AbD8loZK5nPz9oXGwKxDzCFurTlEI1bH3irhCJkHZzVjUE68rhJYJY98VFJbXhXkEHb3hn_iYaF1rQNa59tTo8Y3gOV6canfBt7zn-KKQHlBggral3oWAH6w6vYHO-huFlrtFDuLD9wvwmetKoYCj-3cXISGEQJDtXhFTo7pP8j1iredjzJpusDMEqGs-IVY0k2K8LxPY"
          />
          <span className="logo-text">Vertex</span>
        </Link>

        {/* Navigation Links */}
        <nav className="desktop-nav">
          <Link to="/opportunities" className="nav-link">
            Opportunities
            <span className="header-badge header-badge-blue">
              {count > 100 ? '+100' : count}
            </span>
          </Link>
          <Link to="/companies" className="nav-link">
            Companies
            <span className="header-badge header-badge-purple">
              NEW
            </span>
          </Link>
          <Link to="/profiles" className="nav-link">Profiles</Link>

          {user && (
            <>
              <Link to={user.role === 'student' ? '/student-dashboard' : '/company-dashboard'} className="nav-link flex items-center gap-1">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <Link to={user.role === 'student' ? `/student/profile/${user.user_id}` : `/company/profile/${user.user_id}`} className="nav-link flex items-center gap-1">
                {user.role === 'student' ? <User className="w-4 h-4" /> : <Building2 className="w-4 h-4" />} My Profile
              </Link>
            </>
          )}
        </nav>

        {/* Auth Buttons */}
        <div className="auth-buttons">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden flex items-center justify-center">
                {profilePic ? (
                  <img src={profilePic} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-slate-500">
                    {user.email?.[0].toUpperCase()}
                  </span>
                )}
              </div>
              <button onClick={handleLogout} className="text-slate-500 hover:text-red-600 transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link to="/signin" className="btn-student">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
