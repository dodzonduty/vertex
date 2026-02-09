import { Building2, Mail, Phone, MapPin, Calendar, Trophy } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { apiRequest } from '../lib/api/config';

export function PublicCompanyProfile() {
  const { id } = useParams();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      if (!id) return;

      try {
        const data = await apiRequest<any>(`/api/companies/${id}`);
        setCompany(data);
      } catch (err) {
        console.error('Failed to fetch company:', err);
        setError('Failed to load company profile');
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Not Found</h2>
          <p className="text-gray-600">{error || 'The company you are looking for does not exist.'}</p>
        </div>
      </div>
    );
  }

  // Extract data from API response
  const email = company.user?.email || 'Not available';
  const phone = company.phone || 'Not available';
  const address = company.address || 'Not available';
  const profilePhotoUrl = company.user?.profile_photo_url;

  return (
    <div className="bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-400"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row items-start gap-6 -mt-20 mb-6">
              <div className="w-40 h-40 bg-white rounded-xl border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                {profilePhotoUrl ? (
                  <img src={profilePhotoUrl} alt={company.name} className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-20 h-20 text-purple-600" />
                )}
              </div>
              <div className="flex-1 md:mt-20">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{company.name}</h1>
                <p className="text-xl text-purple-600 font-medium mb-4">{company.size || 'Company'}</p>
                {company.industry && (
                  <div className="mb-4">
                    <span className="px-4 py-2 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                      {company.industry}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* About */}
            {company.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About {company.name}</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{company.description}</p>
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Email</div>
                    {email !== 'Not available' ? (
                      <a href={`mailto:${email}`} className="text-purple-600 hover:text-purple-700 font-medium">
                        {email}
                      </a>
                    ) : (
                      <span className="text-gray-500">{email}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Phone</div>
                    {phone !== 'Not available' ? (
                      <a href={`tel:${phone}`} className="text-purple-600 hover:text-purple-700 font-medium">
                        {phone}
                      </a>
                    ) : (
                      <span className="text-gray-500">{phone}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3 md:col-span-2">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Address</div>
                    <div className="text-gray-900">{address}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events & Opportunities Section - Placeholder for now */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Events & Opportunities
          </h3>
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No events or opportunities available at the moment.</p>
            <p className="text-sm text-gray-400 mt-2">Check back later for updates!</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 mt-6 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">Interested in Working with Us?</h3>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Stay tuned for exciting opportunities and events from {company.name}!
          </p>
        </div>
      </div>
    </div>
  );
}
