import React from 'react';
import { RotateCcw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || 'An unexpected error occurred.',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('Application ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-white px-4 text-[#111111] dark:bg-[#111111] dark:text-white">
          <div className="w-full max-w-md rounded border border-[#E7E7E7] bg-[#F5F5F5] p-6 dark:border-[#262626] dark:bg-[#191919]">
            <p className="font-mono text-xs text-[#777777] dark:text-[#A3A3A3]">
              CodePath · Recovery
            </p>
            <h1 className="mt-2 text-lg font-semibold">Something went wrong</h1>
            <p className="mt-2 text-xs leading-relaxed text-[#777777] dark:text-[#A3A3A3]">
              We encountered an error syncing your workspace state. Reloading will restore your
              session safely.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 inline-flex h-9 items-center gap-2 rounded bg-[#111111] px-4 text-xs font-medium text-white transition-colors hover:bg-[#2B2B2B] dark:bg-white dark:text-[#111111] dark:hover:bg-[#E7E7E7]"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Reload Workspace</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
