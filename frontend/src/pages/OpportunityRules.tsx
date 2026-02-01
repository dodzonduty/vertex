
import './OpportunityProfile.css';

export function OpportunityRules() {
  return (
    <div className="content-grid">
      <div className="main-column full-width">
        <section className="section-card">
          <h3 className="section-title">
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>gavel</span> Official Rules
          </h3>
          
          <div className="typography-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="rule-block mb-8">
              <h4 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-indigo-500 drop-shadow-sm mb-4">1. General Conduct</h4>
              <p className="text-slate-600 leading-relaxed mb-4">
                All participants must adhere to the community code of conduct. Harassment, discrimination, or inappropriate behavior of any kind will not be tolerated and may result in immediate disqualification and banning from the platform. We are committed to providing a safe and inclusive environment for everyone.
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Respect fellow participants, mentors, and judges.</li>
                <li>Report any suspicious or harmful behavior immediately to the organizers.</li>
                <li>Maintain professionalism in all communication channels.</li>
              </ul>
            </div>

            <div className="rule-block mb-8">
              <h4 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-indigo-500 drop-shadow-sm mb-4">2. Intellectual Property</h4>
              <p className="text-slate-600 leading-relaxed">
                Participants retain full ownership of the code and intellectual property developed during the hackathon. However, by submitting a project, you grant the organizers a non-exclusive, royalty-free license to use, reproduce, and display the project for promotional and demonstration purposes related to the event.
              </p>
            </div>

            <div className="rule-block mb-8">
              <h4 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-indigo-500 drop-shadow-sm mb-4">3. Eligibility verification</h4>
              <p className="text-slate-600 leading-relaxed">
                All team members must pass the automated AI Eligibility Check prior to the final submission deadline. Failure to verify eligibility for any team member may result in the disqualification of the entire team. Ensure your GitHub profiles are linked and up to date.
              </p>
            </div>

            <div className="rule-block mb-8">
              <h4 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-indigo-500 drop-shadow-sm mb-4">4. Team Formation</h4>
              <p className="text-slate-600 leading-relaxed">
                Teams may consist of 1 to 4 members. You may form a team with members from different organizations or countries. All team changes must be finalized before the hacking period begins.
              </p>
            </div>

            <div className="rule-block text-slate-500 text-sm italic mt-12 pt-6 border-t border-slate-200">
              * The organizers reserve the right to update these rules at any time. Participants will be notified of any significant changes.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
