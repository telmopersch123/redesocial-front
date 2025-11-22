// components/BatePapoSidebar.tsx
import { ChevronRight, MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Sidebar } from '../../..//components/ui/sidebar'
import { Button } from '../../ui/button'
import { Sheet, SheetContent, SheetTrigger } from '../../ui/sheet'
import { MemoizedSidebarInner } from './SideBarInner'

export interface Conversa {
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
  const [conversations, setConversations] = useState(conversasFicticias)
  const [originalConversations] = useState(conversasFicticias)
  const [search, setSearch] = useState('')
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

  useEffect(() => {
    const body = document.body
    const observerScroll = new MutationObserver(() => {
      const overflow = window.getComputedStyle(body).overflow
      setIsCollapsed(overflow === 'hidden')
    })
    observerScroll.observe(body, {
      attributes: true,
      attributeFilter: ['style'],
    })
    const initialOverflow = window.getComputedStyle(body).overflow
    setIsCollapsed(initialOverflow === 'hidden')
    return () => {
      observerScroll.disconnect()
    }
  }, [])

  if (!ROTAS_COM_SIDEBAR.includes(pathname)) {
    return null
  }

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    if (value.trim() === '') {
      setConversations(originalConversations)
      return
    }

    const filteredConversations = originalConversations.filter((c) =>
      c.nome.toLowerCase().includes(value.toLowerCase())
    )

    setConversations(filteredConversations)
  }

  const activeThreeSeconds = () => {
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
            activeThreeSeconds()
          }}
          className={`bg-linear-purple fixed right-2 top-2 z-[35] transition-opacity duration-200 ${isActive ? 'opacity-0' : 'opacity-100'}`}
        >
          {isCollapsed && (
            <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              3
            </span>
          )}

          <ChevronRight
            className={`h-6 w-6 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </Button>

        <Sidebar
          side="right"
          className={`fixed z-[30] border-l transition-all duration-300 ${
            isCollapsed ? 'w-0 overflow-hidden' : 'w-96'
          }`}
        >
          <MemoizedSidebarInner
            search={search}
            onSearchChange={(value) => {
              handleFilter({
                target: { value },
              } as React.ChangeEvent<HTMLInputElement>)
            }}
            conversations={conversations}
          />
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

        <SheetContent side="right" className="w-72 p-0 im:w-auto">
          <MemoizedSidebarInner
            search={search}
            onSearchChange={(value) => {
              handleFilter({
                target: { value },
              } as React.ChangeEvent<HTMLInputElement>)
            }}
            conversations={conversations}
          />
        </SheetContent>
      </Sheet>
    </>
  )
}

export default BatePapoSidebar
