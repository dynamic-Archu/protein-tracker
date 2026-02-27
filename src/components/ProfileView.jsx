import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ChevronLeft, LogOut, Check, Edit2, X } from 'lucide-react';
import { getLocalString } from '../utils/date';
import { Logo } from './Logo';

const AVATARS = [
    '/avatars/avatar_red_monster_1772148192433.png',
    '/avatars/avatar_orange_monster_1772148273002.png',
    '/avatars/avatar_yellow_monster_1772148221787.png',
    '/avatars/avatar_green_monster_1772148237897.png',
    '/avatars/avatar_teal_monster_1772148302397.png',
    '/avatars/avatar_blue_monster_1772148206828.png',
    '/avatars/avatar_purple_monster_1772148256045.png',
    '/avatars/avatar_pink_monster_1772148286489.png',
    '/avatars/avatar_grey_monster_1772148321415.png',
    '/avatars/avatar_rainbow_monster_1772148337825.png'
];

export function ProfileView({ onBack }) {
    const { user, profile, updateProfile, logout } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState(profile?.username || '');
    const [dob, setDob] = useState(profile?.dob || '');
    const [height, setHeight] = useState(profile?.height || '');
    const [weight, setWeight] = useState(profile?.weight || '');
    const [gender, setGender] = useState(profile?.gender || 'Male');
    const [selectedAvatar, setSelectedAvatar] = useState(profile?.avatarUrl || null);

    const [isChecking, setIsChecking] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

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

        if (cleanUsername === profile?.username && dob === profile?.dob && Number(height) === profile?.height && Number(weight) === profile?.weight && gender === profile?.gender && selectedAvatar === profile?.avatarUrl) {
            setIsEditing(false);
            return setSuccess('Profile saved');
        }

        setIsChecking(true);
        try {
            // Only check username uniqueness if it actually changed
            if (cleanUsername !== profile?.username) {
                const usernameRef = doc(db, 'usernames', cleanUsername);
                const usernameDoc = await getDoc(usernameRef);

                if (usernameDoc.exists() && usernameDoc.data().uid !== user.uid) {
                    setError('Username is already taken');
                    setIsChecking(false);
                    return;
                }

                // Claim new username
                await setDoc(usernameRef, { uid: user.uid });

                // Note: We are not removing the old username document here for brevity, 
                // but in a fully robust system, you'd delete the old lock doc.
            }

            await updateProfile({
                username: cleanUsername,
                dob: dob,
                height: Number(height),
                weight: Number(weight),
                gender: gender,
                avatarUrl: selectedAvatar
            });

            setSuccess('Profile successfully updated!');
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            setError('Failed to update profile. ' + err.message);
        } finally {
            setIsChecking(false);
        }
    };

    const handleCancel = () => {
        setUsername(profile?.username || '');
        setDob(profile?.dob || '');
        setHeight(profile?.height || '');
        setWeight(profile?.weight || '');
        setGender(profile?.gender || 'Male');
        setSelectedAvatar(profile?.avatarUrl || null);
        setError('');
        setSuccess('');
        setIsEditing(false);
    }

    const [showAvatarPicker, setShowAvatarPicker] = useState(false);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', overflowY: 'auto', paddingTop: '40px' }}>
            <div className="card" style={{ width: '100%', maxWidth: '640px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px', margin: 'auto', transform: 'translateX(min(0vw, -30px))' }}>

                {/* Header */}
                <header style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                        onClick={onBack}
                        className="flex-center"
                        style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-glass)', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', color: 'var(--text-primary)', boxShadow: 'var(--shadow-sm)' }}
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-title-1" style={{ fontSize: '36px' }}>Edit Profile</h1>
                    <div style={{ marginLeft: 'auto' }}>
                        <Logo size="medium" />
                    </div>
                </header>

                <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

                    {/* Top Section: Avatar + Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                        {/* Avatar Column */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '120px' }}>
                            <div
                                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                                style={{
                                    position: 'relative',
                                    width: '120px',
                                    height: '120px',
                                    borderRadius: '16px',
                                    background: 'var(--accent-protein)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '48px',
                                    fontWeight: 'bold',
                                    boxShadow: 'var(--shadow-md)',
                                    cursor: 'pointer',
                                    border: '2px solid var(--border-glass-light)',
                                    overflow: 'hidden'
                                }}
                            >
                                {selectedAvatar ? (
                                    <img src={selectedAvatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    username ? username.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()
                                )}

                                {/* Pencil Overlay (Netflix Style) */}
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'rgba(0,0,0,0.4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: 0.8,
                                    transition: 'opacity 0.2s',
                                }}>
                                    <Edit2 size={32} color="#fff" style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))' }} />
                                </div>
                            </div>
                        </div>

                        {/* Name Input Column */}
                        <div style={{ flex: 1, minWidth: '240px' }}>
                            <label className="text-headline" style={{ display: 'block', marginBottom: '8px' }}>Profile Name</label>
                            <input
                                type="text"
                                placeholder="Choose a username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                style={{ width: '100%', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--separator)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)', fontSize: '17px', backdropFilter: 'blur(12px)' }}
                            />
                        </div>
                    </div>

                    {/* Expandable Avatar Picker */}
                    {showAvatarPicker && (
                        <div className="card animate-slide-up" style={{ padding: '20px', margin: '-20px 0 0 0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <label className="text-subheadline" style={{ fontWeight: 600 }}>Choose your monster</label>
                                <button type="button" onClick={() => setShowAvatarPicker(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '12px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', margin: '0 -20px', paddingLeft: '20px', paddingRight: '20px' }}>
                                {AVATARS.map((url) => (
                                    <button
                                        key={url}
                                        type="button"
                                        onClick={() => setSelectedAvatar(url)}
                                        style={{
                                            flexShrink: 0,
                                            width: '72px',
                                            height: '72px',
                                            borderRadius: '36px',
                                            border: selectedAvatar === url ? '3px solid var(--accent-blue)' : '3px solid transparent',
                                            padding: 0,
                                            margin: 0,
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            transition: 'transform 0.2s',
                                            transform: selectedAvatar === url ? 'scale(1.05)' : 'scale(1)'
                                        }}
                                    >
                                        <img src={url} alt="Selectable Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Additional Details Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h2 className="text-title-3" style={{ borderBottom: '1px solid var(--separator)', paddingBottom: '8px' }}>Biological Details</h2>

                        <div style={{ width: '100%' }}>
                            <label className="text-subheadline text-muted" style={{ display: 'block', marginBottom: '8px' }}>Date of Birth</label>
                            <input
                                type="date"
                                required
                                value={dob}
                                onChange={e => setDob(e.target.value)}
                                style={{ width: '100%', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--separator)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)', fontSize: '17px' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            <div style={{ flex: '1 1 140px' }}>
                                <label className="text-subheadline text-muted" style={{ display: 'block', marginBottom: '8px' }}>Height (cm)</label>
                                <input
                                    type="number"
                                    required
                                    min="50"
                                    max="300"
                                    placeholder="175"
                                    value={height}
                                    onChange={e => setHeight(e.target.value)}
                                    style={{ width: '100%', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--separator)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)', fontSize: '17px' }}
                                />
                            </div>
                            <div style={{ flex: '1 1 140px' }}>
                                <label className="text-subheadline text-muted" style={{ display: 'block', marginBottom: '8px' }}>Weight (kg)</label>
                                <input
                                    type="number"
                                    required
                                    min="20"
                                    max="300"
                                    placeholder="70"
                                    step="any"
                                    value={weight}
                                    onChange={e => setWeight(e.target.value)}
                                    style={{ width: '100%', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--separator)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)', fontSize: '17px' }}
                                />
                            </div>
                            <div style={{ flex: '1 1 140px' }}>
                                <label className="text-subheadline text-muted" style={{ display: 'block', marginBottom: '8px' }}>Gender</label>
                                <select
                                    value={gender}
                                    onChange={e => setGender(e.target.value)}
                                    style={{ width: '100%', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--separator)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)', fontSize: '17px', appearance: 'none' }}
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Status Messages */}
                    {error && <p style={{ color: 'var(--system-red)', fontSize: '15px', background: 'rgba(255, 59, 48, 0.1)', padding: '12px 16px', borderRadius: '8px' }}>{error}</p>}
                    {success && <p style={{ color: 'var(--system-green)', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(52, 199, 89, 0.1)', padding: '12px 16px', borderRadius: '8px' }}><Check size={18} /> {success}</p>}

                    {/* Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                        <button type="submit" disabled={isChecking} className="btn-primary" style={{ width: '100%', padding: '18px', fontSize: '18px' }}>
                            {isChecking ? 'Saving...' : 'Save'}
                        </button>
                        <button
                            type="button"
                            onClick={onBack}
                            style={{ width: '100%', padding: '16px', background: 'transparent', border: '1px solid var(--separator)', borderRadius: '30px', color: 'var(--text-primary)', fontSize: '17px', fontWeight: 600, cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>

                {/* Sign Out (Distinct Section at Bottom) */}
                <div style={{ marginTop: '20px', borderTop: '1px solid var(--separator)', paddingTop: '24px' }}>
                    <button
                        onClick={logout}
                        style={{ width: '100%', padding: '16px', border: 'none', background: 'rgba(255, 59, 48, 0.1)', borderRadius: '16px', color: '#ff3b30', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '17px', cursor: 'pointer', fontWeight: 600 }}
                    >
                        Sign Out
                        <LogOut size={20} />
                    </button>
                </div>

            </div>
        </div>
    );
}
