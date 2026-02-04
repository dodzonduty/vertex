import { useState, useEffect } from 'react';
import { Users, FileText, MessageSquare, X, Calendar, Trophy } from 'lucide-react';
import { StatePreservation } from '../../lib/utils/statePreservation';
import { toast } from 'sonner';
import '../Opportunities.css';

interface Event {
  id: string;
  title: string;
  type: 'hackathon' | 'sponsorship' | 'workshop';
  description: string;
  date: string;
  location: string;
  prizes: string[];
  status: 'active' | 'draft' | 'ended';
  registrations: number;
  submissions: number;
  rooms: number;
  tags: string[];
  host: string;
  image?: string;
}

interface Submission {
  id: string;
  eventId: string;
  studentId?: string;
  teamId?: string;
  studentName: string;
  studentAvatar: string;
  university: string;
  submittedAt: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  projectLink?: string;
  projectTitle?: string;
  projectDescription?: string;
  isTeamSubmission: boolean;
  teamName?: string;
  teamMembers?: { name: string; avatar: string; role?: string }[];
}

interface Room {
  id: string;
  eventId: string;
  title: string;
  description: string;
  members: { id: string; name: string; avatar: string; role?: string }[];
  maxMembers: number;
  status: 'open' | 'full';
  createdBy: string;
  createdAt: string;
  openings: { id: string; description: string; status: 'open' | 'closed' }[];
  submissions?: Submission[]; // Submissions from this team
}

