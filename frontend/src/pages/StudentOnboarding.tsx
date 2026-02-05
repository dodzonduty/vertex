import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Sparkles, CheckCircle2, ArrowRight, Loader2, Github, Linkedin, Plus, X, Mail, Lock, User as UserIcon } from 'lucide-react';
import { apiRequest, setAuthToken, setUserData } from '../lib/api/config';
import { signupStudent, analyzeCV, updateStudentProfile, listGitHubRepos, analyzeGitHubBatch } from '../lib/api/students';
import { login } from '../lib/api/auth';
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

    // AI analytics
    bio: string;
    ats_score: number;
    skills: string[];
}

interface Project {
    id: string;
    title: string;
    description: string;
    tags: string[];
    repo_url: string;
    strengths: string[];
    weaknesses: string[];
}

export default function StudentOnboarding() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [step, setStep] = useState<OnboardingStep>('choice');
    const [loading, setLoading] = useState(false);
    const [isParsingGitHub, setIsParsingGitHub] = useState(false);
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [rawCVResponse, setRawCVResponse] = useState<any>(null);
    const [showRepoSelector, setShowRepoSelector] = useState(false);
    const [availableRepos, setAvailableRepos] = useState<any[]>([]);
    const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
    const [isFetchingRepos, setIsFetchingRepos] = useState(false);
    const [studentData, setStudentData] = useState<StudentData>({
        full_name: '',
        email: '',
        password: '',
        university: '',
        degree_level: 'Junior',
        github_url: '',
        linkedin_url: '',
        projects: [],
        bio: '',
        ats_score: 0,
        skills: []
    });

    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentProject, setCurrentProject] = useState<Partial<Project>>({
        title: '',
        description: '',
        tags: [],
        repo_url: '',
        strengths: [],
        weaknesses: []
    });

    const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        console.log('File selected:', file?.name, file?.type, file?.size);
        if (!file) return;

        toast.info('Uploading and analyzing your CV...');
        setStep('processing');

        try {
            console.log('Starting AI analysis...');
            const data = await analyzeCV(file);
            setRawCVResponse(data);
            setStudentData(prev => ({
                ...prev,
                full_name: data.full_name || prev.full_name,
                email: data.email || prev.email,
                university: data.university || prev.university,
                degree_level: data.degree_level || prev.degree_level,
                github_url: data.github_url || prev.github_url,
                linkedin_url: data.linkedin_url || prev.linkedin_url,
                bio: data.professional_bio || data.bio || prev.bio,
                ats_score: typeof data.ats_compatibility === 'string'
                    ? parseInt(data.ats_compatibility.replace(/[^0-9]/g, ''))
                    : (data.ats_compatibility || data.ats_score || prev.ats_score),
                skills: data.skills || prev.skills,
                projects: data.projects ? data.projects.map((p: any) => ({
                    id: Math.random().toString(36).substr(2, 9),
                    title: p.title,
                    description: p.description || "Synthesized from your CV",
                    tags: p.tags || [],
                    repo_url: p.repo_url || '',
                    strengths: p.strengths || [],
                    weaknesses: p.improvements || p.weaknesses || []
                })) : prev.projects
            }));

            setStep('review');
            toast.success('CV Parsed Successfully!', {
                description: 'AI has extracted your professional details.',
            });
        } catch (error) {
            console.error('CV Parsing error:', error);
            setStep('choice');
            toast.error('AI Analysis Failed', {
                description: error instanceof Error ? error.message : 'Please try manual setup or another file.',
            });
        } finally {
            // Reset input so the same file can be uploaded again
            if (e.target) e.target.value = '';
        }
    };

    const handleGitHubExtraction = async () => {
        if (!studentData.github_url) {
            toast.error('Please enter your GitHub profile URL first');
            return;
        }

        setIsFetchingRepos(true);
        try {
            const response = await listGitHubRepos(studentData.github_url);
            setAvailableRepos(response.repos);
            setShowRepoSelector(true);
            toast.success(`Found ${response.count} repositories!`, {
                description: `Select which projects to import from @${response.username}`
            });
        } catch (error) {
            console.error('GitHub repos fetch error:', error);
            toast.error('Failed to fetch repositories', {
                description: 'Make sure you entered a valid GitHub profile URL'
            });
        } finally {
            setIsFetchingRepos(false);
        }
    };

    const handleImportSelected = async () => {
        if (selectedRepos.length === 0) {
            toast.error('Please select at least one repository');
            return;
        }

        setIsParsingGitHub(true);
        toast.info(`Analyzing ${selectedRepos.length} repositories with AI...`);

        try {
            const response = await analyzeGitHubBatch(selectedRepos);
            const successfulProjects = response.results
                .filter((r: any) => r.success)
                .map((r: any) => ({
                    id: Date.now() + Math.random(),
                    title: r.data.title,
                    description: r.data.description,
                    tags: r.data.tags || [],
                    repo_url: r.data.repo_url,
                    strengths: r.data.strengths || [],
                    weaknesses: r.data.improvements || r.data.weaknesses || []
                }));

            setStudentData(prev => ({
                ...prev,
                projects: [...prev.projects, ...successfulProjects]
            }));

            setShowRepoSelector(false);
            setSelectedRepos([]);

            if (response.successful > 0) {
                toast.success(`Imported ${response.successful} projects!`, {
                    description: 'AI has analyzed and added them to your profile'
                });
            }

            if (response.successful < response.total) {
                toast.warning(`${response.total - response.successful} repos failed to import`);
            }
        } catch (error) {
            console.error('GitHub batch analysis error:', error);
            toast.error('Failed to analyze repositories');
        } finally {
            setIsParsingGitHub(false);
        }
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
                description: currentProject.description || '',
                tags: currentProject.tags || [],
                repo_url: currentProject.repo_url || '',
                strengths: currentProject.strengths || [],
                weaknesses: currentProject.weaknesses || []
            };
            setStudentData({
                ...studentData,
                projects: [...studentData.projects, newProject]
            });
            setCurrentProject({
                title: '',
                description: '',
                tags: [],
                repo_url: '',
                strengths: [],
                weaknesses: []
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

    const finalizeOnboarding = async () => {
        if (!studentData.email || !studentData.full_name) {
            toast.error('Name and Email are required');
            return;
        }
        if (!studentData.password || studentData.password !== confirmPassword) {
            toast.error('Passwords do not match or are empty');
            return;
        }
        setLoading(true);

        const signupData = {
            email: studentData.email,
            password: studentData.password,
            full_name: studentData.full_name,
            university: studentData.university,
            degree_level: studentData.degree_level,
            Email_Address: studentData.email,
            bio: studentData.bio,
            ats_score: studentData.ats_score,
            skills: studentData.skills
        };

        try {
            console.log('Attempting signup...', signupData);
            const signupPayload = {
                email: signupData.email,
                password: signupData.password,
                full_name: signupData.full_name,
                university: signupData.university || undefined,
                degree_level: signupData.degree_level || undefined,
                social_links: (studentData.github_url || studentData.linkedin_url) ? [
                    ...(studentData.github_url ? [{ url: studentData.github_url, username: undefined }] : []),
                    ...(studentData.linkedin_url ? [{ url: studentData.linkedin_url, username: undefined }] : [])
                ] : undefined,
                projects: studentData.projects?.length ? studentData.projects.map((p: Project) => ({
                    title: p.title,
                    repo_url: p.repo_url || undefined,
                    description: p.description || undefined,
                    tags: p.tags || [],
                    strengths: p.strengths || [],
                    weaknesses: p.weaknesses || []
                })) : undefined,
                parsed_cv: rawCVResponse || undefined
            };

            let signupSucceeded = false;
            try {
                const signupResponse = await signupStudent(signupPayload) as { access_token?: string; user_id?: string; email?: string; role?: string };
                if (signupResponse?.access_token) {
                    setAuthToken(signupResponse.access_token);
                    setUserData({
                        user_id: signupResponse.user_id,
                        email: signupResponse.email,
                        role: signupResponse.role
                    });
                }
                signupSucceeded = true;
                console.log('Signup successful');
            } catch (signupError: any) {
                const msg = signupError?.message ?? String(signupError);
                // Only "account exists" → try login; any other error → show and stop
                if (msg.includes('Email already registered') || msg.includes('already registered')) {
                    toast.info('Account already exists, signing you in...');
                } else {
                    setLoading(false);
                    toast.error('Registration failed', { description: msg });
                    return;
                }
            }

            if (!signupSucceeded) {
                console.log('Attempting login...');
                await login({
                    email: signupData.email,
                    password: signupData.password
                });
                console.log('Login successful');
            }

            // FORCE UPDATE PROFILE DATA (Double-Tap) to ensure AI fields are saved
            try {
                console.log('Force updating profile with AI data...');
                await updateStudentProfile('me', {
                    bio: studentData.bio,
                    ats_score: typeof studentData.ats_score === 'string'
                        ? parseInt(String(studentData.ats_score).replace(/[^0-9]/g, ''))
                        : (Number(studentData.ats_score) || 0),
                    skills: studentData.skills,
                    github_url: studentData.github_url,
                    linkedin_url: studentData.linkedin_url,
                    full_name: studentData.full_name,
                    university: studentData.university,
                    degree_level: studentData.degree_level
                });
                console.log('Profile force update successful');
            } catch (updErr) {
                console.error("Profile update failed:", updErr);
            }

            // If there are projects, add them after signup
            console.log('Adding projects...', studentData.projects);
            for (const project of studentData.projects) {
                try {
                    await apiRequest('/api/students/me/projects', {
                        method: 'POST',
                        body: JSON.stringify({
                            title: project.title,
                            description: project.description || "Synthesized from your CV/GitHub",
                            repo_url: project.repo_url,
                            tags: project.tags,
                            strengths: project.strengths,
                            weaknesses: project.weaknesses
                        })
                    });
                    console.log(`Project ${project.title} added successfully`);
                } catch (e) {
                    console.error('Failed to add project during onboarding:', e);
                }
            }

            setLoading(false);
            setStep('success');
            toast.success('Profile Completed Successfully!');
        } catch (error) {
            console.error('Finalization error:', error);
            setLoading(false);
            const message = error instanceof Error ? error.message : 'Please check your credentials or try again later.';
            toast.error('Onboarding Failed', {
                description: message
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans bg-gradient-to-br from-slate-50 to-indigo-50">
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleCVUpload}
                className="hidden"
                accept=".pdf"
            />

            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 -left-20 w-[60vw] h-[60vw] rounded-full bg-indigo-500/5 blur-[120px]" />
                <div className="absolute bottom-1/4 -right-20 w-[50vw] h-[50vw] rounded-full bg-blue-500/5 blur-[120px]" />
            </div>

            <div className="w-full max-w-4xl relative z-10 animate-in fade-in zoom-in-95 duration-700 py-12">

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

                            <Card
                                className="group cursor-pointer border-indigo-200 bg-white ring-2 ring-indigo-500/5 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
                                onClick={() => {
                                    console.log('Card clicked, triggering file input');
                                    fileInputRef.current?.click();
                                }}
                            >
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
                                    <span
                                        className="text-sm font-bold text-indigo-600 flex items-center gap-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            console.log('Footer clicked, triggering file input');
                                            fileInputRef.current?.click();
                                        }}
                                    >
                                        Scan CV Now <ArrowRight className="w-4 h-4" />
                                    </span>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                )}

                {step === 'processing' && (
                    <Card className="text-center p-20 space-y-8 border-none bg-transparent shadow-none">
                        <div className="relative w-32 h-32 mx-auto">
                            <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                            <Sparkles className="absolute inset-0 m-auto w-10 h-10 text-indigo-600 animate-pulse" />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">AI is Analyzing...</h2>
                            <p className="text-slate-500 text-lg font-medium">Extracting your skills, experience, and projects from your CV.</p>

                            {/* Progress Bar Simulation */}
                            <div className="w-64 mx-auto bg-slate-200 rounded-full h-2 overflow-hidden relative mt-8">
                                <div className="absolute inset-0 bg-indigo-600/20 w-full animate-pulse" />
                                <div className="bg-indigo-600 h-full rounded-full animate-[shimmer_2s_infinite] w-2/3" />
                            </div>
                            <div className="flex justify-between text-xs text-slate-400 font-bold uppercase tracking-widest w-64 mx-auto mt-2">
                                <span>Scanning</span>
                                <span className="text-indigo-600">Extracting</span>
                                <span>Finalizing</span>
                            </div>
                        </div>
                    </Card>
                )}

                {step === 'manual-form' && (
                    <Card className="shadow-2xl border-slate-100">
                        <CardHeader className="border-b bg-slate-50/50 py-8">
                            <CardTitle className="text-3xl font-black tracking-tight">Student Profile Details</CardTitle>
                            <CardDescription className="text-lg">Create your account and complete your profile.</CardDescription>
                        </CardHeader>
                        <CardContent className="py-8">
                            <form id="manual-form" onSubmit={handleFormSubmit} className="space-y-8">
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

                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-slate-900">Social Links (Optional)</h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                                <Github className="w-4 h-4" /> GitHub Profile
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    placeholder="https://github.com/username"
                                                    value={studentData.github_url}
                                                    onChange={(e) => setStudentData({ ...studentData, github_url: e.target.value })}
                                                    className="py-6 rounded-xl border-slate-200 pr-32"
                                                />
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    disabled={isFetchingRepos || !studentData.github_url}
                                                    onClick={handleGitHubExtraction}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-none"
                                                >
                                                    {isFetchingRepos ? <Loader2 className="w-4 h-4 animate-spin" /> : "Magic Sync"}
                                                </Button>
                                            </div>
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
                                </div>
                            </div>
                            <CardContent className="pt-20 pb-12 px-12">
                                <div className="space-y-8">
                                    <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                        <div className="relative group">
                                            <div className="w-32 h-32 bg-slate-100 rounded-3xl border-4 border-white shadow-xl flex items-center justify-center text-4xl font-extrabold text-indigo-600 overflow-hidden">
                                                {studentData.ats_score > 0 && !profilePic && (
                                                    <div className="absolute inset-0 bg-indigo-600/10 flex items-center justify-center">
                                                        <Sparkles className="w-12 h-12 text-indigo-400 opacity-20" />
                                                    </div>
                                                )}
                                                {profilePic ? (
                                                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span>{studentData.full_name[0] || 'S'}</span>
                                                )}
                                            </div>
                                            <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 rounded-xl shadow-lg flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-all border-4 border-white">
                                                <Upload className="w-5 h-5 text-white" />
                                                <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;
                                                    const formData = new FormData();
                                                    formData.append('file', file);
                                                    try {
                                                        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/mocks/profile-picture/upload/${studentData.email}`, {
                                                            method: 'POST',
                                                            body: formData
                                                        });
                                                        const data = await res.json();
                                                        setProfilePic(data.profile_picture_url);
                                                        toast.success("Profile picture uploaded!");
                                                    } catch (err) {
                                                        toast.error("Upload failed");
                                                    }
                                                }} />
                                            </label>
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[2px] mb-1">AI Match Rating</h3>
                                                    <div className="flex items-end gap-2">
                                                        <span className="text-5xl font-black text-indigo-600">{studentData.ats_score}%</span>
                                                        <span className="text-sm font-bold text-slate-400 mb-1">ATS Compatibility</span>
                                                    </div>
                                                </div>
                                                <div className="hidden md:block">
                                                    <Sparkles className="w-12 h-12 text-indigo-200" />
                                                </div>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${studentData.ats_score}%` }}></div>
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium">Vertex AI analyzed your profile and calculated this compatibility score based on current industry standards.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6 bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                                        <h4 className="text-sm font-black text-indigo-900 uppercase tracking-widest flex items-center gap-2">
                                            <Lock className="w-4 h-4" /> Account Security
                                        </h4>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-slate-2500">Create Password</Label>
                                                <Input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    value={studentData.password}
                                                    onChange={(e) => setStudentData({ ...studentData, password: e.target.value })}
                                                    className="bg-white border-slate-50"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-slate-2500">Confirm Password</Label>
                                                <Input
                                                    type="password"
                                                    placeholder=""
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="bg-white border-slate-"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</Label>
                                            <Input
                                                value={studentData.full_name}
                                                onChange={(e) => setStudentData({ ...studentData, full_name: e.target.value })}
                                                className="py-6 rounded-xl border-slate-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</Label>
                                            <Input
                                                type="email"
                                                value={studentData.email}
                                                onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                                                className="py-6 rounded-xl border-slate-200"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">University</Label>
                                            <Input
                                                value={studentData.university}
                                                onChange={(e) => setStudentData({ ...studentData, university: e.target.value })}
                                                className="py-6 rounded-xl border-slate-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Degree Level</Label>
                                            <select
                                                value={studentData.degree_level}
                                                onChange={(e) => setStudentData({ ...studentData, degree_level: e.target.value })}
                                                className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm bg-white"
                                            >
                                                <option>Freshman</option>
                                                <option>Sophomore</option>
                                                <option>Junior</option>
                                                <option>Senior</option>
                                                <option>Graduate</option>
                                            </select>
                                        </div>
                                    </div>

                                    {studentData.projects.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3">Projects</h4>
                                            <div className="space-y-4">
                                                {studentData.projects.map((project) => (
                                                    <div key={project.id} className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                                                        <div className="flex justify-between items-start">
                                                            <h5 className="font-bold text-slate-900 text-lg">{project.title}</h5>
                                                            {project.repo_url && (
                                                                <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700">
                                                                    <Github className="w-5 h-5" />
                                                                </a>
                                                            )}
                                                        </div>
                                                        <p className="text-slate-600 text-sm leading-relaxed">{project.description}</p>
                                                        {project.tags && project.tags.length > 0 && (
                                                            <div className="flex flex-wrap gap-2">
                                                                {project.tags.map(tag => (
                                                                    <Badge key={tag} variant="outline" className="bg-white text-indigo-600 border-indigo-100 text-[10px] font-bold uppercase transition-all hover:bg-indigo-50">
                                                                        {tag}
                                                                    </Badge>
                                                                ))}
                                                            </div>
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
                            <CardFooter className="bg-slate-500 p-8 flex justify-between items-center">
                                <p className="text-slate-900 text-sm font-medium">Looking good? Complete your onboarding.</p>
                                <div className="flex gap-4">
                                    <Button variant="ghost" onClick={() => setStep('choice')} className="text-slate-400 text-sm font-medium">Edit</Button>
                                    <Button onClick={finalizeOnboarding} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-6 rounded-xl shadow-xl shadow-indigo-200" disabled={loading}>
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Complete Profile"}
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                )}

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

            {/* Repository Selector Modal */}
            {showRepoSelector && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                        <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-purple-50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-2xl font-black text-slate-900">Select Repositories to Import</CardTitle>
                                    <CardDescription className="text-base mt-1">
                                        Choose which projects to analyze with AI and add to your profile
                                    </CardDescription>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setShowRepoSelector(false);
                                        setSelectedRepos([]);
                                    }}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="overflow-y-auto max-h-[50vh] p-6">
                            {availableRepos.length === 0 ? (
                                <div className="text-center py-12">
                                    <Github className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-500">No repositories found</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {availableRepos.map((repo) => (
                                        <div
                                            key={repo.url}
                                            className={`flex items-start gap-4 p-4 border-2 rounded-xl transition-all cursor-pointer hover:shadow-md ${selectedRepos.includes(repo.url)
                                                ? 'border-indigo-500 bg-indigo-50/50'
                                                : 'border-slate-200 hover:border-indigo-200'
                                                }`}
                                            onClick={() => {
                                                if (selectedRepos.includes(repo.url)) {
                                                    setSelectedRepos(selectedRepos.filter(url => url !== repo.url));
                                                } else {
                                                    setSelectedRepos([...selectedRepos, repo.url]);
                                                }
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedRepos.includes(repo.url)}
                                                onChange={() => { }} // Handled by parent div click
                                                className="mt-1 w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className="font-bold text-slate-900 text-lg">{repo.name}</h4>
                                                    {repo.is_private && (
                                                        <Badge variant="outline" className="text-xs">Private</Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-600 mt-1 line-clamp-2">{repo.description}</p>
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {repo.language && (
                                                        <Badge variant="outline" className="bg-white text-indigo-600 border-indigo-200">
                                                            {repo.language}
                                                        </Badge>
                                                    )}
                                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                                        ⭐ {repo.stars} stars
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-between items-center border-t bg-slate-50 py-4 px-6">
                            <p className="text-sm text-slate-500">
                                {selectedRepos.length > 0 ? (
                                    <span className="font-bold text-indigo-600">
                                        {selectedRepos.length} project{selectedRepos.length !== 1 ? 's' : ''} selected
                                    </span>
                                ) : (
                                    'Select at least one repository'
                                )}
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowRepoSelector(false);
                                        setSelectedRepos([]);
                                    }}
                                    className="border-slate-300"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleImportSelected}
                                    disabled={isParsingGitHub || selectedRepos.length === 0}
                                    className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                                >
                                    {isParsingGitHub ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            Import {selectedRepos.length} Project{selectedRepos.length !== 1 ? 's' : ''}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            )}
        </div>
    );
}
