
import React, { useEffect, useState } from 'react';

interface HackingOverlayProps {
    action: string;
    onComplete: () => void;
}

const protocols: Record<string, { title: string; logs: string[]; color: string }> = {
    jam: {
        title: 'SIGNAL JAMMING (800MHz - 2.4GHz)',
        color: 'red',
        logs: [
            'INITIALIZING JAMMING PROTOCOL...',
            'SCANNING FREQUENCIES [800MHz - 2.4GHz]...',
            'TARGET DETECTED: SIGNAL STRENGTH 98%',
            'GENERATING WHITE NOISE INTERFERENCE...',
            'PACKET FLOODING STARTED...',
            'CONNECTION ISOLATION: 45%',
            'CONNECTION ISOLATION: 88%',
            'CONNECTION ISOLATION: 99.8%',
            'TARGET NEUTRALIZED. CONNECTION SEVERED.'
        ]
    },
    trace: {
        title: 'REVERSE TRACE INITIATED',
        color: 'blue',
        logs: [
            'TRACEROUTE STARTED...',
            'RESOLVING NODE HANDSHAKES...',
            'HOP 1: ISP_GATEWAY_V4 [ACCEPTED]',
            'HOP 2: ENCRYPTED_TUNNEL [BYPASSED]',
            'HOP 3: OFFSHORE_SERVER_node_77 [IDENTIFIED]',
            'TRIANGULATING GEOLOCATION...',
            'LAT: [MASKED] | LON: [MASKED]',
            'IDENTITY CONFIDENCE: 87%',
            'LOGGING EVIDENCE TO IMMUTABLE LEDGER...'
        ]
    },
    honeypot: {
        title: 'VIRTUAL HONEYPOT DEPLOYMENT',
        color: 'yellow',
        logs: [
            'DEPLOYING DUMMY PII CONTAINER...',
            'GENERATING SYNTHETIC IDENTITY: [Janko Hrasko]',
            'INJECTING CREDENTIAL BAIT...',
            'MONITORING TRAFFIC SPIKES...',
            'ATTACKER ENGAGED BAIT...',
            'RECORDING KEYSTROKES...',
            'REDIRECTING TO NULL_ROUTE...',
            'THREAT ACTOR CONTAINED IN SANDBOX.'
        ]
    },
    decrypt: {
        title: 'AUTH DECRYPTION ENGINE',
        color: 'green',
        logs: [
            'INTERCEPTING TOKEN STREAM...',
            'ANALYZING HASH ALGORITHM: BCRYPT...',
            'INITIATING DICTIONARY ATTACK...',
            'ATTEMPT 1403/5000: FAILED',
            'ATTEMPT 2911/5000: FAILED',
            'ATTEMPT 4002/5000: SUCCESS',
            'KEY FRAGMENTS RECOVERED...',
            'DECRYPTING PAYLOAD...',
            'ACCESS GRANTED.'
        ]
    }
};

const HackingOverlay: React.FC<HackingOverlayProps> = ({ action, onComplete }) => {
    const [logIndex, setLogIndex] = useState(0);
    const [interactionRequired, setInteractionRequired] = useState(false);
    const [interactionComplete, setInteractionComplete] = useState(false);
    const config = protocols[action] || protocols['jam'];

    useEffect(() => {
        // Trigger interaction requirement at log index 4
        if (logIndex === 4 && !interactionComplete) {
            setInteractionRequired(true);
            return;
        }

        if (logIndex < config.logs.length) {
            const timeout = setTimeout(() => {
                setLogIndex(prev => prev + 1);
            }, Math.random() * 600 + 200);
            return () => clearTimeout(timeout);
        } else {
            const timeout = setTimeout(onComplete, 1500);
            return () => clearTimeout(timeout);
        }
    }, [logIndex, config.logs.length, onComplete, interactionComplete]);

    const handleInteraction = () => {
        setInteractionComplete(true);
        setInteractionRequired(false);
        setLogIndex(prev => prev + 1);
    };

    const colorClasses = {
        red: 'text-red-500 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]',
        blue: 'text-blue-500 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.5)]',
        yellow: 'text-yellow-500 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.5)]',
        green: 'text-green-500 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.5)]',
    };

    const currentColorClass = colorClasses[config.color as keyof typeof colorClasses];

    return (
        <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className={`w-full max-w-2xl bg-black border-2 ${currentColorClass} rounded-xl p-8 font-mono relative overflow-hidden`}>
                {/* CRT Scanline Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none"></div>

                <h2 className={`text-xl md:text-2xl font-black mb-8 border-b-2 ${currentColorClass} pb-4 animate-pulse`}>
                    {config.title}
                </h2>

                <div className="space-y-2 font-bold min-h-[300px]">
                    {config.logs.slice(0, logIndex + 1).map((log, i) => (
                        <div key={i} className={`flex items-start gap-3 ${i === logIndex ? 'animate-pulse' : 'opacity-70'}`}>
                            <span className="text-[10px] opacity-50 mt-1">[{new Date().toLocaleTimeString()}]</span>
                            <span className={config.color === 'red' ? 'text-red-400' : config.color === 'blue' ? 'text-blue-400' : config.color === 'yellow' ? 'text-yellow-400' : 'text-green-400'}>
                                {'>'} {log}
                            </span>
                        </div>
                    ))}
                    {logIndex < config.logs.length && !interactionRequired && (
                        <div className="animate-pulse text-zinc-500">_</div>
                    )}

                    {interactionRequired && (
                        <div className="mt-12 p-6 border-2 border-dashed border-red-500 bg-red-500/10 rounded-xl animate-in fade-in zoom-in duration-500">
                            <h3 className="text-red-500 text-sm font-black uppercase mb-4 tracking-widest">
                                <i className="fas fa-exclamation-triangle mr-2"></i>
                                Interaction Required: Bypass Secure Gateway
                            </h3>
                            <p className="text-[10px] text-zinc-400 mb-6 uppercase">
                                Attacker firewall detected. Manual override necessary to maintain signal injection.
                            </p>
                            <button
                                onClick={handleInteraction}
                                className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg font-black uppercase tracking-[0.3em] transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] active:scale-95"
                            >
                                BYPASS GATEWAY [CLICK]
                            </button>
                        </div>
                    )}
                </div>

                <div className="absolute bottom-4 right-4 text-[10px] text-zinc-600 uppercase">
                    SECURE PROTOCOL v2.5 // INTERACTIVE MODES
                </div>
            </div>
        </div>
    );
};

export default HackingOverlay;
