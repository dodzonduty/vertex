import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Search, Compass, Calendar } from 'lucide-react';
import { CompanyProfile } from '../components/company/CompanyProfile';
import { CompanyHiring } from '../components/company/CompanyHiring';
import { BrowseStudents } from '../components/company/BrowseStudents';
import { CompanyEvents } from '../components/company/CompanyEvents';
import { StatePreservation } from '../lib/utils/statePreservation';
import '../components/Header.css'; // Import global header styles

interface CompanyDashboardProps {
  onLogout: () => void;
}

type Tab = 'profile' | 'hiring' | 'browse' | 'events';

export function CompanyDashboard({ onLogout }: CompanyDashboardProps) {
  // Preserve active tab state when navigating
  const savedTab = StatePreservation.loadSession<Tab>('company_dashboard_tab');
  const [activeTab, setActiveTab] = useState<Tab>(savedTab || 'profile');

  // Save tab state when it changes
  useEffect(() => {
    StatePreservation.saveSession('company_dashboard_tab', activeTab);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pt-24">
      {/* Premium Header */}
      <header className="header header-solid z-50">
        <div className="header-container">
          <Link to="/" className="logo-area">
            <div className="logo-icon-wrapper">
              <img
                alt="Vertex Logo"
                className="logo-img"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDruz-Z1rxJw2B99u929C03U08fcvdxSK_JROTw_OzxOSsBmN5XzbwguREzreQuwCd4E7AbD8loZK5nPz9oXGwKxDzCFurTlEI1bH3irhCJkHZzVjUE68rhJYJY98VFJbXhXkEHb3hn_iYaF1rQNa59tTo8Y3gOV6canfBt7zn-KKQHlBggral3oWAH6w6vYHO-huFlrtFDuLD9wvwmetKoYCj-3cXISGEQJDtXhFTo7pP8j1iredjzJpusDMEqGs-IVY0k2K8LxPY"
              />
            </div>
            <span className="logo-text">Vertex</span>
            <span className="ml-2 px-3 py-1 bg-blue-50/50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100/50 backdrop-blur-sm">Company</span>
          </Link>

          <div className="flex items-center gap-6">
            <button
              onClick={onLogout}
              className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
            >
              Log out
            </button>
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-200">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* Minimal Navigation */}
        <div className="mb-8 border-b border-slate-200">
          <div className="flex gap-8 overflow-x-auto no-scrollbar overflow-visible p-1">
            <TabButton
              icon={<Building2 className="w-4 h-4" />}
              label="Profile"
              active={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
            />
            <TabButton
              icon={<Search className="w-4 h-4" />}
              label="Hiring"
              active={activeTab === 'hiring'}
              onClick={() => setActiveTab('hiring')}
            />
            <TabButton
              icon={<Compass className="w-4 h-4" />}
              label="Discover"
              active={activeTab === 'browse'}
              onClick={() => setActiveTab('browse')}
            />
            
            {/* Opportunities Dropdown */}
            <div className="relative group">
              <TabButton
                icon={<Calendar className="w-4 h-4" />}
                label="Opportunities"
                active={activeTab === 'events'}
                onClick={() => {/* Toggle or keep active if selected */}}
                className="group-hover:text-blue-600 group-hover:bg-slate-50"
              />
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-left">
                <div className="p-1">
                  <Link 
                    to="/opportunities" 
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Search className="w-4 h-4" />
                    View Opportunities
                  </Link>
                  <button 
                    onClick={() => setActiveTab('events')}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-left"
                  >
                    <Calendar className="w-4 h-4" />
                    Host an Opportunity
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[500px]">
          {activeTab === 'profile' && <CompanyProfile />}
          {activeTab === 'hiring' && <CompanyHiring />}
          {activeTab === 'browse' && <BrowseStudents />}
          {activeTab === 'events' && <CompanyEvents />}
        </div>
      </main>
    </div>
  );
}

interface TabButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  className?: string;
}

function TabButton({ icon, label, active, onClick, className = '' }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 transform scale-100 hover:scale-105 active:scale-95 ${active
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
        : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-blue-600 border border-slate-200/50 hover:border-blue-100 hover:shadow-md'
        } ${className}`}
    >
      {icon}
      {label}
    </button>
  );
}