import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import "./utils/newrelic";

function App() {
  const [count, setCount] = useState(0)


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
      <h1>React</h1>
      <div className="card">
        <button
          onClick={() => {
            try {
              setCounts((count) => count + 1);
            } catch (error) {
              if (window.newrelic) {
                window.newrelic.noticeError(error);
              } else {
                console.log("New Relic is not initialized");
              }
            }
          }}
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App
