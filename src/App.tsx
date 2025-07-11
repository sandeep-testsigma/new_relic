import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useEffect, useState } from 'react'

function App() {
  const [count,setCount] = useState(0)

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

  if(count === 2) {
    throw new Error("Test error");
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
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App
