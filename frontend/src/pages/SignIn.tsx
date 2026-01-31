import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { login } from '../lib/api/auth';
import { toast } from 'sonner';
import '../components/Header.css';

export function SignIn() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await login({ email, password });

            toast.success('Login Successful!', {
                description: `Welcome back, ${response.email}`,
            });

            // Navigate based on role
            setTimeout(() => {
                if (response.role === 'student') {
                    navigate('/student-home');
                } else if (response.role === 'company') {
                    navigate('/company-home');
                } else {
                    navigate('/');
                }
            }, 500);
        } catch (error) {
            setLoading(false);
            toast.error('Login Failed', {
                description: error instanceof Error ? error.message : 'Invalid email or password',
            });
        }
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

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-slate-600 text-sm">
                            Don't have an account?{' '}
                            <button
                                onClick={() => navigate('/signup')}
                                className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
                            >
                                Sign Up
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
