import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Building2, CheckCircle2, ArrowRight, Loader2, Mail, Lock, Phone, MapPin, Link as LinkIcon, Plus, X, Upload, Eye, EyeOff, Edit2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { signupCompany } from '../lib/api/companies';
import { setAuthToken, setUserData } from '../lib/api/config';

type OnboardingStep = 'form' | 'review' | 'success';

interface SocialLinkInput {
    type: string;
    url: string;
}

interface CompanyData {
    email: string;
    password: string;
    name: string;
    industry: string;
    description: string;
    phone: string;
    address: string;
    size: string;
    socialLinks: SocialLinkInput[];
}

export default function CompanyOnboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useLocalStorage<OnboardingStep>('vertex_company_onboarding_step', 'form');
    const [loading, setLoading] = useState(false);
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [companyData, setCompanyData] = useLocalStorage<CompanyData>('vertex_company_onboarding_data', {
        email: '',
        password: '',
        name: '',
        industry: '',
        description: '',
        phone: '',
        address: '',
        size: 'Start-up',
        socialLinks: []
    });

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('review');
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

    const finalizeOnboarding = async () => {
        setLoading(true);

        const backendData = {
            email: companyData.email,
            password: companyData.password,
            name: companyData.name,
            industry: companyData.industry,
            description: companyData.description,
            phone: companyData.phone || undefined,
            address: companyData.address || undefined,
            size: companyData.size || undefined,
            social_links: companyData.socialLinks
                .filter((l) => l.url.trim())
                .map((l) => ({ type: l.type, url: l.url }))
        };

        try {
            const res = await signupCompany(backendData) as { access_token?: string; user_id?: string; email?: string; role?: string };
            if (res?.access_token) {
                setAuthToken(res.access_token);
                setUserData({
                    user_id: res.user_id,
                    email: res.email,
                    role: res.role
                });
            }
            setLoading(false);
            // Clear onboarding data
            localStorage.removeItem('vertex_company_onboarding_step');
            localStorage.removeItem('vertex_company_onboarding_data');
            
            setStep('success');
            toast.success('Company Profile Created!', {
                description: 'Welcome to Vertex. Start finding talented students.',
            });
        } catch (error: any) {
            console.error('Signup failed:', error);
            setLoading(false);
            toast.error('Signup Failed', { description: error?.message || 'Please check your information and try again.' });
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Ambient background patterns */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 -left-20 w-[60vw] h-[60vw] rounded-full bg-blue-500/5 blur-[120px]" />
                <div className="absolute bottom-1/4 -right-20 w-[50vw] h-[50vw] rounded-full bg-cyan-500/5 blur-[120px]" />
            </div>

            <div className="w-full max-w-4xl relative z-10 animate-in fade-in zoom-in-95 duration-700 py-12">

                {/* STEP: FORM */}
                {step === 'form' && (
                    <Card className="shadow-2xl border-slate-100">
                        <CardHeader className="border-b bg-slate-50/50 py-8">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                                    <Building2 className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-3xl font-black tracking-tight">Company Profile</CardTitle>
                                    <CardDescription className="text-lg">Create your account and company profile.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="py-8">
                            <form id="company-form" onSubmit={handleFormSubmit} className="space-y-8">
                                {/* Account Information */}
                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold text-slate-900">Account Information</h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                                                <Mail className="w-4 h-4" /> Email
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="contact@company.com"
                                                value={companyData.email}
                                                onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                                                required
                                                style={{ borderColor: '#cbd5e1', borderWidth: '1px', paddingLeft: '20px', paddingRight: '20px' }}
                                                className="py-6 px-5 rounded-xl focus:border-2 focus:border-blue-500 placeholder:text-slate-300 selection:bg-blue-500 selection:text-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                                                <Lock className="w-4 h-4" /> Password
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    value={companyData.password}
                                                    onChange={(e) => setCompanyData({ ...companyData, password: e.target.value })}
                                                    required
                                                    style={{ borderColor: '#cbd5e1', borderWidth: '1px', paddingLeft: '20px', paddingRight: '40px' }}
                                                    className="py-6 px-5 rounded-xl focus:border-2 focus:border-blue-500 placeholder:text-slate-300 selection:bg-blue-500 selection:text-white"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 focus:outline-none"
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Company Information */}
                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold text-slate-900">Company Information</h3>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="company-name" className="text-xs font-black uppercase tracking-widest text-slate-900">Company Name</Label>
                                            <Input
                                                id="company-name"
                                                placeholder="Acme Inc."
                                                value={companyData.name}
                                                onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                                                required
                                                style={{ borderColor: '#cbd5e1', borderWidth: '1px', paddingLeft: '20px', paddingRight: '20px' }}
                                                className="py-6 px-5 rounded-xl focus:border-2 focus:border-blue-500 placeholder:text-slate-300 selection:bg-blue-500 selection:text-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="industry" className="text-xs font-black uppercase tracking-widest text-slate-900">Industry</Label>
                                            <select
                                                id="industry"
                                                value={companyData.industry}
                                                onChange={(e) => setCompanyData({ ...companyData, industry: e.target.value })}
                                                style={{ borderColor: '#cbd5e1', borderWidth: '1px' }}
                                                className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm cursor-pointer hover:border-blue-400 transition-colors"
                                                required
                                            >
                                                <option value="">Select Industry</option>
                                                <option value="Technology">Technology</option>
                                                <option value="Finance">Finance</option>
                                                <option value="Healthcare">Healthcare</option>
                                                <option value="Education">Education</option>
                                                <option value="Retail">Retail</option>
                                                <option value="Manufacturing">Manufacturing</option>
                                                <option value="Consulting">Consulting</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-slate-900">Company Description</Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Tell students about your company, mission, and culture..."
                                                value={companyData.description}
                                                onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
                                                style={{ borderColor: '#cbd5e1', borderWidth: '1px', padding: '20px' }}
                                                className="min-h-[120px] rounded-xl focus:border-2 focus:border-blue-500 placeholder:text-slate-300 selection:bg-blue-500 selection:text-white"
                                            />
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="phone" className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                                                    <Phone className="w-4 h-4" /> Phone
                                                </Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    placeholder="+1 (555) 000-0000"
                                                    value={companyData.phone}
                                                    onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                                                    style={{ borderColor: '#cbd5e1', borderWidth: '1px', paddingLeft: '20px', paddingRight: '20px' }}
                                                    className="py-6 px-5 rounded-xl focus:border-2 focus:border-blue-500 placeholder:text-slate-300 selection:bg-blue-500 selection:text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="size" className="text-xs font-black uppercase tracking-widest text-slate-900">Company Size</Label>
                                                <select
                                                    id="size"
                                                    value={companyData.size}
                                                    onChange={(e) => setCompanyData({ ...companyData, size: e.target.value })}
                                                    style={{ borderColor: '#cbd5e1', borderWidth: '1px' }}
                                                    className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm cursor-pointer hover:border-blue-400 transition-colors"
                                                >
                                                    <option value="Start-up">Start-up</option>
                                                    <option value="Small">Small (1-50)</option>
                                                    <option value="Medium">Medium (51-200)</option>
                                                    <option value="Large">Large (201+)</option>
                                                    <option value="Enterprise">Enterprise</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="address" className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                                                <MapPin className="w-4 h-4" /> Address
                                            </Label>
                                            <Input
                                                id="address"
                                                placeholder="City, Country or Remote"
                                                value={companyData.address}
                                                onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                                                style={{ borderColor: '#cbd5e1', borderWidth: '1px', paddingLeft: '20px', paddingRight: '20px' }}
                                                className="py-6 px-5 rounded-xl focus:border-2 focus:border-blue-500 placeholder:text-slate-300 selection:bg-blue-500 selection:text-white"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                                                    <LinkIcon className="w-4 h-4" /> Social Links
                                                </Label>
                                                <Button type="button" variant="outline" size="sm" onClick={addSocialLink} className="gap-1 border-slate-200 hover:bg-slate-50 text-slate-600">
                                                    <Plus className="w-4 h-4" /> Add
                                                </Button>
                                            </div>
                                            {companyData.socialLinks.map((link, idx) => (
                                                <div key={idx} className="flex gap-2 items-center">
                                                    <select
                                                        value={link.type}
                                                        onChange={(e) => updateSocialLink(idx, 'type', e.target.value)}
                                                        className="h-12 w-32 rounded-xl border border-slate-200 text-sm px-3 outline-none focus:ring-2 focus:ring-blue-500"
                                                        style={{ borderColor: '#cbd5e1', borderWidth: '1px' }}
                                                    >
                                                        <option value="website">Website</option>
                                                        <option value="linkedin">LinkedIn</option>
                                                        <option value="twitter">Twitter/X</option>
                                                        <option value="github">GitHub</option>
                                                    </select>
                                                    <Input
                                                        placeholder="https://..."
                                                        value={link.url}
                                                        onChange={(e) => updateSocialLink(idx, 'url', e.target.value)}
                                                        className="flex-1 py-6 px-5 rounded-xl focus:border-2 focus:border-blue-500 placeholder:text-slate-300"
                                                        style={{ borderColor: '#cbd5e1', borderWidth: '1px' }}
                                                    />
                                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeSocialLink(idx)} className="h-12 w-12 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors">
                                                        <X className="w-5 h-5" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="py-8 bg-slate-50/50 border-t justify-end">
                            <Button form="company-form" style={{ minHeight: '45px', color: 'white', paddingLeft: '64px', paddingRight: '64px', paddingTop: '24px', paddingBottom: '24px' }} className="rounded-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 cursor-pointer">
                                Preview Profile <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {/* STEP: REVIEW */}
                {step === 'review' && (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Review Company Profile</h2>
                                <p className="text-slate-500 text-lg">Make sure everything looks good before completing.</p>
                            </div>
                            <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 p-2 px-4">
                                <CheckCircle2 className="w-4 h-4 mr-2 inline" /> Ready
                            </Badge>
                        </div>

                        <Card className="overflow-hidden shadow-2xl border-none">
                            <div className="h-32 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 relative">
                                <div className="absolute -bottom-12 left-12">
                                    <div className="relative group">
                                        <div className="w-32 h-32 bg-white rounded-3xl border-8 border-white shadow-2xl flex items-center justify-center overflow-hidden">
                                            {profilePic ? (
                                                <img src={profilePic} alt="Company Logo" className="w-full h-full object-cover" />
                                            ) : (
                                                <Building2 className="w-16 h-16 text-blue-600" />
                                            )}
                                        </div>
                                        <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-xl shadow-lg flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-all border-4 border-white">
                                            <Upload className="w-5 h-5 text-white" />
                                            <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                const formData = new FormData();
                                                formData.append('file', file);
                                                try {
                                                    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
                                                    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/upload-profile-photo`, {
                                                        method: 'POST',
                                                        headers: {
                                                            'Authorization': `Bearer ${token}`
                                                        },
                                                        body: formData
                                                    });
                                                    const data = await res.json();
                                                    setProfilePic(data.profile_photo_url);
                                                    toast.success("Logo uploaded!");
                                                } catch (err) {
                                                    toast.error("Upload failed");
                                                }
                                            }} />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <CardContent className="pt-20 pb-12 px-12">
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-3xl font-black text-slate-900 mb-2">{companyData.name}</h3>
                                                <p className="text-blue-600 font-bold text-xl">{companyData.industry}</p>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => setStep('form')} className="text-slate-400 hover:text-blue-600">
                                                <Edit2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                        <p className="text-slate-600 mt-2 flex items-center gap-2"><Mail className="w-4 h-4" /> {companyData.email}</p>
                                        {(companyData.phone || companyData.address || companyData.size) && (
                                            <div className="flex flex-wrap gap-4 mt-4 text-slate-500 text-sm font-medium">
                                                {companyData.phone && <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full"><Phone className="w-3 h-3" /> {companyData.phone}</span>}
                                                {companyData.address && <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full"><MapPin className="w-3 h-3" /> {companyData.address}</span>}
                                                {companyData.size && <span className="bg-slate-100 px-3 py-1 rounded-full">{companyData.size}</span>}
                                            </div>
                                        )}
                                    </div>

                                    {companyData.description && (
                                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">About The Company</h4>
                                            <p className="text-slate-600 text-lg leading-relaxed">{companyData.description}</p>
                                        </div>
                                    )}

                                    {companyData.socialLinks.filter((l) => l.url.trim()).length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Online Presence</h4>
                                            <div className="flex flex-wrap gap-3">
                                                {companyData.socialLinks.filter((l) => l.url.trim()).map((l, i) => (
                                                    <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-blue-600 font-bold hover:border-blue-200 hover:shadow-md transition-all">
                                                        <LinkIcon className="w-4 h-4" />
                                                        <span className="capitalize">{l.type}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter style={{ backgroundColor: '#2563eb', padding: '32px' }} className="flex justify-between items-center">
                                <p style={{ color: 'white' }} className="text-sm font-medium">Ready to launch?</p>
                                <div className="flex gap-4">
                                    <Button 
                                        variant="ghost" 
                                        onClick={() => setStep('form')} 
                                        style={{ 
                                            backgroundColor: 'white',
                                            color: '#2563eb',
                                            paddingLeft: '32px',
                                            paddingRight: '32px',
                                            paddingTop: '12px',
                                            paddingBottom: '12px',
                                            cursor: 'pointer',
                                            border: '2px solid white'
                                        }}
                                        className="text-sm font-bold rounded-xl hover:bg-slate-50"
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        onClick={finalizeOnboarding} 
                                        style={{ 
                                            backgroundColor: 'white',
                                            color: '#2563eb',
                                            paddingLeft: '32px',
                                            paddingRight: '32px',
                                            paddingTop: '24px',
                                            paddingBottom: '24px',
                                            minHeight: '56px',
                                            cursor: 'pointer'
                                        }}
                                        className="font-bold rounded-xl shadow-xl hover:bg-slate-50" 
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Verify & Launch"}
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                )}

                {/* STEP: SUCCESS */}
                {step === 'success' && (
                    <div style={{ textAlign: 'center', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} className="space-y-12 animate-in fade-in duration-700">
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <div style={{ width: '128px', height: '128px', borderRadius: '40px', backgroundColor: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', boxShadow: '0 25px 50px -12px rgba(34, 197, 94, 0.25)' }} className="animate-in zoom-in duration-500">
                                <CheckCircle2 style={{ width: '64px', height: '64px', color: 'white' }} />
                            </div>
                            <div style={{ position: 'absolute', top: '-16px', right: '-16px' }}>
                                <div style={{ width: '48px', height: '48px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="animate-bounce">
                                    <Building2 style={{ width: '24px', height: '24px', color: '#2563eb' }} />
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '32px' }} className="space-y-4">
                            <h2 style={{ fontSize: '48px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.025em', margin: '0' }}>Welcome to Vertex!</h2>
                            <p style={{ fontSize: '20px', color: '#64748b', maxWidth: '500px', margin: '16px auto 0', lineHeight: '1.625' }}>Your company profile is ready. Start posting opportunities and connecting with talented students.</p>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <Button 
                                onClick={() => navigate('/company-home')} 
                                style={{ 
                                    paddingLeft: '64px', 
                                    paddingRight: '64px', 
                                    paddingTop: '24px', 
                                    paddingBottom: '24px', 
                                    backgroundColor: '#2563eb', 
                                    color: 'white', 
                                    borderRadius: '24px', 
                                    fontWeight: '900', 
                                    fontSize: '20px',
                                    boxShadow: '0 20px 30px -10px rgba(37, 99, 235, 0.4)',
                                    cursor: 'pointer',
                                    minHeight: '80px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    border: 'none'
                                }}
                                className="hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95"
                            >
                                Go to Dashboard <ArrowRight style={{ width: '24px', height: '24px' }} />
                            </Button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
