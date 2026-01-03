import React, { useState, useRef } from 'react';
import { LogEntry, RiskLevel, ThreatStatus } from '../types';

interface SecurityDashboardProps {
  logs: LogEntry[];
  onAction: (action: string) => void;
  onPrint: (log: LogEntry) => void;
}

const getStatusColor = (status: ThreatStatus) => {
  switch (status) {
    case ThreatStatus.DANGER: return 'text-red-500 border-red-500/30 bg-red-500/5';
    case ThreatStatus.WARNING: return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/5';
    case ThreatStatus.SAFE: return 'text-green-500 border-green-500/30 bg-green-500/5';
    default: return 'text-zinc-400 border-zinc-800 bg-zinc-900';
  }
};

const SecurityDashboard: React.FC<SecurityDashboardProps> = ({ logs, onAction, onPrint }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playTTS = (base64: string) => {
    const url = `data:audio/wav;base64,${base64}`;
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.play();
    }
  };

  if (logs.length === 0) {
    return (
      <div className="mt-8 text-center py-20 bg-zinc-900/30 rounded-[3rem] border border-dashed border-zinc-800">
        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-radar text-zinc-600 text-2xl animate-pulse"></i>
        </div>
        <h3 className="text-zinc-400 font-black uppercase tracking-widest text-xs">Awaiting Interceptions</h3>
        <p className="text-zinc-600 text-[10px] mt-2 uppercase tracking-widest">Sentinel Eye Radar Active</p>
      </div>
    );
  }

  return (
    <div className="mt-12 space-y-6 pb-20">
      <audio ref={audioRef} className="hidden" />

      <div className="flex items-center justify-between border-b border-zinc-900 pb-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute inset-0"></div>
            <div className="w-3 h-3 bg-red-600 rounded-full relative"></div>
          </div>
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">Live Forensic Feed</h2>
        </div>
        <div className="bg-zinc-900 px-4 py-1.5 rounded-full border border-zinc-800">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Threat Count: {logs.length}</span>
        </div>
      </div>

      <div className="grid gap-6">
        {logs.map((log) => (
          <div
            key={log.id}
            className={`group bg-black/40 border ${expandedId === log.id ? 'border-zinc-700 shadow-2xl shadow-red-900/10' : 'border-zinc-800/50'} rounded-[2.5rem] transition-all duration-700 hover:bg-zinc-900/40 overflow-hidden`}
          >
            <div
              onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
              role="button"
              aria-expanded={expandedId === log.id}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setExpandedId(expandedId === log.id ? null : log.id);
                }
              }}
              className="p-6 md:p-8 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6 outline-none focus:bg-zinc-900/40"
            >
              <div className="flex items-start gap-4 md:gap-6">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500 ${log.result.status === ThreatStatus.DANGER ? 'bg-red-500/10 border-red-500/30' : 'bg-zinc-900 border-zinc-800'}`}>
                  <i className={`fas ${log.result.status === ThreatStatus.DANGER ? 'fa-biohazard text-red-500' : 'fa-shield-alt text-zinc-600'} text-lg md:text-xl`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1.5">
                    <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{log.timestamp}</span>
                    <span className={`text-[8px] md:text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-tighter ${getStatusColor(log.result.call_status || log.result.status)}`}>
                      {log.result.call_status || log.result.status}
                    </span>
                    {log.result.technical_detail.toLocaleLowerCase().includes('offline') && (
                      <span className="bg-zinc-800 text-zinc-400 text-[8px] font-black px-2 py-0.5 rounded border border-zinc-700 uppercase">Offline Heuristics</span>
                    )}
                    {log.result.risk_level === RiskLevel.CRITICAL && (
                      <span className="bg-red-600 text-white text-[8px] font-black px-2 py-0.5 rounded animate-pulse uppercase">Critical Risk</span>
                    )}
                  </div>
                  <h4 className="text-base md:text-lg font-bold text-white tracking-tight group-hover:text-red-400 transition-colors truncate pr-4">
                    {log.result.threat_type}
                  </h4>
                  {log.result.alert_message && (
                    <div className="mt-1 md:hidden">
                      <span className="text-red-500 animate-pulse text-[10px] font-black">{log.result.alert_message}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4 border-t border-zinc-800 md:border-t-0 pt-4 md:pt-0">
                <div className="md:hidden flex-1">
                  <span className="text-red-500 animate-pulse text-[10px] font-black">{log.result.alert_message}</span>
                </div>
                <div className="text-right">
                  <div className="text-[8px] md:text-[10px] font-black text-zinc-600 uppercase tracking-widest">Score</div>
                  <div className={`text-xl font-black ${log.result.risk_matrix.composite_score > 70 ? 'text-red-500' : 'text-zinc-400'}`}>
                    {log.result.risk_matrix.composite_score}
                  </div>
                </div>
                <i className={`fas fa-chevron-${expandedId === log.id ? 'up' : 'down'} text-zinc-700 group-hover:text-zinc-500 transition-colors ml-2 md:ml-4`}></i>
              </div>
            </div>

            {/* Expanded Forensic Data */}
            {expandedId === log.id && (
              <div className="px-8 pb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pt-8 border-t border-zinc-900/50">

                  {/* Column 1: Risk & Forensics */}
                  <div className="space-y-8">
                    <div>
                      <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-6">Threat Telemetry</h5>
                      <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 relative overflow-hidden group/card">
                        <div className="grid grid-cols-2 gap-4 relative z-10">
                          <div className="text-center p-4 bg-black/40 rounded-2xl border border-zinc-800">
                            <div className="text-2xl font-black text-white">{Math.round(log.result.risk_matrix.likelihood * 100)}%</div>
                            <div className="text-[8px] font-black uppercase tracking-widest text-zinc-600 mt-1">Likelihood</div>
                          </div>
                          <div className="text-center p-4 bg-black/40 rounded-2xl border border-zinc-800">
                            <div className="text-2xl font-black text-white">{Math.round(log.result.risk_matrix.impact * 100)}%</div>
                            <div className="text-[8px] font-black uppercase tracking-widest text-zinc-600 mt-1">Impact</div>
                          </div>
                        </div>
                        <div className="mt-6 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]" style={{ width: `${log.result.risk_matrix.composite_score}%` }}></div>
                        </div>
                      </div>

                      {log.audio && (
                        <div className="mt-6 bg-black/40 p-6 rounded-3xl border border-zinc-800/50">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600">Audio Frequency Analysis</span>
                            <span className="text-[8px] font-mono text-red-500 animate-pulse">DEEPFAKE_RADAR_ACTIVE</span>
                          </div>
                          <div className="flex items-end gap-[2px] h-12">
                            {log.telemetry_pulse?.map((p, i) => (
                              <div
                                key={i}
                                className="flex-1 bg-red-600/60 rounded-full"
                                style={{
                                  height: `${p * 100}%`,
                                  animation: `pulse 1.5s ease-in-out infinite`,
                                  animationDelay: `${i * 0.1}s`
                                }}
                              ></div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-6">Forensic Identifiers</h5>
                      <div className="space-y-3">
                        {log.result.forensics.map((f, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-zinc-900/30 rounded-2xl border border-zinc-800/50 hover:bg-zinc-900/60 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-xl bg-black border border-zinc-800 flex items-center justify-center">
                                <i className="fas fa-fingerprint text-[10px] text-zinc-500"></i>
                              </div>
                              <div>
                                <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{f.type}</div>
                                <div className="text-xs font-mono text-zinc-300">{f.value}</div>
                              </div>
                            </div>
                            <div className="text-[10px] font-black text-red-500/50">{Math.round(f.confidence * 100)}% Match</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Analysis & Input */}
                  <div className="space-y-8">
                    <div>
                      <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-6">Deep Analysis</h5>
                      <div className="bg-zinc-900/30 p-6 rounded-3xl border border-zinc-800 leading-relaxed">
                        <p className="text-xs text-zinc-400 italic mb-4">"{log.result.user_message}"</p>
                        <p className="text-xs font-mono text-red-400/80 leading-loose">
                          {log.result.technical_detail}
                        </p>
                      </div>
                    </div>

                    {log.images && log.images.length > 0 && (
                      <div>
                        <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-6">Original Signal Vectors (Visual)</h5>
                        <div className="flex gap-4 overflow-x-auto pb-4">
                          {log.images.map((img, i) => (
                            <div key={i} className="bg-black/60 p-2 rounded-3xl border border-zinc-800 shrink-0">
                              <img src={img} alt={`Vector ${i + 1}`} className="h-40 w-auto rounded-2xl" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {log.input && (
                      <div>
                        <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-6">Original Signal Vector</h5>
                        <div className="bg-black/60 p-6 rounded-3xl border border-zinc-800 font-mono text-[10px] text-zinc-500 overflow-x-auto">
                          {log.input}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Column 3: Mitigation & Actions */}
                  <div className="space-y-8">
                    <div>
                      <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-6">Execution Workflow (NIST)</h5>
                      <div className="space-y-4">
                        {log.result.mitigation_workflow.map((m, i) => (
                          <div key={m.id} className="flex gap-5 group/step">
                            <div className="flex flex-col items-center shrink-0">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all ${m.status === 'completed' ? 'bg-green-500 border-green-500 text-black' : 'bg-transparent border-zinc-800 text-zinc-600'}`}>
                                {m.status === 'completed' ? '✓' : i + 1}
                              </div>
                              {i < log.result.mitigation_workflow.length - 1 && <div className="w-0.5 h-full bg-zinc-900 my-1 group-hover/step:bg-zinc-800 transition-colors"></div>}
                            </div>
                            <div className="pt-0.5 pb-4">
                              <p className={`text-xs ${m.status === 'completed' ? 'text-zinc-600 line-through' : 'text-zinc-300'} font-medium`}>{m.step}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => onAction(log.result.action_button.action)}
                        className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transform active:scale-[0.98] transition-all shadow-xl ${log.result.action_button.color === 'RED' ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/20' :
                          log.result.action_button.color === 'YELLOW' ? 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-yellow-900/20' :
                            'bg-green-600 hover:bg-green-500 text-white shadow-green-900/20'
                          }`}
                      >
                        {log.result.action_button.label}
                      </button>

                      <button
                        onClick={() => onPrint(log)}
                        className="w-full py-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3 border border-zinc-700"
                      >
                        <i className="fas fa-file-contract text-red-500"></i>
                        Official Forensic Report
                      </button>

                      {log.ttsAudio && (
                        <button
                          onClick={() => playTTS(log.ttsAudio!)}
                          className="w-full py-4 rounded-2xl bg-zinc-100 hover:bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3"
                        >
                          <i className="fas fa-bullhorn animate-pulse"></i>
                          Play Interceptor Warning
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityDashboard;
