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
import { NavLink, useLocation, useParams } from 'react-router-dom'
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
const comunidades = [
  'Mindfulness',
  'Autoajuda',
  'Fé & Espiritualidade',
] as const
export function AppSidebar() {
  const { open, setPostCommunity } = useCriarPostDialog()

  const [active, setActive] = useState('Feed')
  const { setOpenMobile } = useSidebar()
  const { isInComunidades, filtro, setFiltro } = useComunidades()
  const location = useLocation()

  const pathname = location.pathname
  const { id } = useParams()

  useEffect(() => {
    setOpenMobile(false)

    const itemPathe = items.find((item) => item.url === pathname)

    if (pathname === `/perfil/${id}` || pathname === `/perfil/${id}/config`) {
      setActive('Perfil')
    } else if (
      pathname === `/usuarios/perfil/${id}` ||
      pathname === `/usuarios/perfil/${id}/config`
    ) {
      setActive('Usuarios')
    } else if (
      pathname === '/comunidades/comunidade-do-usuario' ||
      pathname === '/comunidades/criar' ||
      pathname === '/comunidades/comunidade-do-usuario/config'
    ) {
      setActive('Comunidades')
    } else if (pathname === '/mensagens' || pathname === `/mensagens/${id}`) {
      setActive('Mensagens')
    } else {
      setActive(itemPathe?.title || 'Feed')
    }
  }, [location.pathname])
  return (
    <div
      className={` ${(pathname === '/' && '2xl:w-[134px]') || (pathname === '/comunidades/comunidade-do-usuario' && '2xl:w-[134px]') || (pathname === `/perfil/${id}` && '2xl:w-[130px]')} `}
    >
      <Sidebar side="left" className="border-r border-muted">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="my-4 mt-6 px-3 pb-4">
              <div className="flex items-center gap-3">
                <div className="relative rounded-xl bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-1 shadow-sm">
                  <div className="rounded-lg bg-white p-2">
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
                  <p className="text-lg font-semibold tracking-tight text-foreground">
                    Tess
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Saúde mental e apoio
                  </p>
                </div>
              </div>
            </SidebarGroupLabel>
            <Separator />
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
                              ? 'bg-gradient-to-r from-[#e9f0fb] via-[#ebeffb] to-[#f0edfb] text-[#3d3a64] shadow-sm'
                              : 'text-muted-foreground hover:bg-gradient-to-r hover:from-[#f0f3fc] hover:via-[#f0f2fb] hover:to-[#f0f1fb] hover:text-[#3d3a64]'
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

                  <p className="mx-auto mt-5 max-w-xs rounded-2xl bg-[#f1eefb] p-4 text-sm italic text-muted-foreground shadow-sm">
                    "Você não está sozinho. Estamos aqui para apoiar você."
                  </p>
                </div>
              </SidebarMenu>
              {isInComunidades && (
                <div className="mt-6 px-2">
                  <Separator className="mb-4" />

                  <div className={`w-full transition-all duration-300`}>
                    <div
                      className={`'w-0 opacity-0' : 'opacity-100'} overflow-hidden`}
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <Users className="h-5 w-5 text-purple-500" />
                        <h3 className="font-bold text-gray-800">Comunidades</h3>
                      </div>

                      <div className="mb-4 flex flex-col gap-3">
                        <Button
                          onClick={() => {
                            open()
                            setPostCommunity(true)
                          }}
                          className="bg-linear-purple w-full justify-start text-sm text-white shadow-md hover:shadow-lg"
                        >
                          <MessageCircleDashed className="mr-2 h-4 w-4" />
                          Criar post
                        </Button>
                      </div>

                      <div className="max-h-96 space-y-1 overflow-y-auto">
                        <Button
                          variant={filtro === 'all' ? 'default' : 'outline'}
                          className={`w-full justify-start text-sm ${
                            filtro === 'all'
                              ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                              : 'hover:border-purple-300 hover:text-purple-600'
                          }`}
                          onClick={() => setFiltro('all')}
                        >
                          <MessageCircleHeart className="mr-2 h-4 w-4" />
                          Todas
                        </Button>

                        {comunidades.map((c) => (
                          <Button
                            key={c}
                            variant={filtro === c ? 'default' : 'outline'}
                            className={`w-full justify-start text-sm ${
                              filtro === c
                                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                                : 'hover:border-purple-300 hover:text-purple-600'
                            }`}
                            onClick={() => setFiltro(c)}
                          >
                            <MessageCircleHeart className="mr-2 h-4 w-4" />
                            {c}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-muted p-4">
          <NavLink onClick={() => setActive('Perfil')} to={`/perfil/${0}`}>
            <div
              className={`${
                active === 'Perfil'
                  ? 'bg-gradient-to-r from-[#e9f0fb] via-[#ebeffb] to-[#f0edfb] text-[#3d3a64] shadow-sm'
                  : 'text-muted-foreground hover:bg-gradient-to-r hover:from-[#f0f3fc] hover:via-[#f0f2fb] hover:to-[#f0f1fb] hover:text-[#3d3a64]'
              } flex cursor-pointer items-center space-x-3 rounded-xl from-[#e9f0fb] via-[#ebeffb] to-[#f0edfb] p-2 text-[#3d3a64] transition-all duration-200 hover:bg-white/70 hover:bg-gradient-to-r hover:from-[#f0f3fc] hover:via-[#f0f2fb] hover:to-[#f0f1fb]`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dbcfff]">
                <UserRound className="h-5 w-5 text-[#3d3a64]" />
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">
                  Meu perfil
                </span>
                <span className="text-xs text-muted-foreground">
                  Carlos Almeida
                </span>
              </div>
            </div>
          </NavLink>
        </SidebarFooter>
      </Sidebar>
    </div>
  )
}
