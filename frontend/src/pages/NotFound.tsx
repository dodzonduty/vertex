import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFound() {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[10%] left-[10%] w-[60vw] h-[60vw] rounded-full bg-indigo-600/5 blur-[120px]" />
                <div className="absolute bottom-[20%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/5 blur-[100px]" />
            </div>

            <div className="relative z-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                <h1 className="text-[12rem] font-black text-slate-100 leading-none select-none">404</h1>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Lost in Space?</h2>
                    <p className="text-slate-500 text-lg max-w-md mx-auto mb-10">
                        The page you're looking for has either vanished into the void or moved to a better neighborhood.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            to="/"
                            className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full font-bold shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                        >
                            <Home className="w-5 h-5" />
                            Back to Home
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="px-8 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-full font-bold hover:bg-slate-50 hover:shadow-md transition-all flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
