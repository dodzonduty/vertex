import { Mail, Phone, Github, Linkedin, Award, Sparkles, CheckCircle2, X, ExternalLink, ArrowRight } from 'lucide-react';

interface StudentProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  university: string;
  year: string;
  jobTitle: string;
  description: string;
  avatar: string;
  githubLink?: string;
  linkedinLink?: string;
  atsScore: number;
  certificates: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    tags: string[];
    verified: boolean;
    githubLink?: string;
  }>;
  skills: string[];
  strengths?: string[];
  improvements?: string[];
}

interface ViewStudentProfileProps {
  student: StudentProfileData;
  onClose: () => void;
  viewerType: 'student' | 'company';
}

export function ViewStudentProfile({ student, onClose, viewerType }: ViewStudentProfileProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] max-w-5xl w-full my-8 shadow-2xl shadow-indigo-500/10 overflow-hidden relative animate-in zoom-in-95 duration-300">
        {/* Close Button - Floating */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white transition-all hover:rotate-90 border border-white/20 shadow-xl"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative">
          {/* Profile Header Banner */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 h-48 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent animate-pulse" />
          </div>

          <div className="px-10 pb-10">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-8 -mt-20 relative z-10 mb-10">
              <div className="w-40 h-40 bg-white rounded-[2rem] border-8 border-white shadow-2xl flex items-center justify-center text-5xl font-black text-indigo-600 relative overflow-hidden group">
                <div className="absolute inset-0 bg-slate-50 transition-colors group-hover:bg-slate-100" />
                <span className="relative z-10">{student.avatar}</span>
              </div>
              <div className="flex-1 text-center md:text-left pb-2">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h3 className="text-4xl font-black text-slate-900 tracking-tight">{student.name}</h3>
                  <div className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-widest rounded-full border border-indigo-100 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Talent
                  </div>
                </div>
                <p className="text-2xl text-indigo-600 font-bold mb-3">{student.jobTitle}</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-500 font-medium">
                  <span className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100 text-sm">
                    {student.university}
                  </span>
                  <span className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100 text-sm">
                    {student.year}
                  </span>
                </div>
              </div>
              {viewerType === 'company' && (
                <div className="pb-2">
                  <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all font-bold shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 flex items-center gap-2 group">
                    Contact for Opportunities
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
              {/* Left Column: Analysis & Contact */}
              <div className="space-y-8">
                {/* Score Card */}
                <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Sparkles className="w-24 h-24" />
                  </div>
                  <h4 className="flex items-center gap-2 font-bold text-indigo-400 mb-6 uppercase tracking-widest text-[10px]">
                    <Sparkles className="w-4 h-4" />
                    AI Analysis
                  </h4>
                  <div className="flex items-end gap-3 mb-6">
                    <span className="text-6xl font-black text-white leading-none">{student.atsScore}%</span>
                    <span className="text-indigo-400 font-bold text-sm mb-1">ATS Score</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 mb-8 overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                      style={{ width: `${student.atsScore}%` }}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="text-xs text-slate-400 font-medium leading-relaxed">
                      Profile demonstrates strong technical foundations and is highly optimized for current industry demands.
                    </div>
                  </div>
                </div>

                {/* Contact Section */}
                <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Connections</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-50 hover:border-indigo-100 transition-all group">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors shadow-sm">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Email</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{student.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-50 hover:border-indigo-100 transition-all group">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors shadow-sm">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Phone</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{student.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {student.githubLink && (
                      <a href={student.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all text-xs font-bold shadow-lg shadow-indigo-200">
                        <Github className="w-4 h-4" /> GitHub
                      </a>
                    )}
                    {student.linkedinLink && (
                      <a href={student.linkedinLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-xs font-bold">
                        <Linkedin className="w-4 h-4" /> LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Content */}
              <div className="lg:col-span-2 space-y-10">
                {/* About */}
                <section>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                    About Talent
                    <div className="h-px bg-slate-100 flex-1" />
                  </h4>
                  <p className="text-lg text-slate-600 leading-relaxed font-medium">{student.description}</p>
                </section>

                {/* Skills */}
                <section>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                    Competencies
                    <div className="h-px bg-slate-100 flex-1" />
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {student.skills.map((skill, idx) => (
                      <span key={idx} className="px-5 py-2.5 bg-white border-2 border-slate-50 text-slate-700 font-bold rounded-2xl shadow-sm hover:border-indigo-100 hover:bg-indigo-50/30 transition-all cursor-default text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>

                {/* Projects */}
                <section>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                    Featured Projects
                    <div className="h-px bg-slate-100 flex-1" />
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    {student.projects.map((project) => (
                      <div key={project.id} className="group p-6 bg-white border border-slate-100 rounded-3xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{project.name}</h5>
                          {project.verified && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6 line-clamp-2 font-medium">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="px-2 py-1 bg-slate-50 text-slate-400 text-[10px] font-bold uppercase rounded-lg border border-slate-100">
                              {tag}
                            </span>
                          ))}
                        </div>
                        {project.githubLink && (
                          <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-black text-indigo-600 hover:text-indigo-700 transition-colors tracking-widest uppercase">
                            Exploration Repo <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Certificates */}
                {student.certificates.length > 0 && (
                  <section className="pb-4">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                      Credentials
                      <div className="h-px bg-slate-100 flex-1" />
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {student.certificates.map((cert, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-5 bg-slate-50 rounded-[1.5rem] border border-slate-50 hover:bg-indigo-50/20 hover:border-indigo-100 transition-all">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            <Award className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div>
                            <h5 className="font-bold text-slate-900 text-sm leading-tight">{cert.name}</h5>
                            <p className="text-xs text-slate-500 font-medium">{cert.issuer} • {cert.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
