import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export function OnboardingView() {
    const { user, updateProfile } = useAuth();
    const [username, setUsername] = useState('');
    const [dob, setDob] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [gender, setGender] = useState('Male'); // Default

    const [isChecking, setIsChecking] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || username.trim() === '') {
            return setError('Username cannot be empty');
        }

        if (!dob) {
            return setError('Date of Birth is required');
        }

        if (!height || Number(height) <= 0) {
            return setError('Please enter a valid height in cm');
        }

        if (!weight || Number(weight) <= 0) {
            return setError('Please enter a valid weight in kg');
        }

        const cleanUsername = username.trim().toLowerCase();
        setIsChecking(true);

        try {
            // Check global usernames collection
            const usernameRef = doc(db, 'usernames', cleanUsername);
            const usernameDoc = await getDoc(usernameRef);

            if (usernameDoc.exists() && usernameDoc.data().uid !== user.uid) {
                setError('Username is already taken. Please choose another.');
                setIsChecking(false);
                return;
            }

            // Claim username and update profile
            await setDoc(usernameRef, { uid: user.uid });
            await updateProfile({
                username: cleanUsername,
                dob: dob,
                height: Number(height),
                weight: Number(weight),
                gender: gender
            });

        } catch (err) {
            console.error(err);
            setError('Failed to setup profile. ' + err.message);
            setIsChecking(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '24px', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-base)' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'center' }}>

                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '40px', background: 'var(--accent-protein)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', margin: '0 auto 16px', boxShadow: 'var(--shadow-md)'
                    }}>
                        👋
                    </div>
                    <h1 className="text-title-1">Welcome!</h1>
                    <p className="text-subheadline text-muted mt-2">Let's set up your profile to get started.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    <div>
                        <label className="text-footnote text-muted" style={{ display: 'block', marginBottom: '8px', marginLeft: '4px' }}>Unique Username</label>
                        <input
                            type="text"
                            placeholder="Choose a username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="input-field"
                            style={{ width: '100%', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--separator)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)', fontSize: '17px' }}
                        />
                    </div>

                    <div>
                        <label className="text-footnote text-muted" style={{ display: 'block', marginBottom: '8px', marginLeft: '4px' }}>Date of Birth</label>
                        <input
                            type="date"
                            required
                            value={dob}
                            onChange={e => setDob(e.target.value)}
                            className="input-field"
                            style={{ width: '100%', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--separator)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)', fontSize: '17px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                            <label className="text-footnote text-muted" style={{ display: 'block', marginBottom: '8px', marginLeft: '4px' }}>Height (cm)</label>
                            <input
                                type="number"
                                required
                                min="50"
                                max="300"
                                placeholder="175"
                                value={height}
                                onChange={e => setHeight(e.target.value)}
                                className="input-field"
                                style={{ width: '100%', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--separator)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)', fontSize: '17px' }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label className="text-footnote text-muted" style={{ display: 'block', marginBottom: '8px', marginLeft: '4px' }}>Weight (kg)</label>
                            <input
                                type="number"
                                required
                                min="20"
                                max="300"
                                placeholder="70"
                                step="any"
                                value={weight}
                                onChange={e => setWeight(e.target.value)}
                                className="input-field"
                                style={{ width: '100%', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--separator)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)', fontSize: '17px' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-footnote text-muted" style={{ display: 'block', marginBottom: '8px', marginLeft: '4px' }}>Biological Sex (for BMR Math)</label>
                        <select
                            value={gender}
                            onChange={e => setGender(e.target.value)}
                            style={{ width: '100%', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--separator)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)', fontSize: '17px', appearance: 'none' }}
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    {error && (
                        <div style={{ padding: '12px', background: 'rgba(255,59,48,0.1)', color: 'var(--system-red)', borderRadius: '12px', fontSize: '13px', width: '100%', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" disabled={isChecking} className="btn-primary" style={{ width: '100%', padding: '16px', marginTop: '8px' }}>
                        {isChecking ? 'Saving...' : 'Complete Setup'}
                    </button>
                </form>

            </div>
        </div>
    );
}
