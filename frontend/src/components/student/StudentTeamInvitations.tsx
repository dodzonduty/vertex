import { useState, useEffect } from 'react';
import { Mail, Users, Check, X, ExternalLink } from 'lucide-react';
import { apiRequest } from '../../lib/api/config';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface Invitation {
  invitation_id: string;
  team_id: string;
  team_name: string;
  inviter_name: string;
  opportunity_title: string;
  opportunity_id: string;
  created_at: string;
}

export function StudentTeamInvitations() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const data = await apiRequest<{ invitations: Invitation[] }>('/api/enrollment/my-invitations');
      setInvitations(data.invitations || []);
    } catch (err) {
      console.error('Failed to fetch invitations', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (invitationId: string) => {
    setProcessing(invitationId);
    try {
      await apiRequest(`/api/enrollment/invitations/${invitationId}/accept`, {
        method: 'POST'
      });
      toast.success('Invitation accepted! You are now part of the team.');
      // Remove from list
      setInvitations(invitations.filter(inv => inv.invitation_id !== invitationId));
    } catch (err: any) {
      toast.error(err.message || 'Failed to accept invitation');
    } finally {
      setProcessing(null);
    }
  };

  const handleDecline = async (invitationId: string) => {
    setProcessing(invitationId);
    try {
      await apiRequest(`/api/enrollment/invitations/${invitationId}/decline`, {
        method: 'POST'
      });
      toast.success('Invitation declined');
      // Remove from list
      setInvitations(invitations.filter(inv => inv.invitation_id !== invitationId));
    } catch (err: any) {
      toast.error(err.message || 'Failed to decline invitation');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (invitations.length === 0) {
    return (
      <div className="text-center py-20">
        <Mail className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-slate-900 mb-2">No Pending Invitations</h3>
        <p className="text-slate-500">You don't have any team invitations at the moment</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Team Invitations</h2>
          <p className="text-slate-500 mt-1">You've been invited to join these teams</p>
        </div>
        <div className="px-4 py-2 bg-indigo-50 rounded-xl border border-indigo-100">
          <span className="text-2xl font-black text-indigo-600">{invitations.length}</span>
          <span className="text-sm text-indigo-600 ml-2 font-bold">Pending</span>
        </div>
      </div>

      <div className="space-y-4">
        {invitations.map((invitation) => (
          <div
            key={invitation.invitation_id}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-7 h-7 text-indigo-600" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      {invitation.team_name}
                    </h3>
                    <p className="text-sm text-slate-600">
                      <strong>{invitation.inviter_name}</strong> has invited you to join them on{' '}
                      <Link
                        to={`/opportunities/${invitation.opportunity_id}`}
                        className="text-indigo-600 hover:text-indigo-700 font-semibold inline-flex items-center gap-1"
                      >
                        {invitation.opportunity_title}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </p>
                  </div>
                </div>

                <div className="text-xs text-slate-400 mb-4">
                  Invited {new Date(invitation.created_at).toLocaleDateString()}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAccept(invitation.invitation_id)}
                    disabled={processing === invitation.invitation_id}
                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    {processing === invitation.invitation_id ? 'Accepting...' : 'Accept'}
                  </button>
                  <button
                    onClick={() => handleDecline(invitation.invitation_id)}
                    disabled={processing === invitation.invitation_id}
                    className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    {processing === invitation.invitation_id ? 'Declining...' : 'Decline'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
