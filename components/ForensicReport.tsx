
import React from 'react';
import { LogEntry, RiskLevel } from '../types';

interface ForensicReportProps {
    log: LogEntry;
    onClose: () => void;
}

const ForensicReport: React.FC<ForensicReportProps> = ({ log, onClose }) => {
    return (
        <div className="fixed inset-0 z-[200] bg-white text-black overflow-y-auto p-8 md:p-20 font-serif print:p-0">
            <div className="max-w-4xl mx-auto border-2 border-black p-10 relative">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start border-b-4 border-black pb-8 mb-10 gap-6">
                    <div className="flex-1">
                        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 leading-none">Sentinel Eye Forensic Report</h1>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Protocol v2.5.1000 / Incident ID: {log.id}</p>
                    </div>
                    <div className="flex flex-row md:flex-col items-center md:items-end gap-4 w-full md:w-auto">
                        <div className="flex gap-2 print:hidden">
                            <button
                                onClick={() => window.print()}
                                className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center hover:bg-zinc-800 transition-all shadow-lg active:scale-95"
                                title="Tlačiť report"
                            >
                                <i className="fas fa-print text-sm"></i>
                            </button>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center hover:bg-red-700 transition-all shadow-lg active:scale-95"
                                title="Zatvoriť"
                            >
                                <i className="fas fa-times text-sm"></i>
                            </button>
                        </div>
                        <div className="ml-auto md:ml-0 text-right">
                            <div className="text-[8px] font-black uppercase mb-1">Generated On</div>
                            <div className="text-xs border border-black px-3 py-1 font-mono bg-zinc-50">{log.timestamp}</div>
                        </div>
                    </div>
                </div>

                {/* Executive Summary */}
                <section className="mb-12">
                    <h2 className="text-xl font-black uppercase border-b-2 border-black mb-6 pb-2">1. Executive Summary</h2>
                    <div className="grid grid-cols-2 gap-10">
                        <div>
                            <p className="text-sm mb-4"><span className="font-bold">Threat Type:</span> {log.result.threat_type}</p>
                            <p className="text-sm mb-4"><span className="font-bold">Risk Level:</span> <span className={log.result.risk_level === RiskLevel.CRITICAL ? 'text-red-600' : ''}>{log.result.risk_level}</span></p>
                            <p className="text-sm"><span className="font-bold">NIST Status:</span> {log.result.status}</p>
                        </div>
                        <div className="bg-zinc-100 p-6 border-l-8 border-black">
                            <div className="text-[10px] font-black uppercase mb-2">Composite Threat Score</div>
                            <div className="text-5xl font-black">{log.result.risk_matrix.composite_score}</div>
                            <div className="mt-2 text-[10px] uppercase text-zinc-500">Likelihood: {Math.round(log.result.risk_matrix.likelihood * 100)}% | Impact: {Math.round(log.result.risk_matrix.impact * 100)}%</div>
                        </div>
                    </div>
                </section>

                {/* Incident Metadata */}
                <section className="mb-12">
                    <h2 className="text-xl font-black uppercase border-b-2 border-black mb-6 pb-2">2. Digital Forensics</h2>
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="bg-zinc-100 italic">
                                <th className="p-3 border border-zinc-300">Indicator Type</th>
                                <th className="p-3 border border-zinc-300">Observed Value</th>
                                <th className="p-3 border border-zinc-300">Confidence Match</th>
                            </tr>
                        </thead>
                        <tbody>
                            {log.result.forensics.map((f, i) => (
                                <tr key={i}>
                                    <td className="p-3 border border-zinc-200 font-bold">{f.type}</td>
                                    <td className="p-3 border border-zinc-200 font-mono text-xs">{f.value}</td>
                                    <td className="p-3 border border-zinc-200">{Math.round(f.confidence * 100)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {/* Technical Detail */}
                <section className="mb-12">
                    <h2 className="text-xl font-black uppercase border-b-2 border-black mb-6 pb-2">3. Analysis Detail (AI Narrative)</h2>
                    <div className="bg-zinc-50 p-6 italic text-sm leading-relaxed border border-zinc-200">
                        "{log.result.technical_detail}"
                    </div>
                </section>

                {/* Visual Evidence */}
                {log.images && log.images.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-xl font-black uppercase border-b-2 border-black mb-6 pb-2">4. Visual Evidence Vectors</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {log.images.map((img, i) => (
                                <div key={i} className="border border-black p-2">
                                    <img src={img} alt={`Evidence ${i + 1}`} className="w-full grayscale contrast-125" />
                                    <div className="text-[8px] uppercase font-bold mt-2 text-center text-zinc-500">Vector Attachment #{i + 1}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Mitigation */}
                <section className="mb-12">
                    <h2 className="text-xl font-black uppercase border-b-2 border-black mb-6 pb-2">5. Countermeasure Log</h2>
                    <div className="space-y-2">
                        {log.result.mitigation_workflow.map((m, i) => (
                            <div key={i} className="flex items-center gap-4 text-sm">
                                <div className="w-5 h-5 bg-black text-white text-[10px] flex items-center justify-center shrink-0">✓</div>
                                <div className={m.status === 'completed' ? 'line-through text-zinc-400' : 'font-bold'}>{m.step}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer */}
                <div className="mt-20 pt-8 border-t border-zinc-300 text-[10px] text-zinc-500 flex justify-between italic">
                    <div>OFFICIAL DOCUMENT - FOR LEGAL USE ONLY</div>
                    <div>Page 01 / 01</div>
                </div>
            </div>
        </div>
    );
};

export default ForensicReport;
