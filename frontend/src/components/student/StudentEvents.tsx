import { useState } from 'react';
import { Calendar, MapPin, Trophy, Search, Sparkles, ArrowRight } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  company: string;
  type: 'hackathon' | 'sponsorship' | 'workshop';
  description: string;
  date: string;
  location: string;
  prizes: string[];
  requirements: string[];
  registered: boolean;
  eligibilityScore?: number;
  eligibilityNotes?: {
    strengths: string[];
    missing: string[];
    tips: string[];
  };
}

export function StudentEvents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'hackathon' | 'sponsorship' | 'workshop'>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registrationEvent, setRegistrationEvent] = useState<Event | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);

  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'AI Innovation Hackathon 2026',
      company: 'TechCorp',
      type: 'hackathon',
      description: 'Build innovative AI solutions to real-world problems. 48-hour hackathon with mentorship from industry experts.',
      date: 'Feb 15-17, 2026',
      location: 'San Francisco, CA',
      prizes: ['$10,000 First Prize', '$5,000 Second Prize', '$2,500 Third Prize'],
      requirements: ['Team of 2-4 students', 'Must be enrolled in university', 'AI/ML experience preferred'],
      registered: false,
      eligibilityScore: 85,
      eligibilityNotes: {
        strengths: [
          'Strong AI/ML background matches requirements',
          'Previous hackathon experience visible in profile',
          'Relevant projects in portfolio'
        ],
        missing: [
          'No team formed yet - use OpenMatch to find teammates',
          'Could strengthen cloud computing skills'
        ],
        tips: [
          'Highlight your NLP project in your pitch',
          'Consider focusing on healthcare or education domain',
          'Practice your presentation skills'
        ]
      }
    },
    {
      id: '2',
      title: 'Web3 Developer Summit',
      company: 'CryptoStartup',
      type: 'workshop',
      description: 'Learn about blockchain development, smart contracts, and decentralized applications.',
      date: 'March 5, 2026',
      location: 'Virtual',
      prizes: [],
      requirements: ['Interest in blockchain', 'Basic programming knowledge'],
      registered: true,
      eligibilityScore: 70,
      eligibilityNotes: {
        strengths: [
          'Strong programming fundamentals',
          'Quick learner based on project diversity'
        ],
        missing: [
          'Limited blockchain experience',
          'No Web3 projects in portfolio'
        ],
        tips: [
          'Review Solidity basics before the event',
          'Prepare questions about smart contract security',
          'Network with other attendees'
        ]
      }
    },
    {
      id: '3',
      title: 'Mobile App Challenge',
      company: 'AppVentures',
      type: 'hackathon',
      description: 'Create the next big mobile application. Focus on user experience and innovative features.',
      date: 'April 10-12, 2026',
      location: 'New York, NY',
      prizes: ['$15,000 Grand Prize', '$7,500 Runner Up', 'Internship Opportunities'],
      requirements: ['Mobile development experience', 'Original app idea', 'Working prototype required'],
      registered: false,
      eligibilityScore: 60,
      eligibilityNotes: {
        strengths: [
          'Full-stack development experience',
          'Good UI/UX sense from projects'
        ],
        missing: [
          'Limited mobile-specific experience',
          'No native mobile apps in portfolio'
        ],
        tips: [
          'Learn React Native or Flutter before the event',
          'Build a simple mobile app to gain experience',
          'Study mobile design patterns'
        ]
      }
    }
  ]);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || event.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleRegister = (eventId: string) => {
    setEvents(prev => prev.map(ev => ev.id === eventId ? { ...ev, registered: true } : ev));
    alert(`Successfully registered for ${registrationEvent?.title}!`);
    setShowRegistration(false);
    setRegistrationEvent(null);
  };

  return (
    <div className="max-w-6xl mx-auto py-4 animate-in fade-in duration-700">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Events & Hackathons</h1>
        <p className="text-slate-600 text-lg">Discover exclusive opportunities and get AI-powered eligibility insights.</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 mb-10 group transition-all hover:border-indigo-100">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 relative w-full group/search">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-hover/search:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by title, company, or technology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all text-slate-900 shadow-inner"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <FilterButton label="All" active={filterType === 'all'} onClick={() => setFilterType('all')} />
            <FilterButton label="Hackathons" active={filterType === 'hackathon'} onClick={() => setFilterType('hackathon')} />
            <FilterButton label="Workshops" active={filterType === 'workshop'} onClick={() => setFilterType('workshop')} />
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onViewDetails={() => setSelectedEvent(event)}
          />
        ))}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300 relative">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all hover:rotate-90"
            >
              ×
            </button>

            <div className="h-32 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-t-3xl" />

            <div className="p-8 -mt-12">
              <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
                <div className="w-24 h-24 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center">
                  <div className="w-16 h-16 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-indigo-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${selectedEvent.type === 'hackathon' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                      {selectedEvent.type}
                    </span>
                    {selectedEvent.registered && (
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-100">
                        Registered
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 mb-1">{selectedEvent.title}</h2>
                  <p className="text-indigo-600 font-bold">{selectedEvent.company}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Date</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">{selectedEvent.date}</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Location</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">{selectedEvent.location}</div>
                </div>
              </div>

              <div className="space-y-8 mb-10">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3">About</h3>
                  <p className="text-slate-600 leading-relaxed">{selectedEvent.description}</p>
                </div>
              </div>

              {/* AI Eligibility Analysis */}
              {selectedEvent.eligibilityNotes && (
                <div className="bg-slate-900 rounded-3xl p-8 mb-10 text-white shadow-2xl shadow-indigo-500/20 group/ai">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <Sparkles className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h3 className="font-bold text-lg">AI Eligibility</h3>
                  </div>
                  <div className="mb-8 bg-white/5 rounded-2xl border border-white/10 p-6 text-center">
                    <span className="text-5xl font-black text-indigo-400 mb-2 block">{selectedEvent.eligibilityScore}%</span>
                    <span className="text-xs font-bold text-white uppercase tracking-widest opacity-60">Match Accuracy</span>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button onClick={() => setSelectedEvent(null)} className="flex-1 py-4 px-6 border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all">Close</button>
                {!selectedEvent.registered ? (
                  <button
                    onClick={() => { setRegistrationEvent(selectedEvent); setShowRegistration(true); setSelectedEvent(null); }}
                    className="flex-[2] py-4 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all"
                  >
                    Register Now
                  </button>
                ) : (
                  <button className="flex-[2] py-4 px-6 bg-green-600 text-white rounded-2xl font-bold border-2 border-green-400/30">Successfully Enrolled</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showRegistration && registrationEvent && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center z-[70] p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl animate-in zoom-in-95 duration-300 text-center">
            <Calendar className="w-12 h-12 text-indigo-600 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-slate-900 mb-2">Confirm Enrollment</h2>
            <p className="text-slate-500 mb-8">Ready to join <span className="text-indigo-600 font-bold">{registrationEvent.title}</span>?</p>
            <div className="flex gap-4">
              <button onClick={() => setShowRegistration(false)} className="flex-1 py-4 border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50">Cancel</button>
              <button onClick={() => handleRegister(registrationEvent.id)} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EventCard({ event, onViewDetails }: { event: Event; onViewDetails: () => void }) {
  return (
    <div className="group bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 transform hover:-translate-y-1 relative">
      <div className="p-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${event.type === 'hackathon' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                {event.type}
              </span>
              {event.registered && (
                <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase border border-green-100">Enrolled</span>
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{event.title}</h3>
            <p className="text-indigo-600 text-sm font-bold">{event.company}</p>
          </div>
        </div>

        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">{event.description}</p>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            {event.date}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
            <MapPin className="w-3.5 h-3.5" />
            {event.location}
          </div>
        </div>

        <button
          onClick={onViewDetails}
          className="w-full py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 font-bold hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
        >
          View Opportunities
          <ArrowRight className="w-4 h-4 transform transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

function FilterButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${active
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
        : 'bg-white text-slate-600 border border-slate-200/50 hover:bg-slate-50 hover:border-indigo-100'
        }`}
    >
      {label}
    </button>
  );
}