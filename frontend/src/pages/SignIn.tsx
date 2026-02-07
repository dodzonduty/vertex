import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { login } from '../lib/api/auth';
import { toast } from 'sonner';
import '../components/Header.css';

interface InputProps {
    type: string;
    placeholder: string;
    icon: React.ReactNode;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField = ({ type, placeholder, icon, value, onChange }: InputProps) => (
    <div className="flex items-center gap-3 border border-slate-200 rounded-xl px-5 py-3.5 focus-within:ring-2 focus-within:ring-indigo-500 hover:border-slate-300 transition-all bg-white">
        <span className="text-slate-400">{icon}</span>
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full outline-none text-slate-900 placeholder:text-slate-300 bg-transparent cursor-text"
            required
        />
    </div>
);

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

            // Dispatch auth change event with small delay to ensure storage consistency
            setTimeout(() => {
                window.dispatchEvent(new Event('auth-change'));
            }, 100);

            // Navigate based on role
            if (response.role === 'student') navigate('/student-home');
            else if (response.role === 'company') navigate('/company-home');
            else navigate('/');
        } catch (error) {
            toast.error('Login Failed', {
                description: error instanceof Error ? error.message : 'Invalid email or password',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden font-sans text-slate-900">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-indigo-600/5 blur-[120px]" />
                <div className="absolute top-[40%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/5 blur-[100px]" />
            </div>

            <div className="max-w-lg w-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-indigo-500/10 border border-white/20 ring-1 ring-slate-200/50 p-10 relative z-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-slate-900 mb-4">
                        Welcome Back
                    </h1>
                    <p className="text-slate-700 text-lg font-medium">Sign in to access your dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                        <InputField
                            type="email"
                            placeholder="you@example.com"
                            icon={<Mail className="w-5 h-5" />}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Password</label>
                        <InputField
                            type="password"
                            placeholder="••••••••"
                            icon={<Lock className="w-5 h-5" />}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ minHeight: '45px' }}
                        className="w-full rounded-2xl font-extrabold text-lg text-white bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 hover:from-purple-500 hover:via-violet-500 hover:to-indigo-500 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-300"
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

                <div className="mt-8 text-center">
                    <p className="text-slate-600 text-sm">
                        Don't have an account?{'  '}
                        <button
                            onClick={() => navigate('/signup')}
                            className="text-slate-900 font-bold hover:text-indigo-700 cursor-pointer transition-colors underline decoration-2 underline-offset-4"
                        >
                            Sign Up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
