
import React, { useState, useEffect } from 'react';

const OfflineIndicator: React.FC = () => {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!isOffline) return null;

    return (
        <div className="fixed bottom-4 left-4 z-50 bg-black/80 border border-red-900/50 backdrop-blur-xl px-4 py-2 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.3)] animate-in slide-in-from-bottom-2 fade-in duration-500">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    <div className="absolute inset-0 w-2 h-2 bg-red-600 rounded-full animate-ping opacity-50"></div>
                </div>
                <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 block leading-none">Offline Mode</span>
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block leading-none mt-1">Heuristics Active</span>
                </div>
            </div>
        </div>
    );
};

export default OfflineIndicator;
