import { Component } from "react";
import { sendError } from "../utils/new_relic";

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
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.setErrorState = this.setErrorState.bind(this);
    this.state = { hasError: false};
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Once we integrate sentry we can log the error to sentry
    sendError(error, errorInfo);
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
