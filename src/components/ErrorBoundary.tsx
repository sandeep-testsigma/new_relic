import { Component } from "react";
import NewRelicService from "../utils/new_relic";
interface ErrorBoundaryProps {
  children: React.ReactNode;
  newRelic: NewRelicService;
}

interface ErrorBoundaryState {
  hasError: boolean;
  newRelic: NewRelicService | null;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.setErrorState = this.setErrorState.bind(this);
    this.state = { hasError: false, newRelic: props.newRelic};
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if(this.props.newRelic !== prevProps.newRelic) {
      this.setState({newRelic: this.props.newRelic});
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Once we integrate sentry we can log the error to sentry
    this.state.newRelic?.sendError(error, errorInfo);
    this.state.newRelic?.sendPageAction("ErrorBoundary", {
      error: error.message,
      errorInfo: errorInfo.componentStack,
    });
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

export const ErrorBoundaryWrapper = ({ children, newRelic }: { children: React.ReactNode, newRelic: NewRelicService }) => {
  return <ErrorBoundary newRelic={newRelic}>{children}</ErrorBoundary>;
}; 
