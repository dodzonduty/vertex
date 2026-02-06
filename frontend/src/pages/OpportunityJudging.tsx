
import './OpportunityProfile.css';


interface OpportunityJudgingProps {
  criteria?: string[];
}

export function OpportunityJudging({ criteria }: OpportunityJudgingProps) {
  
  // Parse criteria strings or use default
  const parsedCriteria = criteria && criteria.length > 0 
    ? criteria.map(c => {
        // e.g. "Innovation: 30" or just "Innovation"
        if (c.includes(':')) {
           const [name, val] = c.split(':');
           const percent = parseInt(val.trim());
           return {
               name: name.trim(),
               percent: isNaN(percent) ? 0 : percent,
               description: "" 
           };
        }
        return { name: c, percent: 0, description: "" };
    })
    : [
        {
        name: "Innovation & Impact",
        percent: 30,
        description: "How unique is the solution? Does it address a real-world problem effectively?"
        },
        {
        name: "Technical Implementation",
        percent: 30,
        description: "Code quality, architecture, and effective use of the specific tech stack (Gemini API)."
        },
        {
        name: "User Experience (UX)",
        percent: 20,
        description: "Is the application intuitive, accessible, and visually appealing?"
        },
        {
        name: "Presentation",
        percent: 10,
        description: "Quality of the video walkthrough and project description."
        },
        {
        name: "Feasibility",
        percent: 10,
        description: "Is the project viable for long-term development and scalability?"
        }
    ];

  return (
    <div className="content-grid">
      <div className="main-column full-width">
        <section className="section-card">
          <h3 className="section-title">
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>flaky</span> Judging Criteria
          </h3>

          <div className="judging-container" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '1rem' }}>
            {parsedCriteria.map((item, index) => (
              <div key={index} className="criteria-item mb-8">
                <div className="flex justify-between items-end mb-2">
                  <h4 className="font-bold text-slate-900 text-lg">{item.name}</h4>
                  {item.percent > 0 && <span className="text-2xl font-bold text-indigo-600">{item.percent}%</span>}
                </div>
                {item.percent > 0 && (
                    <div className="w-full bg-slate-100 rounded-full h-3 mb-3 overflow-hidden">
                    <div
                        className="bg-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${item.percent}%` }}
                    ></div>
                    </div>
                )}
                {item.description && <p className="text-slate-600 text-sm">{item.description}</p>}
              </div>
            ))}
            
            {(!criteria || criteria.length === 0) && (
                 <p className="text-center text-slate-400 text-sm mt-8">Sample Criteria shown above.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
