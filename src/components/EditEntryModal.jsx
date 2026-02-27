import { useState } from 'react';
import { X } from 'lucide-react';
import { playSound } from '../utils/audio';

export function EditEntryModal({ isOpen, onClose, entryToEdit, onSave }) {
    const [amount, setAmount] = useState('');
    const [label, setLabel] = useState('');
    const [prevEntry, setPrevEntry] = useState(null);

    // Derive state gracefully to avoid useEffect cascades
    if (entryToEdit !== prevEntry) {
        setPrevEntry(entryToEdit);
        if (entryToEdit) {
            setAmount(entryToEdit.amount.toString());
            setLabel(entryToEdit.label || '');
        } else {
            setAmount('');
            setLabel('');
        }
    }

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || isNaN(amount) || Number(amount) <= 0) return;

        playSound('success');
        onSave(entryToEdit.id, amount, label);
        onClose();
    };

    const handleClose = () => {
        playSound('pop');
        onClose();
    };

    return (
        <>
            <div className="modal-backdrop" onClick={handleClose} />

            <div className="modal-content animate-slide-up">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 className="title-2" style={{ margin: 0 }}>Edit Entry</h2>
                    <button
                        onClick={handleClose}
                        className="flex-center"
                        style={{
                            background: 'var(--bg-surface-elevated)', border: 'none',
                            width: '32px', height: '32px', borderRadius: '16px',
                            color: 'var(--text-secondary)', cursor: 'pointer'
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label className="text-subheadline" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                            Amount (grams)
                        </label>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0"
                                autoFocus
                                style={{
                                    flex: 1,
                                    background: 'var(--bg-surface-elevated)',
                                    border: '1px solid var(--separator)',
                                    padding: '16px 20px',
                                    borderRadius: '16px',
                                    fontSize: '32px',
                                    fontWeight: '700',
                                    color: 'var(--text-primary)',
                                    boxShadow: 'var(--shadow-sm)'
                                }}
                            />
                            <span className="title-3" style={{ color: 'var(--text-tertiary)' }}>g</span>
                        </div>
                    </div>

                    <div>
                        <label className="text-subheadline" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                            Food Label (Optional)
                        </label>
                        <input
                            type="text"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            placeholder="e.g. Chicken breast"
                            style={{
                                width: '100%',
                                background: 'var(--bg-surface-elevated)',
                                border: '1px solid var(--separator)',
                                padding: '16px 20px',
                                borderRadius: '16px',
                                fontSize: '17px',
                                color: 'var(--text-primary)'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ marginTop: '16px', padding: '16px', fontSize: '17px' }}
                        disabled={!amount || Number(amount) <= 0}
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </>
    );
}
