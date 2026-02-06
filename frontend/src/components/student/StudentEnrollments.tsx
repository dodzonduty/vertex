import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, User, Trophy } from 'lucide-react';
import { apiRequest } from '../../lib/api/config';
import { Link } from 'react-router-dom';

interface Enrollment {
  team_id: string;
  team_name: string;
  opportunity_id: string;
  opportunity_title: string;
  opportunity_type: string;
  status: string;
  role: string;
  event_date: string;
  event_end_date?: string;
  location: string;
  image: string;
}

export function StudentEnrollments() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const data = await apiRequest<{ enrollments: Enrollment[] }>('/api/enrollment/my-enrollments');
      setEnrollments(data.enrollments || []);
    } catch (err) {
      console.error('Failed to fetch enrollments', err);
    } finally {
      setLoading(false);
    }
  };

  const getEventStatus = (eventDate: string, eventEndDate?: string) => {
    const now = new Date();
    const start = new Date(eventDate);
    const end = eventEndDate ? new Date(eventEndDate) : start;

    if (now < start) {
      return { label: 'Upcoming', color: 'bg-blue-100 text-blue-700' };
    } else if (now >= start && now <= end) {
      return { label: 'In Progress', color: 'bg-green-100 text-green-700' };
    } else {
      return { label: 'Ended', color: 'bg-slate-100 text-slate-600' };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (enrollments.length === 0) {
    return (
      <div className="text-center py-20">
        <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-slate-900 mb-2">No Enrollments Yet</h3>
        <p className="text-slate-500 mb-6">Start your journey by joining a hackathon or competition!</p>
        <Link
          to="/opportunities"
          className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
        >
          Browse Opportunities
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900">My Enrollments</h2>
          <p className="text-slate-500 mt-1">Hackathons and competitions you're participating in</p>
        </div>
        <div className="px-4 py-2 bg-indigo-50 rounded-xl border border-indigo-100">
          <span className="text-2xl font-black text-indigo-600">{enrollments.length}</span>
          <span className="text-sm text-indigo-600 ml-2 font-bold">Active</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrollments.map((enrollment) => {
          const status = getEventStatus(enrollment.event_date, enrollment.event_end_date);
          const isSolo = enrollment.role === 'Solo';

          return (
            <Link
              key={enrollment.team_id}
              to={`/opportunities/${enrollment.opportunity_id}`}
              className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden bg-gradient-to-br from-indigo-100 to-violet-100">
                {enrollment.image ? (
                  <img
                    src={enrollment.image}
                    alt={enrollment.opportunity_title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Trophy className="w-16 h-16 text-indigo-300" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${status.color}`}>
                    {status.label}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-[10px] font-bold uppercase">
                    {enrollment.opportunity_type}
                  </span>
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase flex items-center gap-1">
                    {isSolo ? (
                      <>
                        <User className="w-3 h-3" /> Solo
                      </>
                    ) : (
                      <>
                        <Users className="w-3 h-3" /> Team
                      </>
                    )}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                  {enrollment.opportunity_title}
                </h3>

                <p className="text-sm text-slate-500 mb-4 font-semibold">
                  {enrollment.team_name}
                </p>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{enrollment.event_date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{enrollment.location}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
