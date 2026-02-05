import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Building2, Link as LinkIcon, Users, Edit, Sparkles, CheckCircle2, Loader2, Upload } from 'lucide-react';
import { getCompanyProfile, updateCompanyProfile } from '../../lib/api/companies';
import { getUserData } from '../../lib/api/config';
import { toast } from 'sonner';

export function CompanyProfile() {
  const [profileMode, setProfileMode] = useState<'view' | 'edit'>('view');

  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [companyData, setCompanyData] = useState({
    name: '',
    email: '',
    industry: '',
    size: 'Start-up',
    address: 'Remote',
    phone: '',
    description: '',
    tags: [] as string[],
    socialLinks: [] as { type: string; url: string }[],
    profilePicture: null
  });

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const userData = getUserData();
    const userId = userData?.user_id || companyData.email || 'me';

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/mocks/profile-picture/upload/${userId}`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setCompanyData(prev => ({ ...prev, profilePicture: data.profile_picture_url }));
      toast.success("Logo updated!");
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userData = getUserData();
      const data = await getCompanyProfile();

      // Fetch profile picture
      let picUrl = null;
      if (userData?.user_id || data.email) {
        try {
          const picRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/mocks/profile-picture/${userData?.user_id || data.email}`);
          const picData = await picRes.json();
          picUrl = picData.profile_picture_url;
        } catch (e) { }
      }

      const links = (data as any).social_links ?? data.socialLinks ?? [];
      setCompanyData({
        name: data.name || '',
        email: data.email || '',
        industry: data.industry || '',
        size: data.size || 'Start-up',
        address: data.address || 'Remote',
        phone: data.phone || '',
        description: data.description || '',
        tags: data.tags || [],
        socialLinks: Array.isArray(links) ? links : [],
        profilePicture: picUrl
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
      toast.error('Could not load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateCompanyProfile({
        name: companyData.name,
        industry: companyData.industry,
        description: companyData.description,
        phone: companyData.phone || undefined,
        address: companyData.address || undefined,
        size: companyData.size || undefined,
        socialLinks: companyData.socialLinks.filter((l) => l.url.trim()).map((l) => ({ type: l.type, url: l.url }))
      });
      toast.success('Profile updated!');
      setProfileMode('view');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    }
  };

  const addSocialLink = () => {
    setCompanyData({
      ...companyData,
      socialLinks: [...companyData.socialLinks, { type: 'website', url: '' }]
    });
  };

  const updateSocialLink = (idx: number, field: 'type' | 'url', value: string) => {
    const next = [...companyData.socialLinks];
    next[idx] = { ...next[idx], [field]: value };
    setCompanyData({ ...companyData, socialLinks: next });
  };

  const removeSocialLink = (idx: number) => {
    setCompanyData({
      ...companyData,
      socialLinks: companyData.socialLinks.filter((_, i) => i !== idx)
    });
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin w-8 h-8 text-blue-600" /></div>;

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
            <div className="relative group/logo">
              <div className="w-32 h-32 bg-white rounded-2xl border-4 border-white shadow-2xl flex items-center justify-center text-4xl font-extrabold text-blue-600 relative overflow-hidden">
                {companyData.profilePicture ? (
                  <img src={companyData.profilePicture} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-blue-50 transition-colors group-hover/logo:bg-blue-100" />
                    <Building2 className="w-12 h-12 relative z-10" />
                  </>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-20">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  </div>
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-xl shadow-lg flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-all border-4 border-white z-30 opacity-0 group-hover/logo:opacity-100 scale-90 group-hover/logo:scale-100">
                <Upload className="w-5 h-5 text-white" />
                <input type="file" className="hidden" accept="image/*" onChange={handleUploadLogo} disabled={isUploading} />
              </label>
            </div>

            <div className="flex-1 text-center md:text-left mb-2">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                {profileMode === 'edit' ? (
                  <input
                    className="text-3xl font-black text-slate-900 tracking-tight bg-slate-50 border p-1 rounded"
                    value={companyData.name}
                    onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                  />
                ) : (
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">{companyData.name}</h1>
                )}

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
                  {companyData.address}
                </div>
              </div>
            </div>

            <div className="pb-2">
              <button
                onClick={() => {
                  if (profileMode === 'edit') {
                    handleSave();
                  } else {
                    setProfileMode('edit');
                  }
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
                {profileMode === 'edit' ? (
                  <input
                    type="tel"
                    value={companyData.phone}
                    onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-slate-900 text-sm">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {companyData.phone || 'N/A'}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Address</label>
                {profileMode === 'edit' ? (
                  <input
                    value={companyData.address}
                    onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                    placeholder="City, Country or Remote"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-slate-900 text-sm">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {companyData.address || 'N/A'}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wider mb-4">Social</h3>
            <div className="space-y-3">
              {(profileMode === 'edit' ? companyData.socialLinks : companyData.socialLinks?.filter((l) => l.url) ?? []).map((link: { type: string; url: string }, idx: number) => (
                <div key={idx} className="flex items-center justify-between gap-2 text-sm">
                  {profileMode === 'edit' ? (
                    <div className="flex gap-2 flex-1">
                      <select
                        value={link.type}
                        onChange={(e) => updateSocialLink(idx, 'type', e.target.value)}
                        className="w-24 px-2 py-1 border rounded text-sm"
                      >
                        <option value="website">Website</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="twitter">Twitter</option>
                        <option value="github">GitHub</option>
                      </select>
                      <input
                        value={link.url}
                        onChange={(e) => updateSocialLink(idx, 'url', e.target.value)}
                        placeholder="https://..."
                        className="flex-1 px-2 py-1 border rounded text-sm"
                      />
                      <button type="button" onClick={() => removeSocialLink(idx)} className="text-red-500 hover:text-red-700">×</button>
                    </div>
                  ) : (
                    <>
                      <a href={link.url} className="text-blue-600 hover:underline truncate">{link.url}</a>
                    </>
                  )}
                </div>
              ))}
              {profileMode === 'edit' && (
                <button type="button" onClick={addSocialLink} className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2 flex items-center gap-1">
                  + Add Link
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: details */}
        <div className="md:col-span-2 space-y-8">
          <section>
            <label className="block text-sm font-bold text-slate-900 mb-2">Company Description</label>
            <textarea
              rows={6}
              value={companyData.description || ''}
              readOnly={profileMode === 'view'}
              onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
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
                {companyData.tags?.length > 0 ? (
                  companyData.tags.map((tag: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 rounded border border-slate-200 text-sm font-medium flex items-center gap-2 group">
                      {tag}
                      {profileMode === 'edit' && (
                        <button className="text-slate-400 hover:text-red-500 group-hover:text-red-500">×</button>
                      )}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 text-sm italic">No tags added yet</span>
                )}
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