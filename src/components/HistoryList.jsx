import React from 'react';
import { Trash2, Edit2 } from 'lucide-react';
import { parseISO } from 'date-fns';
import { formatLocal } from '../utils/date';

export function HistoryList({ entries, onDelete, onEdit }) {
    if (entries.length === 0) {
        return (
            <div className="flex-center" style={{ padding: '40px 20px', flexDirection: 'column', textAlign: 'center' }}>
                <p className="text-headline text-muted">No entries yet.</p>
                <p className="text-subheadline text-muted mt-4">Log your first meal to see it here.</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {entries.map(entry => (
                <div
                    key={entry.id}
                    className="card flex-between"
                    style={{ padding: '16px 20px' }}
                >
                    <div>
                        <h3 className="text-headline">{entry.label}</h3>
                        <p className="text-subheadline text-muted">
                            {formatLocal(entry.timestamp ? new Date(entry.timestamp) : parseISO(entry.date), 'h:mm a')}
                        </p>
                    </div>
                    <div className="flex-center gap-4">
                        <span className="text-title-3" style={{ color: 'var(--accent-protein)' }}>
                            +{entry.amount}g
                        </span>

                        <div style={{ display: 'flex', gap: '8px', marginLeft: '8px' }}>
                            <button
                                onClick={() => onEdit?.(entry)}
                                style={{
                                    background: 'transparent', border: 'none',
                                    color: 'var(--text-secondary)', cursor: 'pointer',
                                    opacity: 0.8, padding: '4px'
                                }}
                            >
                                <Edit2 size={20} />
                            </button>
                            <button
                                onClick={() => onDelete(entry.id)}
                                style={{
                                    background: 'transparent', border: 'none',
                                    color: 'var(--system-red)', cursor: 'pointer',
                                    opacity: 0.8, padding: '4px'
                                }}
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
