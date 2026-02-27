import React, { useEffect, useState } from 'react';

export function ProgressRing({ progress, goal, size = 200, strokeWidth = 18 }) {
    const [animatedProgress, setAnimatedProgress] = useState(0);

    // Animate on mount or progress change
    useEffect(() => {
        const timeout = setTimeout(() => {
            setAnimatedProgress(progress);
        }, 100);
        return () => clearTimeout(timeout);
    }, [progress]);

    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    // Calculate percentage (allow over 100%)
    const percentage = goal > 0 ? (animatedProgress / goal) : 0;

    // Cap visual progress at 100% for the ring fill, unless we want it to overflow like Apple Watch where it overlays itself.
    // For simplicity, we just fill up to 100%. If over 100, we could change color or just stay full.
    const visualPercentage = Math.min(percentage, 1);
    const strokeDashoffset = circumference - visualPercentage * circumference;

    const isComplete = percentage >= 1;

    return (
        <div style={{ position: 'relative', width: size, height: size }}>
            <svg
                width={size}
                height={size}
                style={{ transform: 'rotate(-90deg)', filter: 'drop-shadow(0 4px 12px rgba(255,45,85,0.3))' }}
            >
                <defs>
                    <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ff4b4b" />
                        <stop offset="100%" stopColor="#9b6cff" />
                    </linearGradient>
                </defs>
                {/* Background Ring */}
                <circle
                    stroke="var(--bg-surface-elevated)"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                {/* Progress Ring */}
                <circle
                    stroke="url(#ringGradient)"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{
                        strokeDashoffset,
                        transition: 'stroke-dashoffset 1s cubic-bezier(0.25, 1, 0.5, 1)'
                    }}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            {/* Center Text */}
            <div
                className="flex-center"
                style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    flexDirection: 'column'
                }}
            >
                <span className="text-title-1" style={{ color: isComplete ? '#ff4b4b' : 'var(--text-primary)', transition: 'color 0.3s ease' }}>
                    {animatedProgress}
                    <span className="text-body" style={{ color: 'var(--text-secondary)' }}>g</span>
                </span>
                <span className="text-subheadline text-muted">of {goal}g</span>
            </div>
        </div>
    );
}
