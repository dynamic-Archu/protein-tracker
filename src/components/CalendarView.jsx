import React, { useState, useMemo } from 'react';
import {
    format, addMonths, subMonths, startOfMonth, endOfMonth,
    eachDayOfInterval, isSameMonth, isSameDay, isToday, parseISO,
    startOfWeek, endOfWeek
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getNow, formatLocal } from '../utils/date';

export function CalendarView({ entries, goal, onDateSelect }) {
    const [currentMonth, setCurrentMonth] = useState(getNow());

    const daysInMonth = useMemo(() => {
        const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 }); // Monday start
        const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
        return eachDayOfInterval({ start, end });
    }, [currentMonth]);

    const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    // Small helper to get daily total for a given date
    const getDailyTotal = (date) => {
        const dateStr = formatLocal(date, 'yyyy-MM-dd');
        const dayEntries = entries.filter(entry => entry.date === dateStr);
        return dayEntries.reduce((sum, entry) => sum + entry.amount, 0);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <header className="p-4" style={{ paddingTop: 'env(safe-area-inset-top, 20px)' }}>
                <h1 className="text-title-1">Calendar</h1>
            </header>

            <div className="card" style={{ width: '100%', maxWidth: 'min(900px, 80vh)', margin: '0 auto' }}>
                <div className="flex-between mb-4">
                    <h2 className="text-title-3">{formatLocal(currentMonth, 'MMMM yyyy')}</h2>
                    <div className="flex-center gap-2">
                        <button
                            onClick={handlePrevMonth}
                            className="flex-center"
                            style={{ background: 'var(--bg-surface-elevated)', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', color: 'var(--text-primary)' }}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={handleNextMonth}
                            className="flex-center"
                            style={{ background: 'var(--bg-surface-elevated)', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', color: 'var(--text-primary)' }}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Days of week header */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '8px' }}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                        <div key={day} className="text-footnote text-muted" style={{ fontWeight: 600 }}>{day}</div>
                    ))}
                </div>

                {/* Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                    {daysInMonth.map(day => {
                        const total = getDailyTotal(day);
                        const percentage = Math.min((total / goal), 1);
                        const isTarget = isSameMonth(day, currentMonth);
                        const today = isToday(day);

                        return (
                            <div
                                key={day.toISOString()}
                                onClick={() => onDateSelect?.(day)}
                                style={{
                                    aspectRatio: '1',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    opacity: isTarget ? 1 : 0.3,
                                    cursor: onDateSelect ? 'pointer' : 'default',
                                    borderRadius: '16px',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => { if (onDateSelect) e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)'; }}
                                onMouseLeave={(e) => { if (onDateSelect) e.currentTarget.style.backgroundColor = 'transparent'; }}
                            >
                                {/* Visual Ring Indicator (Apple Style) */}
                                <svg width="32" height="32" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
                                    <circle cx="16" cy="16" r="14" stroke="var(--separator)" strokeWidth="3" fill="none" />
                                    {total > 0 && (
                                        <circle
                                            cx="16"
                                            cy="16"
                                            r="14"
                                            stroke="var(--accent-protein)"
                                            strokeWidth="3"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeDasharray="88"
                                            strokeDashoffset={88 - (88 * percentage)}
                                        />
                                    )}
                                </svg>
                                <span style={{
                                    zIndex: 1,
                                    fontSize: '13px',
                                    fontWeight: today ? 700 : 500,
                                    color: today ? 'var(--accent-protein)' : 'var(--text-primary)'
                                }}>
                                    {formatLocal(day, 'd')}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="px-4">
                <p className="text-subheadline text-muted">A full ring indicates you have reached your {goal}g daily goal.</p>
            </div>
        </div>
    );
}
