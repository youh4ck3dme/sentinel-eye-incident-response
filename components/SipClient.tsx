import React, { useState, useEffect, useRef } from 'react';

interface LogEntry {
    timestamp: string;
    message: string;
    type: 'info' | 'error' | 'success';
}

const SipClient: React.FC = () => {
    const [pbxServer, setPbxServer] = useState('57.129.4.22');
    const [wssPort, setWssPort] = useState('8089');
    const [lineExtension, setLineExtension] = useState('+421950491856');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('Janko Hraško');
    const [logs, setLogs] = useState<LogEntry[]>([
        { timestamp: '10:01:45', message: 'Aplikácia načítaná', type: 'info' }
    ]);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const logEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logEndRef.current) {
            logEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    const addLog = (message: string, type: 'info' | 'error' | 'success' = 'info') => {
        const timestamp = new Date().toLocaleTimeString('sk-SK', { hour12: false });
        setLogs(prev => [...prev, { timestamp, message, type }]);
    };

    const handleConnect = (e: React.FormEvent) => {
        e.preventDefault();
        if (isConnecting || isConnected) return;

        setIsConnecting(true);
        addLog(`Pripájanie k ${pbxServer}:${wssPort}...`, 'info');

        // Simulate connection process
        setTimeout(() => {
            addLog(`Overovanie linky ${lineExtension}...`, 'info');
            setTimeout(() => {
                setIsConnected(true);
                setIsConnecting(false);
                addLog(`Úspešne pripojené k PBX serveru.`, 'success');
            }, 1000);
        }, 800);
    };

    return (
        <section className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Connection Form */}
                <div className="bg-zinc-900/40 backdrop-blur-2xl border border-zinc-800/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <i className="fas fa-network-wired text-6xl text-white"></i>
                    </div>

                    <h3 className="text-xl font-black text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center">
                            <i className="fas fa-phone-alt text-red-500 text-xs"></i>
                        </span>
                        PBX KONFIGURÁCIA
                    </h3>

                    <form onSubmit={handleConnect} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">PBX Server</label>
                                <input
                                    type="text"
                                    value={pbxServer}
                                    onChange={(e) => setPbxServer(e.target.value)}
                                    className="w-full bg-black/40 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-red-500/50 transition-colors uppercase font-mono text-sm"
                                    placeholder="57.129.4.22"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">WSS Port</label>
                                <input
                                    type="text"
                                    value={wssPort}
                                    onChange={(e) => setWssPort(e.target.value)}
                                    className="w-full bg-black/40 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-red-500/50 transition-colors font-mono text-sm"
                                    placeholder="8089"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Číslo linky</label>
                            <input
                                type="text"
                                value={lineExtension}
                                onChange={(e) => setLineExtension(e.target.value)}
                                className="w-full bg-black/40 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-red-500/50 transition-colors font-mono"
                                placeholder="+421950491856"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Heslo</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/40 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-red-500/50 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Vaše Meno</label>
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    className="w-full bg-black/40 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-red-500/50 transition-colors"
                                    placeholder="napr. Janko Hraško"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isConnected || isConnecting}
                            className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] transition-all relative overflow-hidden group ${isConnected || isConnecting
                                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                                : 'bg-red-600 text-white hover:bg-red-500 shadow-[0_10px_30px_rgba(220,38,38,0.2)] active:scale-[0.98]'
                                }`}
                        >
                            <div className="relative z-10 flex items-center justify-center gap-3">
                                {isConnected ? (
                                    <>
                                        <i className="fas fa-check-circle"></i>
                                        PRIPOJENÉ
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-bolt"></i>
                                        {isConnecting ? 'PRIPÁJANIE...' : 'PRIPOJIŤ'}
                                    </>
                                )}
                            </div>
                            {!isConnected && !isConnecting && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                            )}
                        </button>
                    </form>
                </div>

                {/* Activity Log */}
                <div className="bg-black/60 border border-zinc-800/50 rounded-3xl p-8 flex flex-col shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            ACTIVITY LOG
                        </h3>
                        <div className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[8px] font-black text-zinc-500 uppercase tracking-widest">
                            Live Stream
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar font-mono max-h-[400px]">
                        {logs.map((log, index) => (
                            <div key={index} className="flex gap-4 group animate-in slide-in-from-left-2 duration-300">
                                <span className="text-zinc-600 text-xs whitespace-nowrap pt-1">{log.timestamp}</span>
                                <span className={`text-xs leading-relaxed ${log.type === 'success' ? 'text-green-500' :
                                    log.type === 'error' ? 'text-red-500' :
                                        'text-zinc-300'
                                    }`}>
                                    {log.message}
                                </span>
                            </div>
                        ))}
                        <div ref={logEndRef} />
                    </div>

                    <div className="mt-8 pt-6 border-t border-zinc-900 flex items-center justify-between">
                        <div className="flex gap-1">
                            <div className="w-1 h-3 bg-red-500/20 rounded-full"></div>
                            <div className="w-1 h-5 bg-red-500/40 rounded-full"></div>
                            <div className="w-1 h-2 bg-red-500/60 rounded-full"></div>
                            <div className="w-1 h-6 bg-red-500/80 rounded-full"></div>
                        </div>
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.25em]">Telemetry Engine v2.5</span>
                    </div>
                </div>
            </div>

            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
        </section>
    );
};

export default SipClient;
