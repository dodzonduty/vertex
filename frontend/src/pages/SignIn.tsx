import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Building2, User, ArrowRight } from 'lucide-react';
import '../components/Header.css'; // Re-use header styles for consistency

export function SignIn() {
    const navigate = useNavigate();
    const [role, setRole] = useState<'student' | 'company'>('student');
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            navigate(role === 'student' ? '/student-home' : '/company-home');
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-indigo-600/5 blur-[120px]" />
                <div className="absolute top-[40%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/5 blur-[100px]" />
            </div>



            <div className="flex-1 flex items-center justify-center p-4 relative z-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-indigo-500/10 border border-white/20 ring-1 ring-slate-200/50 p-8">

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-indigo-800 mb-2">Welcome Back</h1>
                        <p className="text-slate-500">Sign in to access your dashboard</p>
                    </div>

                    {/* Role Toggle */}
                    <div className="flex bg-slate-100/80 p-1 rounded-xl mb-8 relative">
                        <div
                            className={`absolute inset-y-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-out transform ${role === 'student' ? 'left-1' : 'translate-x-[100%] left-1'}`}
                        />
                        <button
                            onClick={() => setRole('student')}
                            className={`flex-1 relative z-10 py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-colors duration-300 ${role === 'student' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <User className="w-4 h-4" />
                            Student
                        </button>
                        <button
                            onClick={() => setRole('company')}
                            className={`flex-1 relative z-10 py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-colors duration-300 ${role === 'company' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Building2 className="w-4 h-4" />
                            Company
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Password</label>
                                <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
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
                            {loading ? 'Signing in...' : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
