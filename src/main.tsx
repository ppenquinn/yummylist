import React from 'react'
import ReactDOM from 'react-dom/client'
import { StyledEngineProvider, CssVarsProvider } from '@mui/joy/styles';
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <CssVarsProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </CssVarsProvider>
    </StyledEngineProvider>
  </React.StrictMode>,
)
