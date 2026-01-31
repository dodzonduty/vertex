import { useState } from 'react';
import { X, UserPlus, Search, CheckCircle2, Users } from 'lucide-react';

interface Teammate {
  id: string;
  name: string;
  university: string;
  avatar: string;
}

interface EventRegistrationProps {
  eventTitle: string;
  onClose: () => void;
  onSubmit: (teammates: Teammate[]) => void;
  requiresTeam?: boolean;
  teamSizeMin?: number;
  teamSizeMax?: number;
}

export function EventRegistration({
  eventTitle,
  onClose,
  onSubmit,
  requiresTeam = true,
  teamSizeMin = 2,
  teamSizeMax = 4
}: EventRegistrationProps) {
  const [teammates, setTeammates] = useState<Teammate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Mock available students to add as teammates
  const availableStudents: Teammate[] = [
    { id: '1', name: 'Sarah Chen', university: 'MIT', avatar: 'SC' },
    { id: '2', name: 'Mike Rodriguez', university: 'UC Berkeley', avatar: 'MR' },
    { id: '3', name: 'Jordan Lee', university: 'Stanford', avatar: 'JL' },
    { id: '4', name: 'Emma Wilson', university: 'CMU', avatar: 'EW' },
    { id: '5', name: 'David Park', university: 'Georgia Tech', avatar: 'DP' }
  ];

  const filteredStudents = availableStudents.filter(
    student => 
      !teammates.find(t => t.id === student.id) &&
      (student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       student.university.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const addTeammate = (student: Teammate) => {
    if (teammates.length < teamSizeMax - 1) {
      setTeammates([...teammates, student]);
      setSearchQuery('');
    }
  };

  const removeTeammate = (id: string) => {
    setTeammates(teammates.filter(t => t.id !== id));
  };

  const canSubmit = !requiresTeam || (teammates.length >= teamSizeMin - 1 && teammates.length <= teamSizeMax - 1);

  const handleSubmit = () => {
    onSubmit(teammates);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Register for Event</h2>
              <p className="text-gray-600">{eventTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {requiresTeam && (
            <>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-2">
                  <Users className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-purple-900">
                    <p className="font-medium mb-1">Team Requirements</p>
                    <p className="text-purple-800">
                      This event requires a team of {teamSizeMin}-{teamSizeMax} members (including you).
                      {teammates.length < teamSizeMin - 1 && (
                        <span className="block mt-1">
                          You need to add at least {teamSizeMin - 1 - teammates.length} more teammate{teamSizeMin - 1 - teammates.length !== 1 ? 's' : ''}.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Current Team */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Your Team ({teammates.length + 1}/{teamSizeMax})
                </h3>
                <div className="space-y-2">
                  {/* Current User */}
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-purple-50">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      You
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">You (Team Leader)</div>
                      <div className="text-sm text-gray-600">Stanford University</div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>

                  {/* Added Teammates */}
                  {teammates.map((teammate) => (
                    <div key={teammate.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-semibold">
                        {teammate.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{teammate.name}</div>
                        <div className="text-sm text-gray-600">{teammate.university}</div>
                      </div>
                      <button
                        onClick={() => removeTeammate(teammate.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  {/* Add Teammate Button */}
                  {teammates.length < teamSizeMax - 1 && (
                    <button
                      onClick={() => setShowSearch(!showSearch)}
                      className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-gray-600 hover:text-purple-700"
                    >
                      <UserPlus className="w-5 h-5" />
                      Add Teammate
                    </button>
                  )}
                </div>
              </div>

              {/* Search for Teammates */}
              {showSearch && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Search Students</h3>
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name or university..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <div
                          key={student.id}
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => addTeammate(student)}
                        >
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-semibold">
                            {student.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-600">{student.university}</div>
                          </div>
                          <UserPlus className="w-5 h-5 text-purple-600" />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        {searchQuery ? 'No students found' : 'Start typing to search for teammates'}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Personal Information */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Your Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Why do you want to participate?
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your motivation and what you hope to achieve..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relevant Skills/Experience
                </label>
                <input
                  type="text"
                  placeholder="e.g., React, Python, AI/ML..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                canSubmit
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Complete Registration
            </button>
          </div>

          {!canSubmit && requiresTeam && (
            <p className="text-center text-sm text-red-600 mt-3">
              Please add {teamSizeMin - 1 - teammates.length} more teammate{teamSizeMin - 1 - teammates.length !== 1 ? 's' : ''} to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
