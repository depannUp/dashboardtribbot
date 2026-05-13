import { db } from '../../lib/firebase';
import { BarChart3, TrendingUp, TrendingDown, FileText, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getStats() {
    if (!db) return { opened: 0, closed: 0, byMonth: {} };
    const doc = await db.collection('stats').doc('global').get();
    return doc.exists ? doc.data() : { opened: 0, closed: 0, byMonth: {} };
}

export default async function ReportsPage() {
    const stats = await getStats();
    const months = Object.keys(stats.byMonth || {}).sort((a, b) => {
        // Simple sort logic for month strings (might need improvement for real locale sorting)
        return b.localeCompare(a);
    });

    return (
        <main className="container animate-in">
            <header style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <a href="/" style={{ 
                    color: 'var(--text-muted)', 
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.9rem'
                }}>
                    <ArrowLeft size={16} /> Retour
                </a>
            </header>

            <div className="section-header">
                <div>
                    <h1>Rapports d'Activité</h1>
                    <p className="subtitle">Analyse mensuelle des tickets et de la charge de travail</p>
                </div>
            </div>

            <div className="dashboard-grid">
                {months.map(month => {
                    const monthData = stats.byMonth[month];
                    const rate = monthData.opened > 0 ? Math.round((monthData.closed / monthData.opened) * 100) : 0;
                    
                    return (
                        <div key={month} className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div className="card-title" style={{ color: 'var(--primary)', textTransform: 'capitalize' }}>{month}</div>
                                    <div className="card-value" style={{ fontSize: '1.75rem', marginTop: '0.5rem' }}>
                                        {monthData.closed} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>fermés</span>
                                    </div>
                                </div>
                                <div style={{ 
                                    padding: '0.5rem', 
                                    background: 'var(--glass)', 
                                    borderRadius: '10px',
                                    color: rate > 80 ? 'var(--accent)' : 'var(--primary)'
                                }}>
                                    <BarChart3 size={20} />
                                </div>
                            </div>

                            <div style={{ marginTop: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Progression mensuelle</span>
                                    <span style={{ fontWeight: 700 }}>{rate}%</span>
                                </div>
                                <div style={{ width: '100%', height: '6px', background: 'var(--glass)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ 
                                        width: `${rate}%`, 
                                        height: '100%', 
                                        background: 'linear-gradient(90deg, var(--primary), var(--accent))',
                                        borderRadius: '3px'
                                    }} />
                                </div>
                            </div>

                            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1, padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>OUVERTS</div>
                                    <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <TrendingUp size={14} style={{ color: 'var(--primary)' }} /> {monthData.opened}
                                    </div>
                                </div>
                                <div style={{ flex: 1, padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>CLOS</div>
                                    <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <TrendingDown size={14} style={{ color: 'var(--accent)' }} /> {monthData.closed}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {months.length === 0 && (
                    <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem' }}>
                        <FileText size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
                        <p style={{ color: 'var(--text-muted)' }}>Aucune donnée mensuelle disponible pour le moment.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
