import {
  AlertCircle,
  Cloud,
  Edit2,
  Flower2,
  Heart,
  Images,
  Leaf,
  Moon,
  Plus,
  Sparkles,
  Star,
  Sun,
  User,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import { Separator } from '../components/ui/separator'
import { Textarea } from '../components/ui/textarea'

const PerfilPage = () => {
  const [file, setFile] = useState<string | null>(null)
  const [nomeUser, setNomeUser] = useState('Carlos Almeida')
  const [sentimentoAtual, setSentimentoAtual] = useState(['esperancoso', '🌱'])
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null)
  const [isAvatarHovered, setIsAvatarHovered] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const avatarContainerRef = useRef<HTMLDivElement>(null)

  const sentimentos = [
    { value: 'feliz', label: 'Feliz', emoji: '😊' },
    { value: 'esperancoso', label: 'Esperançoso', emoji: '🌱' },
    { value: 'ansioso', label: 'Ansioso', emoji: '😰' },
    { value: 'agradecido', label: 'Agradecido', emoji: '🙏' },
    { value: 'triste', label: 'Triste', emoji: '😢' },
  ]

  const coresFundos = [
    'bg-[#a5c9ff]', // Flor
    'bg-[#c7b9ff]', // Nuvem
    'bg-[#ffd4a3]', // Estrela
    'bg-[#efe8ff]', // Lua
    'bg-[#ffb8d1]', // Sol
    'bg-[#b8e6d5]', // Folha
    'bg-[#ffb8c8]', // Coração
    'bg-[#d4a5ff]', // Brilho
  ]

  const avataresSimbolicos = [
    { icon: Flower2, nome: 'Flor', id: 1 },
    { icon: Cloud, nome: 'Nuvem', id: 2 },
    { icon: Star, nome: 'Estrela', id: 3 },
    { icon: Moon, nome: 'Lua', id: 4 },
    { icon: Sun, nome: 'Sol', id: 5 },
    { icon: Leaf, nome: 'Folha', id: 6 },
    { icon: Heart, nome: 'Coração', id: 7 },
    { icon: Sparkles, nome: 'Brilho', id: 8 },
  ]

  const metodosAutocuidado = [
    'Meditar 10 minutos ao acordar',
    'Beber 2L de água',
  ]

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

  // Fechar hover ao clicar fora (mobile)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        avatarContainerRef.current &&
        !avatarContainerRef.current.contains(e.target as Node)
      ) {
        setIsAvatarHovered(false)
      }
    }

    if (isAvatarHovered) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchend', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchend', handleClickOutside)
    }
  }, [isAvatarHovered])

  return (
    <div className="mx-3 mt-4 min-h-screen bg-background">
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-8 md:px-0">
        <Card>
          <CardContent className="flex items-center gap-5 p-6">
            {/* AVATAR COM BOTÃO DE REMOVER FORA */}
            <div
              ref={avatarContainerRef}
              className="group relative"
              onMouseEnter={() => setIsAvatarHovered(true)}
              onMouseLeave={() => setIsAvatarHovered(false)}
              onTouchStart={() => setIsAvatarHovered(true)}
            >
              <Avatar className="h-24 w-24 border-4 border-background">
                {file ? (
                  <img
                    src={file}
                    alt="Avatar do usuário"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : selectedAvatar ? (
                  <div
                    className={`flex h-full w-full items-center justify-center rounded-full ${
                      coresFundos[selectedAvatar - 1]
                    }`}
                  >
                    {avataresSimbolicos
                      .filter((item: any) => item.id === selectedAvatar)
                      .map((item: any) => {
                        const Icon = item.icon
                        return (
                          <Icon
                            key={item.id}
                            className="h-10 w-10 text-white"
                          />
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
                  className={`absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition-all hover:scale-110 hover:bg-red-700`}
                  aria-label="Remover avatar"
                >
                  <X className="h-4 w-4" />
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
          </CardContent>
        </Card>

        {/* ===== INFORMAÇÕES BÁSICAS ===== */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Nome de Exibição */}
            <div className="space-y-2">
              <Label>Nome de exibição</Label>
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">{nomeUser}</span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Edit2 className="mr-1 h-3 w-3" />
                      Editar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[90%] rounded-md sm:w-full sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Editar nome</DialogTitle>
                      <DialogDescription>
                        Lembre-se de escolher um nome que reflita sua identidade
                        e personalidade.
                      </DialogDescription>
                      <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <p className="font-medium">
                          Importante: após a alteração, você só poderá alterar
                          novamente em 7 dias.
                        </p>
                      </div>
                    </DialogHeader>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Nome de exibição"
                        value={nomeUser}
                        onChange={(e) => setNomeUser(e.target.value)}
                      />
                    </div>
                    <DialogFooter className="sm:justify-start">
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Fechar
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Separator />

            {/* Lema ou Biografia */}
            <div className="space-y-2">
              <Label>Lema ou biografia</Label>
              <Textarea
                placeholder="Escreva algo sobre você..."
                className="min-h-20 resize-none"
              />
            </div>

            <Separator />

            {/* Sentimento */}
            <div className="space-y-2">
              <Label>Como você está se sentindo hoje?</Label>
              <Select
                onValueChange={(value) => {
                  const sentimento = sentimentos.find((s) => s.value === value)
                  if (sentimento) {
                    setSentimentoAtual([sentimento.value, sentimento.emoji])
                  }
                }}
                value={sentimentoAtual[0]}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    <span className="mr-2">{sentimentoAtual[1]}</span>
                    {sentimentoAtual[0]}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {sentimentos.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      <span className="mr-2">{s.emoji}</span>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Avatar Simbólico */}
            <div className="space-y-3">
              <Label>Avatar Simbólico</Label>
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
                {avataresSimbolicos.map((item, index) => {
                  const Icon = item.icon
                  const isSelected = selectedAvatar === item.id
                  const bgColor = coresFundos[index]
                  return (
                    <Button
                      key={item.id}
                      onClick={() => {
                        setSelectedAvatar(item.id)
                        setFile(null)
                      }}
                      variant="ghost"
                      className={`relative flex h-24 flex-col items-center justify-center rounded-2xl p-3 transition-all duration-300 hover:scale-105 ${
                        isSelected
                          ? 'border-2 border-[#a5c9ff] ring-2 ring-[#a5c9ff]/50'
                          : 'border border-gray-300'
                      }`}
                    >
                      <span className={`${bgColor} rounded-xl p-3 text-white`}>
                        <Icon className="!h-8 !w-8" />
                      </span>
                      <span className="mt-1 text-xs font-medium">
                        {item.nome}
                      </span>
                    </Button>
                  )
                })}
              </div>
            </div>

            <Separator />

            {/* Métodos de Autocuidado */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Métodos de Autocuidado</Label>
                <Button size="sm">
                  <Plus className="mr-1 h-4 w-4" />
                  Adicionar
                </Button>
              </div>

              <div className="space-y-2">
                {metodosAutocuidado.map((metodo, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border bg-muted/50 p-3"
                  >
                    <span className="text-sm">{metodo}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Mais seções podem ser adicionadas abaixo
        </p>
      </div>
    </div>
  )
}

export default PerfilPage
