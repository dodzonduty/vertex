import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { OpportunitiesContent } from '../components/OpportunitiesContent';
import { BrowseProfiles } from '../components/student/BrowseProfiles';
import { CompanyHiring } from '../components/company/CompanyHiring';
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
                            className={`nav-link whitespace-nowrap ${activeTab === 'profile' ? 'text-slate-900 after:w-full' : ''}`}
                        >
                            My Profile
                        </button>

                        {userType === 'company' ? (
                            <>
                                {/* Opportunities Dropdown */}
                                <div className="relative group h-full flex items-center">
                                    <button
                                        className={`nav-link flex items-center gap-2 ${activeTab === 'opportunities' ? 'text-slate-900 after:w-full' : ''}`}
                                        onClick={() => {/* Keep as trigger */ }}
                                    >
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
                                            <button 
                                                onClick={() => setActiveTab('opportunities')}
                                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors group/item text-left"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover/item:bg-indigo-100 transition-colors shrink-0">
                                                    <span className="material-symbols-outlined text-xl">add_circle</span>
                                                </div>
                                                <div className="text-left">
                                                    <div className="text-sm font-bold text-slate-900 whitespace-nowrap">Host an Opportunity</div>
                                                    <div className="text-xs text-slate-500 font-medium whitespace-nowrap">Create hackathons & events</div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>

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
                            className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
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
                        userType === 'student' ? <BrowseProfiles /> : <CompanyHiring />
                    )}
                </div>
            </main>
        </div>

    );
}


