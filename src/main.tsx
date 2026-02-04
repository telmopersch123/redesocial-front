import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider.tsx'
import { SidebarProvider } from './components/ui/sidebar.tsx'
import BreathingProvider from './context/BreathingContext.tsx'
import { ComunidadesProvider } from './context/CommunityContext.tsx'
import { CriarPostDialogProvider } from './context/ContextDialogPost.tsx'
import { AuthProvider } from './context/getMe.tsx'
import { OpenMentionsProvider } from './context/openMentions.tsx'

import { ChatProvider } from './context/ChatContext.tsx'
import { NotificationProvider } from './context/NotificationProvider.tsx'
import { PostsProvider } from './context/PostsContext.tsx'
import { ProfileProvider } from './context/ProfileContext.tsx'
import { RefreshPermissionProvider } from './context/RefreshPermissionContext.tsx'
import { ResetPasswordProvider } from './context/ResetPasswordContext.tsx'
import { VideoProvider } from './context/VideoContext.tsx'
import './index.css'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ResetPasswordProvider>
        <AuthProvider>
          <ChatProvider>
            <NotificationProvider>
              <ProfileProvider>
                <RefreshPermissionProvider>
                  <PostsProvider>
                    <VideoProvider>
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
                    </VideoProvider>
                  </PostsProvider>
                </RefreshPermissionProvider>
              </ProfileProvider>
            </NotificationProvider>
          </ChatProvider>
        </AuthProvider>
      </ResetPasswordProvider>
    </BrowserRouter>
  </StrictMode>
)
