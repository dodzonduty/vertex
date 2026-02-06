import { useState, useEffect } from 'react';
import { Plus, Calendar, MapPin, Trophy, Edit, XCircle, ArrowRight, CheckCircle2, MoreHorizontal, Sparkles, Users, Clock, DollarSign, Target, FileText, Link as LinkIcon, X, Save } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { StatePreservation } from '../../lib/utils/statePreservation';
import { toast } from 'sonner';
import { apiRequest } from '../../lib/api/config';
import { Button } from '../ui/button';

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
  tags: string[];
}

export function CompanyEvents() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isCreating = searchParams.get('mode') === 'create';
  const toggleCreateMode = (create: boolean) => {
    setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        if (create) newParams.set('mode', 'create');
        else newParams.delete('mode');
        return newParams;
    });
  };

  const [showLanding, setShowLanding] = useState(false);
  
  // Load events from storage or use default
  const [events, setEvents] = useState<Event[]>([]);

  // Fetch events from backend
  useEffect(() => {
    apiRequest<any[]>('/api/opportunities/')
      .then(data => {
        // Map backend response to Event interface
        const mappedEvents: Event[] = data.map((opp: any) => ({
          id: opp.opportunity_id,
          title: opp.title,
          type: opp.type as any,
          description: opp.description.text || opp.description.summary || "",
          date: opp.description.date || "",
          endDate: opp.description.endDate,
          location: opp.description.location || "Remote",
          prizes: opp.description.prizes || [],
          requirements: opp.description.requirements || [],
          judgingCriteria: opp.description.judgingCriteria || [],
          rules: opp.description.rules || [],
          applicationLink: opp.description.applicationLink || "",
          status: opp.status as any,
          registrations: 0, // Mock for now
          maxParticipants: opp.description.maxParticipants ? parseInt(opp.description.maxParticipants) : undefined,
          registrationDeadline: opp.description.registrationDeadline
        }));
        setEvents(mappedEvents);
      })
      .catch(err => console.error("Failed to load events", err));
  }, []);

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
    registrationDeadline: '',
    tags: []
  });

  const [availableTags, setAvailableTags] = useState<string[]>([]);
  
  useEffect(() => {
    apiRequest<{ tags: string[] }>('/api/tags')
      .then(data => setAvailableTags(data.tags || []))
      .catch(err => {
        console.error("Failed to fetch tags", err);
        setAvailableTags(['#AI', '#Web3', '#Frontend', '#Backend', '#Research']);
      });
  }, []);

  // Save form data to storage
  useEffect(() => {
    StatePreservation.saveSession('event_form_data', formData);
  }, [formData]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await apiRequest<any>('/api/opportunities/', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      const newEvent: Event = {
        id: response.opportunity_id,
        title: response.title,
        type: response.type,
        description: response.description.text,
        date: response.description.date,
        endDate: response.description.endDate,
        location: response.description.location,
        prizes: response.description.prizes || [],
        requirements: response.description.requirements || [],
        judgingCriteria: response.description.judgingCriteria || [],
        rules: response.description.rules || [],
        applicationLink: response.description.applicationLink || "",
        status: 'active',
        registrations: 0,
        maxParticipants: response.description.maxParticipants ? parseInt(response.description.maxParticipants) : undefined,
        registrationDeadline: response.description.registrationDeadline
      };

      setEvents([newEvent, ...events]);
      toggleCreateMode(false);
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
        registrationDeadline: '',
        tags: []
      };
      setFormData(emptyForm);
      StatePreservation.clearSession('event_form_data');
      toast.success('Event published successfully!', {
        description: 'Your event is now live and visible to students.'
      });
    } catch (error) {
      toast.error('Failed to create event');
      console.error(error);
    }
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
    if (field === 'prizes') {
        return; 
    }
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

  if (isCreating) {
    return (
        <EventCreateForm 
           formData={formData}
           setFormData={setFormData}
           onClose={() => toggleCreateMode(false)}
           onSubmit={handleCreateEvent}
           addArrayItem={addArrayItem}
           updateArrayItem={updateArrayItem}
           removeArrayItem={removeArrayItem}
           availableTags={availableTags}
        />
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-4 animate-in fade-in duration-700">
      {(showLanding || events.length === 0) ? (
        <div className="py-8">
          <EventLandingPage 
            onCreateClick={() => {
              setShowLanding(false);
              toggleCreateMode(true);
            }}
            hasEvents={events.length > 0}
          />
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Company Event Dashboard</h1>
              <p className="text-slate-600 text-lg">Orchestrate hackathons and workshops to engage with elite talent.</p>
            </div>
            <div className="flex gap-3">
            <div className="flex gap-3">
              <Button
                onClick={() => setShowLanding(true)}
                variant="ghost"
                style={{
                    backgroundColor: 'white',
                    border: '2px solid #2563eb',
                    color: '#2563eb',
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    paddingLeft: '24px',
                    paddingRight: '24px',
                    borderRadius: '16px',
                    fontWeight: 700,
                    height: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                }}
                className="hover:bg-blue-50 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                View Guide
              </Button>
              <Button
                onClick={() => toggleCreateMode(true)}
                style={{
                    backgroundColor: '#2563eb',
                    color: 'white',
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    paddingLeft: '32px', // Slightly larger for primary
                    paddingRight: '32px',
                    borderRadius: '16px',
                    fontWeight: 700,
                    height: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.2)'
                }}
                className="hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-xl shadow-blue-200"
              >
                <Plus className="w-5 h-5" />
                Host an Event
              </Button>
            </div>
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
        </>
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
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-blue-100">
          <Sparkles className="w-4 h-4" />
          Event Creation Platform
        </div>
        <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">
          Create Engaging Events for Top Talent
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Host hackathons, workshops, and sponsorships to connect with elite students and discover groundbreaking projects.
        </p>
        <div className="flex justify-center mt-2">
          <Button
            onClick={onCreateClick}
            style={{ 
                minHeight: '64px',
                paddingTop: '16px',
                paddingBottom: '16px',
                paddingLeft: '48px',
                paddingRight: '48px',
                borderRadius: '24px',
                backgroundColor: '#2563eb',
                color: 'white',
                fontSize: '20px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                cursor: 'pointer',
                boxShadow: '0 25px 50px -12px rgba(37, 99, 235, 0.25)' 
            }}
            className="hover:bg-blue-700 hover:shadow-blue-300 hover:-translate-y-1 transition-all"
          >
            <Plus className="w-7 h-7" />
            Create Your First Event
          </Button>
        </div>
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

interface EventCreateFormProps {
  formData: EventFormData;
  setFormData: (data: EventFormData) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  addArrayItem: (field: 'prizes' | 'requirements' | 'judgingCriteria' | 'rules') => void;
  availableTags: string[];
  updateArrayItem: (field: 'prizes' | 'requirements' | 'judgingCriteria' | 'rules', index: number, value: string) => void;
  removeArrayItem: (field: 'prizes' | 'requirements' | 'judgingCriteria' | 'rules', index: number) => void;
}

function EventCreateForm({ formData, setFormData, onClose, onSubmit, addArrayItem, updateArrayItem, removeArrayItem, availableTags }: EventCreateFormProps) {
  
  // Local state for rank prizes to sync with formData.prizes
  // We'll parse existing prizes if any to populate
  // Format expectation: "1st Place: $X", "2nd Place: $Y"
  const getPrizeValue = (rank: string) => {
    const found = formData.prizes.find(p => p.toLowerCase().includes(rank.toLowerCase()));
    if (found) {
        // Extract value after colon if exists, or just the whole thing
        const parts = found.split(':');
        return parts.length > 1 ? parts[1].trim() : found;
    }
    return '';
  };

  const handePrizeChange = (rank: string, value: string) => {
     // Reconstruct prizes array
     // Filter out this rank first
     const others = formData.prizes.filter(p => !p.toLowerCase().includes(rank.toLowerCase()));
     if (value.trim()) {
         others.push(`${rank}: ${value}`);
     }
     
     // Sort nicely? 1st, 2nd, 3rd
     const order = ["1st Place", "2nd Place", "3rd Place"];
     const sorted = others.sort((a, b) => {
         let aRank = order.findIndex(o => a.toLowerCase().includes(o.toLowerCase()));
         let bRank = order.findIndex(o => b.toLowerCase().includes(o.toLowerCase()));
         
         // If not found, place at the end
         if (aRank === -1) aRank = 999;
         if (bRank === -1) bRank = 999;
         
         return aRank - bRank;
     });
     
     setFormData({...formData, prizes: sorted});
  };


  return (
    <div className="max-w-4xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between z-10">
          <h2 className="text-3xl font-black text-slate-900">Create New Event</h2>
          <div className="flex gap-3">
             <Button
               type="button"
               variant="ghost"
               onClick={onClose}
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
                form="event-create-form"
                style={{
                      backgroundColor: '#2563eb', // Blue-600
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
                className="hover:bg-blue-700 shadow-xl shadow-blue-200"
             >
               <Save className="w-5 h-5" /> Publish Event
             </Button>
          </div>
        </div>
        
        <form id="event-create-form" onSubmit={onSubmit} className="p-8 space-y-8">
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
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium h-14"
                  style={{ minHeight: '56px', paddingLeft: '24px' }}
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
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  style={{ minHeight: '56px', paddingLeft: '24px' }}
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
                 className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                 style={{ paddingLeft: '24px' }}
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
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  style={{ minHeight: '56px', paddingLeft: '24px' }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  style={{ minHeight: '56px', paddingLeft: '24px' }}
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
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  style={{ minHeight: '56px', paddingLeft: '24px' }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Max Participants</label>
                <input
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                  placeholder="Leave empty for unlimited"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  style={{ minHeight: '56px', paddingLeft: '24px' }}
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-xs font-bold text-slate-700 mb-2">Registration Deadline</label>
              <input
                type="datetime-local"
                value={formData.registrationDeadline}
                onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                style={{ minHeight: '56px', paddingLeft: '24px' }}
              />
            </div>
          </section>

          {/* Prizes */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              Prizes & Rewards
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                  <div className="flex-1 p-4 bg-amber-50 rounded-xl border border-amber-100">
                      <label className="block text-xs font-bold text-amber-600 mb-2 uppercase tracking-wider">1st Place Prize</label>
                      <div className="flex items-center gap-2">
                          <Trophy className="w-5 h-5 text-amber-500" />
                          <input 
                              type="text"
                              placeholder="$10,000"
                              className="flex-1 bg-transparent border-b border-amber-200 focus:border-amber-500 outline-none font-bold text-slate-700 placeholder:text-slate-300"
                              value={getPrizeValue("1st Place")}
                              onChange={(e) => handePrizeChange("1st Place", e.target.value)}
                          />
                      </div>
                  </div>
                  <div className="flex-1 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">2nd Place Prize</label>
                      <div className="flex items-center gap-2">
                          <Trophy className="w-5 h-5 text-slate-400" />
                          <input 
                              type="text"
                              placeholder="$5,000"
                              className="flex-1 bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none font-bold text-slate-700 placeholder:text-slate-300"
                              value={getPrizeValue("2nd Place")}
                              onChange={(e) => handePrizeChange("2nd Place", e.target.value)}
                          />
                      </div>
                  </div>
                  <div className="flex-1 p-4 bg-orange-50 rounded-xl border border-orange-100">
                      <label className="block text-xs font-bold text-orange-600 mb-2 uppercase tracking-wider">3rd Place Prize</label>
                      <div className="flex items-center gap-2">
                          <Trophy className="w-5 h-5 text-orange-500" />
                          <input 
                              type="text"
                              placeholder="$2,500"
                              className="flex-1 bg-transparent border-b border-orange-200 focus:border-orange-500 outline-none font-bold text-slate-700 placeholder:text-slate-300"
                              value={getPrizeValue("3rd Place")}
                              onChange={(e) => handePrizeChange("3rd Place", e.target.value)}
                          />
                      </div>
                  </div>
              </div>

              {/* Custom Prizes */}
              <div className="mt-4">
                  <label className="block text-sm font-bold text-slate-700 mb-3">Custom Prizes & Tracks</label>
                  <div className="space-y-3">
                      {formData.prizes
                          .filter(p => !["1st Place", "2nd Place", "3rd Place"].some(rank => p.includes(rank)))
                          .map((prize, idx) => {
                              // We need to find the real index in the main array to remove it correctly
                              const realIndex = formData.prizes.indexOf(prize);
                              const [title, amount] = prize.includes(':') ? prize.split(':') : [prize, ''];
                              
                              return (
                                  <div key={idx} className="flex gap-3">
                                      <div className="flex-1 flex gap-3 text-sm">
                                          <div className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700">
                                              {title.trim()}
                                          </div>
                                          <div className="w-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900">
                                              {amount ? amount.trim() : 'TBA'}
                                          </div>
                                      </div>
                                      <button 
                                          type="button"
                                          onClick={() => {
                                              const newPrizes = [...formData.prizes];
                                              newPrizes.splice(realIndex, 1);
                                              setFormData({...formData, prizes: newPrizes});
                                          }}
                                          className="px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                                      >
                                          <X className="w-5 h-5" />
                                      </button>
                                  </div>
                              );
                          })
                      }
                      
                      {/* Add New Custom Prize Input */}
                      <div className="flex gap-3">
                          <input 
                              id="new-prize-title"
                              placeholder="Prize Title (e.g. Best UX)"
                              className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                              style={{ minHeight: '56px', paddingLeft: '24px' }}
                              onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                      e.preventDefault();
                                      const titleInput = document.getElementById('new-prize-title') as HTMLInputElement;
                                      const amountInput = document.getElementById('new-prize-amount') as HTMLInputElement;
                                      
                                      if (titleInput.value.trim()) {
                                          const newPrizeStream = `${titleInput.value.trim()}: ${amountInput.value.trim() || 'TBA'}`;
                                          setFormData({
                                              ...formData, 
                                              prizes: [...formData.prizes, newPrizeStream]
                                          });
                                          titleInput.value = '';
                                          amountInput.value = '';
                                          titleInput.focus();
                                      }
                                  }
                              }}
                          />
                          <input 
                              id="new-prize-amount"
                              placeholder="Amount"
                              className="w-32 px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                              style={{ minHeight: '56px', paddingLeft: '24px' }}
                              onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                      e.preventDefault();
                                      const titleInput = document.getElementById('new-prize-title') as HTMLInputElement;
                                      const amountInput = document.getElementById('new-prize-amount') as HTMLInputElement;
                                      
                                      if (titleInput.value.trim()) {
                                          const newPrizeStream = `${titleInput.value.trim()}: ${amountInput.value.trim() || 'TBA'}`;
                                          setFormData({
                                              ...formData, 
                                              prizes: [...formData.prizes, newPrizeStream]
                                          });
                                          titleInput.value = '';
                                          amountInput.value = '';
                                          titleInput.focus();
                                      }
                                  }
                              }}
                          />
                      </div>
                  </div>
              </div>
            </div>
          </section>


          {/* Tags */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-600" />
              Tags & Technologies
            </h3>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.tags?.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold flex items-center gap-1 group">
                    {tag}
                    <button 
                        type="button"
                        onClick={() => setFormData({...formData, tags: formData.tags.filter(t => t !== tag)})}
                        className="w-4 h-4 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center hover:bg-blue-300 transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              
              <div className="relative">
                  <div className="flex gap-2">
                    <input 
                      list="tag-options"
                      placeholder="Type or select a tag..."
                      className="flex-1 px-6 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      style={{ minHeight: '56px', paddingLeft: '24px' }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = e.currentTarget.value.trim();
                          if (val && !formData.tags.includes(val)) {
                             setFormData({...formData, tags: [...formData.tags, val]});
                             e.currentTarget.value = "";
                          }
                        }
                      }}
                    />
                    <datalist id="tag-options">
                        {availableTags.map(t => (
                            <option key={t} value={t} />
                        ))}
                    </datalist>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 font-medium">Type a new tag and press Enter, or select from the list.</p>
              </div>
              <p className="text-xs text-slate-400 mt-2 font-medium">Select correct tags to ensure your event reaches the right candidates.</p>
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
                    className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    style={{ minHeight: '56px', paddingLeft: '24px' }}
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
              <div className="space-y-4">
                {/* Total Weight Indicator */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-600">Total Weight Distribution</span>
                  <span className={`text-sm font-bold ${
                    formData.judgingCriteria.reduce((acc, curr) => {
                      const weightMatch = curr.match(/: (\d+)%$/);
                      return acc + (weightMatch ? parseInt(weightMatch[1]) : 0);
                    }, 0) === 100 ? 'text-green-600' : 'text-amber-600'
                  }`}>
                    {formData.judgingCriteria.reduce((acc, curr) => {
                      const weightMatch = curr.match(/: (\d+)%$/);
                      return acc + (weightMatch ? parseInt(weightMatch[1]) : 0);
                    }, 0)}% / 100%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mb-6 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                       formData.judgingCriteria.reduce((acc, curr) => {
                        const weightMatch = curr.match(/: (\d+)%$/);
                        return acc + (weightMatch ? parseInt(weightMatch[1]) : 0);
                      }, 0) === 100 ? 'bg-green-500' : 'bg-amber-500'
                    }`}
                    style={{
                      width: `${Math.min(100, formData.judgingCriteria.reduce((acc, curr) => {
                        const weightMatch = curr.match(/: (\d+)%$/);
                        return acc + (weightMatch ? parseInt(weightMatch[1]) : 0);
                      }, 0))}%`
                    }}
                  />
                </div>

                {formData.judgingCriteria.map((criteria, index) => {
                  const name = criteria.split(':')[0] || '';
                  const weightMatch = criteria.match(/: (\d+)%$/);
                  const weight = weightMatch ? parseInt(weightMatch[1]) : 0; // Default to 0 if not set

                  return (
                    <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex gap-3">
                        <input
                          value={name}
                          onChange={(e) => {
                             // Preserve weight when name changes
                             const newName = e.target.value;
                             const newCriteria = `${newName}: ${weight}%`;
                             updateArrayItem('judgingCriteria', index, newCriteria);
                          }}
                          placeholder="Criterion Name (e.g. Innovation)"
                          className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('judgingCriteria', index)}
                          className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-slate-500 w-12">{weight}%</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={weight}
                          onChange={(e) => {
                            const newWeight = parseInt(e.target.value);
                            const newCriteria = `${name}: ${newWeight}%`;
                            updateArrayItem('judgingCriteria', index, newCriteria);
                          }}
                          className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                      </div>
                    </div>
                  );
                })}
                
                <button
                  type="button"
                  onClick={() => {
                     // Default new item to something sensible like "New Criteria: 20%"
                     const newItem = "New Criteria: 20%";
                     // Instead of calling addArrayItem, we likely need to push to state. 
                     // Assuming addArrayItem just pushes empty string, we might need to manually update or update immediately after.
                     // The parent's addArrayItem likely adds "". 
                     // Let's modify logic or just use addArrayItem and then update it?
                     // Actually, looking at previous code, addArrayItem('judgingCriteria') adds an empty string. 
                     // We should handle that robustly.
                     addArrayItem('judgingCriteria');
                  }}
                  className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 font-medium hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                  + Add Weighted Criterion
                </button>
                {/* Auto-set empty string to default structure if newly added */}
                {/* This is handled by rendering logic: split(':')[0] handles empty string fine (name="") */}
              </div>
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
