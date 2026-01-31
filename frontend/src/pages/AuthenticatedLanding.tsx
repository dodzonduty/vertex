import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Users, Building2, GraduationCap, Sparkles } from 'lucide-react';
import { OpportunitiesContent } from '../components/OpportunitiesContent';
import { BrowseProfiles } from '../components/student/BrowseProfiles';
import { StudentOpenMatch } from '../components/student/StudentOpenMatch';
import { BrowseStudents } from '../components/company/BrowseStudents';
import { StudentProfile } from '../components/student/StudentProfile';
import { CompanyProfile } from '../components/company/CompanyProfile';
import '../components/Header.css';

interface AuthenticatedLandingProps {
    onLogout: () => void;
    userType: 'student' | 'company';
}

type Tab = 'profile' | 'opportunities' | 'profiles' | 'professors' | 'openmatch' | 'companies';

export function AuthenticatedLanding({ onLogout, userType }: AuthenticatedLandingProps) {
    const [activeTab, setActiveTab] = useState<Tab>('profile');

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
                        <span className={`ml-2 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border backdrop-blur-sm ${userType === 'student'
                            ? 'bg-indigo-50/50 text-indigo-600 border-indigo-100/50'
                            : 'bg-blue-50/50 text-blue-600 border-blue-100/50'
                            }`}>
                            {userType}
                        </span>
                    </Link>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={onLogout}
                            className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
                        >
                            Log out
                        </button>
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg ring-2 ring-white transition-all hover:scale-105 cursor-pointer ${userType === 'student' ? 'bg-indigo-600 shadow-indigo-200' : 'bg-blue-600 shadow-blue-200'
                                }`}
                            title="View Profile"
                        >
                            {userType === 'student' ? 'AJ' : <Building2 className="w-5 h-5" />}
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
                            {userType === 'student'
                                ? 'Discover opportunities, connect with peers, and grow your career'
                                : 'Find top talent, post opportunities, and build your team'}
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
                                icon={<Sparkles className="w-4 h-4" />}
                                label="Opportunities"
                                active={activeTab === 'opportunities'}
                                onClick={() => setActiveTab('opportunities')}
                            />
                            <TabButton
                                icon={<Users className="w-4 h-4" />}
                                label="Profiles"
                                active={activeTab === 'profiles'}
                                onClick={() => setActiveTab('profiles')}
                            />
                            <TabButton
                                icon={<GraduationCap className="w-4 h-4" />}
                                label="Professors"
                                active={activeTab === 'professors'}
                                onClick={() => setActiveTab('professors')}
                            />
                            {userType === 'student' && (
                                <TabButton
                                    icon={<Users className="w-4 h-4" />}
                                    label="Open Match"
                                    active={activeTab === 'openmatch'}
                                    onClick={() => setActiveTab('openmatch')}
                                />
                            )}
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
                    {activeTab === 'profile' && (
                        userType === 'student' ? <StudentProfile /> : <CompanyProfile />
                    )}
                    {activeTab === 'opportunities' && <OpportunitiesContent />}
                    {activeTab === 'profiles' && (
                        userType === 'student' ? <BrowseProfiles /> : <BrowseStudents />
                    )}
                    {activeTab === 'professors' && (
                        <div className="text-center py-20">
                            <GraduationCap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Professors Coming Soon</h3>
                            <p className="text-slate-500">Connect with professors and mentors</p>
                        </div>
                    )}
                    {activeTab === 'openmatch' && userType === 'student' && <StudentOpenMatch />}
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
