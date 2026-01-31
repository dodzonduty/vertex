import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, CheckCircle2, ArrowRight, Loader2, Mail, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';

type OnboardingStep = 'form' | 'review' | 'success';

interface CompanyData {
    // User fields
    email: string;
    password: string;

    // Company fields
    name: string;
    industry: string;
    description: string;
}

export default function CompanyOnboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState<OnboardingStep>('form');
    const [loading, setLoading] = useState(false);
    const [companyData, setCompanyData] = useState<CompanyData>({
        email: '',
        password: '',
        name: '',
        industry: '',
        description: ''
    });

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('review');
    };

    const finalizeOnboarding = () => {
        setLoading(true);

        // Prepare data for backend
        const backendData = {
            // User creation
            email: companyData.email,
            password: companyData.password,
            role: 'company',

            // Company profile
            name: companyData.name,
            industry: companyData.industry,
            description: companyData.description
        };

        console.log('Data to send to backend:', backendData);

        // TODO: Replace with real API call
        // await fetch('/api/companies/onboarding', { method: 'POST', body: JSON.stringify(backendData) })

        setTimeout(() => {
            setLoading(false);
            setStep('success');
            toast.success('Company Profile Created!', {
                description: 'Welcome to Vertex. Start finding talented students.',
            });
        }, 1500);
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
                                            <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                                <Mail className="w-4 h-4" /> Email
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="contact@company.com"
                                                value={companyData.email}
                                                onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                                                required
                                                className="py-6 rounded-xl border-slate-200 focus:border-blue-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                                <Lock className="w-4 h-4" /> Password
                                            </Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="••••••••"
                                                value={companyData.password}
                                                onChange={(e) => setCompanyData({ ...companyData, password: e.target.value })}
                                                required
                                                className="py-6 rounded-xl border-slate-200"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Company Information */}
                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold text-slate-900">Company Information</h3>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="company-name" className="text-xs font-black uppercase tracking-widest text-slate-400">Company Name</Label>
                                            <Input
                                                id="company-name"
                                                placeholder="Acme Inc."
                                                value={companyData.name}
                                                onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                                                required
                                                className="py-6 rounded-xl border-slate-200 focus:border-blue-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="industry" className="text-xs font-black uppercase tracking-widest text-slate-400">Industry</Label>
                                            <select
                                                id="industry"
                                                value={companyData.industry}
                                                onChange={(e) => setCompanyData({ ...companyData, industry: e.target.value })}
                                                className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm"
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
                                            <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-slate-400">Company Description</Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Tell students about your company, mission, and culture..."
                                                value={companyData.description}
                                                onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
                                                className="min-h-[120px] rounded-xl border-slate-200"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="py-8 bg-slate-50/50 border-t justify-end">
                            <Button form="company-form" className="px-8 py-6 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200">
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
                                    <div className="w-32 h-32 bg-white rounded-3xl border-8 border-white shadow-2xl flex items-center justify-center">
                                        <Building2 className="w-16 h-16 text-blue-600" />
                                    </div>
                                </div>
                            </div>
                            <CardContent className="pt-20 pb-12 px-12">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-3xl font-black text-slate-900 mb-2">{companyData.name}</h3>
                                        <p className="text-blue-600 font-bold text-xl">{companyData.industry}</p>
                                        <p className="text-slate-600 mt-2">{companyData.email}</p>
                                    </div>

                                    {companyData.description && (
                                        <div>
                                            <h4 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">About</h4>
                                            <p className="text-slate-600 text-lg leading-relaxed">{companyData.description}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="bg-slate-900 p-8 flex justify-between items-center">
                                <p className="text-slate-400 text-sm font-medium">Looking good? Complete your company profile.</p>
                                <div className="flex gap-4">
                                    <Button variant="ghost" onClick={() => setStep('form')} className="text-white hover:text-blue-400 hover:bg-slate-800 font-bold">Edit</Button>
                                    <Button onClick={finalizeOnboarding} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-6 rounded-xl shadow-xl shadow-blue-500/20" disabled={loading}>
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Complete Profile"}
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                )}

                {/* STEP: SUCCESS */}
                {step === 'success' && (
                    <div className="text-center space-y-12 py-10">
                        <div className="relative inline-block">
                            <div className="w-32 h-32 bg-green-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-green-200 animate-in zoom-in duration-500">
                                <CheckCircle2 className="w-16 h-16 text-white" />
                            </div>
                            <div className="absolute -top-4 -right-4">
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center animate-bounce">
                                    <Building2 className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-5xl font-black text-slate-900 tracking-tight">Welcome to Vertex!</h2>
                            <p className="text-slate-500 text-xl max-w-lg mx-auto leading-relaxed">Your company profile is ready. Start posting opportunities and connecting with talented students.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Button onClick={() => navigate('/company-home')} className="px-12 py-8 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-black text-lg transition-all transform hover:scale-105 shadow-2xl shadow-blue-200">
                                Go to Dashboard
                            </Button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
