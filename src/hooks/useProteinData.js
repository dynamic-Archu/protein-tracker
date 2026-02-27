import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, updateDoc, orderBy } from 'firebase/firestore';
import { getNow, formatLocal } from '../utils/date';

export function useProteinData() {
    const { user, profile } = useAuth();
    const [entries, setEntries] = useState([]);
    // We get the goal from the user's profile now.
    const goal = profile?.goal || 120;

    useEffect(() => {
        if (!user) {
            setEntries([]);
            return;
        }

        // Real-time listener to user's logs
        const logsRef = collection(db, 'logs');
        const q = query(
            logsRef,
            where('userId', '==', user.uid),
            orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setEntries(fetched);
        }, (err) => {
            console.error('Firestore listener error:', err);
            if (err.message.includes('index')) {
                alert('Firestore Index Required: Check the browser console and click the link to build the database index.');
            }
        });

        return unsubscribe;
    }, [user]);

    const addEntry = async (amount, label = 'Quick Add', date = getNow()) => {
        if (!user) return;
        const newEntry = {
            userId: user.uid,
            amount: Number(amount),
            label,
            timestamp: Date.now(),
            date: formatLocal(date, 'yyyy-MM-dd') // Store as IST YYYY-MM-DD string
        };
        try {
            await addDoc(collection(db, 'logs'), newEntry);
        } catch (err) {
            console.error("Error adding doc: ", err);
            alert("Failed to save log: " + err.message);
        }
    };

    const editEntry = async (id, newAmount, newLabel) => {
        if (!user) return;
        const logRef = doc(db, 'logs', id);
        await updateDoc(logRef, {
            amount: Number(newAmount),
            label: newLabel
        });
    };

    const removeEntry = async (id) => {
        if (!user) return;
        const logRef = doc(db, 'logs', id);
        await deleteDoc(logRef);
    };

    // Helper to get entries for a specific day string
    const getEntriesForDay = (dateObj) => {
        const dateStr = formatLocal(dateObj, 'yyyy-MM-dd');
        return entries
            .filter(entry => entry.date === dateStr)
            .sort((a, b) => b.timestamp - a.timestamp);
    };

    const getTotalForDay = (dateObj) => {
        return getEntriesForDay(dateObj).reduce((sum, entry) => sum + entry.amount, 0);
    };

    return {
        entries,
        goal,
        addEntry,
        removeEntry,
        editEntry,
        getEntriesForDay,
        getTotalForDay
    };
}
