import { db } from '../lib/firebase';
import { Users, Ticket, CheckCircle, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getStats() {
  if (!db) return { opened: 0, closed: 0, byMonth: {} };
  const doc = await db.collection('stats').doc('global').get();
  return doc.exists ? doc.data() : { opened: 0, closed: 0, byMonth: {} };
}

async function getRecentHistory() {
  if (!db) return [];
  // On récupère les 5 derniers relevés de présence
  const snapshot = await db.collection('presence_history').limit(5).get();
  const history = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    const [date, type] = doc.id.split('_');
    history.push({ id: doc.id, date, type, members: Object.keys(data).length });
  });
  return history.sort((a, b) => b.date.localeCompare(a.date));
}

export default async function Dashboard() {
  const stats = await getStats();
  const history = await getRecentHistory();
  
  const completionRate = stats.opened > 0 ? Math.round((stats.closed / stats.opened) * 100) : 0;

  return (
    <main className="container animate-in">
      <header style={{ marginBottom: '3rem' }}>
        <h1>Tribbot Analytics</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          Tableau de bord de suivi du Grand Paris RP
        </p>
      </header>

      <div className="dashboard-grid">
        {/* Card 1: Tickets Ouverts */}
        <div className="card">
          <div className="card-title">Tickets Ouverts (Global)</div>
          <div className="card-value">{stats.opened}</div>
          <div className="stat-trend">
            <Ticket size={16} className="trend-up" />
            <span>Volume total historique</span>
          </div>
        </div>

        {/* Card 2: Tickets Traités */}
        <div className="card">
          <div className="card-title">Tickets Traités</div>
          <div className="card-value">{stats.closed}</div>
          <div className="stat-trend">
            <CheckCircle size={16} className="trend-up" />
            <span>{completionRate}% de complétion</span>
          </div>
        </div>

        {/* Card 3: Présence Moyenne */}
        <div className="card">
          <div className="card-title">Activité Récente</div>
          <div className="card-value">{history[0]?.members || 0}</div>
          <div className="stat-trend">
            <Users size={16} style={{ color: 'var(--primary)' }} />
            <span>Membres au dernier relevé</span>
          </div>
        </div>
      </div>

      <section className="table-container animate-in" style={{ animationDelay: '0.2s' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.25rem' }}>Historique des Présences</h2>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Participants</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td style={{ fontWeight: 500 }}>{item.date}</td>
                <td>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '1rem', 
                    fontSize: '0.75rem',
                    background: item.type === 'prefecture' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    color: item.type === 'prefecture' ? '#60a5fa' : '#34d399',
                    textTransform: 'capitalize'
                  }}>
                    {item.type}
                  </span>
                </td>
                <td>{item.members} membres</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }} />
                    Enregistré
                  </div>
                </td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Aucune donnée d'historique disponible.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <footer style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        <p>© 2024 Tribbot Premium Dashboard • Propulsé par Vercel & Firebase</p>
      </footer>
    </main>
  );
}
