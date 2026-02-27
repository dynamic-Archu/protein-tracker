import React from 'react';
import { motion } from 'framer-motion';

export function EmptyState({ icon: Icon, title, message, actionLabel, onAction }) {
    return (
        <motion.div
            className="flex-center"
            style={{ flexDirection: 'column', padding: '64px 24px', textAlign: 'center' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-glass)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                boxShadow: 'var(--shadow-glass)'
            }}>
                <Icon size={32} color="var(--text-tertiary)" opacity={0.5} />
            </div>

            <h3 className="text-title-2" style={{ marginBottom: '8px' }}>
                {title}
            </h3>

            <p className="text-body text-muted" style={{ maxWidth: '280px', marginBottom: '32px' }}>
                {message}
            </p>

            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="btn-primary"
                    style={{ padding: '12px 32px' }}
                >
                    {actionLabel}
                </button>
            )}
        </motion.div>
    );
}
