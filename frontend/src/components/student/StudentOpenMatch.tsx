import { useState, useEffect } from 'react';
import { Plus, Users, UserPlus, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { apiRequest } from '../../lib/api/config';
import { toast } from 'sonner';
import { AIModal } from '../ai/AIModal';
import '../../pages/Opportunities.css'; // Import styles for AI search bar

interface Room {
  id: string;
  title: string;
  description: string;
  host: string;
  host_id?: string;
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
  avatar: string; // Initials or URL
}

interface CreateRoleData {
  title: string;
  count: number;
  tags: string; // Comma separated for input
}

export function StudentOpenMatch({ opportunityId }: { opportunityId: string }) {
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [newRoomDesc, setNewRoomDesc] = useState('');
  const [newRoomRoles, setNewRoomRoles] = useState<CreateRoleData[]>([{ title: '', count: 1, tags: '' }]);

  // Navigation Logic
  const handleViewHostProfile = (hostId: string) => {
    window.location.href = `/student/profile/${hostId}`;
  };

  useEffect(() => {
    fetchRooms();
  }, [opportunityId]);

  const fetchRooms = async () => {
    try {
      const data = await apiRequest<Room[]>(`/api/rooms/?opportunity_id=${opportunityId}`);
      setRooms(data);
    } catch (err) {
      console.error("Failed to fetch rooms", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = () => {
    setNewRoomRoles([...newRoomRoles, { title: '', count: 1, tags: '' }]);
  };

  const handleRoleChange = (index: number, field: keyof CreateRoleData, value: any) => {
    const updated = [...newRoomRoles];
    updated[index] = { ...updated[index], [field]: value };
    setNewRoomRoles(updated);
  };

  const handleRemoveRole = (index: number) => {
    const updated = newRoomRoles.filter((_, i) => i !== index);
    setNewRoomRoles(updated);
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    // Filter valid roles
    const validRoles = newRoomRoles.filter(r => r.title.trim() !== '');
    if (validRoles.length === 0) {
      toast.error("Please add at least one role to your room.");
      return;
    }

    try {
      const payload = {
        title: newRoomTitle,
        description: newRoomDesc,
        opportunity_id: opportunityId,
        roles: validRoles.map(r => ({
          title: r.title,
          count: r.count,
          tags: r.tags.split(',').map(t => t.trim()).filter(Boolean)
        }))
      };

      await apiRequest('/api/rooms/', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      toast.success("Room created successfully!");
      setShowCreateRoom(false);
      fetchRooms();

      // Reset form
      setNewRoomTitle('');
      setNewRoomDesc('');
      setNewRoomRoles([{ title: '', count: 1, tags: '' }]);

    } catch (err) {
      toast.error("Failed to create room.");
      console.error(err);
    }
  };

  const handleJoinRequest = async (room: Room, roleId: string) => {
    try {
      await apiRequest(`/api/rooms/${room.id}/join`, {
        method: 'POST',
        body: JSON.stringify({ opening_id: roleId, message: "Requesting to join via OpenMatch" })
      });
      toast.success("Join request sent!");
    } catch (err: any) {
      toast.error(err.message || "Failed to join");
    }
  };

  const handleAskAI = () => {
    setIsAIModalOpen(true);
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
          style={{ minHeight: '56px', padding: '0 32px', cursor: 'pointer' }}
          className="flex items-center gap-2 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all"
        >
          <Plus className="w-5 h-5" />
          Create Room
        </button>
      </div>

      {/* Search - Premium AI Style */}
      <div className="opp-search-section" style={{ padding: '0 0 2rem 0' }}>
        <div className="opp-search-width-container" style={{ maxWidth: '100%' }}>
          <div className="opp-search-group">
            <div className="opp-search-bg-blur"></div>
            <div className="opp-search-box">
              <span className="material-symbols-outlined opp-search-icon">search</span>
              <input
                className="opp-search-input"
                placeholder="Find your dream team with AI..."
                onClick={handleAskAI}
                value=""
                readOnly
                style={{ cursor: 'pointer' }}
              />
              <button
                className="opp-ask-ai-btn vibrant-gradient"
                onClick={handleAskAI}
              >
                <span className="material-symbols-outlined">auto_awesome</span>
                Ask AI
              </button>
            </div>
          </div>

          <AIModal
            isOpen={isAIModalOpen}
            onClose={() => setIsAIModalOpen(false)}
            context="User is looking for Open Match rooms."
            placeholder="Describe the team you're looking for..."
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {rooms.length === 0 ? (
            <div className="col-span-2 text-center py-20 text-slate-400">
              <p>No active rooms found. Be the first to create one!</p>
            </div>
          ) : (
            rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onViewDetails={() => setSelectedRoom(room)}
              />
            ))
          )}
        </div>
      )}

      {showCreateRoom && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-10">
              <h2 className="text-3xl font-black text-slate-900 mb-8">Establish New Room</h2>
              <form onSubmit={handleCreateRoom} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Room Title</label>
                  <input
                    required
                    value={newRoomTitle}
                    onChange={e => setNewRoomTitle(e.target.value)}
                    placeholder="E.g. Fullstack Devs for FinTech"
                    style={{ height: '72px', paddingLeft: '24px', paddingRight: '24px' }}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Vision & Goals</label>
                  <textarea
                    rows={4}
                    required
                    value={newRoomDesc}
                    onChange={e => setNewRoomDesc(e.target.value)}
                    placeholder="What are you building?"
                    style={{ height: '120px', padding: '24px' }}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus-ring-indigo-500/10 outline-none resize-none"
                  />
                </div>

                {/* Roles Section */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Open Roles needed</label>
                    <button type="button" onClick={handleAddRole} className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-700 cursor-pointer">
                      <Plus className="w-3 h-3" /> Add Role
                    </button>
                  </div>
                  <div className="space-y-3">
                    {newRoomRoles.map((role, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-3 items-start relative">
                        <div className="flex-1 space-y-3">
                          <div className="flex gap-3">
                            <input
                              placeholder="Role Title (e.g. Frontend Dev)"
                              value={role.title}
                              onChange={e => handleRoleChange(idx, 'title', e.target.value)}
                              style={{ height: '56px', paddingLeft: '16px', paddingRight: '16px' }}
                              className="flex-1 bg-white border border-slate-200 rounded-lg text-sm"
                              required
                            />
                            <input
                              type="number"
                              min="1"
                              value={role.count}
                              onChange={e => handleRoleChange(idx, 'count', parseInt(e.target.value))}
                              style={{ height: '56px', paddingLeft: '16px', paddingRight: '16px' }}
                              className="w-20 bg-white border border-slate-200 rounded-lg text-sm"
                            />
                          </div>
                          <input
                            placeholder="Skills (comma seq: React, Node)"
                            value={role.tags}
                            onChange={e => handleRoleChange(idx, 'tags', e.target.value)}
                            style={{ height: '56px', paddingLeft: '16px', paddingRight: '16px' }}
                            className="w-full bg-white border border-slate-200 rounded-lg text-sm"
                          />
                        </div>
                        {newRoomRoles.length > 1 && (
                          <button type="button" onClick={() => handleRemoveRole(idx)} className="text-slate-400 hover:text-red-500 p-1 cursor-pointer">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-10 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowCreateRoom(false)}
                    style={{ height: '64px', cursor: 'pointer' }}
                    className="flex-1 text-slate-400 font-bold hover:text-slate-600 rounded-2xl hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ height: '64px', cursor: 'pointer' }}
                    className="flex-1 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all hover:-translate-y-0.5"
                  >
                    Launch Room
                  </button>
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
                    {selectedRoom.host_id && (
                      <>
                        <span>•</span>
                        <button
                          onClick={() => handleViewHostProfile(selectedRoom.host_id!)}
                          className="text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                        >
                          View Profile
                        </button>
                      </>
                    )}
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
                        onClick={() => handleJoinRequest(selectedRoom, role.id)}
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
