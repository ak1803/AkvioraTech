'use client';

import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

export interface PageErrorBoundaryProps {
  children: ReactNode;
  routeName?: string;
  resetKey?: string | number;
  onReturnHome?: () => void;
  fallbackTitle?: string;
}

interface PageErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

interface ParsedErrorDetails {
  summary: string;
  context?: string;
}

function parseRuntimeError(error: Error | null): ParsedErrorDetails {
  if (!error || !error.message) {
    return {
      summary:
        'An unexpected runtime error occurred while rendering this section.',
    };
  }

  // Check if the error is a structured JSON string (e.g. FirestoreErrorInfo)
  const raw = error.message.trim();
  if (raw.startsWith('{') && raw.endsWith('}')) {
    try {
      const parsed = JSON.parse(raw) as {
        error?: string;
        operationType?: string;
        path?: string | null;
      };
      if (parsed.error) {
        return {
          summary: parsed.error,
          context: parsed.operationType
            ? `Operation: ${parsed.operationType}${parsed.path ? ` · Path: ${parsed.path}` : ''}`
            : undefined,
        };
      }
    } catch {
      // Fallback to standard error message
    }
  }

  return {
    summary: raw,
  };
}

export class PageErrorBoundary extends React.Component<
  PageErrorBoundaryProps,
  PageErrorBoundaryState
> {
  constructor(props: PageErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(
    error: Error
  ): Partial<PageErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(
      `[Akviora PageErrorBoundary${this.props.routeName ? ` · ${this.props.routeName}` : ''}]`,
      error,
      errorInfo
    );
  }

  componentDidUpdate(prevProps: PageErrorBoundaryProps): void {
    if (
      this.state.hasError &&
      this.props.resetKey !== undefined &&
      prevProps.resetKey !== this.props.resetKey
    ) {
      this.setState({
        hasError: false,
        error: null,
      });
    }
  }

  handleRetry = (): void => {
    this.setState((prev) => ({
      hasError: false,
      error: null,
      retryCount: prev.retryCount + 1,
    }));
  };

  handleGoHome = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
    if (this.props.onReturnHome) {
      this.props.onReturnHome();
    } else if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  render(): ReactNode {
    if (!this.state.hasError) {
      return (
        <React.Fragment key={this.state.retryCount}>
          {this.props.children}
        </React.Fragment>
      );
    }

    const { summary, context } = parseRuntimeError(this.state.error);
    const routeLabel = this.props.routeName || 'Current Page';

    return (
      <section
        role="alert"
        aria-live="assertive"
        className="pt-28 pb-20 px-4 sm:px-8 lg:px-12 max-w-[960px] mx-auto min-h-[70svh] flex items-center justify-center"
      >
        <div className="w-full rounded-[28px] border border-[rgba(255,255,255,0.12)] bg-gradient-to-br from-[#0A1424]/95 to-[#060B14]/95 p-7 sm:p-11 space-y-6 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#5CE1E6]">
            <AlertTriangle className="w-4 h-4 text-[#5CE1E6]" />
            <span>ROUTE RECOVERY BOUNDARY · {routeLabel.toUpperCase()}</span>
          </div>

          <div className="space-y-3">
            <h1 className="font-display text-3xl sm:text-4xl text-[#EAF4F8]">
              {this.props.fallbackTitle ||
                `We encountered a temporary issue loading ${routeLabel}.`}
            </h1>
            <p className="text-sm sm:text-base text-[#b8cdd8] max-w-[62ch] leading-relaxed">
              The rest of the Akviora Technologies platform remains active. You
              can retry rendering this view immediately or return to the main
              overview.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#060B14]/80 p-4 space-y-1.5">
            <div className="text-xs font-mono text-[#8EA6B4]">
              DIAGNOSTIC DETAILS
            </div>
            <p className="text-xs sm:text-sm font-mono text-[#EAF4F8]/90 break-words">
              {summary}
            </p>
            {context && (
              <p className="text-xs font-mono text-[#5CE1E6]">{context}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <MagneticButton variant="gradient" onClick={this.handleRetry}>
              <RotateCcw className="w-4 h-4" />
              <span>Retry Loading View</span>
            </MagneticButton>

            <MagneticButton variant="outline" onClick={this.handleGoHome}>
              <Home className="w-4 h-4" />
              <span>Return to Home</span>
            </MagneticButton>
          </div>
        </div>
      </section>
    );
  }
}

export default PageErrorBoundary;
