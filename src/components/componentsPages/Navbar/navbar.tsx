import {
  BookHeart,
  Heart,
  HeartHandshake,
  Home,
  MessageCircle,
  MessageCircleDashed,
  MessageCircleHeart,
  UserRound,
  Users,
  UsersRound,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Separator } from '../../ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '../../ui/sidebar'
import DialogHelp from './DialogHelp'

import { useComunidades } from '../../../context/CommunityContext'
import { useCriarPostDialog } from '../../../context/ContextDialogPost'
import { useAuth } from '../../../context/getMe'
import { normalizeURL } from '../../../pages/community/AreaCommunitiesUserPage'
import { getMyCommunities } from '../../../services/authService'
import type { CommunityInterface } from '../../../types'
import { ToggleThemeButton } from '../../../utils/components/toggleTheme'
import { Button } from '../../ui/button'

// Menu items
const items = [
  { title: 'Feed', url: '/', icon: Home },
  { title: 'Comunidades', url: '/comunidades', icon: HeartHandshake },
  { title: 'Usuarios', url: '/usuarios', icon: UsersRound },
  { title: 'Mensagens', url: '/mensagens', icon: MessageCircle },
  { title: 'Diário', url: '/diario', icon: BookHeart },
  { title: 'Autocuidado', url: '/autocuidado', icon: Heart },
]

const isSelected = (communityId: number, filtro: 'all' | number) => {
  if (filtro === 'all') return false
  return communityId === filtro
}

