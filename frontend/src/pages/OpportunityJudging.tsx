
import './OpportunityProfile.css';

export function OpportunityJudging() {
  const criteria = [
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
            {criteria.map((item, index) => (
              <div key={index} className="criteria-item mb-8">
                <div className="flex justify-between items-end mb-2">
                  <h4 className="font-bold text-slate-900 text-lg">{item.name}</h4>
                  <span className="text-2xl font-bold text-indigo-600">{item.percent}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 mb-3 overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
                <p className="text-slate-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
