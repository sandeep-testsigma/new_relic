import React, { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import browserAgent from "../utils/newrelic";

// Utility functions for stack trace handling
const getStackTrace = (): string => {
  const error = new Error();
  return error.stack || "";
};

const captureErrorWithStackTrace = (
  error: Error,
  additionalData?: Record<string, unknown>
) => {
  try {
    // Get the current stack trace
    const stackTrace = error.stack || getStackTrace();

    // Add custom attributes with stack trace
    const attributes = {
      stackTrace,
      errorName: error.name,
      errorMessage: error.message,
      timestamp: new Date().toISOString(),
      ...additionalData,
    };

    // Use New Relic's noticeError API to send the error with custom attributes
    browserAgent.noticeError(error, attributes);

    // Also log to console for debugging
    console.error("Error captured with stack trace:", {
      error: error.message,
      stack: stackTrace,
      additionalData,
    });

    return attributes;
  } catch (captureError) {
    console.error("Failed to capture error with stack trace:", captureError);
    return null;
  }
};

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Capture error with stack trace and additional context
    captureErrorWithStackTrace(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: "AppErrorBoundary",
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorType: "react_error_boundary",
    });
    throw error;
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        this.props.fallback || (
          <div
            style={{
              padding: "20px",
              margin: "20px",
              border: "2px solid #ff6b6b",
              borderRadius: "8px",
              backgroundColor: "#fff5f5",
              color: "#d63031",
            }}
          >
            <h2>Something went wrong</h2>
            <p>
              An error occurred in the application. The error has been logged to
              New Relic for investigation.
            </p>
            <button
              onClick={() => {
                this.setState({
                  hasError: false,
                  error: undefined,
                  errorInfo: undefined,
                });
                window.location.reload();
              }}
              style={{
                marginTop: "10px",
                padding: "8px 16px",
                backgroundColor: "#ff6b6b",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Reload Page
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
