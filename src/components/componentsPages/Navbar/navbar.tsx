import {
  BookHeart,
  Heart,
  Home,
  MessageCircle,
  UserRound,
  UsersRound,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
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

// Menu items
const items = [
  { title: 'Feed', url: '/', icon: Home },
  { title: 'Comunidades', url: '/comunidades', icon: UsersRound },
  { title: 'Mensagens', url: '/mensagens', icon: MessageCircle },
  { title: 'Diário', url: '/diario', icon: BookHeart },
  { title: 'Autocuidado', url: '/autocuidado', icon: Heart },
]

export function AppSidebar() {
  const [active, setActive] = useState('Feed')
  const { setOpenMobile } = useSidebar()
  const location = useLocation()
  const pathname = location.pathname

  useEffect(() => {
    setOpenMobile(false)

    const itemPathe = items.find((item) => item.url === pathname)
    if (pathname === '/perfil') {
      setActive('Perfil')
    } else {
      setActive(itemPathe?.title || 'Feed')
    }
  }, [location.pathname])
  return (
    <Sidebar className="border-r border-muted">
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
            <SidebarMenu className="space-y-1 px-2">
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
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-muted p-4">
        <NavLink onClick={() => setActive('Perfil')} to="/perfil">
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
  )
}
