import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Users, Building2, Sparkles, FolderGit2, Trophy, Mail } from 'lucide-react';
import { StudentProfile } from '../components/student/StudentProfile';
import { StudentProjects } from '../components/student/StudentProjects';
import { BrowseProfiles } from '../components/student/BrowseProfiles';
import { OpportunitiesContent } from '../components/OpportunitiesContent';
import { StudentEnrollments } from '../components/student/StudentEnrollments';
import { StudentTeamInvitations } from '../components/student/StudentTeamInvitations';
import { getUserData, apiRequest } from '../lib/api/config';
import { StatePreservation } from '../lib/utils/statePreservation';
import '../components/Header.css';

interface StudentDashboardProps {
  onLogout: () => void;
}

type Tab = 'profile' | 'projects' | 'opportunities' | 'browse' | 'companies' | 'requests' | 'enrollments' | 'invitations';

export function StudentDashboard({ onLogout }: StudentDashboardProps) {
  // Preserve active tab state when navigating
  const savedTab = StatePreservation.loadSession<Tab>('student_dashboard_tab');
  const [activeTab, setActiveTab] = useState<Tab>(savedTab || 'profile');
  const [userData, setUserData] = useState<any>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  // Save tab state when it changes
  useEffect(() => {
    StatePreservation.saveSession('student_dashboard_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    const localUserData = getUserData();
    setUserData(localUserData);

    // Fetch user profile with photo
    if (localUserData?.user_id) {
      apiRequest<{ user_id: string; email: string; role: string; profile_photo_url?: string }>('/api/auth/me')
        .then(data => {
          setProfilePhoto(data.profile_photo_url || null);
        })
        .catch(() => { });
    }
  }, []);

  const initials = userData?.email ? userData.email[0].toUpperCase() : 'U';

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Header */}
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
            <span className="ml-2 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border backdrop-blur-sm bg-indigo-50/50 text-indigo-600 border-indigo-100/50">
              Student
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <button
              onClick={onLogout}
              className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Log out
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg ring-2 ring-white transition-all hover:scale-105 cursor-pointer bg-indigo-600 shadow-indigo-200 overflow-hidden"
              title="View Profile"
            >
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-indigo-50/50 to-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-black text-slate-900 mb-4">
              Welcome back to Vertex
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Discover opportunities, connect with peers, and grow your career
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-slate-200 sticky top-20 bg-white z-40">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-8 overflow-x-auto no-scrollbar">
              <TabButton
                icon={<User className="w-4 h-4" />}
                label="My Profile"
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
                icon={<Sparkles className="w-4 h-4" />}
                label="Opportunities"
                active={activeTab === 'opportunities'}
                onClick={() => setActiveTab('opportunities')}
              />
              <TabButton
                icon={<Users className="w-4 h-4" />}
                label="Browse Profiles"
                active={activeTab === 'browse'}
                onClick={() => setActiveTab('browse')}
              />
              <TabButton
                icon={<Users className="w-4 h-4" />}
                label="Team Requests"
                active={activeTab === 'requests'}
                onClick={() => setActiveTab('requests')}
              />
              <TabButton
                icon={<Trophy className="w-4 h-4" />}
                label="My Enrollments"
                active={activeTab === 'enrollments'}
                onClick={() => setActiveTab('enrollments')}
              />
              <TabButton
                icon={<Mail className="w-4 h-4" />}
                label="Team Invitations"
                active={activeTab === 'invitations'}
                onClick={() => setActiveTab('invitations')}
              />
              <TabButton
                icon={<Building2 className="w-4 h-4" />}
                label="Companies"
                active={activeTab === 'companies'}
                onClick={() => setActiveTab('companies')}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {activeTab === 'profile' && <StudentProfile />}
          {activeTab === 'projects' && <StudentProjects />}
          {activeTab === 'opportunities' && <OpportunitiesContent />}
          {activeTab === 'browse' && <BrowseProfiles />}
          {activeTab === 'requests' && <StudentTeamRequests />}
          {activeTab === 'enrollments' && <StudentEnrollments />}
          {activeTab === 'invitations' && <StudentTeamInvitations />}
          {activeTab === 'companies' && (
            <div className="text-center py-20">
              <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Companies Directory</h3>
              <p className="text-slate-500">Browse partner companies and opportunities</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ... TabButton ...

function StudentTeamRequests() {
    const [teams, setTeams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const data = await apiRequest<any>('/api/rooms/dashboard/my-activity');
                setTeams(data.hosted_rooms || []);
            } catch (err) {
                console.error("Failed to fetch activity", err);
            } finally {
                setLoading(false);
            }
        };
        fetchActivity();
    }, []);

    if (loading) return <div className="text-center py-20">Loading...</div>;

    if (teams.length === 0) {
        return (
            <div className="text-center py-20 text-slate-400">
                You haven't created any teams yet. Go to an event and create a room!
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-2xl font-bold text-slate-900">Incoming Requests</h2>
            {teams.map(team => (
                <div key={team.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-xl font-bold mb-4">{team.title}</h3>
                    <div className="space-y-4">
                        {team.applications.length === 0 ? (
                            <p className="text-slate-400 text-sm">No pending applications.</p>
                        ) : (
                            team.applications.map((app: any) => (
                                <div key={app.id} className="p-4 bg-slate-50 rounded-xl flex items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-slate-900">{app.applicant_name}</h4>
                                                <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">{app.role_title}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${app.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100'}`}>
                                                {app.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 mt-2 italic">"{app.message}"</p>
                                        
                                        {/* AI Insight */}
                                        <div className="mt-3 p-3 bg-indigo-50/50 rounded-lg border border-indigo-100">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                                                <span className="text-xs font-bold text-indigo-700">AI Compatibility Analysis</span>
                                                <span className="text-xs font-black text-indigo-600 ml-auto">{app.compatibility.score}% Match</span>
                                            </div>
                                            <p className="text-xs text-indigo-600/80">{app.compatibility.reason}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700">Accept</button>
                                        <button className="px-4 py-2 bg-white border border-slate-200 text-slate-500 text-xs font-bold rounded-lg hover:bg-slate-50">Decline</button>
                                        <Link to={`/student/profile/${app.applicant_id}`} className="px-4 py-2 bg-white border border-slate-200 text-slate-500 text-xs font-bold rounded-lg hover:bg-slate-50 text-center">
                                            Profile
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            ))}
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
      className={`flex items-center gap-2 px-4 py-3 text-sm font-bold transition-all duration-300 border-b-2 ${active
        ? 'border-indigo-600 text-indigo-600'
        : 'border-transparent text-slate-600 hover:text-indigo-600 hover:border-slate-200'
        }`}
    >
      {icon}
      {label}
    </button>
  );
}