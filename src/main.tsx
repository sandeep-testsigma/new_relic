import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundaryWrapper } from './components/ErrorBoundary.tsx'
import NewRelicService from './utils/new_relic.ts'

const newRelic = new NewRelicService();
newRelic.init();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ErrorBoundaryWrapper newRelic={newRelic}>
        <App />
      </ErrorBoundaryWrapper>
  </StrictMode>,
)
