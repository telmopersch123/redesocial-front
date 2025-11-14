import { Route, Routes } from 'react-router-dom'

import AreaCommunitiesUserPage from '../pages/community/AreaCommunitiesUserPage'
import CommunityPage from '../pages/community/CommunityPage'
import ConfigCommunity from '../pages/community/ConfigCommunity'
import CreateCommunityPage from '../pages/community/CreateCommunityPage'
import DiaryPage from '../pages/DiaryPage'
import FeedPage from '../pages/FeedPage'
import MessagePage from '../pages/MessagePage'
import PerfilPage from '../pages/PerfilPage'
import SelfCarePage from '../pages/SelfCarePage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<FeedPage />} />
      <Route path="/comunidades">
        <Route index element={<CommunityPage />} />
        <Route path="criar" element={<CreateCommunityPage />} />
        <Route path="usuario">
          <Route index element={<AreaCommunitiesUserPage />} />
          <Route path="config" element={<ConfigCommunity />} />
        </Route>
      </Route>
      <Route path="/mensagens" element={<MessagePage />} />
      <Route path="/diario" element={<DiaryPage />} />
      <Route path="/autocuidado" element={<SelfCarePage />} />
      <Route path="/perfil" element={<PerfilPage />} />
    </Routes>
  )
}
