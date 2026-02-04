import { useState, useEffect } from 'react';
import { Plus, Calendar, MapPin, Trophy, Edit, XCircle, ArrowRight, CheckCircle2, MoreHorizontal, Sparkles, Users, Clock, DollarSign, Target, FileText, Link as LinkIcon, X } from 'lucide-react';
import { StatePreservation } from '../../lib/utils/statePreservation';
import { toast } from 'sonner';

interface Event {
  id: string;
  title: string;
  type: 'hackathon' | 'sponsorship' | 'workshop';
  description: string;
  date: string;
  endDate?: string;
  location: string;
  prizes: string[];
  requirements: string[];
  judgingCriteria: string[];
  rules: string[];
  applicationLink: string;
  status: 'active' | 'canceled';
  registrations: number;
  maxParticipants?: number;
  registrationDeadline?: string;
}

interface EventFormData {
  title: string;
  type: 'hackathon' | 'sponsorship' | 'workshop';
  description: string;
  date: string;
  endDate: string;
  location: string;
  prizes: string[];
  requirements: string[];
  judgingCriteria: string[];
  rules: string[];
  applicationLink: string;
  maxParticipants: string;
  registrationDeadline: string;
}

export function CompanyEvents() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLanding, setShowLanding] = useState(false);
  
  // Load events from storage or use default
  const savedEvents = StatePreservation.load<Event[]>('company_events');
  const [events, setEvents] = useState<Event[]>(savedEvents || [
    {
      id: '1',
      title: 'Global AI Summit 2026',
      type: 'hackathon',
      description: 'Host and manage one of the largest AI competitions. Connect with top-tier student talent globally.',
      date: 'Feb 15-17, 2026',
      location: 'San Francisco, CA',
      prizes: ['$10,000 First Prize', '$5,000 Second Prize', '$2,500 Third Prize'],
      requirements: ['Team of 2-4 students', 'Enrolled in Tier 1 Universities'],
      judgingCriteria: ['Innovation', 'Technical Implementation'],
      rules: ['Ethical AI standards required'],
      applicationLink: 'https://example.com/apply',
      status: 'active',
      registrations: 156
    }
  ]);

  // Save events to storage
  useEffect(() => {
    StatePreservation.save('company_events', events);
  }, [events]);

  // Load form data from storage
  const savedFormData = StatePreservation.loadSession<EventFormData>('event_form_data');
  const [formData, setFormData] = useState<EventFormData>(savedFormData || {
    title: '',
    type: 'hackathon',
    description: '',
    date: '',
    endDate: '',
    location: '',
    prizes: [],
    requirements: [],
    judgingCriteria: [],
    rules: [],
    applicationLink: '',
    maxParticipants: '',
    registrationDeadline: ''
  });

  // Save form data to storage
  useEffect(() => {
    StatePreservation.saveSession('event_form_data', formData);
  }, [formData]);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: Event = {
      id: Date.now().toString(),
      title: formData.title,
      type: formData.type,
      description: formData.description,
      date: formData.date,
      endDate: formData.endDate || undefined,
      location: formData.location,
      prizes: formData.prizes.filter(p => p.trim()),
      requirements: formData.requirements.filter(r => r.trim()),
      judgingCriteria: formData.judgingCriteria.filter(j => j.trim()),
      rules: formData.rules.filter(r => r.trim()),
      applicationLink: formData.applicationLink,
      status: 'active',
      registrations: 0,
      maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
      registrationDeadline: formData.registrationDeadline || undefined
    };
    setEvents([newEvent, ...events]);
    setShowCreateModal(false);
    setShowLanding(false);
    // Clear form data
    const emptyForm: EventFormData = {
      title: '',
      type: 'hackathon',
      description: '',
      date: '',
      endDate: '',
      location: '',
      prizes: [],
      requirements: [],
      judgingCriteria: [],
      rules: [],
      applicationLink: '',
      maxParticipants: '',
      registrationDeadline: ''
    };
    setFormData(emptyForm);
    StatePreservation.clearSession('event_form_data');
    toast.success('Event published successfully!', {
      description: 'Your event is now live and visible to students.'
    });
  };

  const handleCancelEvent = (eventId: string) => {
    if (confirm('Are you sure you want to cancel this event? This action cannot be undone.')) {
      setEvents(events.map(event =>
        event.id === eventId ? { ...event, status: 'canceled' as const } : event
      ));
      toast.success('Event canceled');
    }
  };

  const addArrayItem = (field: 'prizes' | 'requirements' | 'judgingCriteria' | 'rules') => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  const updateArrayItem = (field: 'prizes' | 'requirements' | 'judgingCriteria' | 'rules', index: number, value: string) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const removeArrayItem = (field: 'prizes' | 'requirements' | 'judgingCriteria' | 'rules', index: number) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index)
    });
  };

  // Show landing page if no events or user clicks create
  if (showLanding || events.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-8 animate-in fade-in duration-700">
        <EventLandingPage 
          onCreateClick={() => {
            setShowLanding(false);
            setShowCreateModal(true);
          }}
          hasEvents={events.length > 0}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-4 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Event Management</h1>
          <p className="text-slate-600 text-lg">Orchestrate hackathons and workshops to engage with elite talent.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowLanding(true)}
            className="flex items-center gap-2 px-6 py-3.5 bg-white border-2 border-blue-600 text-blue-600 rounded-2xl font-bold hover:bg-blue-50 transition-all"
          >
            <Sparkles className="w-5 h-5" />
            View Guide
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 transition-all"
          >
            <Plus className="w-5 h-5" />
            Create New Event
          </button>
        </div>
      </div>

      <div className="grid gap-8">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onCancel={() => handleCancelEvent(event.id)}
          />
        ))}
      </div>

      {showCreateModal && (
        <EventCreateModal
          formData={formData}
          setFormData={setFormData}
          onClose={() => {
            setShowCreateModal(false);
            // Optionally clear form on close - commented out to preserve state
            // StatePreservation.clearSession('event_form_data');
          }}
          onSubmit={handleCreateEvent}
          addArrayItem={addArrayItem}
          updateArrayItem={updateArrayItem}
          removeArrayItem={removeArrayItem}
        />
      )}
    </div>
  );
}

