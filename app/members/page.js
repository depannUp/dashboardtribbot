import { db } from '../../lib/firebase';
import { Users, Star, Trophy, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getLeaderboard() {
    if (!db) return [];
    
    const snapshot = await db.collection('presence_history').get();
    const membersMap = {};

    snapshot.forEach(doc => {
        const data = doc.data();
        Object.keys(data).forEach(userId => {
            if (userId === 'type') return; // skip metadata
            
            const userData = data[userId];
            if (!membersMap[userId]) {
                membersMap[userId] = {
                    id: userId,
                    name: userData.name || 'Inconnu',
                    role: userData.role || 'Citoyen',
                    presenceCount: 0
                };
            }
            membersMap[userId].presenceCount++;
        });
    });

    return Object.values(membersMap).sort((a, b) => b.presenceCount - a.presenceCount);
}

export default async function MembersPage() {
    const members = await getLeaderboard();

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
                    <h1>Membres & Fidélité</h1>
                    <p className="subtitle">Classement basé sur l'assiduité aux services</p>
                </div>
                <div style={{ 
                    background: 'var(--surface)', 
                    padding: '0.75rem 1.5rem', 
                    borderRadius: '1rem',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    <Users size={20} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontWeight: 700 }}>{members.length}</span> Membres répertoriés
                </div>
            </div>

            <div className="table-wrapper" style={{ marginTop: '2rem' }}>
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: '80px' }}>Rang</th>
                            <th>Membre</th>
                            <th>Dernier Rôle connu</th>
                            <th>Présences Totales</th>
                            <th style={{ textAlign: 'right' }}>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member, index) => (
                            <tr key={member.id}>
                                <td>
                                    {index === 0 ? <Trophy size={20} style={{ color: '#fbbf24' }} /> : 
                                     index === 1 ? <Trophy size={20} style={{ color: '#94a3b8' }} /> :
                                     index === 2 ? <Trophy size={20} style={{ color: '#92400e' }} /> : 
                                     <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>#{index + 1}</span>}
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ 
                                            width: '32px', 
                                            height: '32px', 
                                            borderRadius: '50%', 
                                            background: 'var(--glass)',
                                            border: '1px solid var(--border)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.8rem',
                                            fontWeight: 700
                                        }}>
                                            {member.name.charAt(0)}
                                        </div>
                                        <span style={{ fontWeight: 700 }}>{member.name}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className="tag tag-blue" style={{ fontSize: '0.7rem' }}>
                                        {member.role}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Star size={14} style={{ color: '#fbbf24' }} />
                                        {member.presenceCount} services
                                    </div>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <div style={{ 
                                        fontWeight: 800, 
                                        color: index < 3 ? 'var(--text)' : 'var(--text-muted)',
                                        fontSize: '1.1rem'
                                    }}>
                                        {member.presenceCount * 10} pts
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {members.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
                                    Aucun membre n'a encore été enregistré dans l'historique.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
