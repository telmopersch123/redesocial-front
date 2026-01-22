import {
  CheckCircle2,
  Lock,
  MessageSquare,
  Unlock,
  UserRoundPlus,
  UsersRound,
} from 'lucide-react'
import type { UserType } from '../../../types'
import { Button } from '../../ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../ui/card'

interface CommunityCardProps {
  valuesComunity: {
    image: string
    id: number
    category: string
    description: string
    isPrivate: boolean
    nameComunity: string
    _count: {
      members: number
      posts: number
    }
    members: { userId: string }[]
  }
  user: UserType | null
}
const CardsCommunityComponent = ({
  valuesComunity,
  user,
}: CommunityCardProps) => {
  const { image, nameComunity, _count, description, isPrivate, members } =
    valuesComunity

  const isYouMember = members?.some((m) => m.userId === user?.id)

  return (
    <Card className="group relative !mb-5 w-[calc(100vw-3rem)] flex-shrink-0 overflow-hidden rounded-2xl border-none bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:bg-zinc-900 md:w-full">
      {/* Header com Imagem */}
      <CardHeader className="m-0 p-0">
        <div className="relative h-[140px] w-full overflow-hidden">
          {/* Overlay de gradiente para legibilidade se precisar colocar algo sobre a imagem */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/20 to-transparent" />

          {image ? (
            <img
              src={image}
              alt={nameComunity}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800">
              <UsersRound className="h-10 w-10 text-zinc-400" />
            </div>
          )}

          {/* Badge de Categoria ou Privacidade flutuante */}
          <div className="absolute right-3 top-3 z-20">
            <span
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md ${
                isPrivate
                  ? 'border border-red-500/30 bg-red-500/20 text-red-100'
                  : 'border border-emerald-500/30 bg-emerald-500/20 text-emerald-100'
              }`}
            >
              {isPrivate ? (
                <Lock className="h-3 w-3" />
              ) : (
                <Unlock className="h-3 w-3" />
              )}
              {isPrivate ? 'Privada' : 'Pública'}
            </span>
          </div>
        </div>

        <div className="space-y-1.5 px-5 pt-5">
          <CardTitle className="line-clamp-1 text-xl font-bold text-zinc-800 dark:text-zinc-100">
            {nameComunity}
          </CardTitle>

          <CardDescription className="line-clamp-2 min-h-[40px] text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            {description || 'Sem descrição disponível para esta comunidade.'}
          </CardDescription>
        </div>
      </CardHeader>

      {/* Status / Infos */}
      <CardContent className="mt-4 flex items-center gap-4 px-5 py-2">
        <div className="flex items-center gap-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
            <UsersRound className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {_count.members}{' '}
            <span className="font-normal text-zinc-500">
              {_count.members > 1 ? 'membros' : 'membro'}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {_count.posts}{' '}
            <span className="font-normal text-zinc-500">posts</span>
          </span>
        </div>
      </CardContent>

      {/* Footer com Botão */}
      <CardFooter className="p-5 pt-2">
        {isYouMember ? (
          // Botão para quem JÁ É membro
          <Button className="w-full gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 font-bold text-purple-600 hover:bg-purple-500/20 dark:text-purple-400">
            <CheckCircle2 className="h-4 w-4" />
            Já sou membro
          </Button>
        ) : (
          // Botão para quem NÃO É membro
          <Button
            disabled={isPrivate}
            className={`w-full gap-2 rounded-xl font-bold transition-all active:scale-95 ${
              isPrivate
                ? 'bg-zinc-200 text-zinc-500 dark:bg-zinc-800'
                : 'bg-linear-purple text-white shadow-md hover:shadow-purple-500/20'
            }`}
          >
            {isPrivate ? (
              <Lock className="h-4 w-4" />
            ) : (
              <UserRoundPlus className="h-4 w-4" />
            )}
            {isPrivate ? 'Comunidade Privada' : 'Participar agora'}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default CardsCommunityComponent
