import { useState, useEffect } from 'react';
import { Building2, User, Sparkles, ArrowRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../lib/api/config';
import '../Opportunities.css';

interface Student {
  student_id: string;
  full_name: string;
  university?: string;
  degree_level?: string;
  ats_score?: number;
  bio?: string;
  skills?: string[];
  user?: {
    email: string;
    profile_photo_url?: string;
  };
}

interface Company {
  company_id: string;
  name: string;
  industry?: string;
  size?: string;
  description?: string;
  user?: {
    profile_photo_url?: string;
  };
}

interface BrowseProfilesProps {
  publicView?: boolean;
}

export function BrowseProfiles({ publicView = false }: BrowseProfilesProps) {
  const navigate = useNavigate();
  const [browseTarget, setBrowseTarget] = useState<'students' | 'companies'>('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [browseTarget]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (browseTarget === 'students') {
        const data = await apiRequest<Student[]>('/api/students/');
        setStudents(data || []);
      } else {
        const data = await apiRequest<Company[]>('/api/companies/');
        setCompanies(data || []);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.university?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredCompanies = companies.filter(company =>
    company.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.industry?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="opp-main max-w-6xl mx-auto py-4 animate-in fade-in duration-700">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Network Discovery</h1>
        <p className="text-slate-600 text-lg">Connect with peers and industry leading organizations.</p>
      </div>

      {/* Glass Pill Toggle - Standardized */}
      <div className="flex justify-center md:justify-start gap-4 mb-10">
        <div className="opp-filter-toggle">
          <button
            onClick={() => setBrowseTarget('students')}
            className={`opp-toggle-option ${browseTarget === 'students' ? 'active' : ''}`}
          >
            Students
          </button>
          <button
            onClick={() => setBrowseTarget('companies')}
            className={`opp-toggle-option ${browseTarget === 'companies' ? 'active' : ''}`}
          >
            Companies
          </button>
        </div>
      </div>

      {/* Search Input - Standardized Ask AI */}
      <div className="opp-search-group mb-12">
        <div className="opp-search-bg-blur"></div>
        <div className="opp-search-box">
          <span className="material-symbols-outlined opp-search-icon">search</span>
          <input
            className="opp-search-input"
            type="text"
            placeholder={`Search for ${browseTarget === 'students' ? 'peers and collaborators' : 'innovative companies'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="opp-ask-ai-btn vibrant-gradient">
            <span className="material-symbols-outlined">auto_awesome</span>
            Ask AI
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {/* Results Container */}
      {!loading && (
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {browseTarget === 'students' ? (
            filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <div
                  key={student.student_id}
                  onClick={() => navigate(`/student/profile/${student.student_id}`)}
                  className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 cursor-pointer transform hover:-translate-y-1 hover:border-indigo-200"
                >
                  <div className="flex items-start gap-6 mb-6">
                    {student.user?.profile_photo_url ? (
                      <img
                        src={student.user.profile_photo_url}
                        alt={student.full_name}
                        className="w-20 h-20 rounded-2xl object-cover shadow-inner group-hover:scale-110 transition-transform"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl font-black text-indigo-600 shadow-inner group-hover:scale-110 transition-transform">
                        {getInitials(student.full_name)}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{student.full_name}</h3>
                      <p className="text-indigo-600 text-sm font-black uppercase tracking-widest mb-2 leading-none">{student.degree_level || 'Student'}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-400 font-bold text-[10px] uppercase">
                        {student.university && (
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{student.university}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar for Score */}
                  {/* Progress Bar for Score OR Login CTA */}
                  {!publicView ? (
                    student.ats_score !== undefined && (
                      <div className="mb-8 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center justify-between mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-indigo-500" />Profile Match</span>
                          <span className="text-indigo-600">{student.ats_score}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-indigo-600 h-full rounded-full transition-all duration-1000" style={{ width: `${student.ats_score}%` }} />
                        </div>
                      </div>
                    )
                  ) : (
                    <div 
                      onClick={(e) => { e.stopPropagation(); navigate('/signin'); }}
                      className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200 border-dashed flex items-center justify-between cursor-pointer group/login hover:bg-indigo-50/50 hover:border-indigo-200 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-indigo-600">
                           <Sparkles className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-600">Profile Match</span>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 flex items-center gap-1 group-hover/login:translate-x-1 transition-transform">
                        Login to View <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  )}

                  {student.skills && student.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                      {student.skills.slice(0, 4).map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-white border border-slate-100 text-slate-500 text-[10px] font-bold uppercase rounded-lg group-hover:bg-indigo-50 group-hover:border-indigo-100 group-hover:text-indigo-600 transition-colors">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <button style={{ minHeight: '56px' }} className="cursor-pointer w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 group/btn shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 vibrant-gradient text-white border-0">
                    Connect and View
                    <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-20">
                <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No Students Found</h3>
                <p className="text-slate-500">Try adjusting your search criteria</p>
              </div>
            )
          ) : (
            filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => (
                <div
                  key={company.company_id}
                  onClick={() => navigate(`/company/profile/${company.company_id}`)}
                  className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 cursor-pointer transform hover:-translate-y-1 hover:border-blue-200"
                >
                  <div className="flex items-start gap-6 mb-8">
                    {company.user?.profile_photo_url ? (
                      <img
                        src={company.user.profile_photo_url}
                        alt={company.name}
                        className="w-20 h-20 rounded-2xl object-cover group-hover:scale-110 transition-transform"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center font-black text-blue-600 group-hover:scale-110 transition-transform">
                        <Building2 className="w-10 h-10" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{company.name}</h3>
                      <p className="text-blue-600 text-sm font-black uppercase tracking-widest mb-3 leading-none">{company.industry || 'Company'}</p>
                      {company.size && (
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">{company.size}</p>
                      )}
                    </div>
                  </div>

                  {company.description && (
                    <p className="text-slate-600 text-sm mb-6 line-clamp-2">{company.description}</p>
                  )}

                  <button style={{ minHeight: '56px' }} className="cursor-pointer w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 group/btn shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 vibrant-gradient text-white border-0">
                    Access HQ
                    <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-20">
                <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No Companies Found</h3>
                <p className="text-slate-500">Try adjusting your search criteria</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
