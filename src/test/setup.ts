import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
    cleanup();
});

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock crypto.randomUUID
Object.defineProperty(window, 'crypto', {
    value: {
        randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9),
    },
});

// Mock MediaRecorder
class MockMediaRecorder {
    ondataavailable: ((event: any) => void) | null = null;
    onstop: (() => void) | null = null;
    stream: { getTracks: () => { stop: () => void }[] };

    constructor() {
        this.stream = { getTracks: () => [{ stop: vi.fn() }] };
    }

    start() { }
    stop() {
        if (this.onstop) this.onstop();
    }
}

Object.defineProperty(window, 'MediaRecorder', { value: MockMediaRecorder });

// Mock navigator.mediaDevices
Object.defineProperty(navigator, 'mediaDevices', {
    value: {
        getUserMedia: vi.fn().mockResolvedValue({
            getTracks: () => [{ stop: vi.fn() }],
        }),
    },
});

// Mock confirm dialog
window.confirm = vi.fn(() => true);

// Suppress console errors in tests (optional)
vi.spyOn(console, 'error').mockImplementation(() => { });