function EventCard({ event, onCancel }: { event: Event; onCancel: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="group bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500">
      <div className="p-10">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${event.type === 'hackathon' ? 'bg-indigo-50 text-indigo-700' : 'bg-blue-50 text-blue-700'
                }`}>
                {event.type}
              </span>
              {event.status === 'active' ? (
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase border border-green-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3" />
                  Live
                </span>
              ) : (
                <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-[10px] font-bold uppercase">Canceled</span>
              )}
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{event.title}</h3>
            <p className="text-slate-500 leading-relaxed max-w-2xl">{event.description}</p>
          </div>

          <div className="flex md:flex-col gap-3">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center min-w-[120px]">
              <div className="text-sm font-black text-slate-900 leading-tight">{event.registrations}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enrolled</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-600">{event.date}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-600">{event.location}</div>
          </div>
          {event.prizes.length > 0 && (
            <div className="flex items-center gap-3 md:col-span-2">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-amber-700">{event.prizes[0]}</div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-slate-100">
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 group/btn shadow-xl shadow-blue-200 hover:shadow-blue-300 transition-all hover:-translate-y-1"
          >
            Insights & Metrics
            <ArrowRight className={`w-4 h-4 transform transition-transform ${expanded ? 'rotate-90' : 'group-hover/btn:translate-x-1'}`} />
          </button>

          <button className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-blue-600 hover:border-blue-600 transition-all">
            <Edit className="w-5 h-5" />
          </button>

          {event.status === 'active' && (
            <button
              onClick={onCancel}
              className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-red-500 hover:bg-red-50 hover:border-red-500 transition-all font-bold flex items-center gap-2"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}

          <div className="ml-auto">
            <button className="p-3 text-slate-300 hover:text-slate-900">
              <MoreHorizontal className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="bg-slate-50 border-t border-slate-100 p-10 animate-in slide-in-from-top-6 duration-500">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-4">Selection Metrics</h4>
              <div className="space-y-4">
                {event.judgingCriteria.map((c, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    {c}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-4">Incentive Portfolio</h4>
              <div className="space-y-3">
                {event.prizes.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EventLandingPage({ onCreateClick, hasEvents }: { onCreateClick: () => void; hasEvents: boolean }) {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
          <Sparkles className="w-4 h-4" />
          Event Creation Platform
        </div>
        <h1 className="text-5xl font-black text-slate-900 mb-4">
          Create Engaging Events for Top Talent
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Host hackathons, workshops, and sponsorships to connect with elite students and discover groundbreaking projects.
        </p>
        <button
          onClick={onCreateClick}
          className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-1 transition-all"
        >
          <Plus className="w-6 h-6" />
          Create Your First Event
        </button>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-all">
          <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
            <Calendar className="w-7 h-7 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Hackathons</h3>
          <p className="text-slate-600 text-sm">
            Organize competitive coding events to discover innovative solutions and top engineering talent.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-all">
          <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
            <Users className="w-7 h-7 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Workshops</h3>
          <p className="text-slate-600 text-sm">
            Host educational sessions to engage with students and share your company's expertise.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-all">
          <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center mb-4">
            <Trophy className="w-7 h-7 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Sponsorships</h3>
          <p className="text-slate-600 text-sm">
            Sponsor student projects and events to build brand awareness and community connections.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-12 mb-16">
        <h2 className="text-3xl font-black text-slate-900 mb-8 text-center">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { step: '1', title: 'Create Event', desc: 'Fill out the comprehensive form with all event details' },
            { step: '2', title: 'Set Criteria', desc: 'Define requirements, judging criteria, and prizes' },
            { step: '3', title: 'Publish', desc: 'Make your event live and visible to all students' },
            { step: '4', title: 'Engage', desc: 'Review applications and connect with participants' }
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4">
                {item.step}
              </div>
              <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
              <p className="text-sm text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {hasEvents && (
        <div className="text-center">
          <button
            onClick={onCreateClick}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all"
          >
            Continue Creating Events
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

interface EventCreateModalProps {
  formData: EventFormData;
  setFormData: (data: EventFormData) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  addArrayItem: (field: 'prizes' | 'requirements' | 'judgingCriteria' | 'rules') => void;
  updateArrayItem: (field: 'prizes' | 'requirements' | 'judgingCriteria' | 'rules', index: number, value: string) => void;
  removeArrayItem: (field: 'prizes' | 'requirements' | 'judgingCriteria' | 'rules', index: number) => void;
}

function EventCreateModal({ formData, setFormData, onClose, onSubmit, addArrayItem, updateArrayItem, removeArrayItem }: EventCreateModalProps) {
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
        
        <form onSubmit={onSubmit} className="p-8 space-y-8">
          {/* Basic Information */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
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
                placeholder="Detailed description of your event, what participants will do, and what makes it special..."
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
                <label className="block text-xs font-bold text-slate-700 mb-2">Start Date *</label>
                <input
                  required
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
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
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Max Participants</label>
                <input
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                  placeholder="Leave empty for unlimited"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-xs font-bold text-slate-700 mb-2">Registration Deadline</label>
              <input
                type="datetime-local"
                value={formData.registrationDeadline}
                onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </section>

          {/* Prizes */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              Prizes & Rewards
            </h3>
            <div className="space-y-3">
              {formData.prizes.map((prize, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    value={prize}
                    onChange={(e) => updateArrayItem('prizes', index, e.target.value)}
                    placeholder="E.g. $10,000 First Prize"
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('prizes', index)}
                    className="px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('prizes')}
                className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 font-medium hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                + Add Prize
              </button>
            </div>
          </section>

          {/* Requirements */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Requirements
            </h3>
            <div className="space-y-3">
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    value={req}
                    onChange={(e) => updateArrayItem('requirements', index, e.target.value)}
                    placeholder="E.g. Team of 2-4 students"
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('requirements', index)}
                    className="px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('requirements')}
                className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 font-medium hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                + Add Requirement
              </button>
            </div>
          </section>

          {/* Judging Criteria */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Judging Criteria
            </h3>
            <div className="space-y-3">
              {formData.judgingCriteria.map((criteria, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    value={criteria}
                    onChange={(e) => updateArrayItem('judgingCriteria', index, e.target.value)}
                    placeholder="E.g. Innovation, Technical Implementation"
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('judgingCriteria', index)}
                    className="px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('judgingCriteria')}
                className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 font-medium hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                + Add Judging Criteria
              </button>
            </div>
          </section>

          {/* Rules */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-600" />
              Rules & Guidelines
            </h3>
            <div className="space-y-3">
              {formData.rules.map((rule, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    value={rule}
                    onChange={(e) => updateArrayItem('rules', index, e.target.value)}
                    placeholder="E.g. Ethical AI standards required"
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('rules', index)}
                    className="px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('rules')}
                className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 font-medium hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                + Add Rule
              </button>
            </div>
          </section>

          {/* Application Link */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-blue-600" />
              Application Link
            </h3>
            <input
              type="url"
              value={formData.applicationLink}
              onChange={(e) => setFormData({ ...formData, applicationLink: e.target.value })}
              placeholder="https://example.com/apply"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
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
              Publish Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
