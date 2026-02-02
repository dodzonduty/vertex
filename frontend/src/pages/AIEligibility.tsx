import { useState } from 'react';
import { getPerfectMatch } from '../lib/api/opportunities';
import type { PerfectMatch } from '../lib/api/opportunities';
import { toast } from 'sonner';
import { Sparkles, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import '../index.css';

export function AIEligibility() {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<PerfectMatch[]>([]);
    const [success, setSuccess] = useState(false);
    const [analysisStep, setAnalysisStep] = useState(1);

    const startAnalysis = async () => {
        setLoading(true);
        setAnalysisStep(2);

        try {
            // Simulate progress
            await new Promise(r => setTimeout(r, 1500));
            setAnalysisStep(3);

            const data = await getPerfectMatch('hackathon');
            setResults(data);

            await new Promise(r => setTimeout(r, 1000));
            setSuccess(true);
            toast.success("AI Eligibility Verification Complete!");
        } catch (error) {
            console.error("Analysis failed", error);
            toast.error("AI Analysis failed. Please check your profile tags.");
        } finally {
            setLoading(false);
        }
    };
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
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${analysisStep >= 1 ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                                            {analysisStep > 1 ? <CheckCircle2 className="w-4 h-4" /> : '1'}
                                        </div>
                                        <div className={`w-0.5 h-full min-h-[3rem] mt-2 ${analysisStep > 1 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
                                    </div>
                                    <div className="pb-8">
                                        <h4 className={`text-base font-bold ${analysisStep >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>Profile Sync</h4>
                                        <p className="text-sm text-slate-500 mt-1">Vertex account connected</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 relative z-10">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${analysisStep === 2 ? 'border-2 border-indigo-600 bg-white text-indigo-600 animate-pulse' : analysisStep > 2 ? 'bg-indigo-600 text-white' : 'border-2 border-slate-200 bg-white text-slate-400'}`}>
                                            {analysisStep > 2 ? <CheckCircle2 className="w-4 h-4" /> : '2'}
                                        </div>
                                        <div className={`w-0.5 h-full min-h-[3rem] mt-2 ${analysisStep > 2 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
                                    </div>
                                    <div className="pb-8">
                                        <h4 className={`text-base font-bold ${analysisStep >= 2 ? 'text-indigo-600' : 'text-slate-400'}`}>Target Analysis</h4>
                                        <p className="text-sm text-slate-500 mt-1">Scanning event requirements</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 relative z-10">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${analysisStep === 3 ? 'border-2 border-indigo-600 bg-white text-indigo-600 animate-pulse' : success ? 'bg-green-600 text-white' : 'border-2 border-slate-200 bg-white text-slate-400'}`}>
                                            {success ? <CheckCircle2 className="w-4 h-4" /> : '3'}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className={`text-base font-bold ${success ? 'text-green-600' : analysisStep === 3 ? 'text-indigo-600' : 'text-slate-400'}`}>Final Result</h4>
                                        <p className="text-sm text-slate-500 mt-1">{success ? 'Eligibility approved' : 'Awaiting analysis'}</p>
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
                                    <h2 className="text-3xl font-black text-slate-900 mb-3">{success ? 'Analysis Complete' : 'AI Eligibility Analysis'}</h2>
                                    <p className="text-lg text-slate-500 mb-10 max-w-xl mx-auto">
                                        {success
                                            ? "Vertex AI has successfully verified your profile against the event's technical requirements."
                                            : "Analyze your profile and skills against this event's technical requirements using the Vertex AI Engine."}
                                    </p>

                                    {!success && !loading && (
                                        <button
                                            onClick={startAnalysis}
                                            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:shadow-indigo-200 transition-all flex items-center gap-2 group mb-8"
                                        >
                                            <Sparkles className="w-5 h-5 group-hover:animate-spin" />
                                            Start AI Verification
                                        </button>
                                    )}

                                    {(loading || success) && (
                                        <div className="w-full max-w-md space-y-4 mx-auto">
                                            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${analysisStep >= 1 ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                                        {analysisStep > 1 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                                                    </div>
                                                    <span className="text-base font-medium text-slate-700">Profile Alignment</span>
                                                </div>
                                                <span className={`text-sm font-bold ${analysisStep > 1 ? 'text-green-600 bg-green-50' : 'text-slate-400 bg-slate-50'} px-3 py-1.5 rounded`}>
                                                    {analysisStep > 1 ? 'PASSED' : 'PENDING'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${analysisStep >= 2 ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                                                        {analysisStep > 2 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Loader2 className={`w-3.5 h-3.5 ${analysisStep === 2 ? 'animate-spin' : ''}`} />}
                                                    </div>
                                                    <span className="text-base font-medium text-slate-700">Skill Proficiency</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {analysisStep === 2 ? (
                                                        <>
                                                            <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                                <div className="bg-indigo-600 h-full w-[65%] animate-pulse"></div>
                                                            </div>
                                                            <span className="text-xs font-bold text-slate-400 tracking-wide">ANALYZING...</span>
                                                        </>
                                                    ) : analysisStep > 2 ? (
                                                        <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded">VERIFIED</span>
                                                    ) : (
                                                        <span className="text-sm font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded">LOCKED</span>
                                                    )}
                                                </div>
                                            </div>
                                            {success && results.length > 0 && (
                                                <div className="mt-8 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 animate-in fade-in zoom-in-95 duration-500">
                                                    <h4 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
                                                        <Sparkles className="w-4 h-4" />
                                                        Perfect Matches Found
                                                    </h4>
                                                    <div className="space-y-3">
                                                        {results.map((match, i) => (
                                                            <div key={i} className="flex justify-between items-center text-sm bg-white p-3 rounded-xl border border-indigo-100">
                                                                <span className="font-medium text-slate-700">{match.title}</span>
                                                                <span className="text-indigo-600 font-bold">{match.match}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="bg-slate-50 p-8 border-t border-slate-200">
                                <div className="flex items-start gap-4">
                                    <div className="bg-indigo-600 p-2 rounded-lg">
                                        <Sparkles className="text-white w-5 h-5" />
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="h-2 bg-slate-200 rounded-full w-1/4"></div>
                                        <div className="space-y-2">
                                            <p className="text-sm text-slate-600">
                                                {success
                                                    ? "Vertex AI has matched your profile with several high-impact roles based on your verified skills in " + Array.from(new Set(results.map(r => r.tech))).join(", ") + "."
                                                    : loading
                                                        ? "Analyzing your repository history and project contributions..."
                                                        : "Connect your profile to receive personalized AI matching and eligibility status."}
                                            </p>
                                        </div>
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
