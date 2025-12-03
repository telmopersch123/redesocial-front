'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Fullscreen, Globe, Lock, SquarePlus, Upload, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import FullscreenDialog from '../../components/componentsPages/componentsFeed/FullscreenDialog'
import { MessageForms } from '../../components/formCustomer/MessageForms'
import { Button } from '../../components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { Separator } from '../../components/ui/separator'
import { Textarea } from '../../components/ui/textarea'
import { useLimitForms } from '../../hooks/useLimitForms'
import {
  createCommunitySchema,
  type CreateCommunityFormData,
} from '../../lib/validatorSchemas/autoSchemaAutenticator'

const CreateCommunityPage = () => {
  const [limitUsers, setLimitUsers] = useState<number>(500)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPrivate, setIsPrivate] = useState(false)
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const nameCommunity = useLimitForms(50)
  const descriptionCommunity = useLimitForms(256)
  const communityRules = useLimitForms(256)
  const navigate = useNavigate()
  const prohibitedCommunity = useLimitForms(256)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreateCommunityFormData>({
    resolver: zodResolver(createCommunitySchema),
    defaultValues: {
      nameComunity: '',
      description: '',
      category: '',
    },
  })

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => setCoverImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => setCoverImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  function onSubmit(data: CreateCommunityFormData) {
    console.log(data)
  }

  console.log(descriptionCommunity.value.length >= 256)

  return (
    <>
      <div className="mb-4 mt-12 flex w-[calc(100vw-0rem)] flex-col px-5 md:w-[calc(100vw-20rem)]">
        <div className="space-y-4">
          <h1 className="text-center text-xl font-bold text-gray-800 md:text-left md:text-4xl">
            Criar nova comunidade
          </h1>
          <p className="mt-3 whitespace-normal break-words text-center text-base text-gray-500 text-muted-foreground md:text-left md:text-lg lg:text-xl">
            Construa um espaço acolhedor onde pessoas com interesses em comum
            possam se conectar, compartilhar e crescer juntas 🌱
          </p>
        </div>

        <Card className="mt-12 rounded-2xl border border-gray-200 bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">
              Detalhes principais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Nome */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Nome da comunidade
                </Label>
                <Input
                  id="name"
                  {...register('nameComunity', {
                    onChange: nameCommunity.handleChange,
                  })}
                  placeholder="Ex: Bem-estar e Meditação"
                  className={` ${nameCommunity.error ? 'border-red-500 focus:!ring-red-500' : 'focus:!ring-purple-600'}`}
                />
                {errors.nameComunity && (
                  <p className="text-sm font-medium text-red-500">
                    {errors.nameComunity?.message}
                  </p>
                )}
                <MessageForms
                  error={nameCommunity.error}
                  valueLength={nameCommunity.value.length}
                  maxLength={nameCommunity.maxLength}
                />
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700"
                >
                  Descrição
                </Label>
                <Textarea
                  {...register('description', {
                    onChange: descriptionCommunity.handleChange,
                  })}
                  id="description"
                  placeholder="Descreva o propósito e as intenções da sua comunidade..."
                  rows={4}
                  className={`max-h-[500px] ${descriptionCommunity.error ? 'border-red-500 focus:!ring-red-500' : 'focus:!ring-purple-600'}`}
                />
                {errors.description && (
                  <p className="text-sm font-medium text-red-500">
                    {errors.description?.message}
                  </p>
                )}
                <MessageForms
                  error={descriptionCommunity.error}
                  valueLength={descriptionCommunity.value.length}
                  maxLength={descriptionCommunity.maxLength}
                />
              </div>

              {/* Categoria */}
              <div className="space-y-2">
                <Label
                  htmlFor="category"
                  className="text-sm font-medium text-gray-700"
                >
                  Categoria
                </Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full focus:border-purple-600 focus:ring-0">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        <SelectGroup>
                          <SelectLabel>Categorias</SelectLabel>
                          <SelectItem value="autoajuda">Autoajuda</SelectItem>
                          <SelectItem value="mindfulness">
                            Mindfulness
                          </SelectItem>
                          <SelectItem value="fé">
                            Fé & Espiritualidade
                          </SelectItem>
                          <SelectItem value="saúde">Saúde mental</SelectItem>
                          <SelectItem value="outros">Outros</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-sm font-medium text-red-500">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Capa da Comunidade */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Imagem de capa
                </Label>

                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all duration-300 ${
                    isDragging
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-300 hover:border-purple-400'
                  }`}
                >
                  {coverImage ? (
                    <div className="relative w-full">
                      <img
                        src={coverImage}
                        alt="Preview"
                        className="mx-auto h-[250px] min-w-[200px] max-w-[400px] rounded-lg object-cover shadow-sm"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="bg-linear-purple absolute right-2 top-2 rounded-full p-2 shadow-md backdrop-blur-sm hover:scale-105"
                        onClick={() => setCoverImage(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setIsFullscreen(true)}
                        variant="ghost"
                        size="icon"
                        className="bg-linear-purple absolute left-2 top-2 rounded-full p-2 shadow-md backdrop-blur-sm hover:scale-105"
                      >
                        <Fullscreen className="h-5 w-5 text-white" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mb-2 h-8 w-8 text-purple-500" />
                      <p className="text-sm text-gray-500">
                        {isDragging
                          ? 'Solte a imagem aqui...'
                          : 'Arraste uma imagem ou clique para enviar'}
                      </p>
                      <label className="mt-3 cursor-pointer">
                        <input
                          ref={inputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileSelect}
                        />
                        <Button
                          onClick={() => inputRef.current?.click()}
                          className="bg-linear-purple text-white hover:shadow-md"
                        >
                          Escolher arquivo
                        </Button>
                      </label>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              {/* Regras */}
              <div className="space-y-2">
                <Label
                  htmlFor="rules"
                  className="text-sm font-medium text-gray-700"
                >
                  Regras da comunidade
                </Label>
                <Textarea
                  id="rules"
                  onChange={communityRules.handleChange}
                  placeholder="Liste as principais regras e boas práticas da comunidade..."
                  rows={3}
                  className={`max-h-[500px] ${communityRules.error ? 'border-red-500 focus:!ring-red-500' : 'focus:!ring-purple-600'}`}
                />
                <MessageForms
                  error={communityRules.error}
                  valueLength={communityRules.value.length}
                  maxLength={communityRules.maxLength}
                />
              </div>
              {/* Palavras proibidas */}
              <div className="space-y-1">
                <Label>Palavras proibidas</Label>
                <Textarea
                  className={`max-h-[500px] ${prohibitedCommunity.error ? 'border-red-500 focus:!ring-red-500' : 'focus:!ring-purple-600'}`}
                  onChange={prohibitedCommunity.handleChange}
                  placeholder="Separe por vírgulas para a identificação precisa das palavras, ok? Ex: palavrão1, palavrão2, palavrão3..."
                />
                <MessageForms
                  error={prohibitedCommunity.error}
                  valueLength={prohibitedCommunity.value.length}
                  maxLength={prohibitedCommunity.maxLength}
                />
              </div>

              <div className="w-full space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Limite de membros
                </label>

                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={10}
                    max={999}
                    value={limitUsers}
                    onChange={(e) => setLimitUsers(Number(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-gray-700"
                  />

                  <div className="relative">
                    <input
                      type="number"
                      min={10}
                      max={999}
                      value={limitUsers}
                      onChange={(e) => {
                        const v = Number(e.target.value)
                        if (v >= 10 && v <= 999) setLimitUsers(v)
                      }}
                      className="w-20 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium shadow-sm outline-none transition-all focus:border-gray-500 focus:ring-2 focus:ring-gray-300"
                    />
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                      /999
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  Defina o total máximo de membros da comunidade.
                </p>
              </div>

              <Separator />

              <div className="space-y-6">
                <div className="space-y-1">
                  <Label>Quem pode postar?</Label>
                  <Select defaultValue="todos">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os membros</SelectItem>
                      <SelectItem value="admins">
                        Somente administradores
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label>Quem pode comentar?</Label>
                  <Select defaultValue="todos">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os membros</SelectItem>
                      <SelectItem value="admins">
                        Somente administradores
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Privacidade */}
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  {isPrivate ? (
                    <Lock className="h-6 w-6 text-purple-600" />
                  ) : (
                    <Globe className="h-6 w-6 text-purple-600" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {isPrivate ? 'Comunidade privada' : 'Comunidade pública'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {isPrivate
                        ? 'Somente membros aprovados podem ver e interagir com as postagens.'
                        : 'Qualquer usuário pode participar e visualizar as postagens.'}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setIsPrivate(!isPrivate)}
                  variant="outline"
                  className="rounded-full border-purple-300 text-purple-600 hover:bg-purple-100"
                >
                  {isPrivate ? 'Tornar pública' : 'Tornar privada'}
                </Button>
              </div>

              <Separator />

              {/* Ações */}
              <div className="flex flex-col-reverse items-center justify-end gap-3 sm:flex-row">
                <Button
                  onClick={() => navigate(-1)}
                  variant="outline"
                  className="w-full border-gray-300 text-gray-600 hover:bg-gray-100 sm:w-auto"
                >
                  Cancelar
                </Button>

                <Button
                  disabled={
                    descriptionCommunity.value.length > 256 ||
                    nameCommunity.value.length > 50
                  }
                  className="bg-linear-purple w-full text-white hover:shadow-lg sm:w-auto"
                >
                  <SquarePlus className="mr-2 h-4 w-4" /> Criar comunidade
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <FullscreenDialog
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
        file={coverImage}
      />
    </>
  )
}

export default CreateCommunityPage
