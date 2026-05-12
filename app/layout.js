import './globals.css'

export const metadata = {
  title: 'Tribbot | Dashboard Analytics',
  description: 'Suivi des performances et présences du Grand Paris RP',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <nav style={{ 
          padding: '1.5rem 2rem', 
          borderBottom: '1px solid var(--border)', 
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              borderRadius: '8px'
            }}></div>
            <span style={{ fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>TRIBBOT</span>
          </div>
          <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>
            <a href="/" style={{ color: 'var(--text)' }}>Overview</a>
            <a href="#">Membres</a>
            <a href="#">Rapports</a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
