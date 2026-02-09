import { useRef, useEffect } from 'react';
import { X, Sparkles, User, Building2, Rocket, ArrowRight, Zap, BrainCircuit, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAI } from '../../lib/hooks/useAI';

interface AIModalProps {
    isOpen: boolean;
    onClose: () => void;
    context?: string;
    placeholder?: string;
}

export function AIModal({ isOpen, onClose, context, placeholder }: AIModalProps) {
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);
    const { query, setQuery, response, isLoading, handleAskAI, reset } = useAI();

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleClose = () => {
        reset();
        onClose();
    };

    const onSearch = () => {
        if (query.trim()) {
            handleAskAI(context);
        }
    };

    const quickStarts = [
        { label: 'Top Talent', icon: <User className="w-3.5 h-3.5" />, hint: 'Show me AI students with React skills' },
        { label: 'Industry', icon: <Building2 className="w-3.5 h-3.5" />, hint: 'Companies in Fintech industry' },
        { label: 'Growth', icon: <Rocket className="w-3.5 h-3.5" />, hint: 'Paid internships for graduates' },
        { label: 'Impact', icon: <Zap className="w-3.5 h-3.5" />, hint: 'Ongoing hackathons near me' },
    ];

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
            <div className="bg-white/95 backdrop-blur-2xl rounded-[2rem] max-w-3xl w-full h-[85vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-500 border border-white/40 ring-1 ring-black/5 relative">

                {/* Header Section */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/50 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <BrainCircuit className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Vertex AI Assistant</h2>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Online</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleClose}
                        className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content Area - Scrollable */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/30">

                    {!response && !isLoading && (
                        <div className="h-full flex flex-col items-center justify-center -mt-10">
                            <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mb-6">
                                <Sparkles className="w-10 h-10 text-indigo-500" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2 font-display text-center">How can I help you today?</h3>
                            <p className="text-slate-500 text-sm mb-10 max-w-md text-center leading-relaxed">
                                I can help you find top talent, discover companies, or explore opportunities across the Vertex platform.
                            </p>

                            <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
                                {quickStarts.map((item) => (
                                    <button
                                        key={item.label}
                                        onClick={() => { setQuery(item.hint); inputRef.current?.focus(); }}
                                        className="quick-start-chip justify-start hover:shadow-md transition-all duration-300"
                                    >
                                        <span className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                            {item.icon}
                                        </span>
                                        <div className="text-left overflow-hidden">
                                            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">{item.label}</div>
                                            <div className="text-xs font-bold text-slate-700 truncate w-full">{item.hint}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {isLoading && (
                        <div className="h-full flex flex-col items-center justify-center">
                            <div className="neural-scan-container scale-125">
                                <div className="scanning-beam"></div>
                                <div className="neural-orbit orbit-1"></div>
                                <div className="neural-orbit orbit-2"></div>
                                <div className="neural-orbit orbit-3"></div>
                                <BrainCircuit className="w-10 h-10 text-indigo-600/30" />
                            </div>
                            <div className="mt-16 text-center">
                                <div className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] mb-2 animate-pulse">Processing Query</div>
                                <p className="text-slate-400 text-[10px] font-bold">Analyzing platform data...</p>
                            </div>
                        </div>
                    )}

                    {response && !isLoading && (
                        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-4">
                            {/* User Message Bubble (Visual representation of query) */}
                            <div className="flex justify-end mb-8">
                                <div className="bg-indigo-600 text-white px-6 py-3.5 rounded-2xl rounded-tr-none shadow-lg shadow-indigo-200 max-w-[80%] text-sm font-medium leading-relaxed">
                                    {query}
                                </div>
                            </div>

                            {/* Bot Response */}
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 mt-1">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div className="flex-1 space-y-8">
                                    <div className="bg-white p-6 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">
                                        {response.answer}
                                    </div>

                                    {/* Results Grid - Enhanced Cards */}
                                    <div className="space-y-8">
                                        {/* Students */}
                                        {response.recommended_students && response.recommended_students.length > 0 && (
                                            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 delay-100">
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                                                    Talent Matches
                                                </h4>
                                                <div className="grid grid-cols-1 gap-3">
                                                    {response.recommended_students.map((student: any) => (
                                                        <div
                                                            key={student.student_id}
                                                            onClick={() => { navigate(`/student/profile/${student.student_id}`); onClose(); }}
                                                            className="premium-ai-card p-4 rounded-2xl flex items-center gap-4 cursor-pointer group bg-white hover:bg-indigo-50/30 border border-slate-100 hover:border-indigo-100"
                                                        >
                                                            <div className="w-12 h-12 rounded-xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100">
                                                                {student.photo_url ? <img src={student.photo_url} className="w-full h-full object-cover" /> : <User className="w-6 h-6 text-slate-300 m-3" />}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between mb-0.5">
                                                                    <h5 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate text-sm">{student.full_name}</h5>
                                                                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded uppercase tracking-wide">98% Match</span>
                                                                </div>
                                                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight truncate">
                                                                    {student.degree_level} • {student.university}
                                                                </p>
                                                            </div>
                                                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Companies */}
                                        {response.recommended_companies && response.recommended_companies.length > 0 && (
                                            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 delay-200">
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                                                    Companies
                                                </h4>
                                                <div className="grid grid-cols-1 gap-3">
                                                    {response.recommended_companies.map((company: any) => (
                                                        <div
                                                            key={company.company_id}
                                                            onClick={() => { navigate(`/company/profile/${company.company_id}`); onClose(); }}
                                                            className="premium-ai-card p-4 rounded-2xl flex items-center gap-4 cursor-pointer group bg-white hover:bg-blue-50/30 border border-slate-100 hover:border-blue-100"
                                                        >
                                                            <div className="w-12 h-12 rounded-xl bg-white overflow-hidden shrink-0 border border-slate-100 p-2 flex items-center justify-center">
                                                                {company.photo_url ? <img src={company.photo_url} className="w-full h-full object-contain" /> : <Building2 className="w-6 h-6 text-slate-300" />}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h5 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate text-sm">{company.name}</h5>
                                                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight truncate">
                                                                    {company.industry}
                                                                </p>
                                                            </div>
                                                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Chat Input Bar - Fixed at Bottom */}
                <div className="ai-chat-bar-container z-20">
                    <div className="ai-chat-input-wrapper">
                        <input
                            ref={inputRef}
                            type="text"
                            className="ai-chat-input"
                            placeholder={placeholder || "Ask follow-up..."}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                            disabled={isLoading}
                        />
                        <button
                            onClick={onSearch}
                            disabled={!query.trim() || isLoading}
                            className="ai-send-btn"
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <ArrowRight className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    <div className="text-center mt-3">
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                            Vertex AI can make mistakes. Check important info.
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
}
