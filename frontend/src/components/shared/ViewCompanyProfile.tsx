import { X, Building2, CheckCircle2, ArrowRight, Globe, Linkedin, MapPin, Sparkles, Users } from 'lucide-react';

interface CompanyProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  size: string;
  description: string;
  tags: string[];
  socialLinks: Array<{
    type: string;
    url: string;
  }>;
  events: Array<{
    id: string;
    title: string;
    type: string;
    date: string;
    location: string;
    registrations: number;
  }>;
}

interface ViewCompanyProfileProps {
  company: CompanyProfileData;
  onClose: () => void;
  onEventClick?: (eventId: string) => void;
}

export function ViewCompanyProfile({ company, onClose, onEventClick }: ViewCompanyProfileProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] max-w-5xl w-full my-8 shadow-2xl shadow-blue-500/10 overflow-hidden relative animate-in zoom-in-95 duration-300">
        {/* Close Button - Floating */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white transition-all hover:rotate-90 border border-white/20 shadow-xl"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative">
          {/* Company Header Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-48 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent animate-pulse" />
          </div>

          <div className="px-10 pb-10">
            {/* Logo & Basic Info */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-8 -mt-20 relative z-10 mb-10">
              <div className="w-40 h-40 bg-white rounded-[2rem] border-8 border-white shadow-2xl flex items-center justify-center text-blue-600 relative overflow-hidden group">
                <div className="absolute inset-0 bg-slate-50 transition-colors group-hover:bg-slate-100" />
                <Building2 className="w-16 h-16 relative z-10" />
              </div>
              <div className="flex-1 text-center md:text-left pb-2">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                  <h3 className="text-4xl font-black text-slate-900 tracking-tight">{company.name}</h3>
                  <div className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest rounded-full border border-blue-100 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Platform Partner
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-blue-600 font-bold mb-4 uppercase tracking-widest text-xs">
                  <span>{company.tags[0] || 'Technology'}</span>
                  <span className="text-slate-300">•</span>
                  <span>{company.size} Employees</span>
                </div>
              </div>
              <div className="pb-2">
                <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 flex items-center gap-2 group">
                  Follow Headquarters
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
              {/* Left Column: Stats & Contact */}
              <div className="space-y-8">
                {/* Stats Card */}
                <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-500/20">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Users className="w-24 h-24" />
                  </div>
                  <h4 className="flex items-center gap-2 font-bold text-blue-400 mb-6 uppercase tracking-widest text-[10px]">
                    <Building2 className="w-4 h-4" />
                    Platform Activity
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <span className="block text-2xl font-black text-white">{company.events.length}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Events</span>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <span className="block text-2xl font-black text-white">12</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Matches</span>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-xs font-medium text-blue-400">
                    <Sparkles className="w-4 h-4" />
                    Highly Active this month
                  </div>
                </div>

                {/* Info List */}
                <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Focus Areas</h4>
                    <div className="flex flex-wrap gap-2">
                      {company.tags.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-slate-50 text-slate-600 text-[10px] font-bold uppercase rounded-lg border border-slate-100">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-50">
                    {company.socialLinks.map((link, idx) => (
                      <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center transition-colors group-hover:bg-blue-50">
                          {link.type.toLowerCase().includes('linkedin') ? <Linkedin className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                        </div>
                        <span className="text-sm font-bold truncate">{link.type}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: About & Events */}
              <div className="lg:col-span-2 space-y-10">
                {/* About */}
                <section>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                    Our Mission
                    <div className="h-px bg-slate-100 flex-1" />
                  </h4>
                  <p className="text-lg text-slate-600 leading-relaxed font-medium">{company.description}</p>
                </section>

                {/* Upcoming Events */}
                {company.events.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-8">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3 flex-1">
                        Upcoming Missions
                        <div className="h-px bg-slate-100 flex-1" />
                      </h4>
                    </div>

                    <div className="space-y-4">
                      {company.events.map((event) => (
                        <div
                          key={event.id}
                          onClick={() => onEventClick?.(event.id)}
                          className="group p-6 bg-white border border-slate-100 rounded-3xl hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-sm">
                              {event.date.split(' ')[0]}
                            </div>
                            <div>
                              <h5 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{event.title}</h5>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase rounded-md tracking-wider">{event.type}</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">{event.location}</span>
                              </div>
                            </div>
                          </div>
                          <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                            <ArrowRight className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Locations */}
                <section>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                    Global Presence
                    <div className="h-px bg-slate-100 flex-1" />
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-[1.5rem] border border-slate-50 hover:bg-blue-50/20 hover:border-blue-100 transition-all">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{company.address || 'Global Headquarters'}</span>
                    </div>
                    <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-[1.5rem] border border-slate-50 hover:bg-blue-50/20 hover:border-blue-100 transition-all">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <Globe className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">Remote Friendly</span>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
