import { useState, useEffect } from 'react';
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

export function AuthenticatedLanding({ userType }: AuthenticatedLandingProps) {
    // Preserve active tab state when navigating
    const storageKey = `${userType}_landing_tab`;
    const savedTab = StatePreservation.loadSession<Tab>(storageKey);
    const [activeTab] = useState<Tab>(savedTab || 'profile');

    // Save tab state when it changes
    useEffect(() => {
        StatePreservation.saveSession(storageKey, activeTab);
    }, [activeTab, storageKey]);

    return (
        <div className="bg-white font-sans text-slate-900">
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
        </div>
    );
}


