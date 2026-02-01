
import '../index.css';

export function AIEligibility() {
  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-5xl mx-auto py-12 px-6">
            <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-bold uppercase tracking-wider mb-4 border border-blue-100 text-xs">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                AI Powered Verification
            </div>
            <div className="flex flex-col items-center">
            <h1 className="!text-5xl font-bold font-sans text-slate-900 mb-6 text-center">AI Eligibility Check</h1>
            <p className="text-xl text-slate-500 max-w-2xl text-center font-sans">Verify your qualifications automatically for the <br /><span className="font-semibold text-slate-700">Global AI Innovation 2026</span><br />hackathon using our Vertex AI Engine.</p>
            </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">fact_check</span>
                Verification Steps
            </h3>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative">
                <div className="flex gap-4 relative z-10">
                <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    <span className="material-symbols-outlined text-base">check</span>
                </div>
                <div className="w-0.5 h-full min-h-[3rem] bg-slate-200 mt-2"></div>
                </div>
                <div className="pb-8">
                <h4 className="text-base font-bold text-slate-900">Profile Sync</h4>
                <p className="text-sm text-slate-500 mt-1">Vertex account connected</p>
                </div>
                </div>
                <div className="flex gap-4 relative z-10">
                <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full border-2 border-indigo-600 bg-white flex items-center justify-center text-indigo-600 text-sm font-bold animate-pulse shrink-0">
                    2
                </div>
                <div className="w-0.5 h-full min-h-[3rem] bg-slate-200 mt-2"></div>
                </div>
                <div className="pb-8">
                <h4 className="text-base font-bold text-indigo-600">GitHub Analysis</h4>
                <p className="text-sm text-slate-500 mt-1">Scanning repositories & skills</p>
                </div>
                </div>
                <div className="flex gap-4 relative z-10">
                <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full border-2 border-slate-200 bg-white flex items-center justify-center text-slate-400 text-sm font-bold shrink-0">
                    3
                </div>
                </div>
                <div>
                <h4 className="text-base font-bold text-slate-400">Final Confirmation</h4>
                <p className="text-sm text-slate-500 mt-1">Eligibility certificate issued</p>
                </div>
                </div>
            </div>
            </div>
            <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
            <h4 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">Event Requirements</h4>
            <ul className="space-y-4">
                <li className="flex items-start gap-3 text-base text-slate-700">
                <span className="material-symbols-outlined text-blue-500 text-xl">verified</span>
                <span>Ages 18+ globally</span>
                </li>
                <li className="flex items-start gap-3 text-base text-slate-700">
                <span className="material-symbols-outlined text-blue-500 text-xl">code</span>
                <span>Experience with <strong className="text-blue-700">Gemini 1.5 Pro</strong></span>
                </li>
                <li className="flex items-start gap-3 text-base text-slate-700">
                <span className="material-symbols-outlined text-blue-500 text-xl">group</span>
                <span>1-4 members per team</span>
                </li>
            </ul>
            </div>
            </div>
            <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="p-8 md:p-12">
                <div className="flex flex-col items-center text-center">
                <div className="relative mb-8">
                <div className="w-32 h-32 rounded-3xl bg-slate-50 flex items-center justify-center relative overflow-hidden border border-slate-200">
                    <span className="material-symbols-outlined text-5xl text-indigo-600/40">smart_toy</span>
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/20 to-transparent animate-pulse"></div>
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.8)] animate-bounce"></div>
                </div>
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-3">AI Eligibility Analysis</h2>
                <p className="text-lg text-slate-500 mb-10 max-w-xl mx-auto">Connect your GitHub profile to allow Vertex AI to analyze your contributions and match them against the event's technical requirements.</p>
                <div className="w-full max-w-md space-y-4 mx-auto">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                        <span className="material-symbols-outlined text-sm">person</span>
                    </div>
                    <span className="text-base font-medium text-slate-700">Age & Status Verification</span>
                    </div>
                    <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded">PASSED</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                        <span className="material-symbols-outlined text-sm">terminal</span>
                    </div>
                    <span className="text-base font-medium text-slate-700">Gemini API Proficiency</span>
                    </div>
                    <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full w-[65%] animate-pulse"></div>
                    </div>
                    <span className="text-xs font-bold text-slate-400 tracking-wide">ANALYZING...</span>
                    </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-slate-400">
                        <span className="material-symbols-outlined text-sm">history_edu</span>
                    </div>
                    <span className="text-base font-medium text-slate-400">Skillset Consistency Check</span>
                    </div>
                    <span className="material-symbols-outlined text-slate-300">lock</span>
                </div>
                </div>
                </div>
            </div>
            <div className="bg-slate-50 p-8 border-t border-slate-200">
                <div className="flex items-start gap-4">
                <div className="bg-indigo-600 p-2 rounded-lg">
                    <span className="material-symbols-outlined text-white text-xl">psychology</span>
                </div>
                <div className="flex-1 space-y-4">
                    <div className="h-2 bg-slate-200 rounded-full w-1/4 animate-pulse"></div>
                    <div className="space-y-2">
                    <div className="h-2 bg-slate-200 rounded-full w-full animate-pulse"></div>
                    <div className="h-2 bg-slate-200 rounded-full w-5/6 animate-pulse"></div>
                    </div>
                    <div className="text-xs text-slate-400 italic">AI is generating your personalized eligibility feedback based on your repository history...</div>
                </div>
                </div>
            </div>
            </div>
            </div>
            </div>
            </div>
    </div>
  );
}
