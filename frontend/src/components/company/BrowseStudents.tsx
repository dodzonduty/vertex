import { useState } from 'react';
import { Search, Sparkles, ArrowRight, CheckCircle2, Star } from 'lucide-react';

export function BrowseStudents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [useAISearch, setUseAISearch] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const availableTags = [
    'React', 'Python', 'AI/ML', 'Node.js', 'TypeScript', 'Full-Stack',
    'Mobile', 'UI/UX', 'DevOps', 'Data Science', 'Blockchain'
  ];

  const mockStudents = [
    {
      id: '1',
      name: 'Alex Johnson',
      university: 'Stanford University',
      year: 'Junior',
      jobTitle: 'Full-Stack Developer',
      avatar: 'AJ',
      skills: ['React', 'Node.js', 'TypeScript', 'Python', 'AI/ML'],
      atsScore: 85,
      projectCount: 5,
      verified: true
    },
    {
      id: '2',
      name: 'Sarah Chen',
      university: 'MIT',
      year: 'Senior',
      jobTitle: 'AI/ML Engineer',
      avatar: 'SC',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP', 'Data Science'],
      atsScore: 92,
      projectCount: 8,
      verified: true
    },
    {
      id: '3',
      name: 'Mike Rodriguez',
      university: 'UC Berkeley',
      year: 'Graduate',
      jobTitle: 'Blockchain Developer',
      avatar: 'MR',
      skills: ['Solidity', 'Web3', 'React', 'Node.js', 'Ethereum'],
      atsScore: 78,
      projectCount: 6,
      verified: false
    }
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-4 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6 text-center md:text-left">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Discover Talent</h1>
          <p className="text-slate-600 text-lg">Identify and connect with the next generation of industry leaders.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Elite Pipeline</div>
              <div className="text-sm font-black text-blue-900 leading-none">Accessing Tier 1</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Interface - Premium Glassmorphism */}
      <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 mb-10 transition-all hover:border-blue-100">
        <div className={`flex flex-col md:flex-row gap-4 mb-8 p-2 rounded-2xl border transition-all duration-300 ${useAISearch ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-slate-100 bg-slate-50'}`}>
          <div className="flex-1 relative w-full group">
            <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${useAISearch ? 'text-blue-500' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder={useAISearch ? "Describe your requirements (e.g. 'A student who built a scalable AI app...')" : "Search by name, university, or keywords..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-4 py-4 bg-transparent outline-none text-slate-900 font-medium placeholder:text-slate-400"
            />
          </div>
          <button
            onClick={() => setUseAISearch(!useAISearch)}
            className={`flex items-center gap-2 px-8 py-4 rounded-xl transition-all font-bold ${useAISearch ? 'bg-blue-600 text-white shadow-xl' : 'bg-white text-slate-600 hover:bg-slate-200'}`}
          >
            <Sparkles className={`w-5 h-5 ${useAISearch ? 'animate-pulse' : ''}`} />
            <span>AI Talent Finder</span>
          </button>
        </div>

        {!useAISearch ? (
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-4">Core Competencies</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 border ${selectedTags.includes(tag)
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 rounded-2xl p-6 text-white flex items-center justify-between group overflow-hidden relative">
            <div className="relative z-10">
              <h4 className="font-bold text-blue-400 mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Neural Search Active
              </h4>
              <p className="text-sm text-slate-400">Our engine is mapping your constraints to our verified talent pool.</p>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
              <Search className="w-24 h-24 transform -rotate-12" />
            </div>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockStudents.map((student) => (
          <div
            key={student.id}
            className="group bg-white rounded-[2rem] shadow-lg border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer relative"
          >
            {/* Header / Avatar */}
            <div className="p-8 pb-4 text-center">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl flex items-center justify-center text-3xl font-black text-blue-600 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  {student.avatar}
                </div>
                {student.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-lg border border-slate-100">
                    <CheckCircle2 className="w-5 h-5 text-green-500 fill-current" />
                  </div>
                )}
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{student.name}</h3>
              <p className="text-blue-600 text-xs font-black uppercase tracking-widest mb-4 leading-none">{student.jobTitle}</p>
              <div className="flex flex-col items-center gap-1 mb-6 text-slate-400 font-bold text-[10px] uppercase">
                <span>{student.university}</span>
                <span className="opacity-50">•</span>
                <span>{student.year}</span>
              </div>
            </div>

            {/* ATS Score */}
            <div className="px-8 mb-6">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="flex items-center justify-between mb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Profile Quality</span>
                  <span className="text-blue-600">{student.atsScore}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                    style={{ width: `${student.atsScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 pb-8 pt-2">
              <div className="flex flex-wrap gap-1.5 justify-center mb-6">
                {student.skills.slice(0, 3).map((s, i) => (
                  <span key={i} className="px-2 py-1 bg-white border border-slate-100 text-slate-500 text-[9px] font-black uppercase rounded-lg">
                    {s}
                  </span>
                ))}
              </div>
              <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 group/btn shadow-xl shadow-blue-200 hover:shadow-blue-300 transition-all hover:-translate-y-1">
                Evaluate Profile
                <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
