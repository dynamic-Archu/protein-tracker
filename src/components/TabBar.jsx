import React from 'react';
import { Target, BarChart2, Calendar, List } from 'lucide-react';
import { motion } from 'framer-motion';

export function TabBar({ activeTab, onTabChange }) {
    const tabs = [
        { id: 'today', icon: Target, label: 'Today' },
        { id: 'charts', icon: BarChart2, label: 'Trends' },
        { id: 'history', icon: List, label: 'History' },
        { id: 'calendar', icon: Calendar, label: 'Calendar' }
    ];

    return (
        <nav className="tab-bar-container">
            {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            background: 'none',
                            border: 'none',
                            color: isActive ? '#fff' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            position: 'relative',
                            width: '100%',
                            padding: '12px 0',
                            transition: 'color 0.2s ease, transform 0.2s ease',
                            zIndex: 1
                        }}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeTabIndicator"
                                style={{
                                    position: 'absolute',
                                    inset: '4px',
                                    borderRadius: '16px',
                                    background: 'var(--accent-protein)',
                                    zIndex: -1
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            />
                        )}
                        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} style={{ zIndex: 1 }} />
                        <span style={{ fontSize: '11px', fontWeight: isActive ? 600 : 500, zIndex: 1 }}>
                            {tab.label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
}
