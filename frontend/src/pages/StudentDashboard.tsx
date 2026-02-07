import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Users, Sparkles, FolderGit2, Trophy, Mail } from 'lucide-react';
import { StudentProfile } from '../components/student/StudentProfile';
import { StudentProjects } from '../components/student/StudentProjects';
import { StudentEnrollments } from '../components/student/StudentEnrollments';
import { StudentTeamInvitations } from '../components/student/StudentTeamInvitations';
import { apiRequest } from '../lib/api/config';
import { StatePreservation } from '../lib/utils/statePreservation';

interface StudentDashboardProps {
}

type Tab = 'profile' | 'projects' | 'opportunities' | 'browse' | 'companies' | 'requests' | 'enrollments' | 'invitations';

export function StudentDashboard({}: StudentDashboardProps) {
  // Preserve active tab state when navigating
  const savedTab = StatePreservation.loadSession<Tab>('student_dashboard_tab');
  const [activeTab, setActiveTab] = useState<Tab>(savedTab || 'profile');
  // Save tab state when it changes
  useEffect(() => {
    StatePreservation.saveSession('student_dashboard_tab', activeTab);
  }, [activeTab]);

  return (
    <div className="bg-white font-sans text-slate-900">
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
        <div className="sticky top-[70px] z-40 mb-10 py-4 bg-white/95 backdrop-blur-sm border-b border-slate-200/50 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4">
            <div 
              className="flex flex-wrap justify-center items-center gap-3 px-6 py-4 bg-white rounded-full border border-slate-200 shadow-xl mx-auto w-fit"
              style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <TabButton
                icon={<User className="w-6 h-6" />}
                label="My Profile"
                active={activeTab === 'profile'}
                onClick={() => setActiveTab('profile')}
              />
              <TabButton
                icon={<FolderGit2 className="w-6 h-6" />}
                label="Projects"
                active={activeTab === 'projects'}
                onClick={() => setActiveTab('projects')}
              />
              <TabButton
                icon={<Users className="w-6 h-6" />}
                label="Team Requests"
                active={activeTab === 'requests'}
                onClick={() => setActiveTab('requests')}
              />
              <TabButton
                icon={<Trophy className="w-6 h-6" />}
                label="My Enrollments"
                active={activeTab === 'enrollments'}
                onClick={() => setActiveTab('enrollments')}
              />
              <TabButton
                icon={<Mail className="w-6 h-6" />}
                label="Team Invitations"
                active={activeTab === 'invitations'}
                onClick={() => setActiveTab('invitations')}
                style={{ paddingRight: '40px' }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 pb-20">
          {activeTab === 'profile' && <StudentProfile />}
          {activeTab === 'projects' && <StudentProjects />}
          {activeTab === 'requests' && <StudentTeamRequests />}
          {activeTab === 'enrollments' && <StudentEnrollments />}
          {activeTab === 'invitations' && <StudentTeamInvitations />}
        </div>
    </div>
  );
}

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
  style?: React.CSSProperties;
}

function TabButton({ icon, label, active, onClick, style }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{ minWidth: '160px', minHeight: '64px', ...style }} 
      className={`relative cursor-pointer flex items-center justify-center gap-3 px-8 py-5 text-lg font-bold transition-all duration-300 rounded-full whitespace-nowrap overflow-hidden ${active
        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200 ring-2 ring-indigo-600 ring-offset-2 transform scale-105'
        : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
        }`}
    >
      {icon}
      {label}
    </button>
  );
}