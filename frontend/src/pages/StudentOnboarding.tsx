import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Sparkles, CheckCircle2, ArrowRight, Loader2, Github, Linkedin, Plus, X, Mail, Lock, User as UserIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

type OnboardingStep = 'choice' | 'processing' | 'manual-form' | 'review' | 'success';

interface StudentData {
    // User fields
    email: string;
    password: string;

    // Student fields
    full_name: string;
    university: string;
    degree_level: string;

    // Social links
    github_url: string;
    linkedin_url: string;

    // Projects
    projects: Project[];
}

interface Project {
    id: string;
    title: string;
    repo_url: string;
}

export default function StudentOnboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState<OnboardingStep>('choice');
    const [loading, setLoading] = useState(false);
    const [studentData, setStudentData] = useState<StudentData>({
        email: '',
        password: '',
        full_name: '',
        university: '',
        degree_level: 'Junior',
        github_url: '',
        linkedin_url: '',
        projects: []
    });

    const [currentProject, setCurrentProject] = useState<Partial<Project>>({
        title: '',
        repo_url: ''
    });

    const handleCVUpload = () => {
        setStep('processing');
        // Simulate AI parsing
        setTimeout(() => {
            const data: StudentData = {
                email: 'alex.johnson@university.edu',
                password: '', // Will need to set
                full_name: 'Alex Johnson',
                university: 'Stanford University',
                degree_level: 'Junior',
                github_url: 'https://github.com/alexjohnson',
                linkedin_url: 'https://linkedin.com/in/alexjohnson',
                projects: [
                    {
                        id: '1',
                        title: 'AI Task Manager',
                        repo_url: 'https://github.com/alexjohnson/ai-task-manager'
                    }
                ]
            };
            setStudentData(data);
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

    const addProject = () => {
        if (currentProject.title) {
            const newProject: Project = {
                id: Date.now().toString(),
                title: currentProject.title,
                repo_url: currentProject.repo_url || ''
            };
            setStudentData({
                ...studentData,
                projects: [...studentData.projects, newProject]
            });
            setCurrentProject({
                title: '',
                repo_url: ''
            });
            toast.success('Project added!');
        }
    };

    const removeProject = (id: string) => {
        setStudentData({
            ...studentData,
            projects: studentData.projects.filter(p => p.id !== id)
        });
    };

    const finalizeOnboarding = () => {
        setLoading(true);

        // Prepare data for backend
        const backendData = {
            // User creation
            email: studentData.email,
            password: studentData.password,
            role: 'student',

            // Student profile
            full_name: studentData.full_name,
            university: studentData.university,
            degree_level: studentData.degree_level,

            // Social links
            social_links: [
                studentData.github_url && { platform: 'github', url: studentData.github_url },
                studentData.linkedin_url && { platform: 'linkedin', url: studentData.linkedin_url }
            ].filter(Boolean),

            // Projects
            projects: studentData.projects.map(p => ({
                title: p.title,
                repo_url: p.repo_url
            }))
        };

        console.log('Data to send to backend:', backendData);

        // TODO: Replace with real API call
        // await fetch('/api/students/onboarding', { method: 'POST', body: JSON.stringify(backendData) })

        setTimeout(() => {
            setLoading(false);
            setStep('success');
            toast.success('Onboarding Complete!', {
                description: 'Your profile is ready. Welcome to Vertex.',
            });
        }, 1500);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans bg-gradient-to-br from-slate-50 to-indigo-50">
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
                            <h1 className="text-5xl font-black text-slate-900 tracking-tight">Setup Your Student Profile</h1>
                            <p className="text-slate-500 text-lg">Choose how you'd like to build your professional presence on Vertex.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <Card className="group cursor-pointer hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 transform hover:-translate-y-1" onClick={handleManualEntry}>
                                <CardHeader className="text-center py-10">
                                    <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-50 transition-colors">
                                        <UserIcon className="w-10 h-10 text-slate-400 group-hover:text-indigo-600 transition-colors" />
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
                            <p className="text-slate-500 text-lg">Extracting your skills, experience, and projects.</p>
                        </div>
                    </Card>
                )}

                {/* STEP: MANUAL FORM */}
                {step === 'manual-form' && (
                    <Card className="shadow-2xl border-slate-100">
                        <CardHeader className="border-b bg-slate-50/50 py-8">
                            <CardTitle className="text-3xl font-black tracking-tight">Student Profile Details</CardTitle>
                            <CardDescription className="text-lg">Create your account and complete your profile.</CardDescription>
                        </CardHeader>
                        <CardContent className="py-8">
                            <form id="manual-form" onSubmit={handleFormSubmit} className="space-y-8">
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
                                                placeholder="john@university.edu"
                                                value={studentData.email}
                                                onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                                                required
                                                className="py-6 rounded-xl border-slate-200 focus:border-indigo-500"
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
                                                value={studentData.password}
                                                onChange={(e) => setStudentData({ ...studentData, password: e.target.value })}
                                                required
                                                className="py-6 rounded-xl border-slate-200"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Basic Information */}
                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold text-slate-900">Basic Information</h3>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</Label>
                                            <Input
                                                id="name"
                                                placeholder="John Doe"
                                                value={studentData.full_name}
                                                onChange={(e) => setStudentData({ ...studentData, full_name: e.target.value })}
                                                required
                                                className="py-6 rounded-xl border-slate-200 focus:border-indigo-500"
                                            />
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="uni" className="text-xs font-black uppercase tracking-widest text-slate-400">University</Label>
                                                <Input
                                                    id="uni"
                                                    placeholder="MIT / Stanford"
                                                    value={studentData.university}
                                                    onChange={(e) => setStudentData({ ...studentData, university: e.target.value })}
                                                    className="py-6 rounded-xl border-slate-200"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="year" className="text-xs font-black uppercase tracking-widest text-slate-400">Year Of Study</Label>
                                                <select
                                                    value={studentData.degree_level}
                                                    onChange={(e) => setStudentData({ ...studentData, degree_level: e.target.value })}
                                                    className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm"
                                                >
                                                    <option>Freshman</option>
                                                    <option>Sophomore</option>
                                                    <option>Junior</option>
                                                    <option>Senior</option>
                                                    <option>Graduate</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-slate-900">Social Links (Optional)</h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                                <Github className="w-4 h-4" /> GitHub Profile
                                            </Label>
                                            <Input
                                                placeholder="https://github.com/username"
                                                value={studentData.github_url}
                                                onChange={(e) => setStudentData({ ...studentData, github_url: e.target.value })}
                                                className="py-6 rounded-xl border-slate-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                                <Linkedin className="w-4 h-4" /> LinkedIn Profile
                                            </Label>
                                            <Input
                                                placeholder="https://linkedin.com/in/username"
                                                value={studentData.linkedin_url}
                                                onChange={(e) => setStudentData({ ...studentData, linkedin_url: e.target.value })}
                                                className="py-6 rounded-xl border-slate-200"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Projects */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-slate-900">Projects (Optional)</h3>
                                    <div className="space-y-4 p-6 bg-slate-50 rounded-xl border border-slate-200">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Project Title</Label>
                                            <Input
                                                placeholder="My Awesome Project"
                                                value={currentProject.title}
                                                onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                                                className="py-6 rounded-xl border-slate-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">GitHub Repository URL</Label>
                                            <Input
                                                placeholder="https://github.com/username/project"
                                                value={currentProject.repo_url}
                                                onChange={(e) => setCurrentProject({ ...currentProject, repo_url: e.target.value })}
                                                className="py-6 rounded-xl border-slate-200"
                                            />
                                        </div>
                                        <Button type="button" onClick={addProject} className="w-full py-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold">
                                            <Plus className="w-5 h-5 mr-2" /> Add Project
                                        </Button>
                                    </div>

                                    {/* Added Projects List */}
                                    {studentData.projects.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Your Projects</h4>
                                            {studentData.projects.map((project) => (
                                                <div key={project.id} className="p-4 bg-white rounded-xl border border-slate-200 flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h5 className="font-bold text-slate-900">{project.title}</h5>
                                                        {project.repo_url && (
                                                            <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline mt-1 block">
                                                                {project.repo_url}
                                                            </a>
                                                        )}
                                                    </div>
                                                    <Button type="button" variant="ghost" size="sm" onClick={() => removeProject(project.id)}>
                                                        <X className="w-4 h-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="py-8 bg-slate-50/50 border-t justify-end items-center">
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
                                <p className="text-slate-500 text-lg">Make sure everything looks good before completing.</p>
                            </div>
                            <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 p-2 px-4">
                                <CheckCircle2 className="w-4 h-4 mr-2 inline" /> Ready
                            </Badge>
                        </div>

                        <Card className="overflow-hidden shadow-2xl border-none">
                            <div className="h-32 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 relative">
                                <div className="absolute -bottom-12 left-12">
                                    <div className="w-32 h-32 bg-white rounded-3xl border-8 border-white shadow-2xl flex items-center justify-center text-4xl font-black text-indigo-600">
                                        {studentData.full_name[0] || "S"}
                                    </div>
                                </div>
                            </div>
                            <CardContent className="pt-20 pb-12 px-12">
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-3xl font-black text-slate-900 mb-2">{studentData.full_name || "Student Name"}</h3>
                                        <p className="text-indigo-600 font-bold text-xl">{studentData.university || "University"} • {studentData.degree_level}</p>
                                        <p className="text-slate-600 mt-2">{studentData.email}</p>
                                    </div>

                                    {studentData.projects.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3">Projects</h4>
                                            <div className="space-y-4">
                                                {studentData.projects.map((project) => (
                                                    <div key={project.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                                        <h5 className="font-bold text-slate-900">{project.title}</h5>
                                                        {project.repo_url && (
                                                            <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline mt-1 block">
                                                                {project.repo_url}
                                                            </a>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {(studentData.github_url || studentData.linkedin_url) && (
                                        <div className="flex gap-4">
                                            {studentData.github_url && (
                                                <Button variant="outline" className="flex items-center gap-2" onClick={() => window.open(studentData.github_url, '_blank')}>
                                                    <Github className="w-4 h-4" /> GitHub
                                                </Button>
                                            )}
                                            {studentData.linkedin_url && (
                                                <Button variant="outline" className="flex items-center gap-2" onClick={() => window.open(studentData.linkedin_url, '_blank')}>
                                                    <Linkedin className="w-4 h-4" /> LinkedIn
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="bg-slate-900 p-8 flex justify-between items-center">
                                <p className="text-slate-400 text-sm font-medium">Looking good? Complete your onboarding.</p>
                                <div className="flex gap-4">
                                    <Button variant="ghost" onClick={() => setStep('choice')} className="text-white hover:text-indigo-400 hover:bg-slate-800 font-bold">Edit</Button>
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
                                Go to Dashboard
                            </Button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
