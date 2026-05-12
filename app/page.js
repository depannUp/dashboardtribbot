import { db } from '../lib/firebase';
import { Users, Ticket, CheckCircle, ArrowRight, Activity, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getStats() {
  if (!db) return { opened: 0, closed: 0, byMonth: {} };
  const doc = await db.collection('stats').doc('global').get();
  return doc.exists ? doc.data() : { opened: 0, closed: 0, byMonth: {} };
}

async function getRecentHistory() {
  if (!db) return [];
  const snapshot = await db.collection('presence_history').limit(10).get();
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
      <header>
        <h1>Tribbot Analytics</h1>
        <p className="subtitle">Performance & Engagement du Grand Paris RP</p>
      </header>

      <div className="dashboard-grid">
        {/* Total Tickets */}
        <div className="card">
          <div className="card-icon" style={{ color: 'var(--primary)' }}>
            <Ticket size={24} />
          </div>
          <div className="card-title">Volume de Tickets</div>
          <div className="card-value">{stats.opened}</div>
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontSize: '0.85rem' }}>
            <Activity size={14} />
            <span>Historique global actif</span>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="card">
          <div className="card-icon" style={{ color: 'var(--accent)' }}>
            <CheckCircle size={24} />
          </div>
          <div className="card-title">Taux de Résolution</div>
          <div className="card-value">{completionRate}%</div>
          <div style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <strong>{stats.closed}</strong> tickets fermés avec succès
          </div>
        </div>

        {/* Last Activity */}
        <div className="card">
          <div className="card-icon" style={{ color: '#a855f7' }}>
            <Users size={24} />
          </div>
          <div className="card-title">Dernière Présence</div>
          <div className="card-value">{history[0]?.members || 0}</div>
          <div style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Membres actifs le {history[0]?.date || '...'}
          </div>
        </div>
      </div>

      <section style={{ animationDelay: '0.2s' }} className="animate-in">
        <div className="section-header">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Activité Récente</h2>
          <button style={{ 
            background: 'none', 
            border: 'none', 
            color: var(--primary), 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 600
          }}>
            Voir tout <ArrowRight size={16} />
          </button>
        </div>
        
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={14} /> Date</div></th>
                <th>Type</th>
                <th>Participants</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600 }}>{item.date}</td>
                  <td>
                    <span className={item.type === 'prefecture' ? 'tag tag-blue' : 'tag tag-green'}>
                      {item.type.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Users size={14} style={{ color: 'var(--text-muted)' }} />
                      {item.members} membres
                    </div>
                  </td>
                  <td>
                    <div style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                      <div className="pulse" style={{ width: '8px', height: '8px', background: 'var(--accent)', borderRadius: '50%' }} />
                      Terminé
                    </div>
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    Aucune donnée synchronisée avec Firebase. Vérifiez vos variables d'environnement.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <footer style={{ marginTop: '6rem', padding: '2rem', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          TRIBBOT ANALYTICS v2.0 • SYSTÈME DE GESTION RP
        </p>
      </footer>
    </main>
  );
}
