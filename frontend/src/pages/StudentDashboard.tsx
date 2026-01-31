import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, FolderGit2, Calendar, Users, Compass } from 'lucide-react';
import { StudentProfile } from '../components/student/StudentProfile';
import { StudentProjects } from '../components/student/StudentProjects';
import { StudentEvents } from '../components/student/StudentEvents';
import { StudentOpenMatch } from '../components/student/StudentOpenMatch';
import { BrowseProfiles } from '../components/student/BrowseProfiles';
import '../components/Header.css'; // Import global header styles

interface StudentDashboardProps {
  onLogout: () => void;
}

type Tab = 'profile' | 'projects' | 'events' | 'openmatch' | 'browse';

export function StudentDashboard({ onLogout }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('profile');

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
            <span className="ml-2 px-3 py-1 bg-indigo-50/50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100/50 backdrop-blur-sm">Student</span>
          </Link>

          <div className="flex items-center gap-6">
            <button
              onClick={onLogout}
              className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
            >
              Log out
            </button>
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-200 ring-2 ring-white">
              AJ
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* Minimal Navigation */}
        <div className="mb-8 border-b border-slate-200">
          <div className="flex gap-8 overflow-x-auto no-scrollbar">
            <TabButton
              icon={<Users className="w-4 h-4" />}
              label="OpenMatch"
              active={activeTab === 'openmatch'}
              onClick={() => setActiveTab('openmatch')}
            />
            <TabButton
              icon={<User className="w-4 h-4" />}
              label="Profile"
              active={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
            />
            <TabButton
              icon={<FolderGit2 className="w-4 h-4" />}
              label="Projects"
              active={activeTab === 'projects'}
              onClick={() => setActiveTab('projects')}
            />
            <TabButton
              icon={<Calendar className="w-4 h-4" />}
              label="Events"
              active={activeTab === 'events'}
              onClick={() => setActiveTab('events')}
            />
            <TabButton
              icon={<Compass className="w-4 h-4" />}
              label="Browse"
              active={activeTab === 'browse'}
              onClick={() => setActiveTab('browse')}
            />
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[500px]">
          {activeTab === 'profile' && <StudentProfile />}
          {activeTab === 'projects' && <StudentProjects />}
          {activeTab === 'events' && <StudentEvents />}
          {activeTab === 'openmatch' && <StudentOpenMatch />}
          {activeTab === 'browse' && <BrowseProfiles />}
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
}

function TabButton({ icon, label, active, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 transform scale-100 hover:scale-105 active:scale-95 ${active
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
        : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-indigo-600 border border-slate-200/50 hover:border-indigo-100 hover:shadow-md'
        }`}
    >
      {icon}
      {label}
    </button>
  );
}