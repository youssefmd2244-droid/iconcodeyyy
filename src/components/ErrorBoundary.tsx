import React from "react";

interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center p-8">
          <div className="text-center space-y-4 max-w-md">
            <div className="text-6xl">⚠️</div>
            <h2 className="text-xl font-bold text-white">Something went wrong</h2>
            <p className="text-sm text-gray-400">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: undefined });
                window.location.reload();
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium text-sm hover:opacity-90 transition"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
