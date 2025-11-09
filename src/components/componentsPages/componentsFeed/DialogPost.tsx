import { CircleX, Fullscreen, ImageIcon, VideoIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from '../../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog'
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

export function DialogPost() {
  const [anonimo, setAnonimo] = useState(false)
  const [uploadType, setUploadType] = useState<'image' | 'video' | null>(null)
  const [file, setFile] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const closeFullscreen = () => setIsFullscreen(false)

  const handleCloseDialog = () => {
    // Revoga URL da prévia
    if (file) {
      URL.revokeObjectURL(file)
    }

    // Limpa todos os estados
    setFile(null)
    setUploadType(null)
    setIsFullscreen(false)
    setAnonimo(false)

    // Limpa o input file
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    // Opcional: limpar textarea e select
    const textarea = document.getElementById(
      'pensamentos'
    ) as HTMLTextAreaElement
    const selectTrigger = document.querySelector(
      '[data-placeholder="Selecione um sentimento"]'
    )
    if (textarea) textarea.value = ''
    if (selectTrigger) selectTrigger.textContent = 'Selecione um sentimento'
  }

  return (
    <>
      {/* Modal principal */}
      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            // ← Só executa quando FECHAR
            handleCloseDialog()
          }
        }}
      >
        <form>
          <DialogTrigger asChild>
            <Button className="bg-linear-purple mt-5 w-[calc(100vw-5rem)] rounded-xl border-none p-7 text-lg font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] active:shadow-md md:w-[calc(100vw-19rem)] xl:w-[950px]">
              + Como você está se sentindo?
            </Button>
          </DialogTrigger>

          <DialogContent className="!z-40 !overflow-y-auto rounded-2xl bg-white p-6 shadow-xl sm:max-w-[520px]">
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
                    placeholder="Escreva seus pensamentos, sentimentos ou o que quiser compartilhar..."
                    className="min-h-[120px] resize-none rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-900 shadow-sm transition-all duration-200 hover:border-[#a5c9ff]/40 focus:border-[#a5c9ff] focus:outline-none focus:ring-1 focus:ring-[#a5c9ff]"
                  />
                </div>

                {/* Upload de mídia com prévia */}
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
                          {/* Botão fullscreen */}
                          <Button
                            type="button"
                            onClick={() => setIsFullscreen(true)}
                            variant="ghost"
                            size="icon"
                            className="absolute bottom-2 right-2 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm hover:scale-105 hover:bg-white"
                          >
                            <Fullscreen className="h-5 w-5 text-gray-700" />
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

                      {/* Botão de remover */}
                      <Button
                        type="button"
                        onClick={removeFile}
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm hover:scale-105 hover:bg-white"
                      >
                        <CircleX className="h-5 w-5 text-red-500" />
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

                  <div className="flex items-center space-x-2">
                    <Switch
                      className="data-[state=checked]:bg-linear-purple"
                      id="anonimo"
                      checked={anonimo}
                      onCheckedChange={setAnonimo}
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
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

              {/* Fullscreen da imagem */}
              {isFullscreen && file && (
                <div
                  className="fixed inset-0 !z-50 flex items-center justify-center"
                  onClick={closeFullscreen}
                >
                  <div
                    className="relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={file}
                      alt="Imagem em fullscreen"
                      className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
                    />
                    <Button
                      type="button"
                      onClick={closeFullscreen}
                      variant="ghost"
                      size="icon"
                      className="absolute -right-4 -top-4 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm hover:scale-105 hover:bg-white"
                    >
                      <CircleX className="h-6 w-6 text-red-500" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </form>
      </Dialog>
    </>
  )
}
