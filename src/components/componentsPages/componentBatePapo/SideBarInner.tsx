// components/BatePapoSidebar.tsx
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { MessageCircle, Search } from 'lucide-react'
import { memo } from 'react'
import { NavLink } from 'react-router-dom'
import { Badge } from '../../..//components/ui/badge'
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

import { Separator } from '../../ui/separator'
import type { Conversa } from './BatePapoComponent'
// ← Crie um componente filho separado
const SidebarInner = ({
  search,
  onSearchChange,
  conversations,
}: {
  search: string
  onSearchChange: (value: string) => void
  conversations: Conversa[]
}) => {
  return (
    <div className={`flex min-h-screen flex-col`}>
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
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar conversa..."
            className="bg-muted/50 pl-10 focus:ring-purple-500"
            autoFocus={false}
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="h-full">
        <ScrollArea className="im:w-auto">
          <SidebarMenu className="space-y-3 p-3">
            {conversations.map((conversa) => (
              <NavLink key={conversa.id} to={`/mensagens/${conversa.id}`}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="h-[65px] w-full justify-start gap-3 rounded-lg p-3 transition-all hover:bg-gradient-to-r hover:from-[#f0f3fc] hover:via-[#f0f2fb] hover:to-[#f0f1fb] hover:text-[#3d3a64]"
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

                      <div className="flex-1">
                        <div className="flex flex-col justify-between im:flex-row">
                          <p className="font-medium">{conversa.nome}</p>
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
                            <span className="w-[50%] truncate im:w-60">
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
    </div>
  )
}

export const MemoizedSidebarInner = memo(SidebarInner)
