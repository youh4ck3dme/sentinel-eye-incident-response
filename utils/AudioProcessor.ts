
export class AudioProcessor {
    private mediaRecorder: MediaRecorder | null = null;
    private audioChunks: Blob[] = [];
    private stream: MediaStream | null = null;

    getStream(): MediaStream | null {
        return this.stream;
    }

    async startRecording(): Promise<void> {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(this.stream);
            this.audioChunks = [];

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };

            this.mediaRecorder.start();
        } catch (error) {
            console.error('Error starting recording:', error);
            throw error;
        }
    }

    stopRecording(): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!this.mediaRecorder) {
                reject(new Error('No recording in progress'));
                return;
            }

            this.mediaRecorder.onstop = async () => {
                try {
                    const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                    const base64Audio = await this.webmToPcm(audioBlob);
                    this.cleanup();
                    resolve(base64Audio);
                } catch (error) {
                    reject(error);
                }
            };

            this.mediaRecorder.stop();
        });
    }

    private cleanup(): void {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        this.mediaRecorder = null;
        this.audioChunks = [];
    }

    /**
     * Converts WebM blob to Base64 PCM 16kHz mono (Gemini requirement)
     * Note: Since browser decoding/encoding to raw PCM in pure JS is complex without AudioContext,
     * we will use AudioContext to decode and then export to PCM.
     */
    /**
     * Converts WebM blob to Base64 PCM 16kHz mono (Gemini requirement)
     * Public for testing and standalone usage.
     */
    async webmToPcm(blob: Blob): Promise<string> {
        const arrayBuffer = await blob.arrayBuffer();
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
            sampleRate: 16000, // Downsample to 16kHz
        });

        try {
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            const pcmData = this.audioBufferToPCM(audioBuffer);
            return this.arrayBufferToBase64(pcmData);
        } finally {
            await audioContext.close();
        }
    }

    private audioBufferToPCM(audioBuffer: AudioBuffer): ArrayBuffer {
        // Extract mono channel
        const channelData = audioBuffer.getChannelData(0);
        const pcmData = new Int16Array(channelData.length);

        for (let i = 0; i < channelData.length; i++) {
            // Clamp values to -1 to 1 range and scale to Int16
            const s = Math.max(-1, Math.min(1, channelData[i]));
            pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }

        return pcmData.buffer;
    }

    private arrayBufferToBase64(buffer: ArrayBuffer): string {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
}
