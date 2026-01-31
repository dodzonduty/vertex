import { useState } from 'react';
import { Search, Sparkles, User, FolderGit2, CheckCircle2, ArrowRight } from 'lucide-react';

type SearchTarget = 'students' | 'projects';

interface Student {
  id: string;
  name: string;
  university: string;
  year: string;
  jobTitle: string;
  skills: string[];
  atsScore: number;
  projectCount: number;
  avatar: string;
}

interface Project {
  id: string;
  name: string;
  studentName: string;
  description: string;
  tags: string[];
  verified: boolean;
  githubLink?: string;
}

export function CompanyHiring() {
  const [searchTarget, setSearchTarget] = useState<SearchTarget>('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [useAISearch, setUseAISearch] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const availableTags = [
    'React', 'Python', 'AI/ML', 'Node.js', 'TypeScript', 'Full-Stack',
    'Mobile', 'UI/UX', 'DevOps', 'Data Science', 'Blockchain'
  ];

  const students: Student[] = [
    {
      id: '1',
      name: 'Alex Johnson',
      university: 'Stanford University',
      year: 'Junior',
      jobTitle: 'Full-Stack Developer',
      skills: ['React', 'Node.js', 'TypeScript', 'Python', 'AI/ML'],
      atsScore: 85,
      projectCount: 5,
      avatar: 'AJ'
    },
    {
      id: '2',
      name: 'Sarah Chen',
      university: 'MIT',
      year: 'Senior',
      jobTitle: 'AI/ML Engineer',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP', 'Data Science'],
      atsScore: 92,
      projectCount: 8,
      avatar: 'SC'
    }
  ];

  const projects: Project[] = [
    {
      id: '1',
      name: 'AI Chat Bot',
      studentName: 'Alex Johnson',
      description: 'Conversational AI using NLP and machine learning with context awareness',
      tags: ['AI/ML', 'Python', 'NLP', 'TensorFlow'],
      verified: true,
      githubLink: 'https://github.com/username/ai-chatbot'
    },
    {
      id: '2',
      name: 'Healthcare Assistant',
      studentName: 'Sarah Chen',
      description: 'AI-powered healthcare assistant for patient diagnosis support',
      tags: ['AI/ML', 'Healthcare', 'Python', 'Deep Learning'],
      verified: true,
      githubLink: 'https://github.com/username/health-ai'
    }
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-4 animate-in fade-in duration-700">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Talent Acquisition</h1>
        <p className="text-slate-600 text-lg">Harness neural search to discover verified talent and groundbreaking projects.</p>
      </div>

      {/* Target Toggle - Standardized Glass Pill */}
      <div className="flex justify-center md:justify-start gap-4 mb-10">
        <button
          onClick={() => setSearchTarget('students')}
          className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 transform ${searchTarget === 'students'
            ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 scale-105'
            : 'bg-white text-slate-500 border border-slate-200/50 hover:bg-slate-50 hover:border-blue-100'
            }`}
        >
          <User className="w-4 h-4" />
          Students
        </button>
        <button
          onClick={() => setSearchTarget('projects')}
          className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 transform ${searchTarget === 'projects'
            ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 scale-105'
            : 'bg-white text-slate-500 border border-slate-200/50 hover:bg-slate-50 hover:border-blue-100'
            }`}
        >
          <FolderGit2 className="w-4 h-4" />
          Projects
        </button>
      </div>

      {/* Search Layout */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 mb-10 group transition-all hover:border-blue-100">
        <div className={`flex flex-col md:flex-row gap-4 mb-8 p-2 rounded-2xl border transition-all duration-300 ${useAISearch ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-slate-100 bg-slate-50'}`}>
          <div className="flex-1 relative w-full group">
            <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${useAISearch ? 'text-blue-500' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder={useAISearch ? "Describe your hiring goal (e.g. 'Looking for an AI expert with React experience...')" : `Search ${searchTarget}...`}
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
            <span>Smart Candidate Scan</span>
          </button>
        </div>

        {!useAISearch ? (
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-4">Focus Areas</label>
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
                Neural Intelligence Mode
              </h4>
              <p className="text-sm text-slate-400">Vertex AI is simulating candidate fits based on your technical requirements.</p>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
              <Search className="w-24 h-24 transform -rotate-12" />
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {searchTarget === 'students' ? students.map(s => <StudentCard key={s.id} student={s} />) : projects.map(p => <ProjectCard key={p.id} project={p} />)}
      </div>
    </div>
  );
}

function StudentCard({ student }: { student: Student }) {
  return (
    <div className="group bg-white rounded-[2rem] p-8 border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
      <div className="flex items-start gap-6 mb-6">
        <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl font-black text-blue-600 group-hover:scale-110 transition-transform">
          {student.avatar}
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{student.name}</h3>
          <p className="text-blue-600 text-xs font-black uppercase tracking-widest mb-2 leading-none">{student.jobTitle}</p>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">{student.university} • {student.year}</p>
        </div>
      </div>

      <div className="mb-8 p-5 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="flex items-center justify-between mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-blue-500" />ATS Match</span>
          <span className="text-blue-600">{student.atsScore}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
          <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${student.atsScore}%` }} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {student.skills.map((s, i) => (
          <span key={i} className="px-3 py-1 bg-white border border-slate-100 text-slate-500 text-[10px] font-bold uppercase rounded-lg">
            {s}
          </span>
        ))}
      </div>

      <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 group/btn shadow-xl shadow-blue-200 hover:shadow-blue-300 transition-all hover:-translate-y-1">
        Deep Dive Profile
        <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group bg-white rounded-[2rem] p-8 border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{project.name}</h3>
            {project.verified && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase border border-green-100">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </div>
            )}
          </div>
          <p className="text-blue-600 text-xs font-black uppercase tracking-widest leading-none">Maintained by {project.studentName}</p>
        </div>
      </div>

      <p className="text-slate-500 leading-relaxed mb-8 h-12 line-clamp-2">{project.description}</p>

      <div className="flex flex-wrap gap-2 mb-8">
        {project.tags.map((tag, idx) => (
          <span key={idx} className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-bold uppercase rounded-lg border border-slate-100">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex gap-4">
        <button className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 group/btn shadow-xl shadow-blue-200 hover:shadow-blue-300 transition-all hover:-translate-y-1">
          Inspect Code
        </button>
        <button className="flex-1 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold hover:bg-slate-50 transition-all">
          Author Bio
        </button>
      </div>
    </div>
  );
}
