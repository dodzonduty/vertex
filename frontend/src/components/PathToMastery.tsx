import { User, Code2, Trophy, Users, Briefcase, Building2 } from 'lucide-react';
import './PathToMastery.css';

export const PathToMastery: React.FC = () => {
  return (
    <section id="path-to-mastery" className="path-section">
      <div className="path-container">

        {/* Section Header */}
        <div className="section-header">
          <span className="section-eyebrow">Our Ecosystem</span>
          <h2 className="section-title">Choose Your Path to Mastery</h2>
          <div className="section-underline"></div>
        </div>

        {/* Cards Grid */}
        <div className="cards-grid">

          {/* Card 1: Smart Profiles */}
          <div className="card feature-card">
            <div className="icon-wrapper">
              <User className="card-icon" />
            </div>
            <h3 className="card-title">Smart Profiles</h3>
            <p className="card-desc">
              AI-powered profile creation with CV parsing, ATS scoring, and personalized career insights.
            </p>
          </div>

          {/* Card 2: Project Showcase */}
          <div className="card feature-card">
            <div className="icon-wrapper">
              <Code2 className="card-icon" />
            </div>
            <h3 className="card-title">Project Showcase</h3>
            <p className="card-desc">
              Display your work with GitHub integration, AI-generated tags, and automated quality verification.
            </p>
          </div>

          {/* Card 3: Events & Hackathons */}
          <div className="card feature-card">
            <div className="icon-wrapper">
              <Trophy className="card-icon" />
            </div>
            <h3 className="card-title">Events & Hackathons</h3>
            <p className="card-desc">
              Discover and participate in hackathons with AI eligibility analysis and team formation tools.
            </p>
          </div>

          {/* Card 4: OpenMatch */}
          <div className="card feature-card">
            <div className="icon-wrapper">
              <Users className="card-icon" />
            </div>
            <h3 className="card-title">OpenMatch</h3>
            <p className="card-desc">
              Find the perfect teammates with AI-powered role matching and natural language search.
            </p>
          </div>

          {/* Card 5: Hiring Intelligence */}
          <div className="card feature-card">
            <div className="icon-wrapper">
              <Briefcase className="card-icon" />
            </div>
            <h3 className="card-title">Hiring Intelligence</h3>
            <p className="card-desc">
              Companies can discover talent using advanced AI search with natural language prompts.
            </p>
          </div>

          {/* Card 6: Company Profiles */}
          <div className="card feature-card">
            <div className="icon-wrapper">
              <Building2 className="card-icon" />
            </div>
            <h3 className="card-title">Company Profiles</h3>
            <p className="card-desc">
              Showcase your organization, host events, and connect with top student talent.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
