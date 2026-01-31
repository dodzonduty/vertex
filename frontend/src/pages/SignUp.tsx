import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, User, ArrowRight, GraduationCap, Briefcase } from 'lucide-react';
import '../components/Header.css';

export function SignUp() {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState<'student' | 'company' | null>(null);

    const handleRoleSelect = (role: 'student' | 'company') => {
        setSelectedRole(role);
        // Navigate to role-specific onboarding
        setTimeout(() => {
            if (role === 'student') {
                navigate('/onboarding/student');
            } else {
                navigate('/onboarding/company');
            }
        }, 300);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans bg-gradient-to-br from-slate-50 to-indigo-50">
            {/* Ambient background patterns */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 -left-20 w-[60vw] h-[60vw] rounded-full bg-indigo-500/5 blur-[120px]" />
                <div className="absolute bottom-1/4 -right-20 w-[50vw] h-[50vw] rounded-full bg-blue-500/5 blur-[120px]" />
            </div>

            <div className="w-full max-w-5xl relative z-10 animate-in fade-in zoom-in-95 duration-700">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-6xl font-black text-slate-900 tracking-tight">
                        Join Vertex
                    </h1>
                    <p className="text-xl text-slate-600 font-medium">
                        Choose your role to get started
                    </p>
                </div>

                {/* Role Selection Cards */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* Student Card */}
                    <div
                        onClick={() => handleRoleSelect('student')}
                        className={`group relative cursor-pointer transition-all duration-500 transform hover:-translate-y-2 ${selectedRole === 'student' ? 'scale-105' : ''
                            }`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
                        <div className="relative bg-white rounded-3xl p-12 border-2 border-slate-100 shadow-2xl group-hover:border-indigo-300 group-hover:shadow-indigo-500/10 transition-all">
                            <div className="flex flex-col items-center text-center space-y-6">
                                {/* Icon */}
                                <div className="w-28 h-28 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-200 group-hover:scale-110 transition-transform">
                                    <GraduationCap className="w-14 h-14 text-white" />
                                </div>

                                {/* Title */}
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-slate-900">I'm a Student</h2>
                                    <p className="text-slate-600 text-lg leading-relaxed">
                                        Build your portfolio, showcase projects, and connect with companies
                                    </p>
                                </div>

                                {/* Features */}
                                <ul className="text-left space-y-3 w-full">
                                    <li className="flex items-center gap-3 text-slate-700">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                                        <span className="font-medium">Create professional profile</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-700">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                                        <span className="font-medium">Showcase your projects</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-700">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                                        <span className="font-medium">Apply to opportunities</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-700">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                                        <span className="font-medium">Join project teams</span>
                                    </li>
                                </ul>

                                {/* CTA */}
                                <button className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2 group-hover:gap-4">
                                    Continue as Student
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Company Card */}
                    <div
                        onClick={() => handleRoleSelect('company')}
                        className={`group relative cursor-pointer transition-all duration-500 transform hover:-translate-y-2 ${selectedRole === 'company' ? 'scale-105' : ''
                            }`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
                        <div className="relative bg-white rounded-3xl p-12 border-2 border-slate-100 shadow-2xl group-hover:border-blue-300 group-hover:shadow-blue-500/10 transition-all">
                            <div className="flex flex-col items-center text-center space-y-6">
                                {/* Icon */}
                                <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-200 group-hover:scale-110 transition-transform">
                                    <Briefcase className="w-14 h-14 text-white" />
                                </div>

                                {/* Title */}
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-slate-900">I'm a Company</h2>
                                    <p className="text-slate-600 text-lg leading-relaxed">
                                        Find talented students and post exciting opportunities
                                    </p>
                                </div>

                                {/* Features */}
                                <ul className="text-left space-y-3 w-full">
                                    <li className="flex items-center gap-3 text-slate-700">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                        <span className="font-medium">Post job opportunities</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-700">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                        <span className="font-medium">Discover student talent</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-700">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                        <span className="font-medium">Build your employer brand</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-700">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                        <span className="font-medium">Connect with universities</span>
                                    </li>
                                </ul>

                                {/* CTA */}
                                <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 hover:shadow-2xl hover:shadow-blue-300 transition-all flex items-center justify-center gap-2 group-hover:gap-4">
                                    Continue as Company
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sign In Link */}
                <div className="text-center">
                    <p className="text-slate-600 text-lg">
                        Already have an account?{' '}
                        <button
                            onClick={() => navigate('/signin')}
                            className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors underline decoration-2 underline-offset-4"
                        >
                            Sign In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
