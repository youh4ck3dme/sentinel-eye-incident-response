import React, { useState, useRef, useEffect } from 'react';
import { AudioProcessor } from '../utils/AudioProcessor';
import WaveformVisualizer from './VisualEffects/WaveformVisualizer';

interface InputSectionProps {
  onAnalyze: (text: string, images?: string[], audio?: string) => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isLoading }) => {
  const [text, setText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [audioProcessor] = useState(() => new AudioProcessor());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImages(prev => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const startRecording = async () => {
    try {
      await audioProcessor.startRecording();
      setIsRecording(true);
      setRecordedAudio(null);
    } catch (err) {
      console.error("Failed to start recording", err);
      alert("Nepodarilo sa spustiť nahrávanie. Skontrolujte oprávnenia mikrofónu.");
    }
  };

  const stopRecording = async () => {
    if (isRecording) {
      try {
        const base64Audio = await audioProcessor.stopRecording();
        setRecordedAudio(base64Audio);
      } catch (err) {
        console.error("Failed to stop processing audio", err);
      } finally {
        setIsRecording(false);
      }
    }
  };

  const handleSubmit = () => {
    if (text || images.length > 0 || recordedAudio) {
      onAnalyze(text, images.length > 0 ? images : undefined, recordedAudio || undefined);
    }
  };

  const clearInput = () => {
    setText('');
    setImages([]);
    setRecordedAudio(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center gap-2 mb-4">
        <i className="fas fa-terminal text-red-500"></i>
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Vstup pre analýzu</h2>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Sem vlož logy, URL, HTTP headery alebo popis hovoru..."
        aria-label="Threat Analysis Input"
        spellCheck="false"
        className="w-full h-40 bg-black/40 border border-zinc-800 rounded-xl p-4 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/50 transition-all font-mono text-sm resize-none"
      />

      <div className="mt-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border border-zinc-700"
          >
            <i className="fas fa-image"></i>
            {images.length > 0 ? `Pridať dôkaz (${images.length})` : "Nahrať dôkaz"}
          </button>

          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${isRecording
              ? 'bg-red-500/20 text-red-500 border-red-500 animate-pulse'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
              }`}
          >
            <i className={`fas ${isRecording ? 'fa-stop-circle' : 'fa-microphone'}`}></i>
            {isRecording ? "Zastaviť nahrávanie" : recordedAudio ? "Nahrávka pripravená" : "Nahrať Call Segment"}
          </button>

          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={clearInput} className="flex-1 md:flex-none text-zinc-500 hover:text-zinc-300 text-sm font-medium px-4 py-2">
            Vyčistiť
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || (!text && images.length === 0 && !recordedAudio)}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${isLoading || (!text && images.length === 0 && !recordedAudio)
              ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white shadow-[0_4px_20px_rgba(220,38,38,0.3)]'
              }`}
          >
            {isLoading ? (
              <><i className="fas fa-circle-notch animate-spin"></i>Analyzujem...</>
            ) : (
              <><i className="fas fa-shield-alt"></i>SPUSTIŤ SCAN</>
            )}
          </button>
        </div>
      </div>

      {(images.length > 0 || recordedAudio || isRecording) && (
        <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <div key={idx} className="relative h-32 w-32 shrink-0 rounded-xl overflow-hidden border border-zinc-800">
              <img src={img} alt={`Evidence Preview ${idx + 1}`} className="h-full w-full object-cover" />
              <button
                onClick={() => removeImage(idx)}
                aria-label={`Remove image ${idx + 1}`}
                className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white hover:text-red-500"
              >
                <i className="fas fa-times" aria-hidden="true"></i>
              </button>
            </div>
          ))}

          {(isRecording || recordedAudio) && (
            <div className="flex-1 min-w-[300px] h-32 bg-black/20 rounded-xl relative">
              {isRecording ? (
                <WaveformVisualizer stream={audioProcessor.getStream()} isRecording={isRecording} />
              ) : (
                <div className="h-full w-full rounded-xl bg-red-600/10 border border-red-500/30 flex flex-col items-center justify-center gap-2 relative">
                  <i className="fas fa-volume-up text-red-500 text-xl" aria-hidden="true"></i>
                  <span className="text-[10px] text-red-500 font-bold uppercase">Audio Segment Captured</span>
                  <button
                    onClick={() => setRecordedAudio(null)}
                    aria-label="Remove audio"
                    className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white hover:text-red-500"
                  >
                    <i className="fas fa-times" aria-hidden="true"></i>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InputSection;
