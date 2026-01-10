// components/BatePapoSidebar.tsx
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { MessageCircle, Search } from 'lucide-react'
import { memo } from 'react'
import { NavLink } from 'react-router-dom'
import { Input } from '../../..//components/ui/input'
import { ScrollArea } from '../../..//components/ui/scroll-area'
import {
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

import { useAuth } from '../../../context/getMe'
import { type Contato } from '../../../pages/MessagePage'
import { Separator } from '../../ui/separator'

// ← Crie um componente filho separado
const SidebarInner = ({
  search,
  onSearchChange,
  conversations,
  quantity,
}: {
  search: string
  onSearchChange: (value: string) => void
  conversations: Contato[]
  quantity: number
}) => {
  const { user } = useAuth()

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-zinc-900">
      {/* Header */}
      <SidebarHeader className="border-b border-zinc-200 p-5 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="rounded-xl bg-gradient-to-br from-purple-100 via-pink-100 to-violet-100 p-1 shadow-md dark:from-purple-900/50 dark:via-purple-800/50 dark:to-violet-900/50">
                <div className="rounded-lg bg-white p-2 dark:bg-zinc-900">
                  <MessageCircle className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Mensagens
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {quantity > 0 && `${quantity} não lidas`}
              </p>
            </div>
          </div>
        </div>

        {/* Barra de busca */}
        <div className="relative mt-5">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar conversa..."
            className="h-11 rounded-xl border-zinc-300 bg-zinc-50 pl-11 text-sm focus:ring-2 focus:ring-purple-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>
      </SidebarHeader>

      {/* Lista de Conversas */}
      <SidebarContent className="flex-1">
        <ScrollArea className="h-full">
          <SidebarMenu className="space-y-2 p-3">
            {conversations.map((conversa: Contato) => {
              // console.log(
              //   conversa.lastMessage,
              //   conversa.lastMessage.senderId,
              //   Number(user?.id),
              //   conversa.lastMessage.readAt
              // )
              const isUnreadFromOtherUser =
                conversa.lastMessage &&
                conversa.lastMessage.senderId !== Number(user?.id) &&
                conversa.lastMessage.readAt === null

              const unreadFromOther =
                conversa.unreadMessages > 0
                  ? conversa.unreadMessages
                  : undefined

              return (
                <NavLink
                  key={conversa.chatId}
                  to={`/mensagens/${conversa.chatId}`}
                  state={{ openChat: true }}
                  className="block"
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className="h-auto w-full justify-start gap-3 rounded-xl p-3 transition-all hover:bg-zinc-100 data-[state=open]:bg-zinc-100 dark:hover:bg-zinc-800 dark:data-[state=open]:bg-zinc-800"
                    >
                      <div className="flex w-full cursor-pointer items-center gap-3">
                        {/* Avatar + Status Online */}
                        <div className="relative flex-shrink-0">
                          <Avatar className="h-12 w-12 ring-4 ring-white dark:ring-zinc-900">
                            <AvatarImage src={conversa.contact.avatar} />
                            <AvatarFallback className="bg-purple-200 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300">
                              {conversa.contact.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        {/* Conteúdo */}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                              {conversa.contact.name}
                            </p>
                            {conversa.lastMessage && (
                              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                {formatDistanceToNow(
                                  conversa.lastMessage.createdAt,
                                  {
                                    addSuffix: true,
                                    locale: ptBR,
                                  }
                                )}
                              </span>
                            )}
                          </div>

                          {conversa.lastMessage ? (
                            <div className="flex items-center gap-2 text-sm">
                              {conversa.lastMessage.senderId ===
                                Number(user?.id) && (
                                <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                                  Você:{' '}
                                </span>
                              )}
                              <span className="truncate text-zinc-600 dark:text-zinc-300">
                                {conversa.lastMessage.content}
                              </span>
                              {isUnreadFromOtherUser && (
                                <div className="ml-auto flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-purple-600 px-1.5 text-[11px] font-semibold text-white">
                                  {unreadFromOther && unreadFromOther > 9
                                    ? '9+'
                                    : unreadFromOther}
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm italic text-zinc-500 dark:text-zinc-400">
                              Nenhuma mensagem ainda
                            </p>
                          )}
                        </div>
                      </div>
                    </SidebarMenuButton>
                    <Separator className="dark:bg-zinc-800" />
                  </SidebarMenuItem>
                </NavLink>
              )
            })}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-zinc-200 p-5 text-center dark:border-zinc-800">
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Tess • Apoio emocional 24h
        </p>
      </SidebarFooter>
    </div>
  )
}

export const MemoizedSidebarInner = memo(SidebarInner)
