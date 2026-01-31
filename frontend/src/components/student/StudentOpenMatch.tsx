import { useState } from 'react';
import { Plus, Users, Search, Sparkles, UserPlus, ArrowRight, ShieldCheck } from 'lucide-react';

interface Room {
  id: string;
  title: string;
  description: string;
  host: string;
  roles: RoleNeeded[];
  members: Member[];
  status: 'open' | 'full';
  createdAt: string;
}

interface RoleNeeded {
  id: string;
  title: string;
  description: string;
  count: number;
  filled: number;
  tags: string[];
}

interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export function StudentOpenMatch() {
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [useAISearch, setUseAISearch] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const [rooms] = useState<Room[]>([
    {
      id: '1',
      title: 'AI Hackathon Team - Healthcare Focus',
      description: 'Building an AI-powered healthcare assistant for the upcoming AI Innovation Hackathon. Looking for passionate team members!',
      host: 'Sarah Chen',
      roles: [
        {
          id: '1',
          title: 'Frontend Developer',
          description: 'React/TypeScript expert for building the user interface',
          count: 1,
          filled: 1,
          tags: ['React', 'TypeScript', 'UI/UX']
        },
        {
          id: '2',
          title: 'ML Engineer',
          description: 'Experience with NLP and healthcare data',
          count: 1,
          filled: 0,
          tags: ['Machine Learning', 'NLP', 'Python', 'TensorFlow']
        },
        {
          id: '3',
          title: 'Backend Developer',
          description: 'API development and database management',
          count: 1,
          filled: 0,
          tags: ['Node.js', 'Python', 'API', 'Database']
        }
      ],
      members: [
        { id: '1', name: 'Sarah Chen', role: 'Host / Frontend Developer', avatar: 'SC' }
      ],
      status: 'open',
      createdAt: '2 hours ago'
    },
    {
      id: '2',
      title: 'Mobile App Development Team',
      description: 'Creating a social networking app for students. Need creative minds to join!',
      host: 'Alex Kumar',
      roles: [
        {
          id: '1',
          title: 'UI/UX Designer',
          description: 'Design beautiful and intuitive interfaces',
          count: 1,
          filled: 0,
          tags: ['Figma', 'UI/UX', 'Design']
        },
        {
          id: '2',
          title: 'React Native Developer',
          description: 'Build cross-platform mobile apps',
          count: 2,
          filled: 1,
          tags: ['React Native', 'Mobile', 'JavaScript']
        }
      ],
      members: [
        { id: '1', name: 'Alex Kumar', role: 'Host', avatar: 'AK' },
        { id: '2', name: 'Jordan Lee', role: 'React Native Developer', avatar: 'JL' }
      ],
      status: 'open',
      createdAt: '5 hours ago'
    }
  ]);

  const handleCreateRoom = (e: any) => {
    e.preventDefault();
    alert('Room created successfully! OpenMatch is now finding compatible matches for your roles.');
    setShowCreateRoom(false);
  };

  const handleJoinRequest = (roleTitle: string) => {
    alert(`Join request for "${roleTitle}" sent to the host. You'll be notified if they accept!`);
  };

  return (
    <div className="max-w-6xl mx-auto py-4 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6 text-center md:text-left">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">OpenMatch</h1>
          <p className="text-slate-600 text-lg">Assemble your dream team with AI-powered compatibility matching.</p>
        </div>
        <button
          onClick={() => setShowCreateRoom(true)}
          className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all"
        >
          <Plus className="w-5 h-5" />
          Create Room
        </button>
      </div>

      {/* Search - Premium */}
      <div className={`bg-white rounded-3xl p-2 mb-10 border transition-all duration-500 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center gap-2 ${useAISearch ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-slate-100 font-medium'}`}>
        <div className="flex-1 relative w-full group">
          <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${useAISearch ? 'text-indigo-500' : 'text-slate-400'}`} />
          <input
            type="text"
            placeholder={useAISearch ? "Describe your goal (e.g. 'I need a web3 team that values clean code...')" : "Search rooms..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-4 py-4 bg-transparent outline-none text-slate-900 placeholder:text-slate-400 font-medium"
          />
        </div>
        <button
          onClick={() => setUseAISearch(!useAISearch)}
          className={`flex items-center gap-2 px-6 py-4 rounded-2xl transition-all ${useAISearch ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
        >
          <Sparkles className={`w-5 h-5 ${useAISearch ? 'animate-pulse' : ''}`} />
          <span className="font-bold whitespace-nowrap">AI Smart Filter</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onViewDetails={() => setSelectedRoom(room)}
          />
        ))}
      </div>

      {showCreateRoom && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-10">
              <h2 className="text-3xl font-black text-slate-900 mb-8">Establish New Room</h2>
              <form onSubmit={handleCreateRoom} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Room Title</label>
                  <input required placeholder="E.g. Fullstack Devs for FinTech" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Vision & Goals</label>
                  <textarea rows={4} required placeholder="What are you building?" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none" />
                </div>

                <div className="flex gap-4 pt-10 border-t border-slate-100">
                  <button type="button" onClick={() => setShowCreateRoom(false)} className="flex-1 py-4 text-slate-400 font-bold hover:text-slate-600">Cancel</button>
                  <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/10">Launch Room</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {selectedRoom && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="relative">
              <button onClick={() => setSelectedRoom(null)} className="absolute top-4 right-4 z-20 w-10 h-10 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center hover:bg-slate-200 transition-all font-bold">×</button>
              <div className="h-24 bg-gradient-to-r from-indigo-600 to-violet-600" />
            </div>
            <div className="p-10 -mt-10">
              <div className="flex items-end gap-6 mb-8">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center font-black text-2xl text-indigo-600">
                  {selectedRoom.host[0]}
                </div>
                <div className="flex-1 pb-2">
                  <h2 className="text-2xl font-black text-slate-900 mb-1">{selectedRoom.title}</h2>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>Host: {selectedRoom.host}</span>
                    <span>•</span>
                    <span>{selectedRoom.createdAt}</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-500 leading-relaxed mb-10 text-lg">{selectedRoom.description}</p>

              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6">Open Positions</h3>
              <div className="space-y-4 mb-10">
                {selectedRoom.roles.map((role) => (
                  <div key={role.id} className="group p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-slate-900">{role.title}</h4>
                      <span className="px-3 py-1 bg-white text-slate-500 rounded-full text-[10px] font-bold uppercase border border-slate-100 shadow-sm">
                        {role.filled}/{role.count} Slots
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mb-6">{role.description}</p>
                    {role.filled < role.count && (
                      <button
                        onClick={() => handleJoinRequest(role.title)}
                        className="w-full py-3 bg-white border border-slate-200 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm flex items-center justify-center gap-2 group/jr"
                      >
                        <UserPlus className="w-4 h-4" />
                        Apply for Role
                        <ArrowRight className="w-4 h-4 transform group-hover/jr:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setSelectedRoom(null)}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all hover:-translate-y-0.5"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RoomCard({ room, onViewDetails }: { room: Room; onViewDetails: () => void }) {
  const totalSlots = room.roles.reduce((sum, role) => sum + role.count, 0);
  const filledSlots = room.roles.reduce((sum, role) => sum + role.filled, 0);

  return (
    <div className="group bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col pt-2">
      <div className="p-8">
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{room.title}</h3>
          <div className="flex flex-col items-end">
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${room.status === 'full' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              {room.status}
            </div>
          </div>
        </div>

        <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-2">{room.description}</p>

        {/* Progress System */}
        <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 relative group-hover:bg-indigo-50/50 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Team Capacity</span>
            <span className="text-sm font-black text-indigo-600">{filledSlots}/{totalSlots} Filled</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(79,70,229,0.3)]"
              style={{ width: `${(filledSlots / totalSlots) * 100}%` }}
            />
          </div>
          <div className="mt-4 flex -space-x-3 overflow-hidden">
            {room.members.map((m, i) => (
              <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                {m.avatar}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onViewDetails}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 group/btn shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all transform hover:-translate-y-1"
        >
          Enter Room
          <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5" />
          {room.members.length} Ready
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
          Verified Host
        </div>
      </div>
    </div>
  );
}
