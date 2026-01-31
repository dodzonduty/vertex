import { useState } from 'react';
import { Plus, Github, ExternalLink, FileText, Sparkles, CheckCircle2, ArrowRight, Trash2 } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  link?: string;
  githubLink?: string;
  tags: string[];
  verified: boolean;
  source: 'manual' | 'github' | 'cv';
  strengths?: string[];
  improvements?: string[];
}

export function StudentProjects() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [addMethod, setAddMethod] = useState<'manual' | 'github' | null>(null);
  const [showGithubParsing, setShowGithubParsing] = useState(false);
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'AI Chat Bot',
      description: 'Built a conversational AI using NLP and machine learning. Implements context awareness and multi-turn conversations.',
      githubLink: 'https://github.com/username/ai-chatbot',
      tags: ['AI/ML', 'Python', 'NLP', 'TensorFlow', 'FastAPI'],
      verified: true,
      source: 'github',
      strengths: [
        'Well-documented codebase',
        'Comprehensive test coverage',
        'Follows industry best practices'
      ],
      improvements: [
        'Could add deployment instructions',
        'Consider adding API rate limiting'
      ]
    },
    {
      id: '2',
      name: 'E-commerce Platform',
      description: 'Full-stack marketplace application with payment integration, real-time inventory, and admin dashboard.',
      link: 'https://demo-shop.example.com',
      tags: ['Full-Stack', 'React', 'Node.js', 'MongoDB', 'Stripe'],
      verified: false,
      source: 'manual',
      strengths: [
        'Complete feature set',
        'Modern tech stack'
      ],
      improvements: [
        'Add more detailed README',
        'Include architecture diagrams'
      ]
    }
  ]);

  const handleGithubFastAdd = () => {
    setShowGithubParsing(true);
    setTimeout(() => {
      const newProject: Project = {
        id: Date.now().toString(),
        name: 'Task Management App',
        description: 'A collaborative task management application with real-time updates, drag-and-drop interface, and team collaboration features.',
        githubLink: 'https://github.com/username/task-manager',
        tags: ['Full-Stack', 'React', 'TypeScript', 'WebSocket', 'PostgreSQL'],
        verified: true,
        source: 'github',
        strengths: [
          'Excellent code organization',
          'Real-time functionality implemented well',
          'Strong TypeScript usage'
        ],
        improvements: [
          'Add end-to-end tests',
          'Improve error handling'
        ]
      };
      setProjects([newProject, ...projects]);
      setShowGithubParsing(false);
      setShowAddModal(false);
      setAddMethod(null);
    }, 2500);
  };

  const handleManualAdd = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: 'New Custom Project',
      description: 'Successfully created a new project manually.',
      tags: ['Web Development'],
      verified: false,
      source: 'manual'
    };
    setProjects([newProject, ...projects]);
    setShowAddModal(false);
    setAddMethod(null);
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto py-4 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">My Showcase</h1>
          <p className="text-slate-600 text-lg">Manage your projects and see AI-powered code analysis.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Project
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onDelete={() => deleteProject(project.id)} />
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300">
            {showGithubParsing ? (
              <div className="p-16 text-center">
                <div className="w-24 h-24 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-[bounce_2s_infinite]">
                  <Sparkles className="w-12 h-12 text-indigo-600" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">AI Analysis in Progress</h2>
                <p className="text-slate-500 text-lg">Our AI is parsing your repository, analyzing code structure, and generating insights...</p>
              </div>
            ) : !addMethod ? (
              <div className="p-10">
                <h2 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase tracking-widest text-[10px]">Add To Portfolio</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <MethodOption
                    icon={<FileText className="w-10 h-10" />}
                    title="Manual"
                    description="Enter project details yourself."
                    onClick={() => setAddMethod('manual')}
                  />
                  <MethodOption
                    icon={<Github className="w-10 h-10" />}
                    title="GitHub AI"
                    description="Import and analyze instantly."
                    onClick={() => setAddMethod('github')}
                    highlighted
                  />
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-full mt-10 py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : addMethod === 'github' ? (
              <div className="p-10">
                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <Github className="w-8 h-8" />
                  GitHub Fast Add
                </h2>
                <div className="mb-8">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Repository URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/username/repo"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-900 shadow-inner"
                  />
                </div>
                <div className="bg-slate-900 rounded-2xl p-6 mb-8 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles className="w-20 h-20" />
                  </div>
                  <h4 className="font-bold text-indigo-400 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI Capabilities
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li className="flex items-center gap-2">• Auto-fill tech stack from package files</li>
                    <li className="flex items-center gap-2">• Generate project documentation</li>
                    <li className="flex items-center gap-2">• Identify architectural strengths</li>
                  </ul>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setAddMethod(null)} className="flex-1 py-4 border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50">Back</button>
                  <button onClick={handleGithubFastAdd} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/20">Start Analysis</button>
                </div>
              </div>
            ) : (
              <div className="p-10">
                <h2 className="text-2xl font-black text-slate-900 mb-8">Manual Entry</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Project Name</label>
                    <input type="text" placeholder="My Masterpiece" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Description</label>
                    <textarea rows={4} placeholder="What did you build?" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all" />
                  </div>
                </div>
                <div className="flex gap-4 mt-10">
                  <button onClick={() => setAddMethod(null)} className="flex-1 py-4 border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50">Back</button>
                  <button onClick={handleManualAdd} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/20">Add to Profile</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project, onDelete }: { project: Project; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="group bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 flex flex-col">
      <div className="p-8 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{project.name}</h3>
              {project.verified && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase border border-green-100">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </div>
              )}
            </div>
            <span className="px-2 py-0.5 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-slate-100">
              Source: {project.source}
            </span>
          </div>
          <button onClick={onDelete} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag, idx) => (
            <span key={idx} className="px-3 py-1 bg-white border border-slate-100 text-slate-600 text-[11px] font-bold rounded-full group-hover:border-indigo-100 group-hover:bg-indigo-50/30 transition-colors">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 mb-6">
          {project.githubLink && (
            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">
              <Github className="w-4 h-4" />
              Code
            </a>
          )}
          {project.link && (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">
              <ExternalLink className="w-4 h-4" />
              Live Demo
            </a>
          )}
        </div>
      </div>

      {(project.strengths || project.improvements) && (
        <div className="px-8 pb-8 pt-2 mt-auto">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-between px-6 group/exp shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all active:scale-95 transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span className="text-sm">AI Insights</span>
            </div>
            <ArrowRight className={`w-4 h-4 transform transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </button>

          {expanded && (
            <div className="mt-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 animate-in slide-in-from-top-4 duration-300">
              {project.strengths && (
                <div className="mb-4">
                  <label className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-2 block">Strengths</label>
                  <ul className="space-y-2">
                    {project.strengths.map((s, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {project.improvements && (
                <div>
                  <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 block">AI Recommendations</label>
                  <ul className="space-y-2">
                    {project.improvements.map((s, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                        <div className="w-1 h-1 bg-indigo-400 rounded-full shrink-0 mt-1.5" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MethodOption({ icon, title, description, onClick, highlighted }: { icon: any; title: string; description: string; onClick: () => void; highlighted?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-3xl border-2 transition-all text-left group ${highlighted
        ? 'border-indigo-600 bg-indigo-50/50 shadow-xl shadow-indigo-500/5'
        : 'border-slate-100 hover:border-indigo-200 bg-white hover:bg-slate-50'
        }`}
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${highlighted ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
        {icon}
      </div>
      <h3 className="text-lg font-black text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
      {highlighted && (
        <div className="mt-4 flex items-center gap-1.5 text-indigo-600 text-[10px] font-bold uppercase tracking-widest">
          <Sparkles className="w-3 h-3" />
          AI Recommended
        </div>
      )}
    </button>
  );
}
