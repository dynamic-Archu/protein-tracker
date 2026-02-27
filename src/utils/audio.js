// Helper to generate purely synthesized interaction sounds (no external assets needed)

let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

export function playSound(type = 'pop') {
    try {
        initAudio();
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        const now = audioCtx.currentTime;

        if (type === 'pop') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);

            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

            osc.start(now);
            osc.stop(now + 0.1);
        }
        else if (type === 'tab') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);

            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.15, now + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

            osc.start(now);
            osc.stop(now + 0.08);
        }
        else if (type === 'add') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);

            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.2, now + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

            osc.start(now);
            osc.stop(now + 0.1);
        }
        else if (type === 'edit') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(500, now);
            osc.frequency.setValueAtTime(600, now + 0.05);

            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.2, now + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

            gainNode.gain.setValueAtTime(0.2, now + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

            osc.start(now);
            osc.stop(now + 0.1);
        }
        else if (type === 'success') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.setValueAtTime(800, now + 0.1);

            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

            gainNode.gain.setValueAtTime(0.2, now + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

            osc.start(now);
            osc.stop(now + 0.3);
        }
        else if (type === 'achieve') {
            osc.type = 'square';

            // Note 1 (C5)
            osc.frequency.setValueAtTime(523.25, now);
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.15, now + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

            // Note 2 (E5)
            osc.frequency.setValueAtTime(659.25, now + 0.2);
            gainNode.gain.setValueAtTime(0, now + 0.2);
            gainNode.gain.linearRampToValueAtTime(0.15, now + 0.25);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

            // Note 3 (G5) held longer
            osc.frequency.setValueAtTime(783.99, now + 0.4);
            gainNode.gain.setValueAtTime(0, now + 0.4);
            gainNode.gain.linearRampToValueAtTime(0.2, now + 0.45);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1.0);

            osc.start(now);
            osc.stop(now + 1.0);

            // Add a secondary oscillator for fullness
            const osc2 = audioCtx.createOscillator();
            const gain2 = audioCtx.createGain();
            osc2.connect(gain2);
            gain2.connect(audioCtx.destination);
            osc2.type = 'sine';

            osc2.frequency.setValueAtTime(523.25 / 2, now); // Octave down
            gain2.gain.setValueAtTime(0, now);
            gain2.gain.linearRampToValueAtTime(0.15, now + 0.05);
            gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

            osc2.frequency.setValueAtTime(659.25 / 2, now + 0.2);
            gain2.gain.setValueAtTime(0, now + 0.2);
            gain2.gain.linearRampToValueAtTime(0.15, now + 0.25);
            gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

            osc2.frequency.setValueAtTime(783.99 / 2, now + 0.4);
            gain2.gain.setValueAtTime(0, now + 0.4);
            gain2.gain.linearRampToValueAtTime(0.2, now + 0.45);
            gain2.gain.exponentialRampToValueAtTime(0.01, now + 1.0);

            osc2.start(now);
            osc2.stop(now + 1.0);
        }
        else if (type === 'delete') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.exponentialRampToValueAtTime(50, now + 0.15);

            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.3, now + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

            osc.start(now);
            osc.stop(now + 0.15);
        }
    } catch (e) {
        console.warn("Audio context failed to play sound", e);
    }
}
