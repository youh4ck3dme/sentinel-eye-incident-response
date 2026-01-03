import { useCallback, useState } from 'react';

interface ErrorState {
    error: Error | null;
    isError: boolean;
}

type AsyncFunction<T extends unknown[], R> = (...args: T) => Promise<R>;

interface UseErrorHandlerOptions {
    onError?: (error: Error) => void;
    showToast?: boolean;
}

export function useErrorHandler<T extends unknown[], R>(
    asyncFn: AsyncFunction<T, R>,
    options?: UseErrorHandlerOptions
) {
    const [state, setState] = useState<ErrorState>({ error: null, isError: false });
    const [isLoading, setIsLoading] = useState(false);

    const execute = useCallback(
        async (...args: T): Promise<R | undefined> => {
            setState({ error: null, isError: false });
            setIsLoading(true);

            try {
                const result = await asyncFn(...args);
                return result;
            } catch (err) {
                const error = err instanceof Error ? err : new Error(String(err));
                setState({ error, isError: true });
                options?.onError?.(error);

                if (options?.showToast) {
                    console.error('🔴 Error:', error.message);
                }

                return undefined;
            } finally {
                setIsLoading(false);
            }
        },
        [asyncFn, options]
    );

    const reset = useCallback(() => {
        setState({ error: null, isError: false });
    }, []);

    return {
        execute,
        reset,
        isLoading,
        error: state.error,
        isError: state.isError
    };
}
