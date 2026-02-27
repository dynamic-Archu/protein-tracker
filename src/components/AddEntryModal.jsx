import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';

export function AddEntryModal({ isOpen, onClose, onSave }) {
    const [amount, setAmount] = useState('');
    const [label, setLabel] = useState('');
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        let timer;
        if (isOpen) {
            timer = setTimeout(() => setAnimateIn(true), 10);
        } else {
            timer = setTimeout(() => setAnimateIn(false), 0);
        }
        return () => clearTimeout(timer);
    }, [isOpen]);

    if (!isOpen && !animateIn) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || isNaN(amount)) return;

        onSave(amount, label || 'Quick Add');
        setAmount('');
        setLabel('');
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            pointerEvents: isOpen ? 'auto' : 'none'
        }}>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(4px)',
                    opacity: animateIn ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                }}
            />

            {/* Sheet */}
            <div
                className="glass-panel"
                style={{
                    position: 'relative',
                    padding: '24px',
                    borderTopLeftRadius: '32px',
                    borderTopRightRadius: '32px',
                    transform: animateIn ? 'translateY(0)' : 'translateY(100%)',
                    transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease',
                    opacity: animateIn ? 1 : 0,
                    paddingBottom: 'max(24px, env(safe-area-inset-bottom))'
                }}
            >
                <div className="flex-between mb-4">
                    <h2 className="text-title-2">Log Protein</h2>
                    <button
                        onClick={onClose}
                        className="flex-center"
                        style={{
                            background: 'var(--separator)',
                            border: 'none',
                            borderRadius: '50%',
                            width: 30, height: 30,
                            cursor: 'pointer',
                            color: 'var(--text-primary)'
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label className="text-subheadline text-muted mb-4" style={{ display: 'block' }}>Amount (grams)</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="number"
                                className="apple-input"
                                style={{ fontSize: '34px', fontWeight: 'bold', padding: '16px' }}
                                placeholder="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                autoFocus
                            />
                            <span style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '22px', color: 'var(--text-tertiary)', pointerEvents: 'none' }}>g</span>
                        </div>
                    </div>

                    <div>
                        <label className="text-subheadline text-muted mb-4" style={{ display: 'block' }}>Food Label (Optional)</label>
                        <input
                            type="text"
                            className="apple-input"
                            placeholder="e.g. Chicken Breast, Shake"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                        />
                    </div>

                    <div style={{ height: '24px' }}></div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '18px', fontSize: '20px' }} disabled={!amount}>
                        <Plus size={24} /> Add Entry
                    </button>
                </form>
            </div>
        </div>
    );
}