export function AppSidebar() {
  const navigate = useNavigate()
  const { open, setPostCommunity, myCommunities, setMyCommunities } =
    useCriarPostDialog()
  const [active, setActive] = useState('Feed')
  const { setOpenMobile } = useSidebar()
  const { filtro, setFiltro } = useComunidades()
  const location = useLocation()
  const pathname = location.pathname
  const { communityName, id } = useParams()
  const { user } = useAuth()

  const currentPath = decodeURIComponent(location.pathname)

  let isInComunidades =
    currentPath === '/comunidades/comunidades-do-usuario' ||
    currentPath === `/comunidades/comunidades-do-usuario/${communityName}` ||
    currentPath ===
      `/comunidades/comunidades-do-usuario/${communityName}/config` ||
    currentPath ===
      `/comunidades/comunidades-do-usuario/${communityName}/${id}` ||
    currentPath ===
      `/comunidades/comunidades-do-usuario/${communityName}/archived`

  useEffect(() => {
    setOpenMobile(false)

    const itemPathe = items.find((item) => item.url === pathname)

    if (pathname === `/perfil` || pathname === `/perfil/config`) {
      setActive('Perfil')
    } else if (pathname === `/usuarios/perfil/${id}`) {
      setActive('Usuarios')
    } else if (
      pathname === '/comunidades/comunidades-do-usuario' ||
      pathname === `/comunidades/comunidades-do-usuario/${communityName}` ||
      pathname ===
        `/comunidades/comunidades-do-usuario/${communityName}/config` ||
      pathname ===
        `/comunidades/comunidades-do-usuario/${communityName}/${id}` ||
      pathname ===
        `/comunidades/comunidades-do-usuario/${communityName}/archived` ||
      pathname === '/comunidades/criar' ||
      pathname === '/comunidades/comunidades-do-usuario/config'
    ) {
      setActive('Comunidades')
    } else if (pathname === '/mensagens' || pathname === `/mensagens/${id}`) {
      setActive('Mensagens')
    } else {
      setActive(itemPathe?.title || 'Feed')
    }
  }, [location.pathname])
  useEffect(() => {
    if (!communityName) {
      setFiltro('all')
      return
    }

    const found = myCommunities.find(
      (c: CommunityInterface) =>
        normalizeURL(c.nameComunity) === communityName.toLowerCase()
    )

    if (found) {
      setFiltro(found.id)
    }
  }, [communityName, myCommunities, setFiltro])

  useEffect(() => {
    async function handleSearchMyComunity() {
      const res = await getMyCommunities()
      setMyCommunities(res)
    }
    handleSearchMyComunity()
  }, [pathname])

  return (
    <div
      className={`${
        pathname === '/' ||
        pathname === '/comunidades/comunidades-do-usuario' ||
        pathname === `/comunidades/comunidades-do-usuario/${communityName}` ||
        pathname ===
          `/comunidades/comunidades-do-usuario/${communityName}/config` ||
        pathname ===
          `/comunidades/comunidades-do-usuario/${communityName}/${id}` ||
        pathname ===
          `/comunidades/comunidades-do-usuario/${communityName}/archived` ||
        pathname === `/perfil`
          ? '2xl:w-[134px]'
          : ''
      }`}
    >
      <Sidebar
        side="left"
        className="z-40 border-r border-zinc-200 dark:border-zinc-800"
      >
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="my-4 mt-6 px-3 pb-4">
              <div className="flex items-center gap-3">
                <div className="absolute right-2 top-1">
                  <ToggleThemeButton />
                </div>
                <div className="relative rounded-xl bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 p-1 shadow-sm dark:from-purple-900/50 dark:via-purple-800/50 dark:to-indigo-900/50">
                  <div className="rounded-lg bg-white p-2 dark:bg-zinc-900">
                    <img
                      src="/logo.png"
                      width={40}
                      height={40}
                      alt="Logo da Tess"
                      className="h-10 w-10 object-contain"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <p className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    Tess
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Saúde mental e apoio
                  </p>
                </div>
              </div>
            </SidebarGroupLabel>

            <Separator className="dark:bg-zinc-800" />

            <SidebarGroupContent className="pt-3">
              <SidebarMenu className="space-y-1">
                {items.map((item) => {
                  const isActive = active === item.title
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          className={`flex w-full items-center justify-start gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? 'bg-purple-100 text-purple-800 shadow-sm dark:bg-purple-900/50 dark:text-purple-300'
                              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                          }`}
                          onClick={() => setActive(item.title)}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}

                <div className="!mt-10 text-center">
                  <DialogHelp />

                  <p className="mx-auto mt-5 max-w-xs rounded-2xl bg-purple-50 p-4 text-sm italic text-purple-700 shadow-sm dark:bg-purple-900/30 dark:text-purple-300">
                    "Você não está sozinho. Estamos aqui para apoiar você."
                  </p>
                </div>
              </SidebarMenu>

              {isInComunidades && (
                <div className="mt-6 px-2 sm:px-3 lg:px-4">
                  <Separator className="mb-4 bg-zinc-200 dark:bg-zinc-800" />

                  {/* Header */}
                  <div className="mb-3 flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      Comunidades
                    </h3>
                  </div>

                  {/* Criar post */}
                  <div className="mb-4">
                    <Button
                      onClick={() => {
                        open()
                        setPostCommunity(true)
                      }}
                      className="bg-linear-purple w-full justify-start gap-2 text-sm font-medium text-white shadow-md hover:shadow-lg dark:shadow-none dark:hover:shadow-purple-500/20"
                    >
                      <MessageCircleDashed className="h-4 w-4" />
                      Criar post
                    </Button>
                  </div>

                  {/* Lista */}
                  <div className="scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 max-h-96 space-y-1.5 overflow-y-auto pr-1">
                    {/* Todas */}
                    <Button
                      variant={filtro === 'all' ? 'default' : 'outline'}
                      className={`w-full justify-start gap-2 text-sm font-medium transition-colors ${
                        filtro === 'all'
                          ? `bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500`
                          : `border-zinc-300 text-zinc-700 hover:bg-purple-50 hover:text-purple-700 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-purple-400`
                      }`}
                      onClick={() => {
                        setFiltro('all')
                        navigate('/comunidades/comunidades-do-usuario')
                      }}
                    >
                      <MessageCircleHeart className="h-4 w-4" />
                      Todas
                    </Button>

                    {/* Comunidades */}
                    {myCommunities.map((community: CommunityInterface) => (
                      <Button
                        key={community.id}
                        variant={
                          isSelected(community.id, filtro)
                            ? 'default'
                            : 'outline'
                        }
                        className={`w-full justify-start gap-2 text-sm font-medium transition-colors ${
                          isSelected(community.id, filtro)
                            ? `bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500`
                            : `border-zinc-300 text-zinc-700 hover:bg-purple-50 hover:text-purple-700 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-purple-400`
                        }`}
                        onClick={() => {
                          setFiltro(community.id)
                          const nomeURL = normalizeURL(community.nameComunity)
                          navigate(
                            `/comunidades/comunidades-do-usuario/${nomeURL}`,
                            { state: { communityId: community.id } }
                          )
                        }}
                      >
                        {community.image ? (
                          <img
                            className="h-4 w-4 rounded-full"
                            src={community.image}
                            alt={community.nameComunity}
                          />
                        ) : (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                            <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                        )}
                        <span className="truncate">
                          {community.nameComunity}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-zinc-200 p-4 dark:border-zinc-800">
          <NavLink
            onClick={() => setActive('Perfil')}
            to={user ? `/perfil` : '/auth'}
          >
            <div
              className={`${
                active === 'Perfil'
                  ? 'bg-purple-100 text-purple-800 shadow-sm dark:bg-purple-900/50 dark:text-purple-300'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
              } flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-all duration-200`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-200 dark:bg-purple-900/70">
                <UserRound className="h-5 w-5 text-purple-800 dark:text-purple-300" />
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Meu perfil
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {user ? user.name_at : 'Não logado'}
                </span>
              </div>
            </div>
          </NavLink>
        </SidebarFooter>
      </Sidebar>
    </div>
  )
}
