import { useState } from 'react';
import { Github, Linkedin, Award, Sparkles, CheckCircle2, Edit, Mail, Phone, MapPin, Save, X, Plus, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

type ProfileMode = 'view' | 'edit';

export function StudentProfile() {
  const [profileMode, setProfileMode] = useState<ProfileMode>('view');
  const [profileData] = useState<any>({
    name: 'Alex Johnson',
    email: 'alex.johnson@university.edu',
    phone: '+1 (555) 123-4567',
    university: 'Stanford University',
    year: 'Junior',
    description: 'Computer Science student passionate about AI and full-stack development. I love building products that make a real impact on people\'s lives. Currently exploring the intersection of AI and web technologies.',
    jobTitle: 'Full-Stack Developer',
    githubLink: 'https://github.com/alexjohnson',
    linkedinLink: 'https://linkedin.com/in/alexjohnson',
    atsScore: 85,
    certificates: [
      { name: 'AWS Certified Developer', issuer: 'Amazon Web Services', date: 'Jan 2026' },
      { name: 'React Professional Certificate', issuer: 'Meta', date: 'Dec 2025' }
    ],
    skills: ['React', 'Node.js', 'TypeScript', 'Python', 'AI/ML'],
    strengths: [
      'Strong technical skills in modern frameworks',
      'Diverse project portfolio',
      'Clear career focus'
    ],
    weaknesses: [
      'Limited work experience mentioned',
      'Could highlight soft skills more'
    ]
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMode('view');
    toast.success('Profile Updated', {
      description: 'Your changes have been saved successfully.',
    });
  };

  if (profileMode === 'view') {
    return (
      <div className="max-w-5xl mx-auto py-4 animate-in fade-in duration-700">
        {/* Profile Header - Premium */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden mb-10 group">
          {/* Banner */}
          <div className="h-40 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent animate-pulse" />
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          </div>

          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-12 relative z-10">
              <div className="w-32 h-32 bg-white rounded-2xl border-4 border-white shadow-2xl flex items-center justify-center text-4xl font-extrabold text-indigo-600 relative overflow-hidden group/avatar">
                <div className="absolute inset-0 bg-indigo-50 transition-colors group-hover/avatar:bg-indigo-100" />
                <span className="relative z-10">{profileData.name[0]}</span>
              </div>

              <div className="flex-1 text-center md:text-left mb-2">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">{profileData.name}</h1>
                  <Badge className="bg-green-50 text-green-700 border-green-100 flex items-center gap-1 hover:bg-green-100 transition-colors">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </Badge>
                </div>

                <p className="text-lg font-semibold text-indigo-600 mb-2">{profileData.jobTitle}</p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-500 text-sm font-medium">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {profileData.university}
                  </div>
                  <div className="w-1 h-1 bg-slate-300 rounded-full hidden md:block" />
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-slate-400" />
                    {profileData.year}
                  </div>
                </div>
              </div>

              <div className="pb-2">
                <Button
                  onClick={() => setProfileMode('edit')}
                  variant="outline"
                  className="px-6 py-6 rounded-xl font-bold border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 transition-all flex items-center gap-2 group/edit"
                >
                  <Edit className="w-4 h-4 text-slate-500 group-hover/edit:text-indigo-600 transition-colors" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-6">
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
              <p className="text-slate-600 leading-relaxed text-lg">{profileData.description}</p>
            </section>

            <section>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Certificates</h3>
              <div className="grid gap-4">
                {profileData.certificates.map((cert: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-4 p-5 bg-white border border-slate-100 rounded-2xl hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{cert.name}</h4>
                      <p className="text-sm text-slate-500 font-medium">{cert.issuer} • {cert.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Projects</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  Add Project
                </button>
              </div>
              <div className="grid gap-4">
                <ProjectCard
                  name="AI Chat Bot"
                  description="Built a conversational AI using NLP and machine learning. Implements context awareness and multi-turn conversations."
                  tags={['AI/ML', 'Python', 'NLP', 'TensorFlow']}
                  githubLink="https://github.com/username/ai-chatbot"
                  verified={true}
                />
                <ProjectCard
                  name="E-commerce Platform"
                  description="Full-stack marketplace application with payment integration, real-time inventory, and admin dashboard."
                  tags={['Full-Stack', 'React', 'Node.js', 'MongoDB']}
                  link="https://demo-shop.example.com"
                  verified={false}
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  // EDIT MODE
  return (
    <div className="max-w-4xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="shadow-2xl border-none">
        <CardContent className="p-0">
          <form onSubmit={handleSaveProfile}>
            <div className="p-8 border-b bg-slate-50/50 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Refine Profile</h2>
                <p className="text-slate-500 font-medium">Keep your professional identity up to date.</p>
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="ghost" onClick={() => setProfileMode('view')} className="font-bold text-slate-400">
                  <X className="w-5 h-5 mr-2" /> Cancel
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 shadow-xl shadow-indigo-200">
                  <Save className="w-5 h-5 mr-2" /> Save Changes
                </Button>
              </div>
            </div>

            <div className="p-10 space-y-10">
              {/* Identity Section */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Public Name</Label>
                  <Input defaultValue={profileData.name} className="py-6 rounded-xl border-slate-200 focus:ring-indigo-500" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Professional Headline</Label>
                  <Input defaultValue={profileData.jobTitle} className="py-6 rounded-xl border-slate-200 focus:ring-indigo-500" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Detailed Bio</Label>
                <Textarea defaultValue={profileData.description} className="min-h-[150px] rounded-xl border-slate-200 focus:ring-indigo-500 text-lg leading-relaxed" />
              </div>

              <div className="grid md:grid-cols-3 gap-8 border-t border-slate-100 pt-10">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">University</Label>
                  <Input defaultValue={profileData.university} className="py-6 rounded-xl border-slate-200" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Study Year</Label>
                  <Input defaultValue={profileData.year} className="py-6 rounded-xl border-slate-200" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Contact</Label>
                  <Input defaultValue={profileData.phone} className="py-6 rounded-xl border-slate-200" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">GitHub URL</Label>
                  <Input defaultValue={profileData.githubLink} placeholder="https://github.com/username" className="py-6 rounded-xl border-slate-200" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">LinkedIn URL</Label>
                  <Input defaultValue={profileData.linkedinLink} placeholder="https://linkedin.com/in/username" className="py-6 rounded-xl border-slate-200" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</Label>
                <Input defaultValue={profileData.email} type="email" className="py-6 rounded-xl border-slate-200" />
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

// Project Card Component
function ProjectCard({ name, description, tags, githubLink, link, verified }: {
  name: string;
  description: string;
  tags: string[];
  githubLink?: string;
  link?: string;
  verified: boolean;
}) {
  return (
    <div className="flex items-start gap-4 p-6 bg-white border border-slate-100 rounded-2xl hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h4 className="font-bold text-slate-900 text-lg">{name}</h4>
          {verified && (
            <Badge className="bg-green-50 text-green-700 border-green-100 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Verified
            </Badge>
          )}
        </div>
        <p className="text-sm text-slate-500 mb-4 leading-relaxed">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, idx) => (
            <Badge key={idx} variant="secondary" className="bg-white border-slate-100 text-slate-600 text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {githubLink && (
            <a href={githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">
              <Github className="w-4 h-4" />
              Code
            </a>
          )}
          {link && (
            <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">
              <ExternalLink className="w-4 h-4" />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
