// components/BatePapoSidebar.tsx
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, MessageCircle, Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Badge } from '../../..//components/ui/badge'
import { Input } from '../../..//components/ui/input'
import { ScrollArea } from '../../..//components/ui/scroll-area'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../../..//components/ui/sidebar'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../../components/ui/avatar'
import { Button } from '../../ui/button'
import { Separator } from '../../ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '../../ui/sheet'

interface Conversa {
  id: number
  nome: string
  avatar: string
  online: boolean
  ultimaMensagem: {
    texto: string
    enviadaPorMim: boolean
    data: Date
    naoLida?: boolean
  } | null
}

const conversasFicticias: Conversa[] = [
  {
    id: 1,
    nome: 'Ana Clara',
    avatar: 'https://i.pravatar.cc/150?img=1',
    online: true,
    ultimaMensagem: {
      texto: 'Tô morrendo de rir com esse meme kkkk',
      enviadaPorMim: false,
      data: new Date(Date.now() - 1000 * 60 * 2),
      naoLida: true,
    },
  },
  {
    id: 2,
    nome: 'Lucas Mendes',
    avatar: 'https://i.pravatar.cc/150?img=5',
    online: true,
    ultimaMensagem: {
      texto: 'Beleza, te passo o arquivo agora',
      enviadaPorMim: true,
      data: new Date(Date.now() - 1000 * 60 * 15),
    },
  },
  {
    id: 3,
    nome: 'Mariana Silva',
    avatar: 'https://i.pravatar.cc/150?img=12',
    online: false,
    ultimaMensagem: {
      texto: 'Valeu mesmo pela ajuda ontem',
      enviadaPorMim: false,
      data: new Date(Date.now() - 1000 * 60 * 60 * 5),
    },
  },
  {
    id: 4,
    nome: 'Pedro Albuquerque',
    avatar: 'https://i.pravatar.cc/150?img=8',
    online: false,
    ultimaMensagem: null,
  },
  {
    id: 5,
    nome: 'Julia Costa',
    avatar: 'https://i.pravatar.cc/150?img=3',
    online: true,
    ultimaMensagem: {
      texto: 'Já to descendo!',
      enviadaPorMim: true,
      data: new Date(Date.now() - 1000 * 60 * 3),
    },
  },
]
const BREAKPOINT = 1640
const ROTAS_COM_SIDEBAR = ['/', '/comunidades/comunidade-do-usuario']
export const BatePapoSidebar = () => {
  const { pathname } = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const timeoutRef = useRef<number | null>(null)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= BREAKPOINT)
  const [isOpen, setIsOpen] = useState(true)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= BREAKPOINT
      const rotaPermitida = ROTAS_COM_SIDEBAR.includes(pathname)
      if (rotaPermitida) {
        setIsDesktop(desktop)
        setIsOpen(desktop)
      } else {
        setIsDesktop(false)
        setIsOpen(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [isDesktop, pathname])

  if (!ROTAS_COM_SIDEBAR.includes(pathname)) {
    return null
  }
  const SidebarContentComponent = () => (
    <>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="rounded-xl bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-1 shadow-sm">
                <div className="rounded-lg bg-white p-2">
                  <MessageCircle className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Mensagens</h2>
              <p className="text-xs text-muted-foreground">3 não lidas</p>
            </div>
          </div>
        </div>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar conversa..."
            className="bg-muted/50 pl-10 focus:ring-purple-500"
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="h-full">
          <SidebarMenu className="space-y-3 p-3">
            {conversasFicticias.map((conversa) => (
              <NavLink key={conversa.id} to={`/mensagens`}>
                <SidebarMenuItem key={conversa.id}>
                  <SidebarMenuButton
                    asChild
                    className="h-[50px] w-full justify-start gap-3 rounded-lg p-3 transition-all hover:bg-gradient-to-r hover:from-[#f0f3fc] hover:via-[#f0f2fb] hover:to-[#f0f1fb] hover:text-[#3d3a64]"
                  >
                    <div className="flex w-full cursor-pointer items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12 ring-2 ring-background">
                          <AvatarImage src={conversa.avatar} />
                          <AvatarFallback>
                            {conversa.nome
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        {conversa.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                        )}
                      </div>

                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <p className="truncate font-medium">
                            {conversa.nome}
                          </p>
                          {conversa.ultimaMensagem && (
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(
                                conversa.ultimaMensagem.data,
                                {
                                  addSuffix: true,
                                  locale: ptBR,
                                }
                              )}
                            </span>
                          )}
                        </div>

                        {conversa.ultimaMensagem ? (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            {conversa.ultimaMensagem.enviadaPorMim && (
                              <span className="text-xs">Você: </span>
                            )}
                            <span className="truncate">
                              {conversa.ultimaMensagem.texto}
                            </span>
                            {conversa.ultimaMensagem.naoLida && (
                              <Badge className="bg-linear-purple ml-2 flex h-5 w-5 justify-center rounded-full p-0 text-xs text-white">
                                1
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm italic text-muted-foreground">
                            Nenhuma mensagem ainda
                          </p>
                        )}
                      </div>
                    </div>
                  </SidebarMenuButton>
                  <Separator className="mt-2" />
                </SidebarMenuItem>
              </NavLink>
            ))}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="border-t p-4 text-center">
        <p className="text-xs text-muted-foreground">
          Tess • Apoio emocional 24h
        </p>
      </SidebarFooter>
    </>
  )

  const ativarPor3Segundos = () => {
    setIsActive(true)
    setTimeout(() => {
      setIsActive(false)
    }, 500)
  }
  if (isDesktop) {
    return (
      <>
        <Button
          onClick={() => {
            setIsCollapsed(!isCollapsed)
            ativarPor3Segundos()
          }}
          className={`bg-linear-purple fixed right-2 top-2 z-50 transition-opacity duration-200 ${isActive ? 'opacity-0' : 'opacity-100'}`}
        >
          {isCollapsed && (
            <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              3
            </span>
          )}

          <ChevronLeft
            className={`h-6 w-6 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </Button>
        <Sidebar
          side="right"
          className={`fixed right-0 top-0 z-40 h-screen border-l transition-all duration-300 ${
            isCollapsed ? 'w-0 overflow-hidden' : 'w-96'
          }`}
        >
          <SidebarContentComponent />
        </Sidebar>
      </>
    )
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className={`bg-linear-purple hover:scale-11 fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-2xl`}
          >
            <MessageCircle className="h-7 w-7" />
            <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              3
            </span>
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-96 p-0">
          <SidebarContentComponent />
        </SheetContent>
      </Sheet>
    </>
  )
}

export default BatePapoSidebar
