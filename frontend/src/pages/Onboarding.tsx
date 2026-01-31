import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, User, Sparkles, CheckCircle2, ArrowRight, Loader2, Award, Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';

type OnboardingStep = 'choice' | 'processing' | 'manual-form' | 'review' | 'success';

export default function Onboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState<OnboardingStep>('choice');
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState<any>({
        name: '',
        email: '',
        phone: '',
        university: '',
        year: 'Junior',
        jobTitle: '',
        description: '',
        githubLink: '',
        linkedinLink: '',
        skills: []
    });

    const handleCVUpload = () => {
        setStep('processing');
        // Simulate AI parsing
        setTimeout(() => {
            const data = {
                name: 'Alex Johnson',
                email: 'alex.johnson@university.edu',
                phone: '+1 (555) 123-4567',
                university: 'Stanford University',
                year: 'Junior',
                jobTitle: 'Full-Stack Developer',
                description: 'Computer Science student passionate about AI and full-stack development. I love building products that make a real impact.',
                githubLink: 'https://github.com/alexjohnson',
                linkedinLink: 'https://linkedin.com/in/alexjohnson',
                skills: ['React', 'Node.js', 'TypeScript', 'Python', 'AI/ML']
            };
            setProfileData(data);
            setStep('review');
            toast.success('CV Parsed Successfully!', {
                description: 'AI has extracted your professional details.',
            });
        }, 2500);
    };

    const handleManualEntry = () => {
        setStep('manual-form');
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('review');
    };

    const finalizeOnboarding = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep('success');
            toast.success('Onboarding Complete!', {
                description: 'Your profile is ready. Welcome to Vertex.',
            });
        }, 1500);
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Ambient background patterns */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 -left-20 w-[60vw] h-[60vw] rounded-full bg-indigo-500/5 blur-[120px]" />
                <div className="absolute bottom-1/4 -right-20 w-[50vw] h-[50vw] rounded-full bg-blue-500/5 blur-[120px]" />
            </div>

            <div className="w-full max-w-4xl relative z-10 animate-in fade-in zoom-in-95 duration-700 py-12">

                {/* STEP: CHOICE */}
                {step === 'choice' && (
                    <div className="text-center space-y-8">
                        <div className="space-y-3">
                            <h1 className="text-5xl font-black text-slate-900 tracking-tight">Setup Your Journey</h1>
                            <p className="text-slate-500 text-lg">Choose how you'd like to build your professional presence on Vertex.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <Card className="group cursor-pointer hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 transform hover:-translate-y-1" onClick={handleManualEntry}>
                                <CardHeader className="text-center py-10">
                                    <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-50 transition-colors">
                                        <User className="w-10 h-10 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                    </div>
                                    <CardTitle className="text-2xl font-bold">Manual Setup</CardTitle>
                                    <CardDescription className="text-base px-4">Fill out your profile step by step with full control over every detail.</CardDescription>
                                </CardHeader>
                                <CardFooter className="justify-center border-t bg-slate-50/50 py-4 group-hover:bg-indigo-50/5 transition-colors">
                                    <span className="text-sm font-bold text-slate-400 group-hover:text-indigo-600 flex items-center gap-2">
                                        Get Started <ArrowRight className="w-4 h-4" />
                                    </span>
                                </CardFooter>
                            </Card>

                            <Card className="group cursor-pointer border-indigo-200 bg-white ring-2 ring-indigo-500/5 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden" onClick={handleCVUpload}>
                                <div className="absolute top-0 right-0 p-4">
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 text-white rounded-full">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">AI Powered</span>
                                    </div>
                                </div>
                                <CardHeader className="text-center py-10">
                                    <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200 group-hover:scale-110 transition-transform">
                                        <Upload className="w-10 h-10 text-white" />
                                    </div>
                                    <CardTitle className="text-2xl font-bold">Upload Resume</CardTitle>
                                    <CardDescription className="text-base px-4">Let AI parse your CV and auto-fill your profile in seconds. Recommended.</CardDescription>
                                </CardHeader>
                                <CardFooter className="justify-center border-t bg-indigo-50/30 py-4 group-hover:bg-indigo-100/40 transition-colors">
                                    <span className="text-sm font-bold text-indigo-600 flex items-center gap-2">
                                        Scan CV Now <ArrowRight className="w-4 h-4" />
                                    </span>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                )}

                {/* STEP: PROCESSING */}
                {step === 'processing' && (
                    <Card className="text-center p-20 space-y-8 border-none bg-transparent shadow-none">
                        <div className="relative">
                            <div className="w-32 h-32 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto" />
                            <div className="absolute inset-0 flex items-center justify-center scale-150 opacity-20">
                                <Sparkles className="w-12 h-12 text-indigo-600 animate-pulse" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">AI is Analyzing...</h2>
                            <p className="text-slate-500 text-lg">Extracting your skills, experience, and educational background.</p>
                        </div>
                    </Card>
                )}

                {/* STEP: MANUAL FORM */}
                {step === 'manual-form' && (
                    <Card className="shadow-2xl border-slate-100">
                        <CardHeader className="border-b bg-slate-50/50 py-8">
                            <CardTitle className="text-3xl font-black tracking-tight">Profile Details</CardTitle>
                            <CardDescription className="text-lg">Tell the world who you are and what you're building.</CardDescription>
                        </CardHeader>
                        <CardContent className="py-8">
                            <form id="manual-form" onSubmit={handleFormSubmit} className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</Label>
                                        <Input id="name" placeholder="John Doe" required className="py-6 rounded-xl border-slate-200 focus:border-indigo-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="job" className="text-xs font-black uppercase tracking-widest text-slate-400">Desired Role</Label>
                                        <Input id="job" placeholder="AI Engineer / UI/UX Designer" required className="py-6 rounded-xl border-slate-200" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio" className="text-xs font-black uppercase tracking-widest text-slate-400">Professional Bio</Label>
                                    <Textarea id="bio" placeholder="Passionate developer building high-impact products..." className="min-h-[120px] rounded-xl border-slate-200" required />
                                </div>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <Label htmlFor="uni" className="text-xs font-black uppercase tracking-widest text-slate-400">University</Label>
                                        <Input id="uni" placeholder="MIT / Stanford" required className="py-6 rounded-xl border-slate-200" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="year" className="text-xs font-black uppercase tracking-widest text-slate-400">Year Of Study</Label>
                                        <select className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm">
                                            <option>Freshman</option>
                                            <option>Sophomore</option>
                                            <option>Junior</option>
                                            <option>Senior</option>
                                            <option>Graduate</option>
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="py-8 bg-slate-50/50 border-t justify-between items-center">
                            <Button variant="ghost" onClick={() => setStep('choice')} className="font-bold text-slate-500">Back</Button>
                            <Button form="manual-form" className="px-8 py-6 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200">
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
                                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Review Your Profile</h2>
                                <p className="text-slate-500 text-lg">AI curated profile based on your information.</p>
                            </div>
                            <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 p-2 px-4 animate-pulse">
                                <Sparkles className="w-4 h-4 mr-2 inline" /> Quality Score: High
                            </Badge>
                        </div>

                        <Card className="overflow-hidden shadow-2xl border-none">
                            <div className="h-32 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 relative">
                                <div className="absolute -bottom-12 left-12">
                                    <div className="w-32 h-32 bg-white rounded-3xl border-8 border-white shadow-2xl flex items-center justify-center text-4xl font-black text-indigo-600">
                                        {profileData.name[0] || "A"}
                                    </div>
                                </div>
                            </div>
                            <CardContent className="pt-20 pb-12 px-12">
                                <div className="flex flex-col md:flex-row gap-8">
                                    <div className="flex-1 space-y-6">
                                        <div>
                                            <h3 className="text-3xl font-black text-slate-900 mb-2">{profileData.name || "Alex Johnson"}</h3>
                                            <p className="text-indigo-600 font-bold text-xl">{profileData.jobTitle || "Full-Stack Developer"}</p>
                                        </div>

                                        <p className="text-slate-600 text-lg leading-relaxed">
                                            {profileData.description || "Computer Science student passionate about AI and full-stack development. I love building products that make a real impact on people's lives."}
                                        </p>

                                        <div className="flex flex-wrap gap-4 text-slate-500 font-medium border-t border-slate-100 pt-6">
                                            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {profileData.university || "Stanford University"}</div>
                                            <div className="w-1 h-1 bg-slate-300 rounded-full my-auto" />
                                            <div className="flex items-center gap-2"><Award className="w-4 h-4" /> {profileData.year || "Junior"}</div>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-64 space-y-6">
                                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Core Skills</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {(profileData.skills.length > 0 ? profileData.skills : ["React", "AI/ML", "Node.js"]).map((s: string) => (
                                                    <Badge key={s} variant="secondary" className="bg-white border-slate-200 text-slate-600">{s}</Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <Button variant="outline" className="w-full justify-start gap-3 py-6 rounded-xl text-slate-500 hover:text-slate-900 border-slate-200">
                                                <Mail className="w-4 h-4" /> {profileData.email || "alex@uni.edu"}
                                            </Button>
                                            <Button variant="outline" className="w-full justify-start gap-3 py-6 rounded-xl text-slate-500 hover:text-slate-900 border-slate-200">
                                                <Github className="w-4 h-4" /> GitHub Profile
                                            </Button>
                                            <Button variant="outline" className="w-full justify-start gap-3 py-6 rounded-xl text-slate-500 hover:text-slate-900 border-slate-200">
                                                <Linkedin className="w-4 h-4" /> LinkedIn Profile
                                            </Button>
                                            <div className="flex items-center gap-2 px-4 py-2 text-xs text-slate-400 font-medium">
                                                <Phone className="w-3 h-3" /> {profileData.phone || "+1 (555) 000-0000"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-slate-900 p-8 flex justify-between items-center">
                                <p className="text-slate-400 text-sm font-medium">Looking good? Proceed to complete your onboarding.</p>
                                <div className="flex gap-4">
                                    <Button variant="ghost" onClick={() => setStep('choice')} className="text-white hover:text-indigo-400 hover:bg-slate-800 font-bold">Rescan</Button>
                                    <Button onClick={finalizeOnboarding} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-6 rounded-xl shadow-xl shadow-indigo-500/20" disabled={loading}>
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
                                    <Sparkles className="w-6 h-6 text-indigo-600" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-5xl font-black text-slate-900 tracking-tight">You're All Set!</h2>
                            <p className="text-slate-500 text-xl max-w-lg mx-auto leading-relaxed">Your professional profile is live. Start connecting with companies and projects that match your expertise.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Button onClick={() => navigate('/student-home')} className="px-12 py-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl font-black text-lg transition-all transform hover:scale-105 shadow-2xl shadow-indigo-200">
                                Go to Home
                            </Button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
