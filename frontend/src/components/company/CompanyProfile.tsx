import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Phone, MapPin, Building2, Users, Edit, Sparkles, CheckCircle2, Loader2, Upload, Save, X } from 'lucide-react';
import { getCompanyProfile, updateCompanyProfile } from '../../lib/api/companies';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent } from '../ui/card';

export function CompanyProfile() {
  const [searchParams, setSearchParams] = useSearchParams();
  const profileMode = searchParams.get('mode') === 'edit' ? 'edit' : 'view';

  const setProfileMode = (mode: 'view' | 'edit') => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (mode === 'view') {
        newParams.delete('mode');
      } else {
        newParams.set('mode', mode);
      }
      return newParams;
    });
  };

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
    profilePicture: null as string | null
  });

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/upload-profile-photo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json();
      setCompanyData(prev => ({ ...prev, profilePicture: data.profile_photo_url }));
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
      const data = await getCompanyProfile();

      // Fetch profile picture from user data
      let picUrl: string | null = data.profile_photo_url || null;

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

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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

  // EDIT MODE
  if (profileMode === 'edit') {
    return (
      <div className="max-w-4xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="shadow-2xl border-none">
          <CardContent className="p-0">
            <form onSubmit={handleSave}>
              <div className="p-8 border-b bg-slate-50/50 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Refine Company Profile</h2>
                  <p className="text-slate-500 font-medium">Keep your company details up to date.</p>
                </div>
                <div className="flex gap-3">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setProfileMode('view')} 
                    style={{
                      color: '#94a3b8',
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      paddingLeft: '24px',
                      paddingRight: '24px',
                      borderRadius: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      height: 'auto'
                    }}
                    className="hover:bg-slate-50 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" /> Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    style={{
                      backgroundColor: '#2563eb', // Blue-600
                      color: 'white',
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      paddingLeft: '32px',
                      paddingRight: '32px',
                      borderRadius: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      border: 'none',
                      height: 'auto'
                    }}
                    className="hover:bg-blue-700 shadow-xl shadow-blue-200"
                  >
                    <Save className="w-5 h-5" /> Save Changes
                  </Button>
                </div>
              </div>

              <div className="p-10 space-y-10">
                {/* Identity Section */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Company Name</Label>
                    <Input
                      value={companyData.name}
                      onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                      style={{
                          border: '2px solid #cbd5e1',
                          borderRadius: '12px',
                          padding: '12px',
                          fontWeight: 500
                      }}
                      className="py-6 focus:!border-blue-500 hover:!border-blue-400 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Industry</Label>
                    <Input
                      value={companyData.industry}
                      onChange={(e) => setCompanyData({ ...companyData, industry: e.target.value })}
                      style={{
                          border: '2px solid #cbd5e1',
                          borderRadius: '12px',
                          padding: '12px',
                          fontWeight: 500
                      }}
                      className="py-6 focus:!border-blue-500 hover:!border-blue-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Company Description</Label>
                  <Textarea
                    value={companyData.description}
                    onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
                    style={{
                        border: '2px solid #cbd5e1',
                        borderRadius: '12px',
                        padding: '12px',
                        lineHeight: '1.6'
                    }}
                    className="min-h-[150px] focus:!border-blue-500 hover:!border-blue-400 transition-colors text-lg"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-8 border-t border-slate-100 pt-10">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</Label>
                    <Input
                      value={companyData.address}
                      onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                      style={{
                          border: '2px solid #cbd5e1',
                          borderRadius: '12px',
                          padding: '12px',
                          fontWeight: 500
                      }}
                      className="py-6 focus:!border-blue-500 hover:!border-blue-400 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Company Size</Label>
                    <select
                      value={companyData.size}
                      onChange={(e) => setCompanyData({ ...companyData, size: e.target.value })}
                      style={{
                          border: '2px solid #cbd5e1',
                          borderRadius: '12px',
                          padding: '0 12px',
                          fontWeight: 500,
                          width: '100%',
                          outline: 'none',
                          height: '50px',
                          backgroundColor: 'white'
                      }}
                      className="focus:border-blue-500 hover:border-blue-400 transition-colors text-sm"
                    >
                      <option>Start-up</option>
                      <option>Scale-up</option>
                      <option>Enterprise</option>
                      <option>Agency</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contact Phone</Label>
                    <Input
                      value={companyData.phone}
                      onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                      style={{
                          border: '2px solid #cbd5e1',
                          borderRadius: '12px',
                          padding: '12px',
                          fontWeight: 500
                      }}
                      className="py-6 focus:!border-blue-500 hover:!border-blue-400 transition-colors"
                    />
                  </div>
                </div>

                {/* Social Links Editor */}
                <div className="space-y-4 border-t border-slate-100 pt-10">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Social Links</Label>
                    <button type="button" onClick={addSocialLink} className="text-sm text-blue-600 font-bold hover:underline">+ Add Link</button>
                  </div>
                  
                  <div className="space-y-3">
                    {companyData.socialLinks.map((link, idx) => (
                      <div key={idx} className="flex gap-4">
                        <select
                          value={link.type}
                          onChange={(e) => updateSocialLink(idx, 'type', e.target.value)}
                          className="w-32 px-3 py-2 border rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500"
                          style={{ borderRadius: '8px', border: '1px solid #cbd5e1' }}
                        >
                          <option value="website">Website</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="twitter">Twitter</option>
                          <option value="github">GitHub</option>
                        </select>
                        <Input
                          value={link.url}
                          onChange={(e) => updateSocialLink(idx, 'url', e.target.value)}
                          placeholder="https://..."
                          style={{
                              border: '1px solid #cbd5e1',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              flex: 1
                          }}
                        />
                        <button type="button" onClick={() => removeSocialLink(idx)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // VIEW MODE (Default)
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
                  {companyData.address}
                </div>
              </div>
            </div>

            <div className="pb-2">
              <Button
                onClick={() => setProfileMode('edit')}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  paddingLeft: '24px',
                  paddingRight: '24px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.2)'
                }}
                className="bg-blue-600 hover:bg-blue-700 transition-all group/action hover:shadow-blue-300 border-none"
              >
                <Edit className="w-4 h-4 transition-transform group-hover/action:rotate-12" />
                Edit Profile
              </Button>
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
                  {companyData.phone || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Address</label>
                <div className="flex items-center gap-2 text-slate-900 text-sm">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {companyData.address || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wider mb-4">Social</h3>
            <div className="space-y-3">
              {(companyData.socialLinks?.filter((l) => l.url) ?? []).map((link: { type: string; url: string }, idx: number) => (
                <div key={idx} className="flex items-center justify-between gap-2 text-sm">
                  <a href={link.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate flex items-center gap-2">
                    <span className="capitalize font-medium text-slate-700">{link.type}:</span> {link.url}
                  </a>
                </div>
              ))}
              {companyData.socialLinks.length === 0 && (
                 <p className="text-slate-400 text-sm italic">No social links added.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: details */}
        <div className="md:col-span-2 space-y-8">
          <section>
            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Company Description</h3>
            <p className="text-slate-600 leading-relaxed text-lg">
              {companyData.description || "No description added yet. Click edit to tell us about your company!"}
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Industry Tags</h3>
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex flex-wrap gap-2">
                {companyData.tags?.length > 0 ? (
                  companyData.tags.map((tag: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-slate-50 text-slate-700 rounded border border-slate-200 text-sm font-medium flex items-center gap-2">
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 text-sm italic">No tags added yet</span>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}