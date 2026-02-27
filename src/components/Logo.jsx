import React from 'react';

export function Logo({ size = 'medium', className = '', onClick }) {
    // Scales for responsiveness and placement
    const sizes = {
        small: { font: '20px', ringSize: 18, stroke: 3, gap: '2px' },
        medium: { font: '26px', ringSize: 22, stroke: 4, gap: '3px' },
        large: { font: '42px', ringSize: 36, stroke: 6, gap: '4px' }
    };

    const s = sizes[size] || sizes.medium;

    return (
        <div
            onClick={onClick}
            className={className}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                cursor: onClick ? 'pointer' : 'default',
                userSelect: 'none',
                color: 'var(--text-primary)',
            }}
        >
            <div style={{
                display: 'flex',
                alignItems: 'center',
                fontWeight: 800,
                fontSize: s.font,
                letterSpacing: '-1px',
            }}>
                <span>Pr</span>

                {/* The 'o' as an Activity Ring */}
                <svg
                    width={s.ringSize}
                    height={s.ringSize}
                    viewBox="0 0 36 36"
                    style={{ margin: `0 ${s.gap}`, overflow: 'visible' }}
                >
                    {/* Background Ring */}
                    <circle
                        cx="18" cy="18" r={18 - s.stroke}
                        fill="none"
                        stroke="var(--bg-surface-elevated)"
                        strokeWidth={s.stroke}
                    />
                    {/* Active Progress Ring */}
                    <circle
                        cx="18" cy="18" r={18 - s.stroke}
                        fill="none"
                        stroke="url(#logo-ring-grad)"
                        strokeWidth={s.stroke}
                        strokeDasharray="100"
                        strokeDashoffset="25"
                        strokeLinecap="round"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                    />
                    <defs>
                        <linearGradient id="logo-ring-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ff2d55" />
                            <stop offset="100%" stopColor="#ff9500" />
                        </linearGradient>
                    </defs>
                </svg>

                <span style={{ fontWeight: 300 }}>tein</span>
            </div>
        </div>
    );
}
