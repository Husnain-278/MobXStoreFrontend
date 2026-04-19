import { Component } from 'react';
import Button from './Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error?.message || 'Something went wrong.',
    };
  }

  componentDidCatch(error, errorInfo) {
    // Keep the console trace for debugging in development.
    console.error('UI error boundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center">
            <p className="text-xs font-semibold tracking-[0.22em] text-slate-400 uppercase">MobXStore</p>
            <h1 className="mt-3 text-3xl font-black text-slate-900">Something broke on this screen</h1>
            <p className="mt-3 text-sm text-slate-600">
              The app hit an unexpected UI error. Your data is still safe.
            </p>
            <p className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-500 wrap-break-word">
              {this.state.errorMessage}
            </p>
            <Button onClick={this.handleReload} className="mt-6">
              Reload app
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
