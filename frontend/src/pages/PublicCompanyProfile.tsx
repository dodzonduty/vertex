import { Building2, Mail, Phone, MapPin, Calendar, Trophy, ExternalLink, Users } from 'lucide-react';
import { useParams } from 'react-router-dom';

export function PublicCompanyProfile() {
  const { id } = useParams(); // Keep id for potential future use or suppress lint if needed
  console.log('Viewing company:', id); // Use id to avoid lint error
  const onEventClick = (eventId: string) => console.log('Event clicked:', eventId);

  // Mock company data - in real app this would come from props or API
  const company = {
    id: '1',
    name: 'TechCorp',
    email: 'contact@techcorp.com',
    phone: '+1 (555) 987-6543',
    address: '123 Innovation Drive, San Francisco, CA 94105',
    size: 'Enterprise (1000+ employees)',
    description: 'Leading technology company focused on AI innovation and cutting-edge software solutions. We are passionate about creating products that make a difference in people\'s lives. Our mission is to democratize artificial intelligence and make it accessible to everyone.\n\nWe believe in fostering a culture of innovation, collaboration, and continuous learning. Join us in shaping the future of technology.',
    tags: ['AI/ML', 'Software Development', 'Innovation', 'Cloud Computing', 'Enterprise Solutions', 'Startups'],
    socialLinks: [
      { type: 'Website', url: 'https://techcorp.com', icon: '🌐' },
      { type: 'LinkedIn', url: 'https://linkedin.com/company/techcorp', icon: '💼' },
      { type: 'Twitter', url: 'https://twitter.com/techcorp', icon: '🐦' },
      { type: 'YouTube', url: 'https://youtube.com/@techcorp', icon: '📺' }
    ],
    events: [
      {
        id: '1',
        title: 'AI Innovation Hackathon 2026',
        type: 'hackathon',
        date: 'Feb 15-17, 2026',
        location: 'San Francisco, CA',
        registrations: 48,
        prizes: '$17,500 in prizes',
        description: 'Build innovative AI solutions to real-world problems. 48-hour hackathon with mentorship from industry experts.'
      },
      {
        id: '2',
        title: 'Summer Internship Program',
        type: 'sponsorship',
        date: 'June - August 2026',
        location: 'Multiple Locations',
        registrations: 156,
        prizes: 'Paid internship',
        description: '12-week intensive internship program working on real projects with our engineering teams.'
      },
      {
        id: '3',
        title: 'Tech Talk: Future of AI',
        type: 'workshop',
        date: 'March 10, 2026',
        location: 'Virtual',
        registrations: 234,
        prizes: '',
        description: 'Join our CTO for an insightful discussion on the future of artificial intelligence and its applications.'
      }
    ],
    achievements: [
      'Forbes Top 100 Companies to Work For',
      '50+ Patents in AI/ML',
      'Serving 10M+ users worldwide',
      'Carbon Neutral since 2020'
    ]
  };

  return (
    <div className="bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-400"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row items-start gap-6 -mt-20 mb-6">
              <div className="w-40 h-40 bg-white rounded-xl border-4 border-white shadow-lg flex items-center justify-center">
                <Building2 className="w-20 h-20 text-purple-600" />
              </div>
              <div className="flex-1 md:mt-20">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{company.name}</h1>
                <p className="text-xl text-purple-600 font-medium mb-4">{company.size}</p>
                <div className="flex flex-wrap gap-3">
                  {company.socialLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                    >
                      <span>{link.icon}</span>
                      {link.type}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* About */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">About {company.name}</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{company.description}</p>
            </div>

            {/* Tags/Industry */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Industry & Focus Areas</h3>
              <div className="flex flex-wrap gap-2">
                {company.tags.map((tag, idx) => (
                  <span key={idx} className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Achievements & Recognition</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {company.achievements.map((achievement, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <Trophy className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Email</div>
                    <a href={`mailto:${company.email}`} className="text-purple-600 hover:text-purple-700 font-medium">
                      {company.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Phone</div>
                    <a href={`tel:${company.phone}`} className="text-purple-600 hover:text-purple-700 font-medium">
                      {company.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3 md:col-span-2">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Address</div>
                    <div className="text-gray-900">{company.address}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events & Opportunities Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Events & Opportunities ({company.events.length})
          </h3>
          <div className="space-y-4">
            {company.events.map((event) => (
              <div
                key={event.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onEventClick?.(event.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-xl font-semibold text-gray-900">{event.title}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${event.type === 'hackathon'
                        ? 'bg-purple-100 text-purple-700'
                        : event.type === 'workshop'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                        }`}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{event.description}</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{event.registrations} registered</span>
                  </div>
                  {event.prizes && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <span>{event.prizes}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 mt-6 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">Interested in Working with Us?</h3>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            We're always looking for talented individuals to join our team. Check out our events and opportunities above!
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-medium">
              View All Events
            </button>
            <button className="px-6 py-3 bg-purple-800 text-white rounded-lg hover:bg-purple-900 transition-colors font-medium">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
