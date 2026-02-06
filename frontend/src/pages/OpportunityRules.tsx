
import './OpportunityProfile.css';


interface OpportunityRulesProps {
  rules?: string[];
}

export function OpportunityRules({ rules }: OpportunityRulesProps) {
  return (
    <div className="content-grid">
      <div className="main-column full-width">
        <section className="section-card">
          <h3 className="section-title">
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>gavel</span> Official Rules
          </h3>

          <div className="typography-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
            {rules && rules.length > 0 ? (
                rules.map((rule, index) => (
                    <div key={index} className="rule-block mb-8">
                        <h4 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-indigo-500 drop-shadow-sm mb-4">
                            {index + 1}. Rule
                        </h4>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            {rule}
                        </p>
                    </div>
                ))
            ) : (
                <>
                <div className="rule-block mb-8">
                  <h4 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-indigo-500 drop-shadow-sm mb-4">1. General Conduct</h4>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    All participants must adhere to the community code of conduct. Harassment, discrimination, or inappropriate behavior of any kind will not be tolerated.
                  </p>
                </div>
                <div className="rule-block mb-8">
                   <p className="text-slate-500 italic">No specific additional rules provided for this event.</p>
                </div>
                </>
            )}

            <div className="rule-block text-slate-500 text-sm italic mt-12 pt-6 border-t border-slate-200">
              * The organizers reserve the right to update these rules at any time. Participants will be notified of any significant changes.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
