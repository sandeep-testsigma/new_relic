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

    // Use New Relic's noticeError API to send the error with custom attributes
    browserAgent.noticeError(error, attributes);

    // Also log to console for debugging
    console.error('Error captured with stack trace:', {
      error: error.message,
      stack: stackTrace,
      additionalData
    });

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

    // Create a custom error to send to New Relic
    const customError = new Error(message);
    customError.stack = stackTrace;
    
    // Send to New Relic with custom attributes
    browserAgent.noticeError(customError, attributes);
    
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

export const addCustomAttribute = (key: string, value: string | number | boolean | null) => {
  try {
    // Use New Relic's setCustomAttribute API
    browserAgent.setCustomAttribute(key, value);
    console.log(`Custom attribute added to New Relic: ${key} = ${value}`);
  } catch (error) {
    console.error('Failed to add custom attribute:', error);
  }
};

export const addToTrace = (name: string, start: number, end?: number, origin?: string, type?: string) => {
  try {
    // Use New Relic's addToTrace API with correct parameters
    browserAgent.addToTrace({ name, start, end, origin, type });
    console.log('Data added to New Relic trace:', { name, start, end, origin, type });
  } catch (error) {
    console.error('Failed to add data to trace:', error);
  }
};

export default browserAgent;
