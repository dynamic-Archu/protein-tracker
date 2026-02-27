import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function AuthView() {
    const { loginWithGoogle, sendEmailLink } = useAuth();
    const [email, setEmail] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [error, setError] = useState('');

    const handleGoogleLogin = async () => {
        try {
            setError('');
            await loginWithGoogle();
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        try {
            setError('');
            await sendEmailLink(email);
            setEmailSent(true);
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '24px', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-base)' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'center' }}>

                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '24px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--separator)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: 'var(--shadow-md)'
                    }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent-protein)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>
                    </div>
                    <h1 className="text-title-1">Protein Tracker</h1>
                    <p className="text-subheadline text-muted mt-2">Sign in to sync your progress</p>
                </div>

                {error && (
                    <div style={{ padding: '12px', background: 'rgba(255,59,48,0.1)', color: 'var(--system-red)', borderRadius: '12px', fontSize: '13px', width: '100%', textAlign: 'center' }}>
                        {error}
                        {error.includes('API key') && (
                            <div style={{ marginTop: '8px', fontWeight: 'bold' }}>
                                Awaiting real Firebase Configuration from user to function.
                            </div>
                        )}
                    </div>
                )}

                <button
                    onClick={handleGoogleLogin}
                    className="flex-center"
                    style={{
                        width: '100%', background: 'var(--bg-surface-elevated)', border: '1px solid var(--separator)', padding: '16px', borderRadius: '16px', cursor: 'pointer', fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)', gap: '12px', boxShadow: 'var(--shadow-sm)'
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></svg>
                    Continue with Google
                </button>

                <div style={{ width: '100%', height: '1px', background: 'var(--separator)', position: 'relative' }}>
                    <span className="text-footnote text-muted" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--bg-surface)', padding: '0 12px' }}>OR</span>
                </div>

                {!emailSent ? (
                    <form onSubmit={handleEmailAuth} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <input
                            type="email"
                            placeholder="Email address"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--separator)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)', fontSize: '17px' }}
                        />
                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px' }}>
                            Send OTP Link
                        </button>
                    </form>
                ) : (
                    <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(52, 199, 89, 0.1)', color: 'var(--system-green)', borderRadius: '12px' }}>
                        <p className="text-subheadline" style={{ fontWeight: '600' }}>Verification link sent!</p>
                        <p className="text-footnote mt-1">Check your inbox for <b>{email}</b> to complete sign in.</p>
                        <button onClick={() => setEmailSent(false)} style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', marginTop: '12px', cursor: 'pointer', fontSize: '13px' }}>Try another email</button>
                    </div>
                )}
            </div>
        </div>
    );
}
