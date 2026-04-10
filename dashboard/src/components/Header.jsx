import React from 'react';

const Header = ({ activeSection, setActiveSection }) => {
  const navItems = [
    { id: 'intelligence', label: 'Intelligence' },
    { id: 'surveillance', label: 'Surveillance' },
    { id: 'simulation', label: 'Simulation' },
    { id: 'analysis', label: 'Analysis' },
    { id: 'dossier', label: 'Dossier' }
  ];

  return (
    <header className="header-magazine">
      <div className="header-container">
        <div 
          className="logo serif" 
          onClick={() => setActiveSection('latest')}
          style={{ cursor: 'pointer' }}
        >
          E
        </div>
        
        <nav className="nav-links">
          {navItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`nav-button ${activeSection === item.id ? 'active' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="header-widgets">
          <div className="search-minimal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <div className="status-widget">
            <span>☀️ 16°</span>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .header-magazine {
          padding: 30px 40px;
          border-bottom: 1px solid rgba(29, 29, 31, 0.05);
          background-color: var(--bg-cream);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .header-container {
          max-width: var(--content-max-width);
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          font-size: 2.2rem;
          font-weight: 900;
          line-height: 1;
        }
        .nav-links {
          display: flex;
          gap: 32px;
        }
        .nav-button {
          background: none;
          border: none;
          padding: 0;
          color: var(--text-charcoal);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-weight: 600;
          opacity: 0.4;
          transition: all 0.2s ease;
          cursor: pointer;
          font-family: var(--font-sans);
          position: relative;
        }
        .nav-button:hover {
          opacity: 0.8;
        }
        .nav-button.active {
          opacity: 1;
        }
        .nav-button.active::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: var(--text-charcoal);
        }
        .header-widgets {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .search-minimal {
          opacity: 0.5;
          cursor: pointer;
        }
        .status-widget {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-muted);
        }
      `}</style>
    </header>
  );
};

export default Header;
