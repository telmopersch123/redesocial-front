import { zodResolver } from '@hookform/resolvers/zod'
import { CircleX, Fullscreen, ImageIcon, VideoIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useCriarPostDialog } from '../../../context/ContextDialogPost'

import { useLimitForms } from '../../../hooks/useLimitForms'
import {
  postDialogSchema,
  type PostDialogSchema,
} from '../../../lib/validatorSchemas/autoSchemaAutenticator'
import { savePost } from '../../../services/authService'
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

  const [uploadType, setUploadType] = useState<'image' | 'video' | null>(null)
  const [file, setFile] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [typeError, setTypeError] = useState('')

  const [tagInput, setTagInput] = useState<string>('')
  const [tags, setTags] = useState<string[]>([])
  const { value, error, handleChange, maxLength } = useLimitForms(5000)
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<PostDialogSchema>({
    resolver: zodResolver(postDialogSchema),
    mode: 'onChange',
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const destinationType = watch('destination.type')

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

      setValue('tags', [...tags, tagInput.trim()], {
        shouldDirty: true,
        shouldValidate: true,
      })
    }
  }
  const handleRemoveTag = (tag: string) => {
    const newTags = tags.filter((t) => t !== tag)

    setTags(newTags)

    setValue('tags', newTags.length ? newTags : undefined, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }
  const handleSelectType = (type: 'image' | 'video') => {
    setUploadType(type)
    setFile(null)
    setValue('media', null, {
      shouldDirty: true,
      shouldValidate: true,
    })
    if (fileInputRef.current) fileInputRef.current.value = ''
    setTimeout(() => fileInputRef.current?.click(), 100)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !uploadType) return
    const previewURL = URL.createObjectURL(file)
    setFile(previewURL)

    setValue(
      'media',
      {
        type: uploadType,
        url: previewURL,
      },
      {
        shouldDirty: true,
        shouldValidate: true,
      }
    )
  }

  const removeFile = () => {
    if (file) URL.revokeObjectURL(file)
    setFile(null)
    setUploadType(null)

    setValue('media', null, {
      shouldDirty: true,
      shouldValidate: true,
    })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleCloseDialog = () => {
    if (file) URL.revokeObjectURL(file)
    setFile(null)
    setUploadType(null)
    setIsFullscreen(false)

    setValue('tags', undefined, {
      shouldDirty: false,
      shouldValidate: false,
    })

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  useEffect(() => {
    if (destinationType === 'geral') {
      setValue('destination.communityId', null, {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
  }, [destinationType, setValue])

  const onSubmit = async (data: PostDialogSchema) => {
    try {
      if (data.media && data.media.url.startsWith('blob:')) {
        data.media.url = data.media.url.replace('blob:', '')
      }
      await savePost(data)

      handleCloseDialog()
      setTags([])
      close()
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <>
      <Dialog
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
        <DialogContent className="!z-40 w-[95%] !overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-[#1a1a1a] dark:shadow-black/60 sm:max-w-[520px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="max-h-[80vh] overflow-y-auto p-6">
              <DialogHeader className="space-y-2 text-center">
                <DialogTitle asChild>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-zinc-100">
                    Compartilhe como você está se sentindo
                  </h1>
                </DialogTitle>
                <DialogDescription asChild>
                  <p className="text-sm text-muted-foreground dark:text-zinc-400">
                    Este é um espaço seguro para expressar seus pensamentos e
                    emoções.
                  </p>
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="sentimento"
                    className="text-sm font-medium text-gray-700 dark:text-zinc-200"
                  >
                    Como você está se sentindo?
                  </Label>
                  <Controller
                    name="feeling"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(v) => field.onChange(v)}
                      >
                        <SelectTrigger
                          id="sentimento"
                          className="rounded-lg border border-gray-300 bg-white shadow-sm dark:border-[#3a3a3a] dark:bg-[#242424] dark:text-zinc-100"
                        >
                          <SelectValue placeholder="Selecione um sentimento" />
                        </SelectTrigger>

                        <SelectContent className="dark:bg-[#2a2a2a] dark:text-zinc-100">
                          <SelectItem value="feliz">😊 Feliz</SelectItem>
                          <SelectItem value="esperancoso">
                            🌱 Esperançoso
                          </SelectItem>
                          <SelectItem value="ansioso">😰 Ansioso</SelectItem>
                          <SelectItem value="agradecido">
                            🙏 Agradecido
                          </SelectItem>
                          <SelectItem value="triste">😢 Triste</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />

                  {errors.feeling && (
                    <p className="text-xs text-red-500">
                      {errors.feeling.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="pensamentos"
                    className="text-sm font-medium text-gray-700 dark:text-zinc-200"
                  >
                    O que está no seu coração?
                  </Label>

                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        value={value}
                        onChange={(e) => {
                          handleChange(e)
                          setValue('description', e.target.value, {
                            shouldValidate: true,
                          })
                        }}
                        placeholder="Escreva seus pensamentos, sentimentos ou o que quiser compartilhar..."
                        className="min-h-[120px] resize-none rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-900 shadow-sm transition-all hover:border-[#a5c9ff]/40 focus:border-[#a5c9ff] focus:ring-1 focus:ring-[#a5c9ff] dark:border-[#3a3a3a] dark:bg-[#242424] dark:text-zinc-100"
                      />
                    )}
                  />

                  {errors.description && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                  <MessageForms
                    error={error}
                    valueLength={value.length}
                    maxLength={maxLength}
                  />
                </div>

                <div className="flex flex-col gap-3 rounded-xl bg-[#f8f5f2] p-4 shadow-sm dark:bg-[#242424]">
                  <Label className="text-sm font-medium text-gray-800 dark:text-zinc-200">
                    Onde deseja publicar?
                  </Label>
                  <Controller
                    name="destination.type"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="rounded-lg border border-gray-300 bg-white shadow-sm focus:border-[#a5c9ff] focus:ring-1 focus:ring-[#a5c9ff] dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-zinc-100">
                          <SelectValue placeholder="Escolha o destino do post" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-[#2a2a2a] dark:text-zinc-100">
                          <SelectItem disabled={postCommunity} value="geral">
                            🌍 Post geral (todos podem ver)
                          </SelectItem>
                          <SelectItem value="comunidade">
                            👥 Post em uma comunidade
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />

                  {destinationType === 'comunidade' && (
                    <div className="mt-2 flex flex-col gap-2 transition-all">
                      <Label className="text-sm font-medium text-gray-700 dark:text-zinc-200">
                        Escolha uma comunidade
                      </Label>
                      <Controller
                        name="destination.communityId"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value?.toString()}
                            onValueChange={(v) => field.onChange(Number(v))}
                          >
                            <SelectTrigger className="rounded-lg border border-gray-300 bg-white shadow-sm focus:border-[#a5c9ff] focus:ring-1 focus:ring-[#a5c9ff] dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-zinc-100">
                              <SelectValue placeholder="Selecione uma comunidade" />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-[#2a2a2a] dark:text-zinc-100">
                              <SelectItem value="1">🌸 Mindfulness</SelectItem>
                              <SelectItem value="2">
                                💬 Autoajuda & Reflexão
                              </SelectItem>
                              <SelectItem value="3">
                                ✨ Fé & Espiritualidade
                              </SelectItem>
                              <SelectItem value="4">🌿 Bem-estar</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 rounded-xl bg-[#f8f5f2] p-4 shadow-sm dark:bg-[#242424]">
                  <Label className="text-sm font-medium text-gray-800 dark:text-zinc-200">
                    Adicionar mídia (opcional)
                  </Label>

                  {!file ? (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <Button
                        type="button"
                        onClick={() => handleSelectType('image')}
                        variant="outline"
                        className={`flex items-center gap-2 rounded-lg border-gray-300 px-4 py-2 text-sm font-medium shadow-sm transition-all hover:border-[#a5c9ff] hover:text-[#a5c9ff] dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-zinc-100 ${
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
                        className={`flex items-center gap-2 rounded-lg border-gray-300 px-4 py-2 text-sm font-medium shadow-sm transition-all hover:border-[#a5c9ff] hover:text-[#a5c9ff] dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-zinc-100 ${
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
                    <div className="relative flex flex-col items-center justify-center rounded-lg border border-gray-300 bg-white p-3 shadow-sm dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
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

                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="tags"
                    className="text-sm font-medium text-gray-700 dark:text-zinc-200"
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
                    className="rounded-lg border border-gray-300 bg-white p-2 text-sm shadow-sm focus:border-[#a5c9ff] focus:ring-1 focus:ring-[#a5c9ff] dark:border-[#3a3a3a] dark:bg-[#242424] dark:text-zinc-100"
                  />
                  {typeError && <ErrorsPostDialog errors={typeError} />}
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

                <div className="flex justify-between rounded-xl bg-[#f8f5f2] p-4 shadow-sm dark:bg-[#242424]">
                  <div className="flex flex-col">
                    <Label
                      htmlFor="anonimo"
                      className="text-base font-medium text-gray-800 dark:text-zinc-100"
                    >
                      Publicar anonimamente
                    </Label>
                    <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
                      Seu nome não será exibido.
                    </p>
                  </div>
                  <Controller
                    control={control}
                    name="anonymous"
                    render={({ field }) => (
                      <Switch
                        id="anonimo"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-linear-purple"
                      />
                    )}
                  />
                </div>
              </div>

              <DialogFooter className="mt-6 flex gap-3 sm:justify-end">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="rounded-lg border-gray-300 bg-white px-5 py-2 font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-100 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-zinc-100 dark:hover:bg-[#3a3a3a]"
                  >
                    Cancelar
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={!isValid || !!error}
                  className="bg-linear-purple rounded-lg px-5 py-2 font-semibold text-white shadow-md transition-all hover:opacity-90"
                >
                  Publicar
                </Button>
              </DialogFooter>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <FullscreenDialog
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
        file={file}
      />
    </>
  )
}
