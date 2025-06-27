import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import "./utils/newrelic";
import { captureErrorWithStackTrace, captureManualStackTrace, getStackTrace, addCustomAttribute, addToTrace } from './utils/newrelic';

function App() {
  const [count, setCount] = useState(0)

  const triggerReferenceError = () => {
    // This will cause a ReferenceError
    // @ts-expect-error - Intentionally causing a reference error for testing
    console.log(undefinedVariable);
  }

  const triggerTypeError = () => {
    // This will cause a TypeError
    const nullValue = null;
    // @ts-expect-error - Intentionally causing a type error for testing
    nullValue.someMethod();
  }

  const triggerCustomError = () => {
    // This will cause a custom error
    throw new Error("This is a test error for monitoring");
  }

  const triggerAsyncError = async () => {
    // This will cause an error in an async context
    setTimeout(() => {
      throw new Error("Async error for testing");
    }, 100);
  }

  const triggerUnhandledRejection = () => {
    // This will cause an unhandled promise rejection
    Promise.reject(new Error("Unhandled promise rejection test"));
  }

  const triggerErrorWithStackTrace = () => {
    try {
      // Simulate an error
      throw new Error("Custom error with enhanced stack trace");
    } catch (error) {
      // Capture error with additional context
      captureErrorWithStackTrace(error as Error, {
        userId: 'user123',
        action: 'button_click',
        page: 'home',
        customData: { someValue: 'test' }
      });
    }
  }

  const triggerManualStackTrace = () => {
    // Capture a manual stack trace for debugging
    captureManualStackTrace("User performed manual stack trace capture", {
      userId: 'user123',
      action: 'manual_stack_trace',
      timestamp: new Date().toISOString()
    });
  }

  const triggerGetStackTrace = () => {
    // Get current stack trace
    const stackTrace = getStackTrace();
    console.log('Current stack trace:', stackTrace);
    
    // Add custom attribute with proper type
    addCustomAttribute('stackTraceLength', stackTrace.split('\n').length);
    
    // Add to trace with timing information
    const startTime = performance.now();
    addToTrace('stackTraceCapture', startTime, undefined, 'user_action', 'debug');
  }

  const triggerErrorWithTryCatch = () => {
    try {
      // Simulate a complex operation that might fail
      const result = someComplexOperation();
      console.log('Operation result:', result);
    } catch (error) {
      // Enhanced error capture with context
      captureErrorWithStackTrace(error as Error, {
        operation: 'complexOperation',
        step: 'execution',
        context: 'user_triggered',
        severity: 'high'
      });
    }
  }

  const testNewRelicConnection = () => {
    try {
      // Test New Relic connection by adding custom attributes
      addCustomAttribute('testConnection', true);
      addCustomAttribute('testTimestamp', new Date().toISOString());
      addCustomAttribute('testNumber', 42);
      
      // Test trace addition
      const startTime = performance.now();
      addToTrace('newRelicTest', startTime, undefined, 'test', 'connection');
      
      console.log('✅ New Relic connection test completed successfully');
      alert('New Relic connection test completed! Check console for details.');
    } catch (error) {
      console.error('❌ New Relic connection test failed:', error);
      alert('New Relic connection test failed! Check console for details.');
    }
  }

  // Simulate a complex operation that might fail
  const someComplexOperation = () => {
    const random = Math.random();
    if (random > 0.5) {
      throw new Error(`Operation failed with random value: ${random}`);
    }
    return `Operation succeeded with value: ${random}`;
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Error Monitoring Test Page</h1>
      <div className="card">
        <button
          onClick={() => {
            setCount((count) => count + 1);
          }}
        >
          count is {count}
        </button>
        <p>
          This page is for testing error monitoring and stack trace capture. Click the buttons below to trigger different types of errors and stack traces.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
          <h3>Basic Error Tests:</h3>
          <button 
            onClick={triggerReferenceError}
            style={{ padding: '10px', backgroundColor: '#ff6b6b', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Trigger Reference Error
          </button>
          
          <button 
            onClick={triggerTypeError}
            style={{ padding: '10px', backgroundColor: '#4ecdc4', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Trigger Type Error
          </button>
          
          <button 
            onClick={triggerCustomError}
            style={{ padding: '10px', backgroundColor: '#45b7d1', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Trigger Custom Error
          </button>
          
          <button 
            onClick={triggerAsyncError}
            style={{ padding: '10px', backgroundColor: '#96ceb4', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Trigger Async Error
          </button>
          
          <button 
            onClick={triggerUnhandledRejection}
            style={{ padding: '10px', backgroundColor: '#feca57', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Trigger Unhandled Rejection
          </button>
        </div>
      </div>
    </>
  );
}

export default App
