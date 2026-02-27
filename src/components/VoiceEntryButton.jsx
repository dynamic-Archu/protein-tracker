import React, { useState, useEffect, useRef } from 'react';
import { Mic, Loader2 } from 'lucide-react';
import { parseSpokenProteinEntry } from '../utils/voiceParser';

export function VoiceEntryButton({ onEntryParsed }) {
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState('');
    const [transcript, setTranscript] = useState('');

    const recognitionRef = useRef(null);

    useEffect(() => {
        // Initialize Web Speech API if supported
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onstart = () => {
                setIsListening(true);
                setError('');
                setTranscript('');
            };

            recognitionRef.current.onresult = (event) => {
                let currentTranscript = '';
                let isFinalResult = false;

                for (let i = 0; i < event.results.length; i++) {
                    currentTranscript += event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        isFinalResult = true;
                    }
                }

                setTranscript(currentTranscript);

                // Only process if the user has finished speaking that phrase
                // and we haven't already processed it (by checking if we are still listening)
                if (isFinalResult) {
                    const result = parseSpokenProteinEntry(currentTranscript);
                    if (result && result.amount > 0) {
                        onEntryParsed(result.amount, result.label);
                        // Stop listening immediately after a successful parse
                        recognitionRef.current.stop();
                    } else {
                        setError("Couldn't understand the amount. Try saying '30 grams chocolate milkshake'.");
                        setTimeout(() => setError(''), 4000);
                        // Stop listening on error so they can try again
                        recognitionRef.current.stop();
                    }
                    setTimeout(() => setTranscript(''), 2000);
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setError(`Error: ${event.error}`);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        } else {
            setTimeout(() => setError("Speech recognition not supported in this browser."), 0);
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [onEntryParsed]); // Added dependency

    const toggleListen = () => {
        if (error && error.includes('supported')) return;

        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            try {
                recognitionRef.current?.start();
            } catch (e) {
                console.warn('Speech recognition already started:', e);
                // Handle case where recognition is already started but state is out of sync
                recognitionRef.current?.stop();
                setTimeout(() => recognitionRef.current?.start(), 100);
            }
        }
    };

    return (
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* Dynamic Feedback Text */}
            {(transcript || error) && (
                <div style={{
                    position: 'absolute',
                    bottom: '100%',
                    marginBottom: '20px',
                    background: 'var(--bg-surface-elevated)',
                    backdropFilter: 'blur(20px)',
                    padding: '12px 20px',
                    borderRadius: '20px',
                    boxShadow: 'var(--shadow-glass)',
                    minWidth: '200px',
                    textAlign: 'center',
                    animation: 'fadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    zIndex: 60,
                    border: '1px solid var(--separator)'
                }}>
                    {error ? (
                        <span className="text-footnote" style={{ color: 'var(--accent-protein)' }}>{error}</span>
                    ) : (
                        <span className="text-subheadline" style={{ color: 'var(--text-primary)' }}>
                            "{transcript}"
                        </span>
                    )}
                </div>
            )}

            {/* Pulsing Outer Rings (Visible when listening) */}
            <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '64px', height: '64px',
                borderRadius: '50%',
                background: 'var(--accent-blue)',
                opacity: isListening ? 0.2 : 0,
                transition: 'opacity 0.3s ease',
                animation: isListening ? 'pulse 1.5s infinite cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                pointerEvents: 'none',
            }} />

            {/* Main Microphone Button */}
            <button
                onClick={toggleListen}
                className={`flex-center ${!isListening ? 'icon-glow' : ''}`}
                style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    border: 'none',
                    background: isListening ? 'var(--accent-blue)' : 'var(--bg-surface-elevated)',
                    color: isListening ? 'white' : 'var(--accent-blue)',
                    boxShadow: 'var(--shadow-md)',
                    cursor: 'pointer',
                    position: 'relative',
                    zIndex: 10,
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    backdropFilter: isListening ? 'none' : 'blur(10px)'
                }}
            >
                {isListening ? <Loader2 size={24} className="spin" /> : <Mic size={24} />}
            </button>

            {/* Inject Keyframes just for this component */}
            <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.4); opacity: 0.1; }
          100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.3; }
        }
        .spin {
          animation: spin 2s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
