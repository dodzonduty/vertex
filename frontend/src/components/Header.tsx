import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest, getUserData } from '../lib/api/config';
import { logout } from '../lib/api/auth';
import { User, LogOut, LayoutDashboard } from 'lucide-react';
import { StatePreservation } from '../lib/utils/statePreservation';
import './Header.css';

export const Header: React.FC = () => {
  console.log('Header Component File Loaded - v2');
  const [count, setCount] = useState<number>(0);
  const [user, setUser] = useState<any>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = () => {
      console.log('Header: loadUser called');
      const userData = getUserData();
      console.log('Header: userData from storage:', userData);
      setUser(userData);

      // Fetch current user with profile photo
      if (userData?.user_id) {
        console.log('Header: Fetching profile for', userData.user_id);
        apiRequest<{ user_id: string; email: string; role: string; profile_photo_url?: string }>('/api/auth/me')
          .then(data => {
            console.log('Header: Profile data received', data);
            setProfilePic(data.profile_photo_url || null);
          })
          .catch((err) => console.error('Header: Profile fetch error', err));
      }
    };

    console.log('Header: Mounting, attaching listener');
    loadUser();

    // Listen for auth changes
    window.addEventListener('auth-change', loadUser);

    // Fetch opportunities count - use the opportunities-list endpoint
    apiRequest<{ count: number; results: any[] }>('/api/opportunities-list?type=hackathons&tags=%23All')
      .then(data => setCount(data.count || 0))
      .catch(() => setCount(0));

    return () => {
      console.log('Header: Unmounting, removing listener');
      window.removeEventListener('auth-change', loadUser);
    };
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
          {user?.role === 'student' && (
            <span className="ml-3 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full border bg-indigo-50 text-indigo-600 border-indigo-100">
              Student
            </span>
          )}
          {user?.role === 'company' && (
            <span className="ml-3 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full border bg-blue-50 text-blue-600 border-blue-100">
              Company
            </span>
          )}
        </Link>

        {/* Navigation Links */}
        <nav className="desktop-nav">
          {user?.role === 'company' ? (
            <>
               <Link 
                to="/company-home" 
                className="nav-link"
                onClick={() => StatePreservation.saveSession('company_landing_tab', 'profile')}
              >
                My Profile
              </Link>
              
              <Link 
                to="/company-home" 
                className="nav-link"
                onClick={() => StatePreservation.saveSession('company_landing_tab', 'profiles')}
              >
                Hiring
              </Link>

              <div className="relative group h-full flex items-center">
                <button className="nav-link flex items-center gap-1">
                  Opportunities
                  <span className="header-badge header-badge-purple">Active</span>
                </button>
                
                {/* Dropdown Menu */}
                <div 
                    className="absolute top-full mt-2 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 origin-top"
                    style={{ left: '50%', transform: 'translateX(-50%)', width: '300px' }}
                >
                    <div className="p-2 space-y-1">
                        <Link 
                            to="/opportunities"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors group/item"
                        >
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover/item:bg-blue-100 transition-colors shrink-0">
                                <span className="material-symbols-outlined text-xl">search</span>
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-bold text-slate-900 whitespace-nowrap">View Opportunities</div>
                                <div className="text-xs text-slate-500 font-medium whitespace-nowrap">Browse market & talent</div>
                            </div>
                        </Link>
                        <Link 
                            to="/company-home"
                            onClick={() => StatePreservation.saveSession('company_landing_tab', 'opportunities')}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors group/item text-left"
                        >
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover/item:bg-indigo-100 transition-colors shrink-0">
                                <span className="material-symbols-outlined text-xl">add_circle</span>
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-bold text-slate-900 whitespace-nowrap">Host an Opportunity</div>
                                <div className="text-xs text-slate-500 font-medium whitespace-nowrap">Create hackathons & events</div>
                            </div>
                        </Link>
                    </div>
                </div>
              </div>
            </>
          ) : user?.role === 'student' ? (
            <>
              <Link to="/student-dashboard" className="nav-link flex items-center gap-1">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
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
            </>
          ) : (
            <>
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
                  <Link to="/student-dashboard" className="nav-link flex items-center gap-1">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <Link to={`/student/profile/${user.user_id}`} className="nav-link flex items-center gap-1">
                    <User className="w-4 h-4" /> My Profile
                  </Link>
                </>
              )}
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
