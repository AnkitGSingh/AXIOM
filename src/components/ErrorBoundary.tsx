'use client';

import React from 'react';

export class GlobalErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // React 19: componentDidCatch also fires for errors in effects and event handlers.
    // Ensure state is set so the fallback renders.
    if (!this.state.hasError) {
      this.setState({ hasError: true, error });
    }
    console.error('[GlobalErrorBoundary] caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: '#080808', color: '#C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', textAlign: 'center' }}>
          <div>
            <p style={{ fontSize: '1.5rem', letterSpacing: '0.2em', marginBottom: '1rem' }}>SYSTEM FAILURE</p>
            <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>An unexpected error occurred. Please reload the page.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
