import { CircleX, Fullscreen, ImageIcon, VideoIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useCriarPostDialog } from '../../../context/ContextDialogPost'
import { useLimitForms } from '../../../hooks/useLimitForms'
import { MessageForms } from '../../formCustomer/MessageForms'
import { Button } from '../../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { Switch } from '../../ui/switch'
import { Textarea } from '../../ui/textarea'
import ErrorsPostDialog from './ErrorsPostDialog'
import FullscreenDialog from './FullscreenDialog'

export function PostDialog() {
  const { isOpen, close, postCommunity } = useCriarPostDialog()
  const [anonimo, setAnonimo] = useState(false)
  const [uploadType, setUploadType] = useState<'image' | 'video' | null>(null)
  const [file, setFile] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [typeError, setTypeError] = useState('')
  const [postDestino, setPostDestino] = useState<'geral' | 'comunidade'>(
    'geral'
  )
  const [tagInput, setTagInput] = useState<string>('')
  const [tags, setTags] = useState<string[]>([])
  const { value, error, handleChange, maxLength } = useLimitForms(5000)
  const [comunidadeSelecionada, setComunidadeSelecionada] = useState<
    string | null
  >(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (postCommunity) {
      setPostDestino('comunidade')
    }
  }, [postCommunity])

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      if (tags.length >= 10) {
        setTypeError('Limite de tags atingido.')
        return
      }
      if (tags.some((t) => t.toLowerCase() === tagInput.toLowerCase())) {
        setTypeError('Tag já adicionada, escolha outra.')
        return
      }

      e.preventDefault()
      setTags([...tags, tagInput.trim()])
      setTypeError('')
      setTagInput('')
    }
  }
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }
  const handleSelectType = (type: 'image' | 'video') => {
    setUploadType(type)
    setFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    setTimeout(() => fileInputRef.current?.click(), 100)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const previewURL = URL.createObjectURL(file)
      setFile(previewURL)
    }
  }

  const removeFile = () => {
    if (file) URL.revokeObjectURL(file)
    setFile(null)
    setUploadType(null)
  }

  const handleCloseDialog = () => {
    if (file) URL.revokeObjectURL(file)
    setFile(null)
    setUploadType(null)
    setIsFullscreen(false)
    setAnonimo(false)
    setPostDestino('geral')
    setComunidadeSelecionada(null)

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 flex h-screen items-center justify-center !overflow-hidden bg-black/80"></div>
      )}
      <Dialog
        modal={false}
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            if (!isFullscreen) {
              handleCloseDialog()
              setTags([])
              close()
            }
          }
        }}
      >
        <form>
          <DialogContent className="!z-40 w-[95%] !overflow-y-auto rounded-2xl bg-white p-6 shadow-xl sm:max-w-[520px]">
            <div className="max-h-[80vh] overflow-y-auto p-6">
              <DialogHeader className="space-y-2 text-center">
                <DialogTitle asChild>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Compartilhe como você está se sentindo
                  </h1>
                </DialogTitle>
                <DialogDescription asChild>
                  <p className="text-sm text-muted-foreground">
                    Este é um espaço seguro para expressar seus pensamentos e
                    emoções.
                  </p>
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 flex flex-col gap-6">
                {/* Select de sentimento */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="sentimento"
                    className="text-sm font-medium text-gray-700"
                  >
                    Como você está se sentindo?
                  </Label>
                  <Select>
                    <SelectTrigger
                      id="sentimento"
                      className="rounded-lg border border-gray-300 bg-white shadow-sm focus:border-[#a5c9ff] focus:ring-1 focus:ring-[#a5c9ff]"
                    >
                      <SelectValue placeholder="Selecione um sentimento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feliz">😊 Feliz</SelectItem>
                      <SelectItem value="esperancoso">
                        🌱 Esperançoso
                      </SelectItem>
                      <SelectItem value="ansioso">😰 Ansioso</SelectItem>
                      <SelectItem value="agradecido">🙏 Agradecido</SelectItem>
                      <SelectItem value="triste">😢 Triste</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Textarea */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="pensamentos"
                    className="text-sm font-medium text-gray-700"
                  >
                    O que está no seu coração?
                  </Label>
                  <Textarea
                    id="pensamentos"
                    value={value}
                    onChange={handleChange}
                    placeholder="Escreva seus pensamentos, sentimentos ou o que quiser compartilhar..."
                    className="min-h-[120px] resize-none rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-900 shadow-sm transition-all hover:border-[#a5c9ff]/40 focus:border-[#a5c9ff] focus:ring-1 focus:ring-[#a5c9ff]"
                  />
                  <MessageForms
                    error={error}
                    valueLength={value.length}
                    maxLength={maxLength}
                  />
                </div>

                {/* NOVO BLOCO — Destino do post */}
                <div className="flex flex-col gap-3 rounded-xl bg-[#f8f5f2] p-4 shadow-sm">
                  <Label className="text-sm font-medium text-gray-800">
                    Onde deseja publicar?
                  </Label>
                  <Select
                    value={postDestino}
                    onValueChange={(v: 'geral' | 'comunidade') =>
                      setPostDestino(v)
                    }
                  >
                    <SelectTrigger className="rounded-lg border border-gray-300 bg-white shadow-sm focus:border-[#a5c9ff] focus:ring-1 focus:ring-[#a5c9ff]">
                      <SelectValue placeholder="Escolha o destino do post" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem disabled={postCommunity} value="geral">
                        🌍 Post geral (todos podem ver)
                      </SelectItem>
                      <SelectItem value="comunidade">
                        👥 Post em uma comunidade
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {postDestino === 'comunidade' && (
                    <div className="mt-2 flex flex-col gap-2 transition-all">
                      <Label className="text-sm font-medium text-gray-700">
                        Escolha uma comunidade
                      </Label>
                      <Select
                        value={comunidadeSelecionada || undefined}
                        onValueChange={setComunidadeSelecionada}
                      >
                        <SelectTrigger className="rounded-lg border border-gray-300 bg-white shadow-sm focus:border-[#a5c9ff] focus:ring-1 focus:ring-[#a5c9ff]">
                          <SelectValue placeholder="Selecione uma comunidade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mindfulness">
                            🌸 Mindfulness
                          </SelectItem>
                          <SelectItem value="autoajuda">
                            💬 Autoajuda & Reflexão
                          </SelectItem>
                          <SelectItem value="fe">
                            ✨ Fé & Espiritualidade
                          </SelectItem>
                          <SelectItem value="bemestar">🌿 Bem-estar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Upload de mídia */}
                <div className="flex flex-col gap-3 rounded-xl bg-[#f8f5f2] p-4 shadow-sm">
                  <Label className="text-sm font-medium text-gray-800">
                    Adicionar mídia (opcional)
                  </Label>

                  {!file ? (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <Button
                        type="button"
                        onClick={() => handleSelectType('image')}
                        variant="outline"
                        className={`flex items-center gap-2 rounded-lg border-gray-300 px-4 py-2 text-sm font-medium shadow-sm transition-all hover:border-[#a5c9ff] hover:text-[#a5c9ff] ${
                          uploadType === 'image'
                            ? 'border-[#a5c9ff] text-[#a5c9ff]'
                            : ''
                        }`}
                      >
                        <ImageIcon className="h-4 w-4" />
                        Imagem
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleSelectType('video')}
                        variant="outline"
                        className={`flex items-center gap-2 rounded-lg border-gray-300 px-4 py-2 text-sm font-medium shadow-sm transition-all hover:border-[#a5c9ff] hover:text-[#a5c9ff] ${
                          uploadType === 'video'
                            ? 'border-[#a5c9ff] text-[#a5c9ff]'
                            : ''
                        }`}
                      >
                        <VideoIcon className="h-4 w-4" />
                        Vídeo
                      </Button>
                    </div>
                  ) : (
                    <div className="relative flex flex-col items-center justify-center rounded-lg border border-gray-300 bg-white p-3 shadow-sm">
                      {uploadType === 'image' && (
                        <>
                          <img
                            src={file}
                            alt="Prévia da imagem"
                            className="max-h-60 w-full rounded-lg object-cover"
                          />
                          <Button
                            type="button"
                            onClick={() => setIsFullscreen(true)}
                            variant="ghost"
                            size="icon"
                            className="bg-linear-purple absolute left-2 top-2 rounded-full p-2 shadow-md backdrop-blur-sm hover:scale-105"
                          >
                            <Fullscreen className="h-5 w-5 text-white" />
                          </Button>
                        </>
                      )}
                      {uploadType === 'video' && (
                        <video
                          src={file}
                          controls
                          className="max-h-60 w-full rounded-lg"
                        />
                      )}
                      <Button
                        type="button"
                        onClick={removeFile}
                        variant="ghost"
                        size="icon"
                        className="bg-linear-purple absolute right-2 top-2 rounded-full p-2 shadow-md backdrop-blur-sm hover:scale-105"
                      >
                        <CircleX className="h-5 w-5 text-white" />
                      </Button>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={
                      uploadType === 'image'
                        ? 'image/*'
                        : uploadType === 'video'
                          ? 'video/*'
                          : ''
                    }
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                {/* Campo de Tags */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="tags"
                    className="text-sm font-medium text-gray-700"
                  >
                    Adicione tags (pressione Enter)
                  </Label>
                  <Input
                    id="tags"
                    type="text"
                    value={tagInput}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value === '') {
                        setTypeError('')
                      }
                      setTagInput(value)
                    }}
                    onKeyDown={handleAddTag}
                    placeholder="Ex: Felicidade, Motivação"
                    className="rounded-lg border border-gray-300 bg-white p-2 text-sm shadow-sm focus:border-[#a5c9ff] focus:ring-1 focus:ring-[#a5c9ff]"
                  />
                  {typeError && <ErrorsPostDialog errors={typeError} />}
                  {/* Exibir tags adicionadas */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 rounded-full bg-green-500 px-2 py-1 text-xs font-semibold text-white"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-white hover:text-gray-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Publicar anonimamente */}
                <div className="flex justify-between rounded-xl bg-[#f8f5f2] p-4 shadow-sm">
                  <div className="flex flex-col">
                    <Label
                      htmlFor="anonimo"
                      className="text-base font-medium text-gray-800"
                    >
                      Publicar anonimamente
                    </Label>
                    <p className="mt-1 text-sm text-gray-500">
                      Seu nome não será exibido.
                    </p>
                  </div>
                  <Switch
                    className="data-[state=checked]:bg-linear-purple"
                    id="anonimo"
                    checked={anonimo}
                    onCheckedChange={setAnonimo}
                  />
                </div>
              </div>

              <DialogFooter className="mt-6 flex gap-3 sm:justify-end">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="rounded-lg border-gray-300 bg-white px-5 py-2 font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-100"
                  >
                    Cancelar
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="bg-linear-purple rounded-lg px-5 py-2 font-semibold text-white shadow-md transition-all hover:opacity-90"
                >
                  Publicar
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </form>
      </Dialog>

      <FullscreenDialog
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
        file={file}
      />
    </>
  )
}
