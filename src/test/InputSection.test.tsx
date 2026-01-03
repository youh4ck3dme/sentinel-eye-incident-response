
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import InputSection from '../../components/InputSection';

// Mock AudioProcessor to avoid complex Web Audio logic in UI tests
vi.mock('../../utils/AudioProcessor', () => {
    return {
        AudioProcessor: vi.fn().mockImplementation(function () {
            return {
                startRecording: vi.fn().mockResolvedValue(undefined),
                stopRecording: vi.fn().mockResolvedValue('base64-audio-data'),
                webmToPcm: vi.fn().mockResolvedValue('base64-pcm-data'),
            };
        }),
    };
});

describe('InputSection', () => {
    const mockOnAnalyze = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly', () => {
        render(<InputSection onAnalyze={mockOnAnalyze} isLoading={false} />);
        expect(screen.getByPlaceholderText(/Sem vlož logy/i)).toBeInTheDocument();
    });

    it('updates text input value', () => {
        render(<InputSection onAnalyze={mockOnAnalyze} isLoading={false} />);
        const textarea = screen.getByPlaceholderText(/Sem vlož logy/i);
        fireEvent.change(textarea, { target: { value: 'Suspicious call log' } });
        expect(textarea).toHaveValue('Suspicious call log');
    });

    it('calls onAnalyze when "SPUSTIŤ SCAN" is clicked with text', () => {
        render(<InputSection onAnalyze={mockOnAnalyze} isLoading={false} />);
        const textarea = screen.getByPlaceholderText(/Sem vlož logy/i);
        fireEvent.change(textarea, { target: { value: 'Scam alert' } });

        const scanButton = screen.getByRole('button', { name: /SPUSTIŤ SCAN/i });
        fireEvent.click(scanButton);

        expect(mockOnAnalyze).toHaveBeenCalledWith('Scam alert', undefined, undefined);
    });

    it('clears input when "Vyčistiť" is clicked', () => {
        render(<InputSection onAnalyze={mockOnAnalyze} isLoading={false} />);
        const textarea = screen.getByPlaceholderText(/Sem vlož logy/i);
        fireEvent.change(textarea, { target: { value: 'Temporary text' } });

        const clearButton = screen.getByText(/Vyčistiť/i);
        fireEvent.click(clearButton);

        expect(textarea).toHaveValue('');
    });

    it('handles audio recording flow', async () => {
        render(<InputSection onAnalyze={mockOnAnalyze} isLoading={false} />);

        const recordButton = screen.getByText(/Nahrať Call Segment/i);
        fireEvent.click(recordButton);

        expect(await screen.findByText(/Zastaviť nahrávanie/i)).toBeInTheDocument();

        fireEvent.click(screen.getByText(/Zastaviť nahrávanie/i));

        await waitFor(() => {
            expect(screen.getByText(/Nahrávka pripravená/i)).toBeInTheDocument();
        }, { timeout: 2000 });

        const scanButton = screen.getByRole('button', { name: /SPUSTIŤ SCAN/i });
        fireEvent.click(scanButton);

        expect(mockOnAnalyze).toHaveBeenCalledWith('', undefined, 'base64-audio-data');
    });

    it('disables "SPUSTIŤ SCAN" button when loading', () => {
        render(<InputSection onAnalyze={mockOnAnalyze} isLoading={true} />);
        const scanButton = screen.getByRole('button', { name: /Analyzujem/i });
        expect(scanButton).toBeDisabled();
    });

    it('disables "SPUSTIŤ SCAN" button when input is empty', () => {
        render(<InputSection onAnalyze={mockOnAnalyze} isLoading={false} />);
        const scanButton = screen.getByRole('button', { name: /SPUSTIŤ SCAN/i });
        expect(scanButton).toBeDisabled();
    });
});
