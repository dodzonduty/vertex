import { useState } from 'react';
import { Mail, Phone, Github, Linkedin, Award, FolderGit2, Sparkles, CheckCircle2, ExternalLink, MapPin } from 'lucide-react';
import { useParams } from 'react-router-dom';

export function PublicStudentProfile() {
  const { id } = useParams();
  console.log('Viewing student:', id); // Fix unused id
  const [viewerType] = useState<'student' | 'company' | 'guest'>('guest'); // Use state to prevent TS narrowing

  const [showContact, setShowContact] = useState(false);

  // Mock student data - in real app this would come from props or API
  const student = {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.johnson@university.edu',
    phone: '+1 (555) 123-4567',
    university: 'Stanford University',
    year: 'Junior',
    jobTitle: 'Full-Stack Developer',
    description: 'Computer Science student passionate about AI and full-stack development. I love building products that make a real impact on people\'s lives. Currently exploring the intersection of AI and web technologies.',
    avatar: 'AJ',
    githubLink: 'https://github.com/alexjohnson',
    linkedinLink: 'https://linkedin.com/in/alexjohnson',
    atsScore: 85,
    certificates: [
      { name: 'AWS Certified Developer', issuer: 'Amazon Web Services', date: 'Jan 2026' },
      { name: 'React Professional Certificate', issuer: 'Meta', date: 'Dec 2025' },
      { name: 'Machine Learning Specialization', issuer: 'Stanford Online', date: 'Nov 2025' }
    ],
    projects: [
      {
        id: '1',
        name: 'AI Chat Bot',
        description: 'Built a conversational AI using NLP and machine learning. Implements context awareness and multi-turn conversations with 95% accuracy.',
        tags: ['AI/ML', 'Python', 'NLP', 'TensorFlow', 'FastAPI'],
        verified: true,
        githubLink: 'https://github.com/alexjohnson/ai-chatbot',
        strengths: [
          'Well-documented codebase',
          'Comprehensive test coverage',
          'Follows industry best practices'
        ],
        improvements: [
          'Could add deployment instructions',
          'Consider adding API rate limiting'
        ]
      },
      {
        id: '2',
        name: 'E-commerce Platform',
        description: 'Full-stack marketplace application with payment integration, real-time inventory, and admin dashboard. Handles 1000+ concurrent users.',
        link: 'https://demo-shop.example.com',
        tags: ['Full-Stack', 'React', 'Node.js', 'MongoDB', 'Stripe'],
        verified: false,
        strengths: [
          'Complete feature set',
          'Modern tech stack',
          'Scalable architecture'
        ],
        improvements: [
          'Add more detailed README',
          'Include architecture diagrams',
          'Add unit tests'
        ]
      },
      {
        id: '3',
        name: 'Real-Time Collaboration Tool',
        description: 'WebSocket-based collaboration platform for teams. Features include live cursors, real-time editing, and video chat.',
        tags: ['WebSocket', 'React', 'TypeScript', 'Redis'],
        verified: true,
        githubLink: 'https://github.com/alexjohnson/collab-tool'
      }
    ],
    skills: ['React', 'Node.js', 'TypeScript', 'Python', 'AI/ML', 'MongoDB', 'PostgreSQL', 'Docker'],
    strengths: [
      'Strong technical skills in modern frameworks',
      'Diverse project portfolio demonstrating versatility',
      'Clear career focus and direction',
      'Excellent problem-solving abilities'
    ],
    improvements: [
      'Could add more open-source contributions',
      'Consider gaining enterprise-level experience',
      'Expand DevOps and cloud infrastructure skills'
    ]
  };

  return (
    <div className="bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="h-48 bg-gradient-to-r from-indigo-500 to-violet-500"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row items-start gap-6 -mt-20 mb-6">
              <div className="w-40 h-40 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center text-5xl font-bold text-purple-600">
                {student.avatar}
              </div>
              <div className="flex-1 md:mt-20">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{student.name}</h1>
                <p className="text-xl text-purple-600 font-medium mb-2">{student.jobTitle}</p>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{student.university} • {student.year}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {student.githubLink && (
                    <a
                      href={student.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                    >
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  )}
                  {student.linkedinLink && (
                    <a
                      href={student.linkedinLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </a>
                  )}
                  {viewerType === 'company' && (
                    <button
                      onClick={() => setShowContact(!showContact)}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                    >
                      <Mail className="w-4 h-4" />
                      {showContact ? 'Hide Contact' : 'Show Contact'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Info - Only shown when company clicks */}
            {showContact && viewerType === 'company' && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="text-gray-900">{student.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Phone</div>
                      <div className="text-gray-900">{student.phone}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ATS Score & Analysis */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">AI Career Analysis</h3>
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl font-bold text-blue-600">{student.atsScore}%</span>
                  <span className="text-gray-600">ATS Compatibility Score</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all"
                    style={{ width: `${student.atsScore}%` }}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Key Strengths
                  </h4>
                  <ul className="space-y-2">
                    {student.strengths.map((strength, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-700 mb-3">Growth Opportunities</h4>
                  <ul className="space-y-2">
                    {student.improvements.map((improvement, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-orange-600 mt-0.5">→</span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
              <p className="text-gray-700 leading-relaxed">{student.description}</p>
            </div>

            {/* Skills */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills & Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {student.skills.map((skill, idx) => (
                  <span key={idx} className="px-4 py-2 bg-purple-50 text-purple-700 text-sm font-medium rounded-full border border-purple-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Certificates */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Certificates ({student.certificates.length})
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {student.certificates.map((cert, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{cert.name}</h4>
                      <p className="text-sm text-gray-600">{cert.issuer}</p>
                      <p className="text-xs text-gray-500 mt-1">{cert.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FolderGit2 className="w-6 h-6" />
            Projects ({student.projects.length})
          </h3>
          <div className="space-y-6">
            {student.projects.map((project) => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-xl font-semibold text-gray-900">{project.name}</h4>
                      {project.verified && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </div>
                      )}
                    </div>
                    <p className="text-gray-700 mb-4">{project.description}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full border border-purple-200">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-3 mb-4">
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
                    >
                      <Github className="w-4 h-4" />
                      View on GitHub
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
                    >
                      Live Demo
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* AI Analysis */}
                {(project.strengths || project.improvements) && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <h5 className="font-semibold text-gray-900 text-sm">AI Project Analysis</h5>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {project.strengths && project.strengths.length > 0 && (
                        <div>
                          <h6 className="text-xs font-semibold text-green-700 mb-2">Strengths</h6>
                          <ul className="space-y-1">
                            {project.strengths.map((strength, idx) => (
                              <li key={idx} className="text-xs text-gray-700 flex items-start gap-1">
                                <span className="text-green-600 mt-0.5">✓</span>
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {project.improvements && project.improvements.length > 0 && (
                        <div>
                          <h6 className="text-xs font-semibold text-orange-700 mb-2">Improvements</h6>
                          <ul className="space-y-1">
                            {project.improvements.map((improvement, idx) => (
                              <li key={idx} className="text-xs text-gray-700 flex items-start gap-1">
                                <span className="text-orange-600 mt-0.5">→</span>
                                <span>{improvement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
