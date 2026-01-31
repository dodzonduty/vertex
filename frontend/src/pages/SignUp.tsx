import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Building2, User, UserPlus } from 'lucide-react';
import '../components/Header.css';

export function SignUp() {
    const navigate = useNavigate();
    const [role, setRole] = useState<'student' | 'company'>('student');
    const [loading, setLoading] = useState(false);

    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            navigate(role === 'student' ? '/onboarding' : '/company-dashboard');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[10%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-indigo-600/5 blur-[120px]" />
                <div className="absolute bottom-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/5 blur-[100px]" />
            </div>



            <div className="flex-1 flex items-center justify-center p-4 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-indigo-500/10 border border-white/20 ring-1 ring-slate-200/50 p-8">

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-indigo-800 mb-2">Create Account</h1>
                        <p className="text-slate-500">Join Vertex to accelerate your career</p>
                    </div>

                    {/* Role Toogle */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button
                            onClick={() => setRole('student')}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all duration-300 ${role === 'student'
                                ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700'
                                : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-500'
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${role === 'student' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                <User className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-sm">I'm a Student</span>
                        </button>

                        <button
                            onClick={() => setRole('company')}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all duration-300 ${role === 'company'
                                ? 'border-blue-600 bg-blue-50/50 text-blue-700'
                                : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50 text-slate-500'
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${role === 'company' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                <Building2 className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-sm">I'm a Company</span>
                        </button>
                    </div>

                    <form onSubmit={handleSignUp} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">First Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium text-slate-900"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Last Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium text-slate-900"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium text-slate-900"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium text-slate-900"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 ${role === 'student'
                                ? 'bg-gradient-to-r from-indigo-600 to-violet-600'
                                : 'bg-gradient-to-r from-blue-600 to-cyan-600'
                                }`}
                        >
                            {loading ? 'Creating Account...' : (
                                <>
                                    Create Account
                                    <UserPlus className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
