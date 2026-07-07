// ============================================================
// SILLAGE — ErrorBoundary
// A live product must never white-screen. Any uncaught render
// error (a lost WebGL context, a bad share payload…) lands on
// an editorial fallback with a reload, instead of a blank page.
// ============================================================

import { Component, type ReactNode } from 'react';

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Surface for debugging without crashing the tree.
    console.error('SILLAGE render error:', error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="grid min-h-[70vh] place-items-center px-6">
        <div className="max-w-[420px] rounded-panel border border-dashed border-[var(--line)] px-8 py-14 text-center">
          <p className="font-display text-[26px] leading-tight text-parchment">
            Something spilled.
          </p>
          <p className="mx-auto mt-3 font-sans text-[15px] leading-relaxed text-parchment-dim">
            An unexpected error interrupted the atlas. Your shelf and drafts are
            safe — they live in your browser.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-chip bg-champagne px-6 py-3 font-sans text-[13px] font-medium text-ink outline-none transition-colors hover:bg-champagne-bright hover:text-white"
          >
            Reload SILLAGE
          </button>
        </div>
      </div>
    );
  }
}
