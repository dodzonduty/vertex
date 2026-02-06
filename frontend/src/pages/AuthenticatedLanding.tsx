import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Users, Building2, Sparkles } from 'lucide-react';
import { OpportunitiesContent } from '../components/OpportunitiesContent';
import { BrowseProfiles } from '../components/student/BrowseProfiles';
import { BrowseStudents } from '../components/company/BrowseStudents';
import { StudentProfile } from '../components/student/StudentProfile';
import { CompanyProfile } from '../components/company/CompanyProfile';
import { CompanyEvents } from '../components/company/CompanyEvents';
import { StatePreservation } from '../lib/utils/statePreservation';
import '../components/Header.css';
import '../components/Footer.css';

interface AuthenticatedLandingProps {
    onLogout: () => void;
    userType: 'student' | 'company';
}

type Tab = 'profile' | 'opportunities' | 'profiles';

export function AuthenticatedLanding({ onLogout, userType }: AuthenticatedLandingProps) {
    // Preserve active tab state when navigating
    const storageKey = `${userType}_landing_tab`;
    const savedTab = StatePreservation.loadSession<Tab>(storageKey);
    const [activeTab, setActiveTab] = useState<Tab>(savedTab || 'profile');

    // Save tab state when it changes
    useEffect(() => {
        StatePreservation.saveSession(storageKey, activeTab);
    }, [activeTab, storageKey]);

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            {/* Header */}
            <header className="header header-solid">
                <div className="header-container">
                    {/* Logo Area */}
                    <div
                        className="logo-link cursor-pointer"
                        onClick={() => setActiveTab('profile')}
                    >
                        <img
                            alt="Vertex Logo"
                            className="logo-img"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDruz-Z1rxJw2B99u929C03U08fcvdxSK_JROTw_OzxOSsBmN5XzbwguREzreQuwCd4E7AbD8loZK5nPz9oXGwKxDzCFurTlEI1bH3irhCJkHZzVjUE68rhJYJY98VFJbXhXkEHb3hn_iYaF1rQNa59tTo8Y3gOV6canfBt7zn-KKQHlBggral3oWAH6w6vYHO-huFlrtFDuLD9wvwmetKoYCj-3cXISGEQJDtXhFTo7pP8j1iredjzJpusDMEqGs-IVY0k2K8LxPY"
                        />
                        <span className="logo-text">Vertex</span>
                        <span className={`ml-3 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full border ${userType === 'student'
                            ? 'bg-indigo-50 text-indigo-600 border-indigo-100'
                            : 'bg-blue-50 text-blue-600 border-blue-100'
                            }`}>
                            {userType}
                        </span>
                    </div>

                    {/* Navigation Tabs */}
                    <nav className="desktop-nav">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`nav-link ${activeTab === 'profile' ? 'text-slate-900 after:w-full' : ''}`}
                        >
                            My Profile
                        </button>

                        {userType === 'company' ? (
                            <>
                                <button
                                    onClick={() => setActiveTab('opportunities')}
                                    className={`nav-link ${activeTab === 'opportunities' ? 'text-slate-900 after:w-full' : ''}`}
                                >
                                    Events
                                    <span className="header-badge header-badge-purple">Active</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('profiles')}
                                    className={`nav-link ${activeTab === 'profiles' ? 'text-slate-900 after:w-full' : ''}`}
                                >
                                    Hiring
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setActiveTab('opportunities')}
                                    className={`nav-link ${activeTab === 'opportunities' ? 'text-slate-900 after:w-full' : ''}`}
                                >
                                    Opportunities
                                    <span className="header-badge header-badge-blue">New</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('profiles')}
                                    className={`nav-link ${activeTab === 'profiles' ? 'text-slate-900 after:w-full' : ''}`}
                                >
                                    Profiles
                                </button>
                            </>
                        )}
                    </nav>

                    {/* Right Side Actions */}
                    <div className="auth-buttons flex items-center gap-4">
                        <button
                            onClick={onLogout}
                            className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                        >
                            Log out
                        </button>

                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md ring-2 ring-white transition-transform hover:scale-105 ${userType === 'student' ? 'bg-indigo-600' : 'bg-blue-600'
                                }`}
                        >
                            {userType === 'student' ? 'AJ' : <Building2 className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-20">
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


                {/* Content */}
                <div className="max-w-7xl mx-auto px-6 py-1">
                    {activeTab === 'profile' && (
                        userType === 'student' ? <StudentProfile /> : <CompanyProfile />
                    )}
                    {activeTab === 'opportunities' && (
                        userType === 'student' ? <OpportunitiesContent /> : <CompanyEvents />
                    )}
                    {activeTab === 'profiles' && (
                        userType === 'student' ? <BrowseProfiles /> : <BrowseStudents />
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
