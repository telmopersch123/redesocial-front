import { Images, LogOut, Trash, User } from 'lucide-react'
import { useRef } from 'react'
import { useAuth } from '../../../../context/getMe'
import { UserAvatar } from '../../../../utils/components/UserAvatar'
import { Avatar, AvatarFallback } from '../../../ui/avatar'
import { Badge } from '../../../ui/badge'
import { Button } from '../../../ui/button'
import { Card, CardContent } from '../../../ui/card'

interface UserPerfilComponentProps {
  file: string | null
  setFile: React.Dispatch<React.SetStateAction<string | null>>
  selectedAvatar: number | null
  setSelectedAvatar: React.Dispatch<React.SetStateAction<number | null>>
  isAvatarHovered: boolean
  setIsAvatarHovered: React.Dispatch<React.SetStateAction<boolean>>
  avatarContainerRef: React.RefObject<HTMLDivElement | null>
  avataresSimbolicos: Array<{
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    nome: string
    id: number
  }>
  nomeUser: string

  sentimentoAtual: Array<string>
  coresFundos: Array<string>
  setRawFile: React.Dispatch<React.SetStateAction<File | null>>
}

const UserPerfilComponent = ({
  file,
  setFile,
  selectedAvatar,
  setSelectedAvatar,
  isAvatarHovered,
  setIsAvatarHovered,
  avatarContainerRef,
  avataresSimbolicos,
  nomeUser,
  sentimentoAtual,
  coresFundos,
  setRawFile,
}: UserPerfilComponentProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user, handleLogout } = useAuth()
  const handleSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setRawFile(file)
      const previewURL = URL.createObjectURL(file)
      setFile(previewURL)
      setSelectedAvatar(null)
    }
  }

  const removeFile = () => {
    if (file) URL.revokeObjectURL(file)
    setFile(null)
    setSelectedAvatar(null)
    setRawFile(null)
    // Limpa o input para permitir selecionar a mesma imagem de novo
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Card className="">
      <CardContent className="relative flex w-full flex-col items-center gap-5 p-8 pt-10 im:flex-row">
        {/* AVATAR COM BOTÃO DE REMOVER FORA */}
        {user && (
          <Button
            onClick={handleLogout}
            className="absolute right-0 top-0 m-2 flex items-center gap-2 rounded-lg border-none bg-red-300 p-3 font-semibold text-white transition-all hover:opacity-80 dark:bg-[#1a1a1a]"
          >
            <LogOut size={20} />
            Sair
          </Button>
        )}
        <div
          ref={avatarContainerRef}
          className="group relative"
          onMouseEnter={() => setIsAvatarHovered(true)}
          onMouseLeave={() => setIsAvatarHovered(false)}
          onTouchStart={() => setIsAvatarHovered(true)}
        >
          <Avatar
            className={`group-hover:border-linear-purple border-1 h-24 w-24 border-background transition-all duration-300 group-hover:scale-105 ${isAvatarHovered ? 'ring-4 ring-purple-400/30' : ''} `}
          >
            {file ? (
              <UserAvatar
                url={file || `SYMBOLIC_${selectedAvatar}`}
                name={nomeUser}
                className="h-full w-full rounded-full shadow-2xl ring-4 ring-white dark:ring-zinc-900"
              />
            ) : selectedAvatar ? (
              <div
                className={`flex h-full w-full items-center justify-center rounded-full ${
                  coresFundos[Number(selectedAvatar) - 1]
                }`}
              >
                {avataresSimbolicos
                  .filter((item: any) => item.id === selectedAvatar)
                  .map((item: any) => {
                    const Icon = item.icon
                    return (
                      <Icon key={item.id} className="h-10 w-10 text-white" />
                    )
                  })}
              </div>
            ) : (
              <AvatarFallback className="text-sm text-muted-foreground">
                <User className="h-10 w-10" />
              </AvatarFallback>
            )}

            {/* Ícone de câmera (aparece no hover/touch) */}
            <div
              className={`pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-all duration-200 ${isAvatarHovered ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100`}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleSelect()
                }}
                className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white transition-all hover:bg-white/30"
                aria-label="Alterar avatar"
              >
                <Images className="h-6 w-6" />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </Avatar>

          {/* BOTÃO DE REMOVER FORA DO AVATAR (canto inferior direito) */}
          {(file || selectedAvatar) && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                removeFile()
              }}
              className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 transform items-center gap-1.5 whitespace-nowrap rounded-md bg-red-600/90 p-1 text-center text-xs font-medium text-white opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-red-700 group-hover:opacity-100"
              aria-label="Remover avatar"
            >
              <Trash className="h-4 w-4" />
              <p> remover</p>
            </button>
          )}
        </div>

        <div className="space-y-2">
          <h2 className="line-clamp-2 max-w-[250px] break-words pt-3 text-center text-2xl font-bold hover:underline">
            @{nomeUser}
          </h2>
          <Badge variant="secondary" className="space-x-2 text-sm">
            <span>{sentimentoAtual[1]}</span>
            <span>{sentimentoAtual[0]}</span>
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

export default UserPerfilComponent
