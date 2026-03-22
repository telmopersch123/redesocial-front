import { Outlet } from 'react-router-dom'
import { SidebarProvider } from './components/ui/sidebar'
import BreathingProvider from './context/BreathingContext'
import { ChatProvider } from './context/ChatContext'
import { ComunidadesProvider } from './context/CommunityContext'
import { CriarPostDialogProvider } from './context/ContextDialogPost'
import { AuthProvider } from './context/getMe.tsx'
import { MyProfileProvider } from './context/MyProfileContext'
import { NotificationProvider } from './context/NotificationProvider.tsx'
import { OpenMentionsProvider } from './context/openMentions'
import { PostsProvider } from './context/PostsContext'
import { RefreshPermissionProvider } from './context/RefreshPermissionContext.tsx'
import { ResetPasswordProvider } from './context/ResetPasswordContext.tsx'
import { VideoProvider } from './context/VideoContext'
import { ViewedProfileProvider } from './context/ViewedProfileContext'
// src/context/SocialContextsWrapper.tsx
export const SocialContextsWrapper = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <ResetPasswordProvider>
      <AuthProvider>
        <NotificationProvider>
          <RefreshPermissionProvider>
            <ChatProvider>
              <MyProfileProvider>
                <ViewedProfileProvider>
                  <PostsProvider>
                    <VideoProvider>
                      <OpenMentionsProvider>
                        <BreathingProvider>
                          <ComunidadesProvider>
                            <SidebarProvider>
                              <CriarPostDialogProvider>
                                {children || <Outlet />}
                              </CriarPostDialogProvider>
                            </SidebarProvider>
                          </ComunidadesProvider>
                        </BreathingProvider>
                      </OpenMentionsProvider>
                    </VideoProvider>
                  </PostsProvider>
                </ViewedProfileProvider>
              </MyProfileProvider>
            </ChatProvider>
          </RefreshPermissionProvider>
        </NotificationProvider>
      </AuthProvider>
    </ResetPasswordProvider>
  )
}
