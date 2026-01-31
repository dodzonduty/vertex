import { useState } from 'react';
import { Plus, Calendar, MapPin, Trophy, Edit, XCircle, ArrowRight, CheckCircle2, MoreHorizontal } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  type: 'hackathon' | 'sponsorship' | 'workshop';
  description: string;
  date: string;
  location: string;
  prizes: string[];
  requirements: string[];
  judgingCriteria: string[];
  rules: string[];
  applicationLink: string;
  status: 'active' | 'canceled';
  registrations: number;
}

export function CompanyEvents() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [events, setEvents] = useState<Event[]>([
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

  const handleCreateEvent = (e: any) => {
    e.preventDefault();
    const newEvent: Event = {
      id: Date.now().toString(),
      title: 'Emerging Tech Workshop',
      type: 'workshop',
      description: 'New interactive session for advanced students.',
      date: 'TBD',
      location: 'Virtual',
      prizes: [],
      requirements: [],
      judgingCriteria: [],
      rules: [],
      applicationLink: '',
      status: 'active',
      registrations: 0
    };
    setEvents([newEvent, ...events]);
    setShowCreateModal(false);
    alert('Event published successfully!');
  };

  const handleCancelEvent = (eventId: string) => {
    if (confirm('Are you sure you want to cancel this event? This action cannot be undone.')) {
      setEvents(events.map(event =>
        event.id === eventId ? { ...event, status: 'canceled' as const } : event
      ));
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-4 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Event Management</h1>
          <p className="text-slate-600 text-lg">Orchestrate hackathons and workshops to engage with elite talent.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 transition-all"
        >
          <Plus className="w-5 h-5" />
          Create New Event
        </button>
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-12">
              <h2 className="text-3xl font-black text-slate-900 mb-8 text-center">New Event Portfolio</h2>
              <form onSubmit={handleCreateEvent} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Event Classification</label>
                    <select className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-700">
                      <option>Hackathon</option>
                      <option>Workshop</option>
                      <option>Sponsorship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Public Title</label>
                    <input required placeholder="E.g. Future of Finance Hack" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Event Brief</label>
                  <textarea rows={4} required placeholder="Detailed description of the opportunity..." className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none" />
                </div>

                <div className="flex gap-4 pt-8">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors">Discard</button>
                  <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/10">Publish Event</button>
                </div>
              </form>
            </div>
          </div>
        </div>
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
