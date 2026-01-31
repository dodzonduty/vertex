import React from 'react';
import './OpenMatchRooms.css';

export const OpenMatchRooms: React.FC = () => {
  return (
    <div className="omr-container">
      <div className="omr-grid">
        
        {/* Main Column */}
        <div className="omr-main">
          
          {/* Search Box */}
          <div className="omr-search-box">
             <div className="omr-search-inner">
               <span className="material-symbols-outlined" style={{ color: '#94a3b8', marginLeft: '1rem' }}>search</span>
               <input 
                 type="text" 
                 placeholder="Describe the kind of team or room you're looking for..." 
                 className="omr-search-input"
               />
               <button className="omr-ai-btn">
                 <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>auto_awesome</span> Find with AI
               </button>
             </div>
          </div>

          {/* Filters & Actions */}
          <div className="omr-filters">
            <div className="omr-filter-scroll no-scrollbar">
              <button className="omr-filter-btn active">All Roles</button>
              <button className="omr-filter-btn inactive">Frontend</button>
              <button className="omr-filter-btn inactive">Backend</button>
              <button className="omr-filter-btn inactive">UI/UX Design</button>
              <button className="omr-filter-btn inactive">AI Engineer</button>
              <button className="omr-filter-btn inactive">Product Manager</button>
            </div>
            <button className="omr-create-room-btn">
              <span className="material-symbols-outlined">add_circle</span> Create Room
            </button>
          </div>

          {/* Room List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Room 1 */}
            <div className="omr-room-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, minWidth: 0 }}>
                <div className="omr-room-icon-box blue">
                  <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>hub</span>
                </div>
                <div className="omr-room-content">
                  <h4 className="omr-room-title">Looking for Backend Devs for Social App</h4>
                  <div className="omr-tags">
                    <span className="omr-tag">Backend</span>
                    <span className="omr-tag">FastAPI</span>
                    <span className="omr-tag">PostgreSQL</span>
                  </div>
                </div>
              </div>
              <div className="omr-room-actions">
                <div className="omr-avatars">
                  <div className="omr-avatar" style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBfE5vUKtzCFtsC7oQmEkGqW_uOKQ3BqWGfe_K7wavtR-oEDO9rqBfDJ5tbF4x20vaERy4-1vMJ7X-GbFfKXwFOcG9K2U02ngz9PCbrmjsZvFiZL8GPbqKyBVw7kgaBw1nL9h6G1OLyfQ6NlTc8aSl1cmt3c81CMEnbdSy1RxdI6wHHO0AcXQdGhEJLr-ZfX74c9jTGLKDNW_M7HAKgWY3tPbVlE-U41t6sR5hgA9_33-d9Uv0PgV5ScAoL3QPtLDxJzAwlMYoKhM0")` }}></div>
                  <div className="omr-avatar" style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBglYmdFKz-CT_MHHpEoDt0MsPxeqaUBueBnoLmpFKDSt9oK73Zqu3Xc-CFhCl8VM-SySXPvIn5ggV8JjNw82QnSnDUjAbO4zCSYvuRtD4ba5_t394dWy4KbupF0DKO4sg3DfafDQAUhjgAZzHl7GxaFoC4BOt5uku0XoGOKKX0kxDfEU9e8byrq9hMD7ltjHugnWEqqHD9oNA4JYQ10GVBk_VY8u9eXEK6rP9gECEw_OBV9MZFActl1VVtkPdFyDv7rOnGOqDhRXQ")` }}></div>
                   <div className="omr-avatar-more">+1</div>
                </div>
                <button className="omr-join-btn">Request to Join</button>
              </div>
            </div>

            {/* Room 2 */}
            <div className="omr-room-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, minWidth: 0 }}>
                <div className="omr-room-icon-box violet">
                  <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>brush</span>
                </div>
                <div className="omr-room-content">
                  <h4 className="omr-room-title">AI Engineer & Designer Needed for HealthTech</h4>
                  <div className="omr-tags">
                    <span className="omr-tag">AI Engineer</span>
                    <span className="omr-tag">UI/UX Design</span>
                  </div>
                </div>
              </div>
              <div className="omr-room-actions">
                <div className="omr-avatars">
                  <div className="omr-avatar" style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAwi2bPE1U55tlZMUGpuLPWo39dq6jDPh_2WKZ0gJxeSeNPsMJBhnm6ZrV5Y4LMeS0tEv9_l8gq7H3fty3sW19IeiZ4l6ab01Gwq0TsBe49m5r7c2j7vd2uPPZU3h4PtLRFptsB2dqOdVHXdhi8LAjyg8OV-3OT1UCkHBrSARkw3ThlxoyAnODnaAtiszeigPzDiIvlKdHN3u-MU8sTuGtbRPb2g6rWy4YIX5NBjEMpNwXm5iqlLsiFrgA2IoBw93hK2olnQE6TZ3Q")` }}></div>
                   <div className="omr-avatar-more">+4</div>
                </div>
                <button className="omr-join-btn">Request to Join</button>
              </div>
            </div>

            {/* Room 3 */}
            <div className="omr-room-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, minWidth: 0 }}>
                <div className="omr-room-icon-box green">
                  <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>eco</span>
                </div>
                <div className="omr-room-content">
                  <h4 className="omr-room-title">Sustainable Logistics AI - Looking for PM</h4>
                  <div className="omr-tags">
                    <span className="omr-tag">Product Manager</span>
                  </div>
                </div>
              </div>
              <div className="omr-room-actions">
                <div className="omr-avatars">
                   <div className="omr-avatar" style={{ backgroundColor: '#94a3b8' }}></div>
                </div>
                <button className="omr-join-btn">Request to Join</button>
              </div>
            </div>

          </div>
        </div>

        {/* Sidebar */}
        <div className="omr-sidebar">
          <div className="omr-stats-card">
            <div className="omr-stats-header">
              <h4 className="omr-stats-title">Roles by Activity</h4>
              <span className="material-symbols-outlined" style={{ color: '#94a3b8' }}>query_stats</span>
            </div>
            
            <div className="omr-stats-grid">
              <a href="#" className="omr-stat-chip">
                <span className="omr-stat-label">Frontend</span>
                <span className="omr-stat-val">14</span>
              </a>
              <a href="#" className="omr-stat-chip">
                <span className="omr-stat-label">Backend</span>
                <span className="omr-stat-val">28</span>
              </a>
              <a href="#" className="omr-stat-chip">
                <span className="omr-stat-label">AI Engineer</span>
                <span className="omr-stat-val">42</span>
              </a>
              <a href="#" className="omr-stat-chip">
                <span className="omr-stat-label">UI/UX Design</span>
                <span className="omr-stat-val">19</span>
              </a>
              <a href="#" className="omr-stat-chip">
                <span className="omr-stat-label">Product Manager</span>
                <span className="omr-stat-val">12</span>
              </a>
               <a href="#" className="omr-stat-chip">
                <span className="omr-stat-label">Web3</span>
                <span className="omr-stat-val">7</span>
              </a>
               <a href="#" className="omr-stat-chip">
                <span className="omr-stat-label">Data Science</span>
                <span className="omr-stat-val">15</span>
              </a>
               <a href="#" className="omr-stat-chip">
                <span className="omr-stat-label">Mobile Dev</span>
                <span className="omr-stat-val">11</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
