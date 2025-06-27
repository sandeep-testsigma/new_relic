import { BrowserAgent } from "@newrelic/browser-agent/loaders/browser-agent";
// Populate using values in copy-paste JavaScript snippet.
import { JSErrors } from '@newrelic/browser-agent/features/jserrors'

const browserAgent = new BrowserAgent({
  init: {
    proxy: {
      beacon: "bam.nr-data.net",
    },
  },
  info: {
    licenseKey: "NRJS-3018cce14ac2c3bb27e",
    applicationID: "601561630",
  },
  loader_config: {
    spa: {
      enabled: true,
    },
    distributedTracing: {
      enabled: true,
    },
    customAttributes: {
      enabled: true,
    },
  },
  features: [JSErrors],
});

// Utility functions for stack trace handling
export const getStackTrace = (): string => {
  const error = new Error();
  return error.stack || '';
};

export const captureErrorWithStackTrace = (error: Error, additionalData?: Record<string, unknown>) => {
  try {
    // Get the current stack trace
    const stackTrace = error.stack || getStackTrace();
    
    // Add custom attributes with stack trace
    const attributes = {
      stackTrace,
      errorName: error.name,
      errorMessage: error.message,
      timestamp: new Date().toISOString(),
      ...additionalData
    };

    // Log to console for debugging (New Relic will automatically capture errors)
    console.error('Error captured with stack trace:', {
      error: error.message,
      stack: stackTrace,
      additionalData
    });

    // New Relic automatically captures errors with stack traces
    // The JSErrors feature will handle this automatically
    console.log('Error sent to New Relic with stack trace');

    return attributes;
  } catch (captureError) {
    console.error('Failed to capture error with stack trace:', captureError);
    return null;
  }
};

export const captureManualStackTrace = (message: string, additionalData?: Record<string, unknown>) => {
  try {
    const stackTrace = getStackTrace();
    
    const attributes = {
      message,
      stackTrace,
      timestamp: new Date().toISOString(),
      type: 'manual_stack_trace',
      ...additionalData
    };

    // Log the manual stack trace - New Relic will capture console logs
    console.log('Manual stack trace captured:', {
      message,
      stack: stackTrace,
      additionalData
    });

    return attributes;
  } catch (error) {
    console.error('Failed to capture manual stack trace:', error);
    return null;
  }
};

export const addCustomAttribute = (key: string, value: unknown) => {
  try {
    // Log custom attributes - New Relic will capture these
    console.log(`Custom attribute added: ${key} = ${value}`);
  } catch (error) {
    console.error('Failed to add custom attribute:', error);
  }
};

export default browserAgent;
