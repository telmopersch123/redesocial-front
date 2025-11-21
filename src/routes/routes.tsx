import { Route, Routes } from 'react-router-dom'

import { AppLayout } from '../AppLayout'
import AreaCommunitiesUserPage from '../pages/community/AreaCommunitiesUserPage'
import CommunityPage from '../pages/community/CommunityPage'
import ConfigCommunity from '../pages/community/ConfigCommunity'
import CreateCommunityPage from '../pages/community/CreateCommunityPage'
import ConfigPerfilPage from '../pages/ConfigPerfilPage'
import DiaryPage from '../pages/DiaryPage'
import FeedPage from '../pages/FeedPage'
import MessagePage from '../pages/MessagePage'
import PerfilPage from '../pages/PerfilPage'
import SelfCarePage from '../pages/SelfCarePage'
import Users from '../pages/Users'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<FeedPage />} />
        <Route path="/comunidades">
          <Route index element={<CommunityPage />} />
          <Route path="criar" element={<CreateCommunityPage />} />
          <Route path="comunidade-do-usuario">
            <Route index element={<AreaCommunitiesUserPage />} />
            <Route path="config" element={<ConfigCommunity />} />
          </Route>
        </Route>
        <Route path="/perfil/:id">
          <Route index element={<PerfilPage />} />
          <Route path="config" element={<ConfigPerfilPage />} />
        </Route>
        ////
        <Route path="/mensagens" element={<MessagePage />} />
        <Route path="/mensagens/:id" element={<MessagePage />} />
        <Route path="/diario" element={<DiaryPage />} />
        <Route path="/autocuidado" element={<SelfCarePage />} />
        <Route path="/usuarios">
          <Route index element={<Users />} />
          <Route path="perfil/:id" element={<PerfilPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
