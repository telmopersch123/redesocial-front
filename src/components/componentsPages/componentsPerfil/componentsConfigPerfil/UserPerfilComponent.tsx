import { Images, Trash, User } from 'lucide-react'
import { useRef } from 'react'
import { Avatar, AvatarFallback } from '../../../ui/avatar'
import { Badge } from '../../../ui/badge'
import { Card, CardContent } from '../../../ui/card'
import { ConfigDialog } from './ConfigDialog'

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
  setNomeUser: React.Dispatch<React.SetStateAction<string>>
  sentimentoAtual: Array<string>
  coresFundos: Array<string>
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
  setNomeUser,
  sentimentoAtual,
  coresFundos,
}: UserPerfilComponentProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const previewURL = URL.createObjectURL(file)
      setFile(previewURL)
      setSelectedAvatar(null)
    }
  }

  const removeFile = () => {
    if (file) URL.revokeObjectURL(file)
    setFile(null)
    setSelectedAvatar(null)
    // Limpa o input para permitir selecionar a mesma imagem de novo
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Card>
      <CardContent className="relative flex w-full flex-col items-center gap-5 p-6 im:flex-row">
        {/* AVATAR COM BOTÃO DE REMOVER FORA */}
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
              <img
                src={file}
                alt="Avatar do usuário"
                className="h-full w-full rounded-full object-cover"
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
          <h2 className="text-2xl font-bold">{nomeUser}</h2>
          <Badge variant="secondary" className="space-x-2 text-sm">
            <span>{sentimentoAtual[1]}</span>
            <span>{sentimentoAtual[0]}</span>
          </Badge>
        </div>
        <ConfigDialog nomeUser={nomeUser} setNomeUser={setNomeUser} />
      </CardContent>
    </Card>
  )
}

export default UserPerfilComponent
