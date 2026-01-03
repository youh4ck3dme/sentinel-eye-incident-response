import React, { Component, ErrorInfo, ReactNode } from 'react';

export interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    resetKeys?: unknown[];
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorId: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorId: ''
        };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return {
            hasError: true,
            error,
            errorId: 'err-' + Math.random().toString(36).substring(2, 11)
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('🚨 Sentinel Eye Error:', {
            error: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            timestamp: new Date().toISOString(),
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
        });

        this.props.onError?.(error, errorInfo);
    }

    componentDidUpdate(prevProps: ErrorBoundaryProps): void {
        if (this.state.hasError && prevProps.resetKeys !== this.props.resetKeys) {
            this.setState({ hasError: false, error: null });
        }
    }

    handleRetry = (): void => {
        this.setState({ hasError: false, error: null });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[400px] flex items-center justify-center bg-zinc-900/50 rounded-3xl border border-red-500/30 p-8 md:p-12">
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                            <i className="fas fa-exclamation-triangle text-red-500 text-2xl md:text-3xl"></i>
                        </div>

                        <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-wider mb-2">
                            Systémová Chyba
                        </h2>

                        <p className="text-zinc-400 text-sm mb-6">
                            Nastal neočakávaný problém v Sentinel Eye moduli.
                        </p>

                        <div className="bg-black/40 rounded-xl p-4 mb-6 text-left">
                            <p className="text-[10px] font-mono text-red-400/80 break-all">
                                {this.state.error?.message}
                            </p>
                            <p className="text-[8px] font-mono text-zinc-600 mt-2">
                                Error ID: {this.state.errorId}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={this.handleRetry}
                                className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-sm transition-colors"
                            >
                                <i className="fas fa-redo mr-2"></i>
                                Skúsiť Znova
                            </button>

                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold text-sm transition-colors"
                            >
                                <i className="fas fa-sync mr-2"></i>
                                Reštart
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
