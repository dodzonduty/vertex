import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Mail, Phone, MapPin, Github, Linkedin,
  ExternalLink, CheckCircle2, Award, Plus, Save, X, Sparkles, FolderGit2, Loader2, Edit, Upload
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { getStudentProfile, updateStudentProfile, addProject, analyzeCV } from '../../lib/api/students';
import { getUserData } from '../../lib/api/config';

type ProfileMode = 'view' | 'edit' | 'add-project';

export function StudentProfile() {
  const [searchParams, setSearchParams] = useSearchParams();
  const validModes: ProfileMode[] = ['view', 'edit', 'add-project'];
  const modeParam = searchParams.get('mode');
  const profileMode: ProfileMode = validModes.includes(modeParam as ProfileMode) ? (modeParam as ProfileMode) : 'view';

  const setProfileMode = (mode: ProfileMode) => {
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
  // Removed isAddingProject state in favor of profileMode
  const [newProject, setNewProject] = useState({ title: '', description: '', repo_url: '' });
  const [profileData, setProfileData] = useState<any>({
    name: 'Loading...',
    email: '',
    phone: '',
    university: '',
    year: '',
    description: '',
    jobTitle: '',
    githubLink: '',
    linkedinLink: '',
    atsScore: 0,
    certificates: [],
    skills: [],
    strengths: [],
    weaknesses: [],
    profilePicture: null
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadPicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setProfileData((prev: any) => ({ ...prev, profilePicture: data.profile_photo_url }));
      toast.success("Profile picture updated!");
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleScanCV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    toast.info("Analyzing your CV...", { description: "Vertex AI is extracting your details." });

    try {
      const data = await analyzeCV(file);
      console.log('Resume Analysis Result:', data);

      // Robust update logic (Double-Tap Strategy)
      const updatePayload = {
        bio: data.professional_bio || data.bio,
        ats_score: typeof data.ats_compatibility === 'string'
          ? parseInt(data.ats_compatibility.replace(/[^0-9]/g, ''))
          : (Number(data.ats_compatibility) || 0),
        skills: data.skills || [],
        github_url: data.github_url,
        linkedin_url: data.linkedin_url,
        // Also update basics if missing
        full_name: profileData.name === 'Loading...' ? data.full_name : undefined,
        university: !profileData.university ? data.university : undefined,
        degree_level: !profileData.year ? data.degree_level : undefined
      };

      console.log('Sending Profile Update Payload:', updatePayload);
      await updateStudentProfile('me', updatePayload);
      console.log('Profile Update Success');

      // Add projects if any
      if (data.projects && data.projects.length > 0) {
        console.log(`Found ${data.projects.length} projects to add.`);
        for (const p of data.projects) {
          try {
            console.log('Adding project:', p.title);
            await addProject({
              title: p.title,
              description: p.description || "Synthesized from CV",
              repo_url: p.repo_url,
              tags: p.tags,
              strengths: p.strengths,
              weaknesses: p.improvements
            });
            console.log('Project added successfully');
          } catch (err) {
            console.error("Project add failed", err);
            toast.warning(`Could not add project: ${p.title}`);
          }
        }
      }

      toast.success("Profile Updated!", {
        description: "AI analysis applied successfully. Refreshing page...",
        duration: 3000
      });

      // Delay reload to ensure user sees success and backend commits
      setTimeout(() => window.location.reload(), 2000);

    } catch (error) {
      console.error("CV Analysis failed", error);
      toast.error("Analysis Failed", { description: "Could not parse the CV. Please try again." });
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = getUserData();
        if (!userData || !userData.user_id) {
          toast.error("User not logged in");
          setLoading(false);
          return;
        }

        // Directly fetch the logged-in student's profile
        const detailed = await getStudentProfile('me');

        if (detailed) {
          setProfileData({
            name: detailed.full_name,
            email: detailed.email,
            phone: detailed.Email_Address || '',
            university: detailed.university || '',
            year: detailed.degree_level || '',
            description: detailed.bio || '',
            jobTitle: detailed.degree_level ? `${detailed.degree_level} Student` : 'Student',
            githubLink: detailed.github_url || '',
            linkedinLink: detailed.linkedin_url || '',
            atsScore: detailed.ats_score || 0,
            skills: detailed.skills || [],
            projects: detailed.projects || [],
            profilePicture: (detailed as any).profile_photo_url || null,
            strengths: [],
            weaknesses: []
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        full_name: profileData.name,
        university: profileData.university,
        degree_level: profileData.year,
        Email_Address: profileData.phone,
        bio: profileData.description,
        skills: profileData.skills,
        github_url: profileData.githubLink,
        linkedin_url: profileData.linkedinLink,
        ats_score: profileData.atsScore
      };

      await updateStudentProfile('me', updateData);

      setProfileMode('view');
      toast.success('Profile Updated', {
        description: 'Your changes have been saved successfully.',
      });
    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error("Update Failed", {
        description: error instanceof Error ? error.message : "Could not save changes."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addProject(newProject);
      toast.success('Project added successfully');
      setProfileMode('view');
      setNewProject({ title: '', description: '', repo_url: '' });
      // Refresh to show new project
      window.location.reload();
    } catch (error) {
      toast.error('Failed to add project');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Syncing with Vertex AI...</p>
      </div>
    );
  }

  if (profileMode === 'view') {
    return (
      <div className="max-w-5xl mx-auto py-4 animate-in fade-in duration-700">


        {/* Profile Header - Premium */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden mb-10 group">
          {/* Banner */}
          <div className="h-20 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          </div>

          <div className="px-8 pb-8 pt-10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar Section */}
              <div className="relative group/avatar">
                <div className="w-36 h-36 bg-white rounded-2xl border-4 border-white shadow-2xl flex items-center justify-center text-5xl font-extrabold text-indigo-600 relative overflow-hidden">
                  {profileData.profilePicture ? (
                    <img src={profileData.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-indigo-50 transition-colors group-hover/avatar:bg-indigo-100" />
                      <span className="relative z-10">{profileData.name[0] || "H"}</span>
                    </>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-20">
                      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                    </div>
                  )}
                </div>

                <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 rounded-xl shadow-lg flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-all border-4 border-white z-30 opacity-0 group-hover/avatar:opacity-100 scale-90 group-hover/avatar:scale-100">
                  <Upload className="w-5 h-5 text-white" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleUploadPicture} disabled={isUploading} />
                </label>
              </div>

              {/* Profile Info Section */}
              <div className="flex-1 space-y-3">
                {/* Name & Verification */}
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-bold text-slate-900">{profileData.name || "Habeba Mostafa Desoky"}</h1>
                </div>

                {/* Job Titles */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-semibold py-1 px-3">
                      {profileData.jobTitle || "Undergraduate Student Engineer Student"}
                    </Badge>
                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold py-1 px-3">
                      Student
                    </Badge>
                  </div>

                  {/* University & Faculty */}
                  <div className="flex flex-wrap items-center gap-3 text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span className="font-medium">{profileData.university || "Helwan University"}</span>
                      <span className="text-slate-500">,</span>
                      <span className="text-slate-600">{profileData.faculty || "Faculty of Engineering"}</span>
                    </div>
                  </div>

                  {/* Degree Level */}
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-700 font-medium">{profileData.year || "Undergraduate Student Engineer"}</span>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <div className="md:self-start">
                <Button
                  onClick={() => setProfileMode('edit')}
                  style={{
                    backgroundColor: '#4f46e5',
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
                    boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.2)'
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 transition-all group/edit hover:shadow-indigo-300"
                >
                  <Edit className="w-4 h-4 text-white/90 group-hover/edit:text-white transition-colors" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-6">

            {/* AI Setup / Re-scan (Visible if score is 0 or low) */}
            {profileData.atsScore === 0 && (
              <Card className="border-indigo-100 shadow-lg shadow-indigo-100/50 bg-indigo-50/30 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Sparkles className="w-24 h-24 text-indigo-600" />
                </div>
                <CardContent className="p-6 space-y-4 relative z-10">
                  <div className="space-y-2">
                    <h3 className="font-black text-indigo-900 text-lg">AI Profile Setup</h3>
                    <p className="text-sm text-indigo-700 font-medium">Your profile seems empty. Upload your CV to auto-fill everything.</p>
                  </div>
                  <div className="relative">
                    <input
                      type="file"
                      id="rescan-cv"
                      onChange={handleScanCV}
                      className="hidden"
                      accept=".pdf"
                      disabled={isAnalyzing}
                    />
                    <Button
                      onClick={() => document.getElementById('rescan-cv')?.click()}
                      style={{
                        backgroundColor: '#4f46e5',
                        color: 'white',
                        paddingTop: '12px',
                        paddingBottom: '12px',
                        borderRadius: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        width: '100%',
                        border: 'none'
                      }}
                      className="hover:bg-indigo-700 shadow-xl shadow-indigo-200"
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4" />}
                      {isAnalyzing ? "Analyzing..." : "Auto-Fill with CV"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ATS Score */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-[2px]">AI Analysis</h3>
                </div>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-4xl font-black text-slate-900">{profileData.atsScore}%</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">ATS Compatibility</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full transition-all duration-1000" style={{ width: `${profileData.atsScore}%` }} />
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-[2px] mb-4">Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary" className="bg-white border-slate-100 text-slate-600 px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-[2px] mb-2">Contact</h3>
                <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {profileData.email}
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400" />
                  {profileData.phone}
                </div>
                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <a href={profileData.githubLink} className="text-slate-400 hover:text-slate-900 transition-colors"><Github className="w-5 h-5" /></a>
                  <a href={profileData.linkedinLink} className="text-slate-400 hover:text-blue-600 transition-colors"><Linkedin className="w-5 h-5" /></a>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-8">
            <section>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Professional Bio</h3>
              <p className="text-slate-600 leading-relaxed text-lg italic">
                {profileData.description || "No bio added yet. Click edit to tell us about yourself!"}
              </p>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Projects</h3>
                <button
                  onClick={() => setProfileMode('add-project')}
                  style={{
                    backgroundColor: '#4f46e5',
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
                    minWidth: '140px',
                    justifyContent: 'center',
                    border: 'none'
                  }}
                  className="hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                >
                  <Plus className="w-4 h-4" />
                  Add Project
                </button>
              </div>

              <div className="grid gap-4">
                {profileData.projects && profileData.projects.length > 0 ? (
                  profileData.projects.map((project: any, idx: number) => (
                    <ProjectCard
                      key={idx}
                      name={project.title}
                      description={project.description || "No description provided."}
                      tags={project.tags || []}
                      githubLink={project.repo_url}
                      verified={project.is_verified || false}
                      strengths={project.strengths || []}
                      improvements={project.weaknesses || []}
                    />
                  ))
                ) : (
                  <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-10 text-center">
                    <p className="text-slate-500 font-bold">No projects showcased yet.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  // EDIT MODE
  if (profileMode === 'edit') {
    return (
      <div className="max-w-4xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="shadow-2xl border-none">
          <CardContent className="p-0">
            <form onSubmit={handleSaveProfile}>
              {/* ... existing edit form content ... */}
              <div className="p-8 border-b bg-slate-50/50 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Refine Profile</h2>
                  <p className="text-slate-500 font-medium">Keep your professional identity up to date.</p>
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
                      backgroundColor: '#4f46e5',
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
                    className="hover:bg-indigo-700 shadow-xl shadow-indigo-200"
                  >
                    <Save className="w-5 h-5" /> Save Changes
                  </Button>
                </div>
              </div>

              <div className="p-10 space-y-10">
                {/* Identity Section */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Public Name</Label>
                    <Input
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      style={{
                          border: '2px solid #cbd5e1',
                          borderRadius: '12px',
                          padding: '12px',
                          fontWeight: 500
                      }}
                      className="py-6 focus:!border-indigo-500 hover:!border-indigo-400 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Professional Headline</Label>
                    <Input
                      value={profileData.jobTitle}
                      onChange={(e) => setProfileData({ ...profileData, jobTitle: e.target.value })}
                      style={{
                          border: '2px solid #cbd5e1',
                          borderRadius: '12px',
                          padding: '12px',
                          fontWeight: 500
                      }}
                      className="py-6 focus:!border-indigo-500 hover:!border-indigo-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Detailed Bio</Label>
                  <Textarea
                    value={profileData.description}
                    onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                    style={{
                        border: '2px solid #cbd5e1',
                        borderRadius: '12px',
                        padding: '12px',
                        lineHeight: '1.6'
                    }}
                    className="min-h-[150px] focus:!border-indigo-500 hover:!border-indigo-400 transition-colors text-lg"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-8 border-t border-slate-100 pt-10">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">University</Label>
                    <Input
                      value={profileData.university}
                      onChange={(e) => setProfileData({ ...profileData, university: e.target.value })}
                      style={{
                          border: '2px solid #cbd5e1',
                          borderRadius: '12px',
                          padding: '12px',
                          fontWeight: 500
                      }}
                      className="py-6 focus:!border-indigo-500 hover:!border-indigo-400 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Study Year</Label>
                    <Input
                      value={profileData.year}
                      onChange={(e) => setProfileData({ ...profileData, year: e.target.value })}
                      style={{
                          border: '2px solid #cbd5e1',
                          borderRadius: '12px',
                          padding: '12px',
                          fontWeight: 500
                      }}
                      className="py-6 focus:!border-indigo-500 hover:!border-indigo-400 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Contact</Label>
                    <Input
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      style={{
                          border: '2px solid #cbd5e1',
                          borderRadius: '12px',
                          padding: '12px',
                          fontWeight: 500
                      }}
                      className="py-6 focus:!border-indigo-500 hover:!border-indigo-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">GitHub URL</Label>
                    <Input
                      value={profileData.githubLink}
                      onChange={(e) => setProfileData({ ...profileData, githubLink: e.target.value })}
                      placeholder="https://github.com/username"
                      style={{
                          border: '2px solid #cbd5e1',
                          borderRadius: '12px',
                          padding: '12px',
                          fontWeight: 500
                      }}
                      className="py-6 focus:!border-indigo-500 hover:!border-indigo-400 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">LinkedIn URL</Label>
                    <Input
                      value={profileData.linkedinLink}
                      onChange={(e) => setProfileData({ ...profileData, linkedinLink: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                      style={{
                          border: '2px solid #cbd5e1',
                          borderRadius: '12px',
                          padding: '12px',
                          fontWeight: 500
                      }}
                      className="py-6 focus:!border-indigo-500 hover:!border-indigo-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</Label>
                  <Input
                    value={profileData.email}
                    disabled
                    type="email"
                    className="py-6 rounded-xl border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="p-8 bg-indigo-600/5 text-indigo-700 font-bold flex items-center justify-center gap-2 border-t border-indigo-100">
                <Sparkles className="w-5 h-5" />
                Vertex AI will re-analyze your compatibility score after saving.
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ADD PROJECT MODE
  if (profileMode === 'add-project') {
    return (
      <div className="max-w-4xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="shadow-2xl border-none">
          <CardContent className="p-0">
            <form onSubmit={handleAddProject}>
              <div className="p-8 border-b bg-slate-50/50 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Add New Project</h2>
                  <p className="text-slate-500 font-medium">Showcase what you've built.</p>
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
                      backgroundColor: '#4f46e5',
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
                    className="hover:bg-indigo-700 shadow-xl shadow-indigo-200"
                  >
                    <Plus className="w-5 h-5" /> Create Project
                  </Button>
                </div>
              </div>

              <div className="p-10 space-y-10">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Project Title</Label>
                  <Input
                    required
                    value={newProject.title}
                    onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                    placeholder="e.g. AI Content Generator"
                    style={{
                        border: '2px solid #cbd5e1',
                        borderRadius: '12px',
                        padding: '12px',
                        fontWeight: 500
                    }}
                    className="py-6 focus:!border-indigo-500 hover:!border-indigo-400 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</Label>
                  <Textarea
                    required
                    value={newProject.description}
                    onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Describe the problem, your solution, and the technologies used..."
                    style={{
                        border: '2px solid #cbd5e1',
                        borderRadius: '12px',
                        padding: '12px',
                        lineHeight: '1.6'
                    }}
                    className="min-h-[200px] focus:!border-indigo-500 hover:!border-indigo-400 transition-colors text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Repository URL (Optional)</Label>
                  <Input
                    value={newProject.repo_url}
                    onChange={e => setNewProject({ ...newProject, repo_url: e.target.value })}
                    placeholder="https://github.com/..."
                    style={{
                        border: '2px solid #cbd5e1',
                        borderRadius: '12px',
                        padding: '12px',
                        fontWeight: 500
                    }}
                    className="py-6 focus:!border-indigo-500 hover:!border-indigo-400 transition-colors"
                  />
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
}

// Project Card Component
function ProjectCard({ name, description, tags, githubLink, link, verified, strengths, improvements }: {
  name: string;
  description: string;
  tags: string[];
  githubLink?: string;
  link?: string;
  verified: boolean;
  strengths: string[];
  improvements: string[];
}) {
  return (
    <div className="flex flex-col gap-4 p-6 bg-white border border-slate-100 rounded-3xl hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-indigo-100/50" />

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-lg leading-tight">{name}</h4>
              <div className="flex items-center gap-2 mt-1">
                {verified && (
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Verified
                  </span>
                )}
                {githubLink && <span className="text-[10px] font-bold text-slate-400">GitHub Repository</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {githubLink && (
              <a href={githubLink} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                <Github className="w-5 h-5" />
              </a>
            )}
            {link && (
              <a href={link} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all">
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        <p className="text-slate-600 text-sm mb-6 leading-relaxed font-medium">{description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, idx) => (
            <Badge key={idx} variant="outline" className="bg-white border-indigo-50 text-indigo-600 text-[10px] font-black uppercase px-2.5 py-1">
              {tag}
            </Badge>
          ))}
        </div>

        {/* AI Analysis Section */}
        {(strengths.length > 0 || improvements.length > 0) && (
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
            <div className="space-y-3">
              <h5 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-500">
                <Sparkles className="w-3.5 h-3.5" />
                Technical Strengths
              </h5>
              <ul className="space-y-2">
                {strengths.slice(0, 3).map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600 font-bold leading-tight">
                    <div className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <h5 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Potential Growth
              </h5>
              <ul className="space-y-2">
                {improvements.slice(0, 3).map((inf, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-500 font-medium leading-tight italic">
                    <div className="w-1 h-1 rounded-full bg-slate-200 mt-1.5 shrink-0" />
                    {inf}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
