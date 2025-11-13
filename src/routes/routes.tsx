import { Route, Routes } from 'react-router-dom'
import AreaCommunitiesUserPage from '../pages/AreaCommunitiesUserPage'
import CommunityPage from '../pages/CommunityPage'
import CreateCommunityPage from '../pages/CreateCommunityPage'
import DiaryPage from '../pages/DiaryPage'
import FeedPage from '../pages/FeedPage'
import MessagePage from '../pages/MessagePage'
import PerfilPage from '../pages/PerfilPage'
import SelfCarePage from '../pages/SelfCarePage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<FeedPage />} />
      <Route path="/comunidades" element={<CommunityPage />} />
      <Route path="/criar_comunidade" element={<CreateCommunityPage />} />
      <Route path="/mensagens" element={<MessagePage />} />
      <Route path="/diario" element={<DiaryPage />} />
      <Route path="/autocuidado" element={<SelfCarePage />} />
      <Route path="/perfil" element={<PerfilPage />} />
      <Route
        path="/comunidades_usuario"
        element={<AreaCommunitiesUserPage />}
      />
    </Routes>
  )
}
