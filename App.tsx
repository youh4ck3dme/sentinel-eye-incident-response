
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import SecurityDashboard from './components/SecurityDashboard';
import CountermeasureControl from './components/CountermeasureControl';
import { ErrorBoundary, SectionErrorBoundary } from './components/errors';
import OfflineIndicator from './components/OfflineIndicator';
import SipClient from './components/SipClient';
import HackerBanner from './components/HackerBanner';
import { analyzeThreat, generateSecurityTTS } from './geminiService';
import { LogEntry, SecurityAnalysisResponse, ThreatStatus } from './types';

const HackingOverlay = React.lazy(() => import('./components/VisualEffects/HackingOverlay'));
const ForensicReport = React.lazy(() => import('./components/ForensicReport'));


const App: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const saved = localStorage.getItem('sentinel_eye_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse logs", e);
        return [];
      }
    }
    return [];
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    localStorage.setItem('sentinel_eye_logs', JSON.stringify(logs));
  }, [logs]);

  const handleAnalyze = async (text: string, images?: string[], audioData?: string) => {
    setIsAnalyzing(true);
    setShowWelcome(false);

    try {
      const result: SecurityAnalysisResponse = await analyzeThreat(text, images, audioData, logs);

      let ttsAudio: string | undefined = undefined;
      // If significant threat detected, generate robotic warning
      const effectiveStatus = result.call_status || result.status;
      if (effectiveStatus === ThreatStatus.DANGER || (result.risk_matrix && result.risk_matrix.composite_score > 75)) {
        const warningText = result.alert_message || "Security Alert. Fraudulent patterns detected. This call is being recorded. Terminating connection.";
        ttsAudio = await generateSecurityTTS(warningText);
      }

      const newEntry: LogEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date().toLocaleTimeString('sk-SK', { hour12: false }),
        input: text,
        images: images,
        audio: audioData,
        result: result,
        ttsAudio: ttsAudio,
        telemetry_pulse: Array.from({ length: 20 }, () => Math.random())
      };

      setLogs(prev => [newEntry, ...prev]);
    } catch (err) {
      console.error("Analysis failed", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [printingLog, setPrintingLog] = useState<LogEntry | null>(null);

  const handleAction = useCallback((action: string) => {
    setActiveAction(action);
  }, []);

  const clearHistory = () => {
    if (confirm("Vymazať celú históriu incidentov?")) {
      setLogs([]);
      localStorage.removeItem('sentinel_eye_logs');
    }
  };

  return (
    <ErrorBoundary fallback={<div className="p-8 text-center text-red-500">Application failed to load.</div>}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] bg-red-600 text-white px-4 py-2 rounded font-bold uppercase tracking-wider">
        Skip to content
      </a>

      {activeAction && (
        <React.Suspense fallback={null}>
          <HackingOverlay action={activeAction} onComplete={() => setActiveAction(null)} />
        </React.Suspense>
      )}

      {printingLog && (
        <React.Suspense fallback={null}>
          <ForensicReport log={printingLog} onClose={() => setPrintingLog(null)} />
        </React.Suspense>
      )}

      <OfflineIndicator />
      <Header />
      <main id="main-content" className="flex-1 max-w-6xl mx-auto w-full px-4 pt-8 md:pt-12" tabIndex={-1}>
        {showWelcome && logs.length === 0 && (
          <div className="mb-12 animate-in fade-in slide-in-from-bottom-6 duration-[1500ms]">
            <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-6 leading-[0.9]">
              SENTINEL<br />
              <span className="text-red-600">INTERCEPT.</span><br />
              DESTROY FRAUD.
            </h2>
            <p className="text-zinc-500 max-w-xl text-lg leading-relaxed uppercase tracking-[0.1em] font-medium">
              V2.5 EXTREME: Deepfake detection, forensic telemetry, and autonomous countermeasure control.
            </p>
          </div>
        )}

        <SectionErrorBoundary fallback={<div className="p-4 text-center text-red-500 border border-red-900/50 rounded-xl bg-red-950/10">Input Interface Error</div>}>
          <InputSection onAnalyze={handleAnalyze} isLoading={isAnalyzing} />
        </SectionErrorBoundary>

        <SectionErrorBoundary fallback={<div className="p-4 text-center text-red-500 border border-red-900/50 rounded-xl bg-red-950/10">Communications Error</div>}>
          <SipClient />
        </SectionErrorBoundary>

        {logs.length > 0 && (
          <SectionErrorBoundary fallback={<div className="p-4 text-center text-red-500 border border-red-900/50 rounded-xl bg-red-950/10">Countermeasures Unavailable</div>}>
            <CountermeasureControl onAction={handleAction} />
          </SectionErrorBoundary>
        )}

        <SectionErrorBoundary fallback={<div className="p-4 text-center text-red-500 border border-red-900/50 rounded-xl bg-red-950/10">Dashboard Unavailable</div>}>
          <SecurityDashboard logs={logs} onAction={handleAction} onPrint={setPrintingLog} />
        </SectionErrorBoundary>

        {logs.length > 0 && (
          <div className="fixed bottom-6 right-6 flex items-center gap-3 z-50">
            <button onClick={clearHistory} className="bg-zinc-900/80 hover:bg-zinc-800 text-zinc-500 hover:text-red-500 p-4 rounded-[1.5rem] border border-zinc-800 transition-all shadow-2xl backdrop-blur-xl">
              <i className="fas fa-trash-alt"></i>
            </button>
            <div className="bg-red-600 text-white px-6 py-4 rounded-[1.5rem] shadow-[0_20px_40px_rgba(220,38,38,0.3)] flex items-center gap-4 border border-red-500 animate-pulse relative group">
              <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sentinel Shield Active</span>
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/90 border border-zinc-800 px-3 py-1.5 rounded-lg text-[8px] font-black text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                AI ENGINE: HYBRID (CLOUD + LOCAL)
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="py-12 border-t border-zinc-900 mt-20">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 opacity-20">
          <div className="flex items-center gap-3">
            <i className="fas fa-eye text-red-500"></i>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Sentinel Eye Extreme • Protocol v2.5.1000 • 2024</span>
          </div>
        </div>
      </footer>
      <HackerBanner />
    </ErrorBoundary>
  );
};

export default App;
