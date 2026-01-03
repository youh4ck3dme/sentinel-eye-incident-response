import React, { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
    stream: MediaStream | null;
    isRecording: boolean;
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ stream, isRecording }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        if (isRecording && stream && canvasRef.current) {
            // Initialize Audio Context
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            contextRef.current = audioContext;

            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            analyserRef.current = analyser;

            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            sourceRef.current = source;

            const draw = () => {
                const canvas = canvasRef.current;
                if (!canvas) return;

                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                analyser.getByteFrequencyData(dataArray);

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Styling
                const barWidth = (canvas.width / bufferLength) * 2.5;
                let barHeight;
                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    barHeight = dataArray[i] / 2;

                    // Gradient for bars (Red to Orange)
                    const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
                    gradient.addColorStop(0, '#7f1d1d'); // red-900
                    gradient.addColorStop(1, '#ef4444'); // red-500

                    ctx.fillStyle = gradient;
                    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                    x += barWidth + 1;
                }

                if (isRecording) {
                    animationFrameRef.current = requestAnimationFrame(draw);
                }
            };

            draw();

            return () => {
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                }
                if (contextRef.current && contextRef.current.state !== 'closed') {
                    contextRef.current.close();
                }
            };
        }
    }, [isRecording, stream]);

    return (
        <div className="relative h-32 w-full bg-black/40 border border-zinc-800 rounded-xl overflow-hidden">
            <canvas
                ref={canvasRef}
                width={300}
                height={128}
                className="w-full h-full"
            />
            {!isRecording && (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-600 text-[10px] uppercase font-bold tracking-widest">
                    Awaiting Signal Input...
                </div>
            )}
            {isRecording && (
                <div className="absolute top-2 right-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-600 animate-ping"></div>
                    <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Live Input</span>
                </div>
            )}
        </div>
    );
};

export default WaveformVisualizer;
