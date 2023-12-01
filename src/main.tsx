import React from 'react'
import ReactDOM from 'react-dom/client'
import { StyledEngineProvider, CssVarsProvider } from '@mui/joy/styles';
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <CssVarsProvider>
        <App />
      </CssVarsProvider>
    </StyledEngineProvider>
  </React.StrictMode>,
)
