// components/BatePapoSidebar.tsx
import { ChevronRight, MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useChat, type Contato } from '../../../context/ChatContext'

import { getContatos } from '../../../services/authService'
import { Button } from '../../ui/button'
import { Sheet, SheetContent, SheetTrigger } from '../../ui/sheet'
import NotificationComponent from '../componentNotification/NotificationComponent'
import { MemoizedSidebarInner } from './SideBarInner'

const BREAKPOINT = 1640

export const BatePapoSidebar = () => {
  const { pathname } = useLocation()
  const { communityName, id } = useParams()
  const {
    totalUnread,
    isChatOpenChatSideBar,
    setIsOpenChatSideBar,
    setClickedState,
  } = useChat()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [search, setSearch] = useState('')
  const [allContatos, setAllContatos] = useState<Contato[]>([])
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= BREAKPOINT)

  const [isActive, setIsActive] = useState(false)

  const { contatos: conversations, setContatos: setConversations } = useChat()
  const ROTAS_COM_SIDEBAR = [
    '/',
    '/comunidades/comunidades-do-usuario',
    `/comunidades/comunidades-do-usuario/${communityName}`,
    `/comunidades/comunidades-do-usuario/${communityName}/${id}`,
  ]

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= BREAKPOINT
      const rotaPermitida = ROTAS_COM_SIDEBAR.includes(pathname)

      if (rotaPermitida) {
        setIsDesktop(desktop)
        setIsOpenChatSideBar(desktop)
      } else {
        setIsDesktop(false)
        setIsOpenChatSideBar(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [isDesktop, pathname])

  useEffect(() => {
    async function myContatos() {
      try {
        const response = await getContatos()
        setAllContatos(response)
        setConversations(response)
      } catch (error) {
        console.log(error)
      }
    }
    myContatos()
  }, [])

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    if (value.trim() === '') {
      setConversations(allContatos)
      return
    }
    const filtered = allContatos.filter((c) =>
      c.contact.name_at.toLowerCase().includes(value.toLowerCase())
    )
    setConversations(filtered)
  }

  const activeThreeSeconds = () => {
    setIsActive(true)
    setTimeout(() => {
      setIsActive(false)
    }, 200)
  }

  if (!ROTAS_COM_SIDEBAR.includes(pathname)) {
    return null
  }

  if (isDesktop) {
    return (
      <>
        <Button
          onClick={() => {
            setClickedState((prev) => !prev)
            setIsCollapsed(!isCollapsed)
            activeThreeSeconds()
          }}
          className={`bg-linear-purple fixed right-2 top-2 z-[35] transition-opacity duration-200 ${isActive ? 'opacity-0' : 'opacity-100'}`}
        >
          {isCollapsed && totalUnread > 0 && (
            <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              <div>{totalUnread}</div>
            </span>
          )}

          <ChevronRight
            className={`h-6 w-6 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </Button>
        <div
          className="fixed top-3 !z-30 transition-all duration-300"
          style={{
            right: isCollapsed ? '80px' : '400px',
          }}
        >
          <NotificationComponent />
        </div>
        <div
          className={`fixed right-0 top-0 z-[30] h-full border-l border-zinc-200 bg-white transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-950 ${
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
            quantity={totalUnread}
          />
        </div>
      </>
    )
  }

  return (
    <>
      <div className="fixed bottom-10 right-24 z-40 transition-all duration-300 md:right-5 md:top-3">
        <NotificationComponent />
      </div>

      <Sheet open={isChatOpenChatSideBar} onOpenChange={setIsOpenChatSideBar}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className="hover:shadow-3xl fixed bottom-6 right-6 z-40 h-16 w-16 rounded-full bg-gradient-to-br from-purple-600 to-violet-700 text-white shadow-2xl transition-all hover:scale-110 hover:from-purple-500 hover:to-violet-600 active:scale-95"
          >
            <MessageCircle className="h-8 w-8" />

            {/* Badge de mensagens não lidas */}
            {totalUnread > 0 && (
              <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {totalUnread}
              </span>
            )}
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-full max-w-sm border-l border-zinc-200 bg-white p-0 dark:border-zinc-800 dark:bg-zinc-950 sm:w-96"
        >
          <MemoizedSidebarInner
            search={search}
            onSearchChange={(value) => {
              handleFilter({
                target: { value },
              } as React.ChangeEvent<HTMLInputElement>)
            }}
            conversations={conversations}
            quantity={totalUnread}
          />
        </SheetContent>
      </Sheet>
    </>
  )
}

export default BatePapoSidebar
