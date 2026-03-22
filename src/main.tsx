import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider.tsx'

import './index.css'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <BrowserRouter>
//       <ResetPasswordProvider>
//         <AuthProvider>
//           <ChatProvider>
//             <NotificationProvider>
//               <MyProfileProvider>
//                 <ViewedProfileProvider>
//                   <RefreshPermissionProvider>
//                     <PostsProvider>
//                       <VideoProvider>
//                         <ThemeProvider>
//                           <OpenMentionsProvider>
//                             <BreathingProvider>
//                               <ComunidadesProvider>
//                                 <SidebarProvider>
//                                   <CriarPostDialogProvider>
//                                     <App />
//                                   </CriarPostDialogProvider>
//                                 </SidebarProvider>
//                               </ComunidadesProvider>
//                             </BreathingProvider>
//                           </OpenMentionsProvider>
//                         </ThemeProvider>
//                       </VideoProvider>
//                     </PostsProvider>
//                   </RefreshPermissionProvider>
//                 </ViewedProfileProvider>
//               </MyProfileProvider>
//             </NotificationProvider>
//           </ChatProvider>
//         </AuthProvider>
//       </ResetPasswordProvider>
//     </BrowserRouter>
//   </StrictMode>
// )
