import './globals.css'

export const metadata = {
  title: 'Tribbot | Dashboard Analytics',
  description: 'Suivi des performances et présences du Grand Paris RP',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              background: 'linear-gradient(135deg, var(--primary) 0%, #a855f7 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}>
              <span style={{ fontWeight: 900, color: '#fff', fontSize: '1.2rem' }}>T</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.3rem', letterSpacing: '-0.02em' }}>TRIBBOT</span>
          </div>
          
          <div className="nav-links">
            <a href="/" className="nav-link active">Overview</a>
            <a href="#" className="nav-link">Membres</a>
            <a href="#" className="nav-link">Rapports</a>
          </div>

          <div style={{ 
            background: 'var(--glass)', 
            padding: '0.5rem 1rem', 
            borderRadius: '2rem', 
            border: '1px solid var(--border)',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--accent)'
          }}>
            SYSTEM ONLINE
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