export function CompanyOpportunities() {
  const [activeTab, setActiveTab] = useState<'hackathons' | 'sponsorships'>('hackathons');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('Most Recent');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [viewMode, setViewMode] = useState<'events' | 'submissions' | 'rooms'>('events');
  const [activeTags, setActiveTags] = useState<string[]>(['#All']);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Event>>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAllRoomsModal, setShowAllRoomsModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [createFormData, setCreateFormData] = useState({
    title: '',
    type: 'hackathon' as 'hackathon' | 'sponsorship' | 'workshop',
    description: '',
    date: '',
    location: '',
    prizes: [] as string[],
    tags: [] as string[],
    status: 'active' as 'active' | 'draft' | 'ended'
  });

  // Load events from storage or use default
  const savedEvents = StatePreservation.load<Event[]>('company_events_list');
  const [events, setEvents] = useState<Event[]>(savedEvents || [
    {
      id: '1',
      title: 'Global AI Summit 2026',
      type: 'hackathon',
      description: 'Host and manage one of the largest AI competitions. Connect with top-tier student talent globally.',
      date: 'Feb 15-17, 2026',
      location: 'San Francisco, CA',
      prizes: ['$10,000 First Prize', '$5,000 Second Prize'],
      status: 'active',
      registrations: 156,
      submissions: 42,
      rooms: 8,
      tags: ['#AI_Safety', '#Frontend'],
      host: 'Your Company'
    },
    {
      id: '2',
      title: 'GreenTech Sprint',
      type: 'hackathon',
      description: 'Accelerating sustainable solutions through rapid prototyping and deep tech.',
      date: 'Dec 01-05, 2026',
      location: 'Hybrid • London',
      prizes: ['$7,500 Prize'],
      status: 'active',
      registrations: 89,
      submissions: 23,
      rooms: 5,
      tags: ['#Sustainability'],
      host: 'Your Company'
    }
  ]);

  const [submissions] = useState<Submission[]>([
    {
      id: 's1',
      eventId: '1',
      studentId: 's1',
      studentName: 'Alex Johnson',
      studentAvatar: 'AJ',
      university: 'Stanford University',
      submittedAt: '2 hours ago',
      status: 'pending',
      projectLink: 'https://github.com/alex/project',
      projectTitle: 'AI Healthcare Assistant',
      projectDescription: 'An AI-powered healthcare assistant for patient diagnosis support',
      isTeamSubmission: false
    },
    {
      id: 's2',
      eventId: '1',
      teamId: 't1',
      studentName: 'Sarah Chen',
      studentAvatar: 'SC',
      university: 'MIT',
      submittedAt: '5 hours ago',
      status: 'reviewed',
      projectLink: 'https://github.com/sarah/project',
      projectTitle: 'Neural Network Optimization',
      projectDescription: 'Advanced neural network optimization techniques',
      isTeamSubmission: true,
      teamName: 'AI Healthcare Team',
      teamMembers: [
        { name: 'Sarah Chen', avatar: 'SC', role: 'Team Lead' },
        { name: 'John Doe', avatar: 'JD', role: 'ML Engineer' },
        { name: 'Jane Smith', avatar: 'JS', role: 'Frontend Dev' }
      ]
    },
    {
      id: 's3',
      eventId: '1',
      studentId: 's3',
      studentName: 'Mike Wilson',
      studentAvatar: 'MW',
      university: 'UC Berkeley',
      submittedAt: '1 day ago',
      status: 'accepted',
      projectLink: 'https://github.com/mike/project',
      projectTitle: 'Blockchain Voting System',
      projectDescription: 'Secure blockchain-based voting platform',
      isTeamSubmission: false
    }
  ]);

  const [rooms] = useState<Room[]>([
    {
      id: 'r1',
      eventId: '1',
      title: 'AI Healthcare Team',
      description: 'Building an AI-powered healthcare assistant for the upcoming AI Innovation Hackathon',
      members: [
        { id: 's1', name: 'Sarah Chen', avatar: 'SC', role: 'Team Lead / Frontend' },
        { id: 's2', name: 'John Doe', avatar: 'JD', role: 'ML Engineer' },
        { id: 's3', name: 'Jane Smith', avatar: 'JS', role: 'Backend Dev' }
      ],
      maxMembers: 4,
      status: 'open',
      createdBy: 'Sarah Chen',
      createdAt: '2 days ago',
      openings: [
        { id: 'o1', description: 'Frontend Developer - React/TypeScript expert', status: 'open' },
        { id: 'o2', description: 'ML Engineer - Experience with NLP', status: 'closed' }
      ]
    },
    {
      id: 'r2',
      eventId: '1',
      title: 'Web3 Innovation Group',
      description: 'Developing next-generation Web3 applications with focus on DeFi',
      members: [
        { id: 's4', name: 'Alex Johnson', avatar: 'AJ', role: 'Blockchain Dev' },
        { id: 's5', name: 'Mike Wilson', avatar: 'MW', role: 'Smart Contract Engineer' },
        { id: 's6', name: 'Emily Brown', avatar: 'EB', role: 'UI/UX Designer' },
        { id: 's7', name: 'David Lee', avatar: 'DL', role: 'Backend Engineer' }
      ],
      maxMembers: 4,
      status: 'full',
      createdBy: 'Alex Johnson',
      createdAt: '3 days ago',
      openings: [],
      submissions: []
    },
    {
      id: 'r3',
      eventId: '1',
      title: 'Sustainability Tech Squad',
      description: 'Creating sustainable tech solutions for climate change',
      members: [
        { id: 's8', name: 'Emma Davis', avatar: 'ED', role: 'Project Lead' },
        { id: 's9', name: 'Chris Taylor', avatar: 'CT', role: 'Data Scientist' }
      ],
      maxMembers: 5,
      status: 'open',
      createdBy: 'Emma Davis',
      createdAt: '1 day ago',
      openings: [
        { id: 'o3', description: 'Frontend Developer', status: 'open' },
        { id: 'o4', description: 'Backend Developer', status: 'open' },
        { id: 'o5', description: 'IoT Engineer', status: 'open' }
      ],
      submissions: []
    }
  ]);

  const [trendingTags] = useState<{ tag: string; count: number }[]>([
    { tag: '#AI_Safety', count: 24 },
    { tag: '#Web3_Gaming', count: 18 },
    { tag: '#Neurotech', count: 8 }
  ]);

  // Save events to storage
  useEffect(() => {
    StatePreservation.save('company_events_list', events);
  }, [events]);

  const filteredEvents = events.filter(event => {
    const matchesTab = activeTab === 'hackathons' ? event.type === 'hackathon' : event.type === 'sponsorship';
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = activeTags.includes('#All') || 
      event.tags.some(tag => activeTags.includes(tag));
    return matchesTab && matchesSearch && matchesTags;
  });

  const getSortedEvents = () => {
    return [...filteredEvents].sort((a, b) => {
      if (sortBy === 'Registrations') return b.registrations - a.registrations;
      if (sortBy === 'Submissions') return b.submissions - a.submissions;
      return b.id.localeCompare(a.id);
    });
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEditFormData({
      title: event.title,
      type: event.type,
      description: event.description,
      date: event.date,
      location: event.location,
      prizes: event.prizes,
      tags: event.tags,
      status: event.status
    });
  };

  const handleSaveEdit = () => {
    if (!editingEvent) return;

    const updatedEvents = events.map(e => 
      e.id === editingEvent.id 
        ? {
            ...e,
            ...editFormData,
            // Preserve computed fields
            registrations: e.registrations,
            submissions: e.submissions,
            rooms: e.rooms
          }
        : e
    );

    setEvents(updatedEvents);
    setEditingEvent(null);
    setEditFormData({});
    toast.success('Event updated successfully!');
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: Event = {
      id: Date.now().toString(),
      title: createFormData.title,
      type: createFormData.type,
      description: createFormData.description,
      date: createFormData.date,
      location: createFormData.location,
      prizes: createFormData.prizes.filter(p => p.trim()),
      status: createFormData.status,
      registrations: 0,
      submissions: 0,
      rooms: 0,
      tags: createFormData.tags,
      host: 'Your Company'
    };
    setEvents([newEvent, ...events]);
    setShowCreateModal(false);
    setCreateFormData({
      title: '',
      type: 'hackathon',
      description: '',
      date: '',
      location: '',
      prizes: [],
      tags: [],
      status: 'active'
    });
    toast.success('Event created successfully!');
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(e => e.id !== eventId));
      toast.success('Event deleted');
    }
  };

  const toggleTag = (tag: string) => {
    if (tag === '#All') {
      setActiveTags(['#All']);
      return;
    }
    let newTags = [...activeTags];
    if (newTags.includes('#All')) newTags = [];
    if (newTags.includes(tag)) {
      newTags = newTags.filter(t => t !== tag);
    } else {
      newTags.push(tag);
    }
    if (newTags.length === 0) newTags = ['#All'];
    setActiveTags(newTags);
  };

  const scrollTags = (direction: 'left' | 'right') => {
    const container = document.getElementById('company-tags-container');
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const eventSubmissions = selectedEvent 
    ? submissions.filter(s => s.eventId === selectedEvent.id)
    : [];
  const eventRooms = selectedEvent
    ? rooms.filter(r => r.eventId === selectedEvent.id).map(room => ({
        ...room,
        submissions: submissions.filter(s => s.teamId && room.id === 'r1' && s.id === 's2')
      }))
    : [];

  return (
    <div className="opp-page-container">
      <main className="opp-main">
        {/* Hero Section */}
        <section className="opp-hero-section">
          <div className="opp-hero-container">
            <h1 className="opp-hero-title">
              Manage Your <br />
              <span className="vibrant-text-gradient">Events & Opportunities</span>
            </h1>
            <p className="opp-hero-desc">
              Create, edit, and monitor your hackathons and sponsorships. Track submissions and team formations.
            </p>
          </div>
        </section>

        {/* Search Section */}
        <section className="opp-search-section">
          <div className="opp-search-width-container">
            <div className="opp-search-group">
              <div className="opp-search-bg-blur"></div>
              <div className="opp-search-box">
                <span className="material-symbols-outlined opp-search-icon">search</span>
                <input
                  className="opp-search-input"
                  placeholder="Search your events..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  className="opp-ask-ai-btn vibrant-gradient"
                  onClick={() => setShowCreateModal(true)}
                >
                  <span className="material-symbols-outlined">add</span>
                  Create Event
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="opp-filters-section">
          <div className="opp-filters-container">
            <div className="opp-filter-toggle">
              <button
                onClick={() => setActiveTab('hackathons')}
                className={`opp-toggle-option ${activeTab === 'hackathons' ? 'active' : ''}`}
              >
                Hackathons
              </button>
              <button
                onClick={() => setActiveTab('sponsorships')}
                className={`opp-toggle-option ${activeTab === 'sponsorships' ? 'active' : ''}`}
              >
                Sponsorships
              </button>
            </div>

            <div className="opp-tags-wrapper">
              <button className="opp-scroll-btn" onClick={() => scrollTags('left')}>
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <div className="opp-tags-row" id="company-tags-container">
                {['#All', '#AI_Safety', '#Frontend', '#Web3', '#Sustainability'].map(tag => (
                  <button
                    key={tag}
                    className={`opp-chip ${activeTags.includes(tag) ? 'active' : 'inactive'}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <button className="opp-scroll-btn" onClick={() => scrollTags('right')}>
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <section className="opp-content-section">
          <div className="opp-content-grid">
            {/* Left Column: Events List */}
            <div className="opp-listing-column">
              <div className="opp-listing-header-row">
                <h3 className="opp-listing-title">
                  Showing {filteredEvents.length} {activeTab === 'hackathons' ? 'Hackathons' : 'Sponsorships'}
                </h3>
                <div className="opp-sort-dropdown">
                  <span className="material-symbols-outlined">sort</span>
                  <span className="opp-sort-label">Sort by:</span>
                  <select
                    className="opp-sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option>Most Recent</option>
                    <option>Registrations</option>
                    <option>Submissions</option>
                  </select>
                </div>
              </div>

              <div className="opp-listings-list">
                {getSortedEvents().map((event) => (
                  <div
                    key={event.id}
                    className="opp-event-card"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="opp-card-img-container">
                      {event.image ? (
                        <img alt="Event" className="opp-card-img" src={event.image} />
                      ) : (
                        <div className="opp-card-img" style={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '24px',
                          fontWeight: 'bold'
                        }}>
                          {event.title.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="opp-card-main">
                      <div className="opp-card-badges">
                        <span className={`opp-badge-pill badge-blue-soft`}>
                          {event.type}
                        </span>
                        <span className={`opp-badge-pill ${
                          event.status === 'active' ? 'badge-emerald-solid' :
                          event.status === 'draft' ? 'badge-amber-solid' :
                          'badge-gray-solid'
                        }`}>
                          {event.status}
                        </span>
                        {event.tags.slice(0, 1).map(tag => (
                          <span key={tag} className="opp-badge-pill badge-gray-soft">{tag}</span>
                        ))}
                      </div>
                      <h5 className="opp-card-title">{event.title}</h5>
                      <p className="opp-card-host">Hosted by {event.host}</p>
                      <p className="opp-card-summary">{event.description}</p>
                      <div className="flex gap-4 mt-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {event.registrations} registered
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {event.submissions} submissions
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {event.rooms} rooms
                        </span>
                      </div>
                    </div>
                    <div className="opp-card-meta-col">
                      <div className="opp-meta-item">
                        <span className="material-symbols-outlined text-brand-blue opp-meta-icon">event</span>
                        <span className="opp-meta-text">{event.date}</span>
                      </div>
                      <div className="opp-meta-item">
                        <span className="material-symbols-outlined text-brand-blue opp-meta-icon">payments</span>
                        <span className="opp-meta-text-bold">{event.prizes[0] || 'No prize'}</span>
                      </div>
                      <div className="opp-meta-item">
                        <span className="material-symbols-outlined text-brand-blue opp-meta-icon">public</span>
                        <span className="opp-meta-text">{event.location}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="opp-apply-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(event);
                            setViewMode('events');
                          }}
                          title="View Details"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>visibility</span>
                        </button>
                        <button
                          className="opp-apply-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditEvent(event);
                          }}
                          title="Edit Event"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                        </button>
                        <button
                          className="opp-apply-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEvent(event.id);
                          }}
                          title="Delete Event"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Sidebar */}
            <aside className="opp-sidebar-column">
              <div className="opp-sticky-wrapper">
                {/* View Mode Toggle */}
                {selectedEvent && (
                  <div className="glass-card opp-trending-widget mb-6">
                    <h4 className="opp-widget-heading mb-4">Event Management</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => setViewMode('events')}
                        className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                          viewMode === 'events' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Event Details
                      </button>
                      <button
                        onClick={() => setViewMode('submissions')}
                        className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                          viewMode === 'submissions' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Submissions ({eventSubmissions.length})
                      </button>
                      <button
                        onClick={() => setViewMode('rooms')}
                        className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                          viewMode === 'rooms' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Match Rooms ({eventRooms.length})
                      </button>
                    </div>
                  </div>
                )}

                {/* Event Details View */}
                {selectedEvent && viewMode === 'events' && (
                  <div className="glass-card opp-trending-widget mb-6">
                    <h4 className="opp-widget-heading">{selectedEvent.title}</h4>
                    <div className="space-y-3 mt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Status</span>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          selectedEvent.status === 'active' ? 'bg-green-100 text-green-700' :
                          selectedEvent.status === 'draft' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {selectedEvent.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Registrations</span>
                        <span className="text-sm font-bold text-slate-900">{selectedEvent.registrations}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Submissions</span>
                        <span className="text-sm font-bold text-slate-900">{selectedEvent.submissions}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Active Rooms</span>
                        <span className="text-sm font-bold text-slate-900">{selectedEvent.rooms}</span>
                      </div>
                      <button
                        onClick={() => handleEditEvent(selectedEvent)}
                        className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Edit Event
                      </button>
                    </div>
                  </div>
                )}

                {/* Submissions View */}
                {selectedEvent && viewMode === 'submissions' && (
                  <div className="glass-card opp-trending-widget mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="opp-widget-heading">Submissions ({eventSubmissions.length})</h4>
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                          onClick={() => {
                            // Filter by status - can be enhanced
                            toast.info('Filter by status coming soon');
                          }}
                        >
                          Filter
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      {eventSubmissions.map(submission => (
                        <div key={submission.id} className="p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
                                {submission.studentAvatar}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="font-bold text-sm text-slate-900">{submission.studentName}</div>
                                  {submission.isTeamSubmission && (
                                    <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs font-bold">
                                      Team
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-slate-500">{submission.university}</div>
                                {submission.isTeamSubmission && submission.teamName && (
                                  <div className="text-xs text-blue-600 font-medium mt-1">
                                    Team: {submission.teamName}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                submission.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                submission.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                submission.status === 'reviewed' ? 'bg-blue-100 text-blue-700' :
                                'bg-amber-100 text-amber-700'
                              }`}>
                                {submission.status}
                              </span>
                              <div className="flex gap-1">
                                <button
                                  className="p-1.5 hover:bg-slate-100 rounded transition-colors"
                                  onClick={() => {
                                    if (submission.status === 'pending') {
                                      toast.success('Marked as reviewed');
                                    }
                                  }}
                                  title="Mark as Reviewed"
                                >
                                  <span className="material-symbols-outlined text-sm text-blue-600">check_circle</span>
                                </button>
                                <button
                                  className="p-1.5 hover:bg-slate-100 rounded transition-colors"
                                  onClick={() => {
                                    toast.info('Reject submission');
                                  }}
                                  title="Reject"
                                >
                                  <span className="material-symbols-outlined text-sm text-red-600">cancel</span>
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          {submission.projectTitle && (
                            <div className="mb-2">
                              <div className="font-semibold text-sm text-slate-900 mb-1">{submission.projectTitle}</div>
                              {submission.projectDescription && (
                                <div className="text-xs text-slate-600 line-clamp-2">{submission.projectDescription}</div>
                              )}
                            </div>
                          )}

                          {submission.isTeamSubmission && submission.teamMembers && submission.teamMembers.length > 0 && (
                            <div className="mb-3 p-2 bg-slate-50 rounded-lg">
                              <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Team Members</div>
                              <div className="flex flex-wrap gap-2">
                                {submission.teamMembers.map((member, idx) => (
                                  <div key={idx} className="flex items-center gap-1.5 px-2 py-1 bg-white rounded border border-slate-200">
                                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                                      {member.avatar}
                                    </div>
                                    <div>
                                      <div className="text-xs font-medium text-slate-900">{member.name}</div>
                                      {member.role && (
                                        <div className="text-[10px] text-slate-500">{member.role}</div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <div className="text-xs text-slate-500">{submission.submittedAt}</div>
                            {submission.projectLink && (
                              <a 
                                href={submission.projectLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium"
                              >
                                <span className="material-symbols-outlined text-sm">link</span>
                                View Project
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                      {eventSubmissions.length === 0 && (
                        <div className="text-center py-8 text-slate-500 text-sm">
                          No submissions yet
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Rooms View */}
                {selectedEvent && viewMode === 'rooms' && (
                  <div className="glass-card opp-trending-widget mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="opp-widget-heading">Match Rooms ({eventRooms.length})</h4>
                      {eventRooms.length > 0 && (
                        <button
                          className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          onClick={() => setShowAllRoomsModal(true)}
                        >
                          View All
                        </button>
                      )}
                    </div>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                      {eventRooms.map(room => (
                        <div key={room.id} className="p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="font-bold text-sm text-slate-900">{room.title}</div>
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                  room.status === 'full' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                }`}>
                                  {room.status}
                                </span>
                              </div>
                              {room.description && (
                                <div className="text-xs text-slate-600 mb-2 line-clamp-2">{room.description}</div>
                              )}
                              <div className="text-xs text-slate-500">
                                Created by {room.createdBy} • {room.createdAt}
                              </div>
                            </div>
                          </div>

                          {/* Team Members */}
                          <div className="mb-3">
                            <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
                              Team Members ({room.members.length}/{room.maxMembers})
                            </div>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {room.members.map((member, idx) => (
                                <div key={member.id || idx} className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded border border-slate-200">
                                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                                    {member.avatar}
                                  </div>
                                  <div>
                                    <div className="text-xs font-medium text-slate-900">{member.name}</div>
                                    {member.role && (
                                      <div className="text-[10px] text-slate-500">{member.role}</div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${(room.members.length / room.maxMembers) * 100}%` }}
                              />
                            </div>
                          </div>

                          {/* Open Positions */}
                          {room.openings && room.openings.length > 0 && (
                            <div className="mb-3 p-2 bg-amber-50 rounded-lg border border-amber-200">
                              <div className="text-xs font-bold text-amber-700 mb-2 uppercase tracking-wide">
                                Open Positions ({room.openings.filter(o => o.status === 'open').length})
                              </div>
                              <div className="space-y-1">
                                {room.openings.map(opening => (
                                  <div key={opening.id} className={`text-xs p-1.5 rounded ${
                                    opening.status === 'open' ? 'bg-white text-slate-700' : 'bg-slate-100 text-slate-500'
                                  }`}>
                                    <span className="material-symbols-outlined text-xs align-middle mr-1">
                                      {opening.status === 'open' ? 'person_add' : 'check_circle'}
                                    </span>
                                    {opening.description}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Team Submissions */}
                          {room.submissions && room.submissions.length > 0 && (
                            <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">
                                Team Submission
                              </div>
                              {room.submissions.map(sub => (
                                <div key={sub.id} className="text-xs text-blue-900">
                                  <div className="font-medium mb-1">{sub.projectTitle || 'Project Submission'}</div>
                                  {sub.projectLink && (
                                    <a 
                                      href={sub.projectLink} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline flex items-center gap-1"
                                    >
                                      <span className="material-symbols-outlined text-xs">link</span>
                                      View Project
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <button
                              className="text-xs text-blue-600 hover:underline font-medium"
                              onClick={() => setSelectedRoom(room)}
                            >
                              View Details
                            </button>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span className="material-symbols-outlined text-xs">group</span>
                              {room.members.length}/{room.maxMembers}
                            </div>
                          </div>
                        </div>
                      ))}
                      {eventRooms.length === 0 && (
                        <div className="text-center py-8 text-slate-500 text-sm">
                          No rooms created yet
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Trending Widget */}
                <div className="glass-card opp-trending-widget">
                  <h4 className="opp-widget-heading">
                    <span className="material-symbols-outlined text-purple-600">trending_up</span>
                    Trending
                  </h4>
                  <div className="opp-trending-list">
                    {trendingTags.map((item, i) => (
                      <a
                        key={i}
                        href="#"
                        className="opp-trending-item"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleTag(item.tag);
                        }}
                      >
                        <span className="opp-trending-tag">{item.tag}</span>
                        <span className="opp-trending-count">{item.count}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      {/* Create Event Modal */}
      {showCreateModal && (
        <EventCreateModal
          formData={createFormData}
          setFormData={setCreateFormData}
          onClose={() => {
            setShowCreateModal(false);
            setCreateFormData({
              title: '',
              type: 'hackathon',
              description: '',
              date: '',
              location: '',
              prizes: [],
              tags: [],
              status: 'active'
            });
          }}
          onSubmit={handleCreateEvent}
        />
      )}

      {/* View All Rooms Modal */}
      {showAllRoomsModal && selectedEvent && (
        <AllRoomsModal
          rooms={eventRooms}
          eventTitle={selectedEvent.title}
          onClose={() => setShowAllRoomsModal(false)}
          onViewRoom={(room) => {
            setShowAllRoomsModal(false);
            setSelectedRoom(room);
          }}
        />
      )}

      {/* Room Details Modal */}
      {selectedRoom && (
        <RoomDetailsModal
          room={selectedRoom}
          eventTitle={selectedEvent?.title || 'Event'}
          onClose={() => setSelectedRoom(null)}
        />
      )}

      {/* Edit Event Modal */}
      {editingEvent && (
        <EventEditModal
          event={editingEvent}
          formData={editFormData}
          setFormData={setEditFormData}
          onClose={() => {
            setEditingEvent(null);
            setEditFormData({});
          }}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}

interface AllRoomsModalProps {
  rooms: Room[];
  eventTitle: string;
  onClose: () => void;
  onViewRoom: (room: Room) => void;
}

function AllRoomsModal({ rooms, eventTitle, onClose, onViewRoom }: AllRoomsModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900">All Match Rooms</h2>
            <p className="text-sm text-slate-500 mt-1">{eventTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => onViewRoom(room)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{room.title}</h3>
                    {room.description && (
                      <p className="text-sm text-slate-600 line-clamp-2 mb-3">{room.description}</p>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    room.status === 'full' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {room.status}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span>Team Members</span>
                    <span className="font-bold text-slate-900">{room.members.length}/{room.maxMembers}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(room.members.length / room.maxMembers) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {room.members.slice(0, 4).map((member, idx) => (
                    <div key={member.id || idx} className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded border border-slate-200">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                        {member.avatar}
                      </div>
                      <span className="text-xs font-medium text-slate-700">{member.name}</span>
                    </div>
                  ))}
                  {room.members.length > 4 && (
                    <div className="px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600">
                      +{room.members.length - 4} more
                    </div>
                  )}
                </div>

                {room.openings && room.openings.length > 0 && (
                  <div className="mb-4 p-2 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="text-xs font-bold text-amber-700 mb-1">
                      {room.openings.filter(o => o.status === 'open').length} Open Positions
                    </div>
                  </div>
                )}

                <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  View Full Details
                </button>
              </div>
            ))}
          </div>
          {rooms.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <span className="material-symbols-outlined text-4xl mb-4 block">group_off</span>
              <p>No rooms created yet for this event</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface RoomDetailsModalProps {
  room: Room;
  eventTitle: string;
  onClose: () => void;
}

function RoomDetailsModal({ room, eventTitle, onClose }: RoomDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900">{room.title}</h2>
            <p className="text-sm text-slate-500 mt-1">{eventTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <div className="p-8 space-y-6">
          {/* Description */}
          {room.description && (
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Description</h3>
              <p className="text-slate-600">{room.description}</p>
            </div>
          )}

          {/* Team Info */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Team Members</h3>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  room.status === 'full' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  {room.status}
                </span>
                <span className="text-sm text-slate-500">
                  {room.members.length}/{room.maxMembers}
                </span>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${(room.members.length / room.maxMembers) * 100}%` }}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {room.members.map((member, idx) => (
                <div key={member.id || idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
                    {member.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm text-slate-900">{member.name}</div>
                    {member.role && (
                      <div className="text-xs text-slate-500">{member.role}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Open Positions */}
          {room.openings && room.openings.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">
                Open Positions ({room.openings.filter(o => o.status === 'open').length})
              </h3>
              <div className="space-y-2">
                {room.openings.map(opening => (
                  <div
                    key={opening.id}
                    className={`p-4 rounded-lg border ${
                      opening.status === 'open'
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <span className={`material-symbols-outlined mt-0.5 ${
                          opening.status === 'open' ? 'text-amber-600' : 'text-slate-400'
                        }`}>
                          {opening.status === 'open' ? 'person_add' : 'check_circle'}
                        </span>
                        <div className="flex-1">
                          <div className="font-medium text-sm text-slate-900 mb-1">
                            {opening.description}
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            opening.status === 'open'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {opening.status === 'open' ? 'Open' : 'Closed'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team Submissions */}
          {room.submissions && room.submissions.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">Team Submissions</h3>
              <div className="space-y-3">
                {room.submissions.map(sub => (
                  <div key={sub.id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="font-bold text-sm text-slate-900 mb-2">{sub.projectTitle || 'Project Submission'}</div>
                    {sub.projectDescription && (
                      <p className="text-sm text-slate-600 mb-3">{sub.projectDescription}</p>
                    )}
                    {sub.projectLink && (
                      <a
                        href={sub.projectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1 text-sm font-medium"
                      >
                        <span className="material-symbols-outlined text-sm">link</span>
                        View Project
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Room Metadata */}
          <div className="pt-4 border-t border-slate-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Created By</div>
                <div className="text-slate-900">{room.createdBy}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Created At</div>
                <div className="text-slate-900">{room.createdAt}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface EventCreateModalProps {
  formData: {
    title: string;
    type: 'hackathon' | 'sponsorship' | 'workshop';
    description: string;
    date: string;
    location: string;
    prizes: string[];
    tags: string[];
    status: 'active' | 'draft' | 'ended';
  };
  setFormData: (data: any) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

function EventCreateModal({ formData, setFormData, onClose, onSubmit }: EventCreateModalProps) {
  const [localPrizes, setLocalPrizes] = useState<string[]>(formData.prizes || []);
  const [localTags, setLocalTags] = useState<string[]>(formData.tags || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormData({
      ...formData,
      prizes: localPrizes.filter(p => p.trim()),
      tags: localTags
    });
    onSubmit(e);
  };

  const addPrize = () => {
    setLocalPrizes([...localPrizes, '']);
  };

  const updatePrize = (index: number, value: string) => {
    const updated = [...localPrizes];
    updated[index] = value;
    setLocalPrizes(updated);
  };

  const removePrize = (index: number) => {
    setLocalPrizes(localPrizes.filter((_, i) => i !== index));
  };

  const addTag = () => {
    const newTag = prompt('Enter tag (e.g., #AI_Safety):');
    if (newTag && !localTags.includes(newTag)) {
      setLocalTags([...localTags, newTag]);
    }
  };

  const removeTag = (tag: string) => {
    setLocalTags(localTags.filter(t => t !== tag));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between z-10">
          <h2 className="text-3xl font-black text-slate-900">Create New Event</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Basic Information */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">description</span>
              Basic Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Event Type *</label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'hackathon' | 'sponsorship' | 'workshop' })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium"
                >
                  <option value="hackathon">Hackathon</option>
                  <option value="workshop">Workshop</option>
                  <option value="sponsorship">Sponsorship</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Event Title *</label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="E.g. Global AI Summit 2026"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-xs font-bold text-slate-700 mb-2">Description *</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of your event..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              />
            </div>
          </section>

          {/* Date & Location */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Date & Location
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Date *</label>
                <input
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="E.g. Feb 15-17, 2026"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Location *</label>
                <input
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="E.g. San Francisco, CA or Virtual"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </section>

          {/* Prizes */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              Prizes & Rewards
            </h3>
            <div className="space-y-3">
              {localPrizes.map((prize, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    value={prize}
                    onChange={(e) => updatePrize(index, e.target.value)}
                    placeholder="E.g. $10,000 First Prize"
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removePrize(index)}
                    className="px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addPrize}
                className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 font-medium hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                + Add Prize
              </button>
            </div>
          </section>

          {/* Tags */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-600">tag</span>
              Tags
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {localTags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              + Add Tag
            </button>
          </section>

          {/* Status */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-green-600">toggle_on</span>
              Status
            </h3>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'draft' | 'ended' })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="ended">Ended</option>
            </select>
          </section>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 text-slate-600 font-bold hover:text-slate-900 transition-colors rounded-xl hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface EventEditModalProps {
  event: Event;
  formData: Partial<Event>;
  setFormData: (data: Partial<Event>) => void;
  onClose: () => void;
  onSave: () => void;
}

function EventEditModal({ event, formData, setFormData, onClose, onSave }: EventEditModalProps) {
  const [localPrizes, setLocalPrizes] = useState<string[]>(formData.prizes || event.prizes || []);
  const [localTags, setLocalTags] = useState<string[]>(formData.tags || event.tags || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormData({
      ...formData,
      prizes: localPrizes,
      tags: localTags
    });
    onSave();
  };

  const addPrize = () => {
    setLocalPrizes([...localPrizes, '']);
  };

  const updatePrize = (index: number, value: string) => {
    const updated = [...localPrizes];
    updated[index] = value;
    setLocalPrizes(updated);
  };

  const removePrize = (index: number) => {
    setLocalPrizes(localPrizes.filter((_, i) => i !== index));
  };

  const addTag = () => {
    const newTag = prompt('Enter tag (e.g., #AI_Safety):');
    if (newTag && !localTags.includes(newTag)) {
      setLocalTags([...localTags, newTag]);
    }
  };

  const removeTag = (tag: string) => {
    setLocalTags(localTags.filter(t => t !== tag));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between z-10">
          <h2 className="text-3xl font-black text-slate-900">Edit Event</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Basic Information */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">description</span>
              Basic Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Event Type *</label>
                <select
                  required
                  value={formData.type || event.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'hackathon' | 'sponsorship' | 'workshop' })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium"
                >
                  <option value="hackathon">Hackathon</option>
                  <option value="workshop">Workshop</option>
                  <option value="sponsorship">Sponsorship</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Event Title *</label>
                <input
                  required
                  value={formData.title || event.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="E.g. Global AI Summit 2026"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-xs font-bold text-slate-700 mb-2">Description *</label>
              <textarea
                required
                rows={4}
                value={formData.description || event.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of your event..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              />
            </div>
          </section>

          {/* Date & Location */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Date & Location
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Date *</label>
                <input
                  required
                  value={formData.date || event.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="E.g. Feb 15-17, 2026"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Location *</label>
                <input
                  required
                  value={formData.location || event.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="E.g. San Francisco, CA or Virtual"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </section>

          {/* Prizes */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              Prizes & Rewards
            </h3>
            <div className="space-y-3">
              {localPrizes.map((prize, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    value={prize}
                    onChange={(e) => updatePrize(index, e.target.value)}
                    placeholder="E.g. $10,000 First Prize"
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removePrize(index)}
                    className="px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addPrize}
                className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 font-medium hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                + Add Prize
              </button>
            </div>
          </section>

          {/* Tags */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-600">tag</span>
              Tags
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {localTags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              + Add Tag
            </button>
          </section>

          {/* Status */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-green-600">toggle_on</span>
              Status
            </h3>
            <select
              value={formData.status || event.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'draft' | 'ended' })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="ended">Ended</option>
            </select>
          </section>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 text-slate-600 font-bold hover:text-slate-900 transition-colors rounded-xl hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

