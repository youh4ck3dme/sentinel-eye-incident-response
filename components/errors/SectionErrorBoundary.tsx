import React from 'react';
import ErrorBoundary from './ErrorBoundary';

interface Props {
    children: React.ReactNode;
    sectionName?: string;
    fallback?: React.ReactNode;
}

const SectionErrorBoundary: React.FC<Props> = ({ children, sectionName = 'Unknown', fallback: customFallback }) => {
    const handleError = (error: Error) => {
        console.warn(`[${sectionName}] Section Error:`, error.message);
    };

    const defaultFallback = (
        <div className="bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-800 p-6 md:p-8">
            <div className="flex items-center gap-3 text-zinc-500">
                <i className="fas fa-plug text-xl"></i>
                <div>
                    <p className="font-bold text-sm">Modul {sectionName} nie je dostupný</p>
                    <p className="text-xs">Táto sekcia bude obnovená po reštarte.</p>
                </div>
            </div>
        </div>
    );

    return (
        <ErrorBoundary fallback={customFallback || defaultFallback} onError={handleError}>
            {children}
        </ErrorBoundary>
    );
};

export default SectionErrorBoundary;
