import { useState } from 'react';
import { Users, User, Sparkles, X, Plus, Search } from 'lucide-react';
import { apiRequest } from '../../lib/api/config';
import { toast } from 'sonner';

interface JoinHackathonModalProps {
  opportunityId: string;
  opportunityTitle: string;
  maxParticipants?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function JoinHackathonModal({
  opportunityId,
  opportunityTitle,
  maxParticipants,
  onClose,
  onSuccess
}: JoinHackathonModalProps) {
  const [step, setStep] = useState<'choose' | 'solo-confirm' | 'group-form'>('choose');
  const [teamName, setTeamName] = useState('');
  const [inviteEmails, setInviteEmails] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);

  const maxAllowed = maxParticipants && maxParticipants.toLowerCase() !== 'unlimited'
    ? parseInt(maxParticipants)
    : Infinity;

  const handleSoloJoin = async () => {
    setLoading(true);
    try {
      const response = await apiRequest<any>('/api/enrollment/solo', {
        method: 'POST',
        body: JSON.stringify({ opportunity_id: opportunityId })
      });

      toast.success(response.message);
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to enroll');
    } finally {
      setLoading(false);
    }
  };

  const handleGroupJoin = async () => {
    if (!teamName.trim()) {
      toast.error('Please enter a team name');
      return;
    }

    const validEmails = inviteEmails.filter(e => e.trim() !== '');

    // Require at least one invited teammate
    if (validEmails.length === 0) {
      toast.error('Please invite at least one teammate to create a team');
      return;
    }

    const totalMembers = 1 + validEmails.length;

    if (maxAllowed !== Infinity && totalMembers > maxAllowed) {
      toast.error(`Team size (${totalMembers}) exceeds maximum allowed (${maxAllowed})`);
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest<any>('/api/enrollment/group', {
        method: 'POST',
        body: JSON.stringify({
          opportunity_id: opportunityId,
          team_name: teamName,
          invited_emails: validEmails
        })
      });

      toast.success(response.message);
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  const addEmailField = () => {
    const totalMembers = 1 + inviteEmails.length + 1;
    if (maxAllowed !== Infinity && totalMembers > maxAllowed) {
      toast.error(`Cannot add more members. Maximum allowed: ${maxAllowed}`);
      return;
    }
    setInviteEmails([...inviteEmails, '']);
  };

  const removeEmailField = (index: number) => {
    setInviteEmails(inviteEmails.filter((_, i) => i !== index));
  };

  const updateEmail = (index: number, value: string) => {
    const updated = [...inviteEmails];
    updated[index] = value;
    setInviteEmails(updated);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300 cursor-default">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center hover:bg-slate-200 transition-all font-bold"
          >
            ×
          </button>
          <div className="h-24 bg-gradient-to-r from-indigo-600 to-violet-600" />
        </div>

        <div className="p-10 -mt-10">
          {/* Choose Step */}
          {step === 'choose' && (
            <>
              <div className="w-20 h-20 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center font-black text-2xl text-indigo-600 mb-6">
                🚀
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">Join {opportunityTitle}</h2>
              <p className="text-slate-500 mb-8">Choose how you'd like to participate</p>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Solo Option */}
                <button
                  onClick={() => setStep('solo-confirm')}
                  className="group p-10 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-slate-200 hover:border-indigo-400 hover:shadow-xl transition-all flex flex-col items-center text-center min-h-[280px] justify-center"
                >
                  <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                    <User className="w-10 h-10 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">Go Solo</h3>
                  <p className="text-base text-slate-600 font-medium">Compete individually as a lone ninja 🥷</p>
                </button>

                {/* Group Option */}
                <button
                  onClick={() => setStep('group-form')}
                  className="group p-10 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border-2 border-indigo-200 hover:border-indigo-400 hover:shadow-xl transition-all flex flex-col items-center text-center min-h-[280px] justify-center"
                >
                  <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-200">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">With Friends</h3>
                  <p className="text-base text-slate-600 font-medium">Form a team and collaborate 🤝</p>
                </button>
              </div>

              {maxParticipants && maxParticipants.toLowerCase() !== 'unlimited' && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-sm text-amber-800">
                    <strong>Team Size Limit:</strong> Maximum {maxParticipants} participants per team
                  </p>
                </div>
              )}
            </>
          )}

          {/* Solo Confirmation */}
          {step === 'solo-confirm' && (
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-indigo-50 rounded-3xl shadow-sm border border-indigo-100 flex items-center justify-center mb-8">
                <User className="w-12 h-12 text-indigo-600" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-3">Confirm Solo Registration</h2>
              <p className="text-lg text-slate-500 mb-10 max-w-xl mx-auto">
                You're about to register as a solo participant for <strong>{opportunityTitle}</strong>
              </p>

              <div className="w-full p-8 bg-indigo-50 rounded-3xl border border-indigo-100 mb-10 text-left">
                <div className="flex items-start gap-5">
                  <div className="bg-white p-3 rounded-xl shadow-sm">
                    <Sparkles className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-indigo-900 mb-2">Solo Ninja Mode</h4>
                    <p className="text-base text-indigo-700 leading-relaxed">
                      You'll compete individually. Show the world what you can build on your own!
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-6 w-full">
                <button
                  onClick={() => setStep('choose')}
                  style={{ minHeight: '72px' }}
                  className="flex-1 text-lg text-slate-600 font-bold hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"
                  disabled={loading}
                >
                  Back
                </button>
                <button
                  onClick={handleSoloJoin}
                  disabled={loading}
                  style={{ minHeight: '72px' }}
                  className="flex-1 bg-indigo-600 text-white rounded-2xl text-lg font-bold shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all hover:-translate-y-1 disabled:opacity-50"
                >
                  {loading ? 'Registering...' : 'Confirm Registration'}
                </button>
              </div>
            </div>
          )}

          {/* Group Form */}
          {step === 'group-form' && (
            <>
              <div className="w-20 h-20 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center font-black text-2xl mb-6">
                🤝
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">Create Your Team</h2>
              <p className="text-slate-500 mb-8">Invite your friends to join the adventure</p>

              <div className="space-y-6 mb-8">
                {/* Team Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Team Name
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g., Code Warriors"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none"
                    required
                  />
                </div>

                {/* Invite Members */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Invite Team Members (Optional)
                    </label>
                    <button
                      type="button"
                      onClick={addEmailField}
                      className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-700"
                    >
                      <Plus className="w-3 h-3" /> Add Member
                    </button>
                  </div>

                  <div className="space-y-3">
                    {inviteEmails.map((email, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => updateEmail(idx, e.target.value)}
                          placeholder="teammate@example.com"
                          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                        />
                        {inviteEmails.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEmailField(idx)}
                            className="px-3 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-slate-500 mt-2">
                    {maxAllowed === Infinity
                      ? 'No team size limit'
                      : `You + ${inviteEmails.filter(e => e.trim()).length} invited = ${1 + inviteEmails.filter(e => e.trim()).length}/${maxAllowed} members`
                    }
                  </p>
                </div>

                {/* Open Match Suggestion */}
                <div className="p-4 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-violet-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-bold text-violet-900 mb-1">Need teammates?</h4>
                      <p className="text-sm text-violet-700 mb-2">
                        Create an Open Match to find skilled collaborators!
                      </p>
                      <button
                        onClick={() => {
                          onClose();
                          // Navigate to Open Match tab - this will be handled by parent
                          window.dispatchEvent(new CustomEvent('navigate-to-open-match'));
                        }}
                        className="text-sm font-bold text-violet-600 hover:text-violet-800 underline"
                      >
                        Create Open Match →
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-6">
                <button
                  onClick={() => setStep('choose')}
                  style={{ minHeight: '72px' }}
                  className="flex-1 text-slate-600 font-bold hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all text-lg"
                  disabled={loading}
                >
                  Back
                </button>
                <button
                  onClick={handleGroupJoin}
                  disabled={loading}
                  style={{ minHeight: '72px' }}
                  className="flex-1 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all hover:-translate-y-1 disabled:opacity-50 text-lg"
                >
                  {loading ? 'Creating Team...' : 'Create Team'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

