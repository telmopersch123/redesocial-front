import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import { AppLayout } from '../AppLayout'
import RouterPost from '../components/componentsPages/PostsComponent.tsx/RouterPost'

import AnalysisLogin from '../pages/analysis/initLogin'
import { RouteValided } from '../pages/analysis/RouteValided'

import NotFoundPage from '@/utils/components/NotFoundPage'
import { AnalysisInitPage } from '../pages/analysis/RouterInitial'
import { RouterSupSentinelPosts } from '../pages/analysis/RouterSupSentinelPosts'
import { RouteSup } from '../pages/analysis/RouteSupAnalysis'
import { RouterSupSentinelPersons } from '../pages/analysis/RouteSupSentinelPersons'
import AuthenticadorPage from '../pages/AuthenticadorPage'
import AreaCommunitiesUserPage from '../pages/community/AreaCommunitiesUserPage'
import CommunityPage from '../pages/community/CommunityPage'
import ConfigCommunity from '../pages/community/ConfigCommunity'
import CreateCommunityPage from '../pages/community/CreateCommunityPage'
import { PostsArchived } from '../pages/community/PostsArchived'
import ConfigPerfilPage from '../pages/ConfigPerfilPage'
import DiaryPage from '../pages/DiaryPage'
import FeedPage from '../pages/FeedPage'
import MessagePage from '../pages/MessagePage'
import { default as MyPerfilPage } from '../pages/MyPerfilPage'
import OtherUserPerfilPage from '../pages/OtherUserPerfilPage'
import SelfCarePage from '../pages/SelfCarePage'
import Users from '../pages/Users'
import { SocialContextsWrapper } from '../SocialContextsWrapper'
import { ValidateRoute } from './ValidateRoute'

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        element={
          <SocialContextsWrapper>
            <Outlet />
          </SocialContextsWrapper>
        }
      >
        <Route element={<ValidateRoute />}>
          <Route path="/auth" element={<AuthenticadorPage />} />{' '}
        </Route>
        <Route element={<AppLayout />}>
          <Route path="/" element={<FeedPage />} />
          <Route path="/comunidades">
            <Route index element={<CommunityPage />} />
            <Route path="criar" element={<CreateCommunityPage />} />

            <Route path="comunidades-do-usuario">
              <Route index element={<AreaCommunitiesUserPage />} />

              <Route path=":communityName">
                <Route index element={<AreaCommunitiesUserPage />} />
                <Route path=":token" element={<AreaCommunitiesUserPage />} />
                <Route path="archived" element={<PostsArchived />} />
                <Route path="config" element={<ConfigCommunity />} />
              </Route>
            </Route>
          </Route>
          <Route path="/perfil">
            <Route index element={<MyPerfilPage />} />
            <Route path=":id" element={<OtherUserPerfilPage />} />
            <Route path="config" element={<ConfigPerfilPage />} />
            <Route path="*" element={<Navigate to="/perfil" replace />} />
          </Route>
          ////
          <Route path="/post/:id" element={<RouterPost />} />
          <Route path="/mensagens" element={<MessagePage />} />
          <Route path="/mensagens/:id" element={<MessagePage />} />
          <Route path="/diario" element={<DiaryPage />} />
          <Route path="/autocuidado" element={<SelfCarePage />} />
          <Route path="/usuarios">
            <Route index element={<Users />} />
            <Route path="perfil/:id">
              <Route index element={<OtherUserPerfilPage />} />
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path="/analysisLo" element={<AnalysisLogin />} />
      <Route
        path="/analysis"
        element={
          <RouteValided>
            <AnalysisInitPage />
          </RouteValided>
        }
      >
        <Route index element={<RouteSup />} />
        <Route path="denuncias-perfil" element={<RouterSupSentinelPersons />} />
        <Route path="denuncias-posts" element={<RouterSupSentinelPosts />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
