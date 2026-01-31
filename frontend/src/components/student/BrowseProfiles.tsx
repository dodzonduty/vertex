import { useState } from 'react';
import { Search, Building2, User, Sparkles, ArrowRight, MapPin, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function BrowseProfiles() {
  const navigate = useNavigate();
  const [browseTarget, setBrowseTarget] = useState<'students' | 'companies'>('students');
  const [searchQuery, setSearchQuery] = useState('');

  const mockStudents = [
    {
      id: '1',
      name: 'Sarah Chen',
      university: 'MIT',
      year: 'Senior',
      jobTitle: 'AI/ML Engineer',
      avatar: 'SC',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP'],
      atsScore: 92,
      projectCount: 8
    },
    {
      id: '2',
      name: 'Mike Rodriguez',
      university: 'UC Berkeley',
      year: 'Graduate',
      jobTitle: 'Blockchain Developer',
      avatar: 'MR',
      skills: ['Solidity', 'Web3', 'React', 'Node.js'],
      atsScore: 78,
      projectCount: 6
    }
  ];

  const mockCompanies = [
    {
      id: '1',
      name: 'TechCorp',
      size: 'Enterprise (1000+ employees)',
      industry: 'AI/ML',
      tags: ['AI/ML', 'Software Development', 'Innovation'],
      eventCount: 3
    },
    {
      id: '2',
      name: 'StartupHub',
      size: 'Startup (1-50 employees)',
      industry: 'SaaS',
      tags: ['SaaS', 'Cloud', 'B2B'],
      eventCount: 2
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-4 animate-in fade-in duration-700">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Network Discovery</h1>
        <p className="text-slate-600 text-lg">Connect with peers and industry leading organizations.</p>
      </div>

      {/* Glass Pill Toggle - Standardized */}
      <div className="flex justify-center md:justify-start gap-4 mb-10">
        <button
          onClick={() => setBrowseTarget('students')}
          className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 transform ${browseTarget === 'students'
            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 scale-105'
            : 'bg-white text-slate-500 border border-slate-200/50 hover:bg-slate-50 hover:border-indigo-100'
            }`}
        >
          <User className="w-4 h-4" />
          Students
        </button>
        <button
          onClick={() => setBrowseTarget('companies')}
          className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 transform ${browseTarget === 'companies'
            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 scale-105'
            : 'bg-white text-slate-500 border border-slate-200/50 hover:bg-slate-50 hover:border-indigo-100'
            }`}
        >
          <Building2 className="w-4 h-4" />
          Companies
        </button>
      </div>

      {/* Search Input - Premium */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-2 mb-10 group transition-all hover:border-indigo-100">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder={`Search for ${browseTarget === 'students' ? 'peers and collaborators' : 'innovative companies'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-4 py-4 bg-transparent outline-none text-slate-900 font-medium placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Results Container */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {browseTarget === 'students' ? (
          mockStudents.map((student) => (
            <div
              key={student.id}
              onClick={() => navigate(`/student/profile/${student.id}`)}
              className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 cursor-pointer transform hover:-translate-y-1"
            >
              <div className="flex items-start gap-6 mb-6">
                <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl font-black text-indigo-600 shadow-inner group-hover:scale-110 transition-transform">
                  {student.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{student.name}</h3>
                  <p className="text-indigo-600 text-sm font-black uppercase tracking-widest mb-2 leading-none">{student.jobTitle}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-400 font-bold text-[10px] uppercase">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{student.university}</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{student.year}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar for Score */}
              <div className="mb-8 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-indigo-500" />Profile Match</span>
                  <span className="text-indigo-600">{student.atsScore}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full transition-all duration-1000" style={{ width: `${student.atsScore}%` }} />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {student.skills.map((s, i) => (
                  <span key={i} className="px-3 py-1 bg-white border border-slate-100 text-slate-500 text-[10px] font-bold uppercase rounded-lg group-hover:bg-indigo-50 group-hover:border-indigo-100 group-hover:text-indigo-600 transition-colors">
                    {s}
                  </span>
                ))}
              </div>

              <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 group/btn shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all hover:-translate-y-0.5">
                Connect and View
                <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          ))
        ) : (
          mockCompanies.map((company) => (
            <div
              key={company.id}
              onClick={() => navigate(`/company/profile/${company.id}`)}
              className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 cursor-pointer transform hover:-translate-y-1"
            >
              <div className="flex items-start gap-6 mb-8">
                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center font-black text-blue-600 group-hover:scale-110 transition-transform">
                  <Building2 className="w-10 h-10" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{company.name}</h3>
                  <p className="text-blue-600 text-sm font-black uppercase tracking-widest mb-3 leading-none">{company.industry}</p>
                  <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">{company.size}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {company.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase rounded-lg group-hover:bg-blue-50 group-hover:border-blue-100 group-hover:text-blue-600 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between mb-8 px-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-blue-500" />{company.eventCount} Active Events</span>
                <span className="text-blue-600">Premium Partner</span>
              </div>

              <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 group/btn shadow-xl shadow-blue-200 hover:shadow-blue-300 transition-all hover:-translate-y-0.5">
                Access HQ
                <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
