import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider.tsx'
import { SidebarProvider } from './components/ui/sidebar.tsx'
import BreathingProvider from './context/BreathingContext.tsx'
import { ComunidadesProvider } from './context/CommunityContext.tsx'
import { CriarPostDialogProvider } from './context/ContextDialogPost.tsx'
import { OpenMentionsProvider } from './context/openMentions.tsx'
import './index.css'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <OpenMentionsProvider>
          <BreathingProvider>
            <ComunidadesProvider>
              <SidebarProvider>
                <CriarPostDialogProvider>
                  <App />
                </CriarPostDialogProvider>
              </SidebarProvider>
            </ComunidadesProvider>
          </BreathingProvider>
        </OpenMentionsProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)
