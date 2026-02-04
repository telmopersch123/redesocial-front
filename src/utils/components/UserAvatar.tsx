import {
  Cloud,
  Flower2,
  Heart,
  Leaf,
  Moon,
  Sparkles,
  Star,
  Sun,
  UserRound,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
export const avataresSimbolicos = [
  { icon: Flower2, nome: 'Flor', id: 1 },
  { icon: Cloud, nome: 'Nuvem', id: 2 },
  { icon: Star, nome: 'Estrela', id: 3 },
  { icon: Moon, nome: 'Lua', id: 4 },
  { icon: Sun, nome: 'Sol', id: 5 },
  { icon: Leaf, nome: 'Folha', id: 6 },
  { icon: Heart, nome: 'Coração', id: 7 },
  { icon: Sparkles, nome: 'Brilho', id: 8 },
]
export const coresFundos = [
  'bg-[#a5c9ff]', // Flor
  'bg-[#c7b9ff]', // Nuvem
  'bg-[#ffd4a3]', // Estrela
  'bg-[#efe8ff]', // Lua
  'bg-[#ffb8d1]', // Sol
  'bg-[#b8e6d5]', // Folha
  'bg-[#ffb8c8]', // Coração
  'bg-[#d4a5ff]', // Brilho
]
export const UserAvatar = ({
  url,
  name,
  className = 'h-10 w-10',
}: {
  url?: string
  name?: string
  className?: string
}) => {
  if (url?.startsWith('SYMBOLIC_')) {
    const id = parseInt(url.split('_')[1])
    const avatarIndex = avataresSimbolicos.findIndex((a) => a.id === id)
    const Icone = avataresSimbolicos.find((a) => a.id === id)?.icon || UserRound
    const bgColor =
      avatarIndex !== -1 ? coresFundos[avatarIndex] : 'bg-zinc-100'
    return (
      <div
        className={`flex items-center justify-center rounded-full ${bgColor} ${className}`}
      >
        <Icone className="h-1/2 w-1/2 text-white/80" />
      </div>
    )
  }

  return (
    <Avatar className={className}>
      <AvatarImage src={url} alt={name} className="object-cover" />
      <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
    </Avatar>
  )
}
