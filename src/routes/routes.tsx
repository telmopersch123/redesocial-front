import { Route, Routes } from 'react-router-dom'
import AutoCuidadoPage from '../pages/AutoCuidadoPage'
import ComunidadesPage from '../pages/ComunidadesPage'
import DiarioPage from '../pages/DiarioPage'
import FeedPage from '../pages/FeedPage'
import MensagensPage from '../pages/MensagensPage'
import PerfilPage from '../pages/PerfilPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<FeedPage />} />
      <Route path="/comunidades" element={<ComunidadesPage />} />
      <Route path="/mensagens" element={<MensagensPage />} />
      <Route path="/diario" element={<DiarioPage />} />
      <Route path="/autocuidado" element={<AutoCuidadoPage />} />
      <Route path="/perfil" element={<PerfilPage />} />
    </Routes>
  )
}
