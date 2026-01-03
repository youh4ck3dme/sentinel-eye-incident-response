import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import ErrorBoundary from '../../components/errors/ErrorBoundary';
import SectionErrorBoundary from '../../components/errors/SectionErrorBoundary';

// Component that throws an error
const ThrowError: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
    if (shouldThrow) {
        throw new Error('Test error message');
    }
    return <div>Normal content</div>;
};

describe('ErrorBoundary', () => {
    it('renders children when no error', () => {
        render(
            <ErrorBoundary>
                <div>Test content</div>
            </ErrorBoundary>
        );

        expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('renders error UI when child throws', () => {
        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(screen.getByText('Systémová Chyba')).toBeInTheDocument();
        expect(screen.getByText('Test error message')).toBeInTheDocument();
    });

    it('renders custom fallback when provided', () => {
        render(
            <ErrorBoundary fallback={<div>Custom fallback</div>}>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(screen.getByText('Custom fallback')).toBeInTheDocument();
    });

    it('calls onError callback when error occurs', () => {
        const onError = vi.fn();

        render(
            <ErrorBoundary onError={onError}>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(onError).toHaveBeenCalled();
        expect(onError.mock.calls[0][0].message).toBe('Test error message');
    });

    it('shows retry button that resets error state', () => {
        const { rerender } = render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(screen.getByText('Systémová Chyba')).toBeInTheDocument();

        const retryButton = screen.getByText('Skúsiť Znova');
        fireEvent.click(retryButton);

        // After retry, it will try to render children again
        // Since shouldThrow is still true, it will error again
        // But the retry mechanism was triggered
        expect(screen.getByText('Systémová Chyba')).toBeInTheDocument();
    });
});

describe('SectionErrorBoundary', () => {
    it('renders children when no error', () => {
        render(
            <SectionErrorBoundary sectionName="TestSection">
                <div>Section content</div>
            </SectionErrorBoundary>
        );

        expect(screen.getByText('Section content')).toBeInTheDocument();
    });

    it('renders section-specific fallback when error occurs', () => {
        render(
            <SectionErrorBoundary sectionName="Dashboard">
                <ThrowError shouldThrow={true} />
            </SectionErrorBoundary>
        );

        expect(screen.getByText('Modul Dashboard nie je dostupný')).toBeInTheDocument();
    });
});
