import React, { useState, useMemo } from 'react';
import { Trash2, Edit2, Search } from 'lucide-react';
import Fuse from 'fuse.js';
import { formatLocal } from '../utils/date';
import { parseISO } from 'date-fns';
import { EmptyState } from './EmptyState';

export function FullHistoryView({ entries, onDelete, onEdit }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [visibleCount, setVisibleCount] = useState(15);

    // Apply filters and search
    const processedEntries = useMemo(() => {
        let result = [...entries].sort((a, b) => b.timestamp - a.timestamp);

        if (startDate) {
            result = result.filter(e => e.date >= startDate);
        }

        if (endDate) {
            result = result.filter(e => e.date <= endDate);
        }

        if (searchQuery.trim()) {
            const fuse = new Fuse(result, {
                keys: ['label'],
                threshold: 0.4,
            });
            result = fuse.search(searchQuery).map(r => r.item);
        }

        return result;
    }, [entries, searchQuery, startDate, endDate]);

    const visibleEntries = processedEntries.slice(0, visibleCount);

    const grouped = visibleEntries.reduce((acc, entry) => {
        const logDate = entry.timestamp ? new Date(entry.timestamp) : parseISO(entry.date);
        const dateStr = formatLocal(logDate, 'MMMM d, yyyy');
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(entry);
        return acc;
    }, {});

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setVisibleCount(15); // Reset pagination on search
    };

    const handleDateChange = (setter) => (e) => {
        setter(e.target.value);
        setVisibleCount(15);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '100px' }}>
            <header className="p-4" style={{ paddingTop: 'env(safe-area-inset-top, 20px)' }}>
                <h1 className="text-title-1">History</h1>
            </header>

            <div className="px-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Search Bar */}
                <div className="glowing-wrap" style={{ position: 'relative' }}>
                    <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', zIndex: 10 }} />
                    <input
                        className="apple-input"
                        type="text"
                        placeholder="Search logs..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        style={{
                            paddingLeft: '48px',
                        }}
                    />
                </div>

                {/* Date Filters */}
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                        <label className="text-footnote text-muted mb-1" style={{ display: 'block', paddingLeft: '4px' }}>After Date</label>
                        <div className="glowing-wrap">
                            <input
                                className="apple-input"
                                type="date"
                                value={startDate}
                                onChange={handleDateChange(setStartDate)}
                            />
                        </div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label className="text-footnote text-muted mb-1" style={{ display: 'block', paddingLeft: '4px' }}>Before Date</label>
                        <div className="glowing-wrap">
                            <input
                                className="apple-input"
                                type="date"
                                value={endDate}
                                onChange={handleDateChange(setEndDate)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {Object.entries(grouped).map(([date, dayEntries]) => (
                    <div key={date}>
                        <h2 className="text-headline text-muted mb-2" style={{ textTransform: 'uppercase', fontSize: '13px', letterSpacing: '0.05em' }}>{date}</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {dayEntries.map(entry => {
                                const logDate = entry.timestamp ? new Date(entry.timestamp) : parseISO(entry.date);
                                return (
                                    <div key={entry.id} className="card flex-between" style={{ padding: '16px 20px', position: 'relative', overflow: 'hidden' }}>
                                        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, background: 'var(--theme-gradient)' }}></div>
                                        <div style={{ zIndex: 1 }}>
                                            <h3 className="text-headline">{entry.label}</h3>
                                            <p className="text-subheadline text-muted">
                                                {formatLocal(logDate, 'h:mm a')}
                                            </p>
                                        </div>
                                        <div className="flex-center gap-4" style={{ zIndex: 1 }}>
                                            <span className="text-title-3" style={{ color: '#ff4b4b' }}>
                                                +{entry.amount}g
                                            </span>
                                            <div style={{ display: 'flex', gap: '8px', marginLeft: '8px' }}>
                                                <button
                                                    onClick={() => onEdit?.(entry)}
                                                    style={{ background: 'transparent', border: 'none', color: '#ff4b4b', cursor: 'pointer', opacity: 0.8, padding: '4px' }}
                                                    aria-label="Edit entry"
                                                >
                                                    <Edit2 size={20} />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(entry.id)}
                                                    style={{ background: 'transparent', border: 'none', color: '#ff4b4b', cursor: 'pointer', opacity: 0.8, padding: '4px' }}
                                                    aria-label="Delete entry"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {visibleEntries.length === 0 && (
                    <EmptyState
                        icon={Search}
                        title="No Logs Found"
                        message="Try adjusting your date filters or search query to find past entries."
                    />
                )}

                {visibleCount < processedEntries.length && (
                    <button
                        onClick={() => setVisibleCount(v => v + 15)}
                        style={{
                            background: 'var(--bg-surface-elevated)',
                            border: '1px solid var(--separator)',
                            padding: '16px',
                            borderRadius: '16px',
                            width: '100%',
                            color: 'var(--accent-blue)',
                            fontSize: '17px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            marginTop: '8px'
                        }}
                    >
                        See More ({processedEntries.length - visibleCount} remaining)
                    </button>
                )}
            </div>
        </div>
    );
}
