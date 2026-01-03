import React from 'react';

interface CountermeasureControlProps {
    onAction: (action: string) => void;
}

const CountermeasureControl: React.FC<CountermeasureControlProps> = ({ onAction }) => {
    const controls = [
        { id: 'jam', label: 'Signal Jamming', icon: 'fa-broadcast-tower', color: 'red' },
        { id: 'trace', label: 'Reverse Trace', icon: 'fa-map-marker-alt', color: 'blue' },
        { id: 'honeypot', label: 'Deploy Honeypot', icon: 'fa-spider', color: 'yellow' },
        { id: 'decrypt', label: 'Auth Decryption', icon: 'fa-unlock-alt', color: 'green' }
    ];

    return (
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl mt-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400">Tactical Countermeasures</h3>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {controls.map(ctrl => (
                    <button
                        key={ctrl.id}
                        onClick={() => onAction(ctrl.id)}
                        className={`group flex flex-col items-center justify-center p-6 rounded-2xl border border-zinc-800 hover:border-${ctrl.color}-500/50 bg-black/40 hover:bg-${ctrl.color}-500/5 transition-all duration-500`}
                    >
                        <i className={`fas ${ctrl.icon} text-2xl mb-3 text-zinc-500 group-hover:text-${ctrl.color}-500 transition-colors`}></i>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 group-hover:text-white transition-colors">
                            {ctrl.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CountermeasureControl;
