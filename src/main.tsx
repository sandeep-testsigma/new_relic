import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import browserAgent from "./utils/newrelic";

// import ErrorBoundary from './components/ErrorBoundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <ErrorBoundary> */}
      <App />
    {/* </ErrorBoundary> */}
  </StrictMode>,
)
