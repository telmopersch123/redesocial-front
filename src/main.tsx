import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

import { BrowserRouter } from 'react-router-dom'
import { PostDialog } from './components/componentsPages/componentsFeed/PostDialog.tsx'
import { AppSidebar } from './components/componentsPages/Navbar/navbar.tsx'
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar.tsx'
import { ComunidadesProvider } from './context/CommunityContext.tsx'
import { CriarPostDialogProvider } from './context/ContextDialogPost.tsx'
import './index.css'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ComunidadesProvider>
        <SidebarProvider>
          <CriarPostDialogProvider>
            <AppSidebar />
            <main className="flex-shrink-0 overflow-x-auto">
              <SidebarTrigger className="absolute left-0 top-0 m-3 bg-gray-500/5 p-3 transition-all ease-linear hover:bg-gray-500/15" />
              <PostDialog />
              <App />
            </main>
          </CriarPostDialogProvider>
        </SidebarProvider>
      </ComunidadesProvider>
    </BrowserRouter>
  </StrictMode>
)
