import React, { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { subDays, isSameDay, parseISO } from 'date-fns';
import { getNow, formatLocal } from '../utils/date';

const CustomTooltip = ({ active, payload, goal }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-panel" style={{ padding: '12px 16px', borderRadius: '16px', border: '1px solid var(--border-glass-light)', boxShadow: 'var(--shadow-glass)' }}>
                <p className="text-subheadline text-muted mb-1" style={{ fontSize: '13px', fontWeight: 500 }}>{payload[0].payload.date}</p>
                <p className="text-title-3" style={{ color: 'var(--accent-protein)', margin: 0 }}>
                    {payload[0].value}g <span className="text-subheadline text-muted" style={{ fontSize: '14px' }}>/ {goal}g</span>
                </p>
            </div>
        );
    }
    return null;
};

export function ChartsView({ entries, goal }) {
    const [days, setDays] = useState(7);

    const chartData = useMemo(() => {
        const data = [];
        const today = getNow();

        // Generate last N days data points
        for (let i = days - 1; i >= 0; i--) {
            const targetDate = subDays(today, i);
            const targetDateStr = formatLocal(targetDate, 'yyyy-MM-dd');
            const dayEntries = entries.filter(entry => entry.date === targetDateStr);
            const total = dayEntries.reduce((sum, entry) => sum + entry.amount, 0);

            data.push({
                name: formatLocal(targetDate, 'EEE'), // Mon, Tue, Wed
                date: formatLocal(targetDate, 'MMM d'), // Jan 12
                total: total
            });
        }
        return data;
    }, [entries, days]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <header className="p-4" style={{ paddingTop: 'env(safe-area-inset-top, 20px)' }}>
                <h1 className="text-title-1">Trends</h1>
            </header>

            <div className="flex-center gap-2 px-4">
                {/* Simple segmented control */}
                <div style={{ display: 'flex', background: 'var(--bg-surface-elevated)', borderRadius: '12px', padding: '4px', width: '100%' }}>
                    <button
                        onClick={() => setDays(7)}
                        style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', background: days === 7 ? 'linear-gradient(90deg, #ff4b4b, #ff9500)' : 'transparent', color: days === 7 ? 'white' : 'var(--text-secondary)', fontWeight: 600, boxShadow: days === 7 ? 'var(--shadow-sm)' : 'none', transition: 'all 0.2s', cursor: 'pointer' }}
                    >
                        7 Days
                    </button>
                    <button
                        onClick={() => setDays(30)}
                        style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', background: days === 30 ? 'linear-gradient(90deg, #ff4b4b, #ff9500)' : 'transparent', color: days === 30 ? 'white' : 'var(--text-secondary)', fontWeight: 600, boxShadow: days === 30 ? 'var(--shadow-sm)' : 'none', transition: 'all 0.2s', cursor: 'pointer' }}
                    >
                        30 Days
                    </button>
                </div>
            </div>

            <div className="card mx-4" style={{ height: 'max(300px, 40vh)', padding: '20px 10px 20px 0' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#ff4b4b" />
                                <stop offset="100%" stopColor="#9b6cff" />
                            </linearGradient>
                            <linearGradient id="colorProtein" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#9b6cff" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#ff4b4b" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} stroke="none" tickLine={false} axisLine={false} dy={10} />
                        <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} stroke="none" tickLine={false} axisLine={false} domain={[0, 'auto']} dx={-10} />
                        <Tooltip content={<CustomTooltip goal={goal} />} cursor={{ stroke: 'var(--separator)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        <ReferenceLine y={goal} stroke="var(--accent-green)" strokeDasharray="4 4" strokeWidth={2} opacity={0.6} />
                        <Area
                            type="monotone"
                            dataKey="total"
                            stroke="url(#strokeGradient)"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorProtein)"
                            activeDot={{ r: 6, fill: '#ff4b4b', stroke: 'var(--bg-surface)', strokeWidth: 4 }}
                            style={{ filter: 'drop-shadow(0px 12px 16px rgba(255, 75, 75, 0.4))' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="px-4">
                <p className="text-subheadline text-muted">
                    Your daily goal is {goal}g. The <span style={{ color: 'var(--accent-green)' }}>green dashed line</span> represents your target.
                </p>
            </div>
        </div>
    );
}
