import { useState } from 'react';
import { Mail, Phone, MapPin, Building2, Link as LinkIcon, Users, Edit, Sparkles, CheckCircle2 } from 'lucide-react';

export function CompanyProfile() {
  const [profileMode, setProfileMode] = useState<'view' | 'edit'>('view');
  const [companyData, setCompanyData] = useState({
    name: 'TechCorp',
    email: 'contact@techcorp.com',
    size: 'Enterprise (1000+ employees)',
    address: '123 Innovation Drive, San Francisco, CA 94105',
    phone: '+1 (555) 987-6543',
    description: 'Leading technology company focused on AI innovation and cutting-edge software solutions. We are passionate about creating products that make a difference in people\'s lives.',
    tags: ['AI/ML', 'Software Development', 'Innovation', 'Tech'],
    socialLinks: [
      { type: 'Website', url: 'https://techcorp.com' },
      { type: 'LinkedIn', url: 'https://linkedin.com/company/techcorp' },
      { type: 'Twitter', url: 'https://twitter.com/techcorp' }
    ]
  });

  return (
    <div className="max-w-5xl mx-auto font-sans animate-in fade-in duration-700">

      {/* Profile Header - Premium */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden mb-10 group">
        {/* Banner */}
        <div className="h-40 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent animate-pulse" />
          <div className="absolute top-4 right-4 flex gap-2">
            <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/20">
              Premium Partner
            </div>
          </div>
        </div>

        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-12 relative z-10">
            <div className="w-32 h-32 bg-white rounded-2xl border-4 border-white shadow-2xl flex items-center justify-center text-4xl font-extrabold text-blue-600 relative overflow-hidden group/logo">
              <div className="absolute inset-0 bg-blue-50 transition-colors group-hover/logo:bg-blue-100" />
              <Building2 className="w-12 h-12 relative z-10" />
            </div>

            <div className="flex-1 text-center md:text-left mb-2">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">{companyData.name}</h1>
                <div className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest rounded-full border border-blue-100 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-500 text-sm font-medium">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                  <Users className="w-4 h-4 text-blue-500" />
                  {companyData.size}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  SF, California
                </div>
              </div>
            </div>

            <div className="pb-2">
              <button
                onClick={() => {
                  if (profileMode === 'edit') {
                    // Logic to save changes would go here
                    setCompanyData({ ...companyData });
                  }
                  setProfileMode(profileMode === 'view' ? 'edit' : 'view');
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-0.5 transition-all flex items-center gap-2 group/action"
              >
                {profileMode === 'view' ? (
                  <>
                    <Edit className="w-4 h-4 transition-transform group-hover/action:rotate-12" />
                    Edit Profile
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Contact & Quick Info */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wider mb-4">Contact Info</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Email</label>
                <div className="flex items-center gap-2 text-slate-900 text-sm">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {companyData.email}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Phone</label>
                <div className="flex items-center gap-2 text-slate-900 text-sm">
                  <Phone className="w-4 h-4 text-slate-400" />
                  {companyData.phone}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Address</label>
                <div className="flex items-center gap-2 text-slate-900 text-sm">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {companyData.address}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wider mb-4">Social</h3>
            <div className="space-y-3">
              {companyData.socialLinks.map((link: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <LinkIcon className="w-4 h-4 text-slate-400" />
                  <a href={link.url} className="text-blue-600 hover:underline truncate">{link.url}</a>
                </div>
              ))}
              <button className="text-sm text-slate-500 hover:text-slate-900 font-medium mt-2 flex items-center gap-1">
                + Add Link
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: details */}
        <div className="md:col-span-2 space-y-8">
          <section>
            <label className="block text-sm font-bold text-slate-900 mb-2">Company Description</label>
            <textarea
              rows={6}
              defaultValue={companyData.description}
              readOnly={profileMode === 'view'}
              className={`w-full px-4 py-3 border rounded-lg transition-all ${profileMode === 'edit'
                  ? 'border-blue-500 ring-2 ring-blue-500/20 bg-white text-slate-900 cursor-text'
                  : 'border-slate-100 bg-slate-50 text-slate-600 cursor-default outline-none'
                }`}
            />
          </section>

          <section>
            <label className="block text-sm font-bold text-slate-900 mb-3">Industry Tags</label>
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {companyData.tags.map((tag: string, idx: number) => (
                  <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 rounded border border-slate-200 text-sm font-medium flex items-center gap-2 group">
                    {tag}
                    {profileMode === 'edit' && (
                      <button className="text-slate-400 hover:text-red-500 group-hover:text-red-500">×</button>
                    )}
                  </span>
                ))}
              </div>
              {profileMode === 'edit' && (
                <button className="text-blue-600 font-medium text-sm hover:underline">+ Add Industry Tag</button>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}