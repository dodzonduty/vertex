import { useState, useEffect } from 'react';
import { MapPin, Users, Link as LinkIcon, Star } from 'lucide-react';
import './Opportunities.css';

interface Company {
  id: string;
  name: string;
  industry: string;
  description: string;
  location: string;
  size: string;
  logo?: string;
  website?: string;
  linkedin?: string;
  rating: number;
  activeOpportunities: number;
  tags: string[];
}

export const Companies: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string>('#All');
  const [sortBy, setSortBy] = useState<string>('Most Recent');

  useEffect(() => {
    // Mock data - replace with API call
    const mockCompanies: Company[] = [
      {
        id: '1',
        name: 'TechCorp Innovations',
        industry: 'Technology',
        description: 'Leading AI and machine learning company focused on innovative solutions for enterprise clients.',
        location: 'San Francisco, CA',
        size: '500-1000',
        website: 'https://techcorp.com',
        linkedin: 'https://linkedin.com/company/techcorp',
        rating: 4.8,
        activeOpportunities: 12,
        tags: ['#AI_Safety', '#Frontend', '#Web3']
      },
      {
        id: '2',
        name: 'GreenTech Solutions',
        industry: 'Sustainability',
        description: 'Pioneering sustainable technology solutions to combat climate change through innovation.',
        location: 'London, UK',
        size: '100-500',
        website: 'https://greentech.com',
        rating: 4.6,
        activeOpportunities: 8,
        tags: ['#Sustainability', '#IoT']
      },
      {
        id: '3',
        name: 'DataFlow Systems',
        industry: 'Data Science',
        description: 'Advanced data analytics and business intelligence solutions for modern enterprises.',
        location: 'New York, NY',
        size: '1000+',
        website: 'https://dataflow.com',
        rating: 4.9,
        activeOpportunities: 15,
        tags: ['#AI_Safety', '#DataScience']
      }
    ];
    setCompanies(mockCompanies);
  }, []);

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = activeTag === '#All' || company.tags.includes(activeTag);
    return matchesSearch && matchesTag;
  });

  const tags = ['#All', '#AI_Safety', '#Frontend', '#Web3', '#Sustainability', '#DataScience', '#IoT'];

  return (
    <div className="opp-page-container">
      <main className="opp-main">
        {/* Hero Section */}
        <section className="opp-hero-section">
          <div className="opp-hero-container">
            <h1 className="opp-hero-title">
              Discover Top <br />
              <span className="vibrant-text-gradient">Companies</span>
            </h1>
            <p className="opp-hero-desc">
              Connect with leading companies offering hackathons, sponsorships, and career opportunities.
            </p>
          </div>
        </section>

        {/* Search Section */}
        <section className="opp-search-section">
          <div className="opp-search-width-container">
            <div className="opp-search-group">
              <div className="opp-search-bg-blur"></div>
              <div className="opp-search-box">
                <span className="material-symbols-outlined opp-search-icon">search</span>
                <input
                  className="opp-search-input"
                  placeholder="Search companies by name, industry, or location..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="opp-filters-section">
          <div className="opp-filters-container">
            <div className="opp-tags-wrapper">
              <button className="opp-scroll-btn" onClick={() => {
                const container = document.getElementById('companies-tags-container');
                if (container) container.scrollBy({ left: -200, behavior: 'smooth' });
              }}>
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <div className="opp-tags-row" id="companies-tags-container">
                {tags.map(tag => (
                  <button
                    key={tag}
                    className={`opp-chip ${activeTag === tag ? 'active' : 'inactive'}`}
                    onClick={() => setActiveTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <button className="opp-scroll-btn" onClick={() => {
                const container = document.getElementById('companies-tags-container');
                if (container) container.scrollBy({ left: 200, behavior: 'smooth' });
              }}>
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="opp-content-section">
          <div className="opp-content-grid">
            {/* Left Column: Companies List */}
            <div className="opp-listing-column">
              <div className="opp-listing-header-row">
                <h3 className="opp-listing-title">Showing {filteredCompanies.length} Companies</h3>
                <div className="opp-sort-dropdown">
                  <span className="material-symbols-outlined">sort</span>
                  <span className="opp-sort-label">Sort by:</span>
                  <select
                    className="opp-sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option>Most Recent</option>
                    <option>Rating</option>
                    <option>Opportunities</option>
                    <option>Company Size</option>
                  </select>
                </div>
              </div>

              <div className="opp-listings-list">
                {filteredCompanies.map((company) => (
                  <div key={company.id} className="opp-event-card">
                    <div className="opp-card-img-container">
                      {company.logo ? (
                        <img alt={company.name} className="opp-card-img" src={company.logo} />
                      ) : (
                        <div className="opp-card-img" style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '32px',
                          fontWeight: 'bold'
                        }}>
                          {company.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="opp-card-main">
                      <div className="opp-card-badges">
                        <span className="opp-badge-pill badge-blue-soft">{company.industry}</span>
                        <span className="opp-badge-pill badge-emerald-solid">
                          {company.activeOpportunities} Opportunities
                        </span>
                        {company.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="opp-badge-pill badge-gray-soft">{tag}</span>
                        ))}
                      </div>
                      <h5 className="opp-card-title">{company.name}</h5>
                      <p className="opp-card-summary">{company.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {company.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {company.size} employees
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          {company.rating}
                        </span>
                      </div>
                    </div>
                    <div className="opp-card-meta-col">
                      <div className="opp-meta-item">
                        <span className="material-symbols-outlined text-brand-blue opp-meta-icon">business</span>
                        <span className="opp-meta-text">{company.industry}</span>
                      </div>
                      <div className="opp-meta-item">
                        <span className="material-symbols-outlined text-brand-blue opp-meta-icon">trending_up</span>
                        <span className="opp-meta-text-bold">{company.activeOpportunities} Active</span>
                      </div>
                      <div className="flex gap-2">
                        {company.website && (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="opp-apply-btn"
                            title="Visit Website"
                          >
                            <LinkIcon className="w-4 h-4" />
                          </a>
                        )}
                        <button className="opp-apply-btn">
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Sidebar */}
            <aside className="opp-sidebar-column">
              <div className="opp-sticky-wrapper">
                {/* Trending Companies */}
                <div className="glass-card opp-trending-widget">
                  <h4 className="opp-widget-heading">
                    {/* <TrendingUp className="w-5 h-5 text-purple-600" style={{ display: 'inline' }} /> */}
                    <span style={{ marginLeft: '8px' }}>Trending</span>
                  </h4>
                  <div className="opp-trending-list">
                    {[
                      { tag: '#AI_Safety', count: 24 },
                      { tag: '#Web3_Gaming', count: 18 },
                      { tag: '#Neurotech', count: 8 }
                    ].map((item, i) => (
                      <a
                        key={i}
                        href="#"
                        className="opp-trending-item"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveTag(item.tag);
                        }}
                      >
                        <span className="opp-trending-tag">{item.tag}</span>
                        <span className="opp-trending-count">{item.count}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
};

