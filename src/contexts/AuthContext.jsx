import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import {
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink,
    signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getNow } from '../utils/date';
import { differenceInYears } from 'date-fns';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Dynamic Goal Calculator Engine (Mifflin-St Jeor + Macro Adjustment)
    const calculateProteinGoal = (dob, heightCm, weightKg, genderStr) => {
        if (!dob || !heightCm || !weightKg) return 120; // safe fallback

        const age = differenceInYears(getNow(), new Date(dob));

        let sModifier = 5; // Default Male
        if (genderStr === 'Female') sModifier = -161;

        // BMR (Basal Metabolic Rate) Equation
        const bmr = (10 * Number(weightKg)) + (6.25 * Number(heightCm)) - (5 * age) + sModifier;

        // TDEE (Total Daily Energy Expenditure) - Assuming Moderate Activity Level multiplier (1.55)
        const tdee = bmr * 1.55;

        // 25% of TDEE calories allocated to Protein (4 calories per gram)
        let dailyProteinGrams = (tdee * 0.25) / 4;

        // Age Adjustment: Older adults (> 50) have higher needs to fight sarcopenia
        if (age >= 50) {
            dailyProteinGrams *= 1.2;
        }

        return Math.max(Math.round(dailyProteinGrams), 60); // Floor safety cap
    };

    // Watch Firebase Auth State
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                // Fetch custom profile from Firestore
                const docRef = doc(db, 'users', firebaseUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    let dbProfile = docSnap.data();

                    // Automatically recalculate the goal if it's their birthday year transition
                    if (dbProfile.dob && dbProfile.height && dbProfile.weight) {
                        const currentAge = differenceInYears(getNow(), new Date(dbProfile.dob));

                        // If there is no lastRecalculatedAge or they had a birthday
                        if (dbProfile.lastRecalculatedAge !== currentAge) {
                            const newGoal = calculateProteinGoal(dbProfile.dob, dbProfile.height, dbProfile.weight, dbProfile.gender);
                            dbProfile = {
                                ...dbProfile,
                                goal: newGoal,
                                lastRecalculatedAge: currentAge
                            };
                            await updateDoc(docRef, {
                                goal: newGoal,
                                lastRecalculatedAge: currentAge
                            });
                        }
                    }

                    setProfile(dbProfile);
                } else {
                    // Create base profile on first login
                    const baseProfile = {
                        email: firebaseUser.email,
                        username: null,
                        dob: null,
                        height: null,
                        weight: null,
                        gender: 'Male', // Default option
                        goal: 120, // Default goal fallback
                        lastRecalculatedAge: null,
                        createdAt: Date.now()
                    };
                    await setDoc(docRef, baseProfile);
                    setProfile(baseProfile);
                }
            } else {
                setUser(null);
                setProfile(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    };

    const sendEmailLink = async (email) => {
        const actionCodeSettings = {
            // URL must be whitelisted in the Firebase Console.
            url: window.location.origin,
            handleCodeInApp: true,
        };
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        window.localStorage.setItem('emailForSignIn', email);
    };

    const completeEmailLogin = async (url) => {
        if (isSignInWithEmailLink(auth, url)) {
            let email = window.localStorage.getItem('emailForSignIn');
            if (!email) {
                email = window.prompt('Please provide your email for confirmation');
            }
            if (email) {
                await signInWithEmailLink(auth, email, url);
                window.localStorage.removeItem('emailForSignIn');
            }
        }
    };

    const logout = async () => {
        await signOut(auth);
    };

    const updateProfile = async (updates) => {
        if (!user) return;
        const docRef = doc(db, 'users', user.uid);

        let finalUpdates = { ...updates };

        // If height, weight, dob or gender are being modified inside these updates, recalculate!
        const mergedProfile = { ...profile, ...updates };

        if (mergedProfile.dob && mergedProfile.height && mergedProfile.weight) {
            const newGoal = calculateProteinGoal(
                mergedProfile.dob,
                mergedProfile.height,
                mergedProfile.weight,
                mergedProfile.gender || 'Male'
            );

            const currentAge = differenceInYears(getNow(), new Date(mergedProfile.dob));

            finalUpdates.goal = newGoal;
            finalUpdates.lastRecalculatedAge = currentAge;
        }

        await setDoc(docRef, finalUpdates, { merge: true });
        setProfile(prev => ({ ...prev, ...finalUpdates }));
    };

    // Check if we are returning from an email link
    useEffect(() => {
        if (isSignInWithEmailLink(auth, window.location.href)) {
            completeEmailLogin(window.location.href).catch(console.error);
        }
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            profile,
            loading,
            loginWithGoogle,
            sendEmailLink,
            logout,
            updateProfile
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
