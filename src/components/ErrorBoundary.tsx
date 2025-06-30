import { Component } from 'react';
import browserAgent from '../utils/newrelic';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props) {
    super(props);
    this.setErrorState = this.setErrorState.bind(this);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Once we integrate sentry we can log the error to sentry
    console.log({ error, extraInfo: errorInfo });
  }
  setErrorState() {
    this.setState({ hasError: false });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Error</h1>
        </div>
      );
    }

    return this.props.children;
  }
}
