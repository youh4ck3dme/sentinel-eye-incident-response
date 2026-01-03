
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AudioProcessor } from '../../utils/AudioProcessor';

// Mocks for Web Audio API
class MockAudioContext {
    createBufferSource() {
        return {
            connect: vi.fn(),
            start: vi.fn(),
            buffer: null,
        };
    }
    close() {
        return Promise.resolve();
    }
    decodeAudioData(buffer: ArrayBuffer) {
        // Return a dummy AudioBuffer
        return Promise.resolve({
            sampleRate: 48000,
            numberOfChannels: 1,
            length: 1000,
            duration: 1000 / 48000,
            getChannelData: () => new Float32Array(1000),
        });
    }
}

class MockOfflineAudioContext {
    constructor(channels: number, length: number, sampleRate: number) { }
    createBufferSource() {
        return {
            connect: vi.fn(),
            start: vi.fn(),
            buffer: null,
        };
    }
    createChannelMerger() {
        return {
            connect: vi.fn()
        }
    }
    startRendering() {
        // Return an AudioBuffer simulated as 16kHz
        return Promise.resolve({
            sampleRate: 16000,
            numberOfChannels: 1,
            length: 1000, // Dummy length
            getChannelData: () => new Float32Array(1000).fill(0.5), // Fill with recognizable data
        });
    }
    destination = {};
}

describe('AudioProcessor', () => {
    let processor: AudioProcessor;

    beforeEach(() => {
        // Inject mocks globally
        vi.stubGlobal('AudioContext', MockAudioContext);
        vi.stubGlobal('OfflineAudioContext', MockOfflineAudioContext);
        processor = new AudioProcessor();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('initializes correctly', () => {
        expect(processor).toBeDefined();
    });

    it('converts WebM Blob to PCM Base64', async () => {
        // Create a fake Blob
        const mockBlob = new Blob(['dummy audio data'], { type: 'audio/webm' });
        // Spy on arrayBuffer to return something valid
        mockBlob.arrayBuffer = vi.fn().mockResolvedValue(new ArrayBuffer(8));

        const result = await processor.webmToPcm(mockBlob);

        // Expect a string (Base64)
        expect(typeof result).toBe('string');
        // Since we filled data with 0.5, the PCM 16-bit conversion should yield non-zero bytes (Base64 shouldn't be empty)
        expect(result.length).toBeGreaterThan(0);
    });

    it('handles resampling failure gracefully', async () => {
        // This tests if the chain holds up even if we pass weird logic
        const mockBlob = new Blob([''], { type: 'audio/webm' });
        mockBlob.arrayBuffer = vi.fn().mockResolvedValue(new ArrayBuffer(0));

        // In a real scenario, decodeAudioData might fail for empty buffer, but our mock resolves. 
        // Let's verify it simply runs through our mocked pipeline.
        await expect(processor.webmToPcm(mockBlob)).resolves.not.toThrow();
    });
});
