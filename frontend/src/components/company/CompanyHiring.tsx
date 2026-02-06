import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, FolderGit2, CheckCircle2, ArrowRight } from 'lucide-react';
import '../Opportunities.css';

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
  const navigate = useNavigate();
  const [searchTarget, setSearchTarget] = useState<SearchTarget>('students');
  const [useAISearch, setUseAISearch] = useState(false);
  const [sortBy, setSortBy] = useState<string>('Most Recent');
  const [selectedTags, setSelectedTags] = useState<string[]>(['#All']); // Init with #All like Opps

  const availableTags = [
    '#All', '#React', '#Python', '#AI/ML', '#Node.js', '#TypeScript', 
    '#Full-Stack', '#Mobile', '#UI/UX', '#DevOps', '#Data Science', '#Blockchain'
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
    },
    {
      id: '3',
      name: 'Mike Rodriguez',
      university: 'UC Berkeley',
      year: 'Graduate',
      jobTitle: 'Blockchain Developer',
      skills: ['Solidity', 'Web3', 'React', 'Rust'],
      atsScore: 78,
      projectCount: 3,
      avatar: 'MR'
    }
  ];

  const projects: Project[] = [
    {
      id: '1',
      name: 'AI Chat Bot',
      studentName: 'Alex Johnson',
      description: 'Conversational AI using NLP and machine learning with context awareness to provide real-time support.',
      tags: ['AI/ML', 'Python', 'NLP', 'TensorFlow'],
      verified: true,
      githubLink: 'https://github.com/username/ai-chatbot'
    },
    {
      id: '2',
      name: 'Healthcare Assistant',
      studentName: 'Sarah Chen',
      description: 'AI-powered healthcare assistant for patient diagnosis support, integrating with electronic health records.',
      tags: ['AI/ML', 'Healthcare', 'Python', 'Deep Learning'],
      verified: true,
      githubLink: 'https://github.com/username/health-ai'
    }
  ];

  const toggleTag = (tag: string) => {
    if (tag === '#All') {
        setSelectedTags(['#All']);
        return;
    }
    let newTags = [...selectedTags];
    if (newTags.includes('#All')) newTags = [];
    
    if (newTags.includes(tag)) {
        newTags = newTags.filter(t => t !== tag);
    } else {
        newTags.push(tag);
    }
    
    if (newTags.length === 0) newTags = ['#All'];
    setSelectedTags(newTags);
  };

  const scrollTags = (direction: 'left' | 'right') => {
    const container = document.getElementById('hiring-tags-container');
    if (container) {
        const scrollAmount = 200;
        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    }
  };

  return (
    <main className="opp-main">
      {/* Search Section - Standardized */}
      <section className="opp-search-section">
        <div className="opp-search-width-container">
            <div className="opp-search-group">
                <div className="opp-search-bg-blur"></div>
                <div className="opp-search-box">
                    <span className="material-symbols-outlined opp-search-icon">search</span>
                    <input
                        className="opp-search-input"
                        placeholder={useAISearch ? "Describe your ideal candidate..." : "Search for talent by name, skill, or university..."}
                        type="text"
                    />
                    <button 
                        className="opp-ask-ai-btn vibrant-gradient"
                        onClick={() => setUseAISearch(!useAISearch)}
                    >
                        <span className="material-symbols-outlined">auto_awesome</span>
                        Ask AI
                    </button>
                </div>
            </div>
        </div>
      </section>

      {/* Filters Section - Standardized */}
      <section className="opp-filters-section">
        <div className="opp-filters-container">
            <div className="opp-filter-toggle">
                <button
                    onClick={() => setSearchTarget('students')}
                    className={`opp-toggle-option ${searchTarget === 'students' ? 'active' : ''}`}
                >
                    Candidates
                </button>
                <button
                    onClick={() => setSearchTarget('projects')}
                    className={`opp-toggle-option ${searchTarget === 'projects' ? 'active' : ''}`}
                >
                    Projects
                </button>
            </div>

            <div className="opp-tags-wrapper">
                <button className="opp-scroll-btn" onClick={() => scrollTags('left')}>
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>

                <div className="opp-tags-row" id="hiring-tags-container">
                    {availableTags.map(tag => (
                        <button
                            key={tag}
                            className={`opp-chip ${selectedTags.includes(tag) ? 'active' : 'inactive'}`}
                            onClick={() => toggleTag(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                <button className="opp-scroll-btn" onClick={() => scrollTags('right')}>
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>
        </div>
      </section>

      {/* Main Content Grid - Standardized Vertical Layout */}
      <section className="opp-content-section" style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
         <div className="w-full">
            <div className="opp-listing-header-row">
                <h3 className="opp-listing-title">
                    Showing {searchTarget === 'students' ? students.length : projects.length} {searchTarget === 'students' ? 'Candidates' : 'Projects'}
                </h3>

                <div className="opp-sort-dropdown">
                    <span className="material-symbols-outlined">sort</span>
                    <span className="opp-sort-label">Sort by:</span>
                    <select
                        className="opp-sort-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option>Most Recent</option>
                        <option>Best Match</option>
                        <option>Experience</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {searchTarget === 'students' 
                    ? students.map(s => <StudentCard key={s.id} student={s} />) 
                    : projects.map(p => <ProjectCard key={p.id} project={p} />)
                }
            </div>
         </div>
      </section>
    </main>
  );
}

function StudentCard({ student }: { student: Student }) {
  return (
    <div className="opp-event-card" style={{ cursor: 'default' }}> {/* Reusing opp-event-card for consistent styling */}
        <div className="flex flex-col md:flex-row gap-6 p-6 w-full">
            {/* Avatar Section */}
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl font-black text-blue-600 shrink-0">
                {student.avatar}
            </div>

            {/* Main Info */}
            <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-slate-900">{student.name}</h3>
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase border border-blue-100">
                        Top Talent
                    </div>
                </div>
                <p className="text-blue-600 text-xs font-black uppercase tracking-widest mb-2 leading-none">{student.jobTitle}</p>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">{student.university} • {student.year}</p>
                
                {/* Skills */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {student.skills.slice(0, 5).map((s, i) => (
                        <span key={i} className="px-3 py-1 bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-bold uppercase rounded-lg">
                            {s}
                        </span>
                    ))}
                    {student.skills.length > 5 && (
                         <span className="px-3 py-1 text-slate-400 text-[10px] font-bold">+{student.skills.length - 5}</span>
                    )}
                </div>
            </div>

            {/* Meta / Action Column */}
            <div className="w-full md:w-64 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                     <div className="flex items-center justify-between mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-blue-500" />ATS Match</span>
                        <span className="text-blue-600">{student.atsScore}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: `${student.atsScore}%` }} />
                    </div>
                </div>

                <div className="flex gap-3 mt-auto">
                    <button className="flex-1 h-12 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 hover:border-slate-400 transition-all cursor-pointer">
                        Message
                    </button>
                    <button className="flex-1 h-12 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer">
                        Profile
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="opp-event-card" style={{ cursor: 'default' }}>
        <div className="flex flex-col md:flex-row gap-6 p-6 w-full">
            {/* Project Icon/Image Placeholder */}
            <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                <FolderGit2 className="w-8 h-8" />
            </div>

             <div className="flex-1 flex flex-col justify-center">
                 <div className="flex items-center gap-2 mb-1">
                     <h3 className="text-xl font-bold text-slate-900">{project.name}</h3>
                     {project.verified && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase border border-green-100">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified
                        </div>
                     )}
                 </div>
                 <p className="text-slate-500 text-sm leading-relaxed mb-3 line-clamp-2">{project.description}</p>
                 
                 <div className="flex items-center gap-2">
                     <span className="text-[10px] font-bold uppercase text-slate-400">Maintained by</span>
                     <span className="text-xs font-bold text-blue-600 uppercase">{project.studentName}</span>
                 </div>
             </div>

             <div className="w-full md:w-64 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 gap-4">
                 <div className="flex flex-wrap gap-2">
                     {project.tags.map((tag, idx) => (
                         <span key={idx} className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase rounded-lg border border-slate-100">
                             {tag}
                         </span>
                     ))}
                 </div>
                 
                 <div className="flex gap-3 mt-auto">
                     <button className="flex-1 h-12 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer">
                         <FolderGit2 className="w-4 h-4" />
                         Code
                     </button>
                 </div>
             </div>
        </div>
    </div>
  );
}
