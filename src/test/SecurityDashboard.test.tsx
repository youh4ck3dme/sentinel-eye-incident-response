
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SecurityDashboard from '../../components/SecurityDashboard';
import { ThreatStatus, RiskLevel } from '../../types';

describe('SecurityDashboard', () => {
    const mockOnAction = vi.fn();
    const mockLogs = [
        {
            id: '1',
            timestamp: '12:00:00',
            input: 'Test input 1',
            result: {
                status: ThreatStatus.DANGER,
                threat_type: 'Phishing',
                risk_level: RiskLevel.CRITICAL,
                risk_matrix: { composite_score: 95, likelihood: 0.9, impact: 1.0 },
                user_message: 'Dangerous!',
                technical_detail: 'Detailed info',
                mitigation_workflow: [{ id: 'm1', step: 'Step 1', status: 'pending' }],
                forensics: [{ type: 'IP', value: '1.2.3.4', confidence: 0.9 }],
                action_button: { label: 'BLOCK', action: 'jam', color: 'RED' }
            }
        }
    ];

    it('renders empty state when no logs provided', () => {
        render(<SecurityDashboard logs={[]} onAction={mockOnAction} onPrint={vi.fn()} />);
        expect(screen.getByText(/Awaiting Interceptions/i)).toBeInTheDocument();
    });

    it('renders log entries correctly', () => {
        render(<SecurityDashboard logs={mockLogs.map(l => ({ ...l, result: { ...l.result, call_status: l.result.status } })) as any} onAction={mockOnAction} onPrint={vi.fn()} />);
        expect(screen.getByText('Phishing')).toBeInTheDocument();
        expect(screen.getByText('95')).toBeInTheDocument(); // Composite score
        expect(screen.getByText(/CRITICAL/i)).toBeInTheDocument();
    });

    it('expands detail view on click', () => {
        render(<SecurityDashboard logs={mockLogs.map(l => ({ ...l, result: { ...l.result, call_status: l.result.status } })) as any} onAction={mockOnAction} onPrint={vi.fn()} />);
        const logHeader = screen.getByRole('button');
        fireEvent.click(logHeader);

        expect(screen.getByText(/Threat Telemetry/i)).toBeInTheDocument();
        expect(screen.getByText(/Detailed info/i)).toBeInTheDocument();
    });

    it('calls onAction when mitigation button is clicked', () => {
        render(<SecurityDashboard logs={mockLogs.map(l => ({ ...l, result: { ...l.result, call_status: l.result.status } })) as any} onAction={mockOnAction} onPrint={vi.fn()} />);
        // Expand first
        fireEvent.click(screen.getByRole('button'));

        const actionButton = screen.getByText('BLOCK');
        fireEvent.click(actionButton);

        expect(mockOnAction).toHaveBeenCalledWith('jam');
    });

    it('handles keyboard navigation for expansion', () => {
        render(<SecurityDashboard logs={mockLogs.map(l => ({ ...l, result: { ...l.result, call_status: l.result.status } })) as any} onAction={mockOnAction} onPrint={vi.fn()} />);
        const logHeader = screen.getByRole('button');

        fireEvent.keyDown(logHeader, { key: 'Enter' });
        expect(screen.getByText(/Threat Telemetry/i)).toBeInTheDocument();

        fireEvent.keyDown(logHeader, { key: ' ' }); // Space
        // Should collapse now
        expect(screen.queryByText(/Threat Telemetry/i)).not.toBeInTheDocument();
    });
});
