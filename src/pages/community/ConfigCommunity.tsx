'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Globe, Lock, Upload, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { Textarea } from '../../components/ui/textarea'
import {
  configCommunitySchema,
  type ConfigCommunityFormData,
} from '../../lib/validatorSchemas/autoSchemaAutenticator'
import {
  getConfigCommunities,
  updateCommunityDetails,
} from '../../services/authService'
import { LoadingComponent } from '../../utils/components/Loading'
import { MessagePerson } from '../../utils/components/MessagePerson'
interface ConfigCommunityProps {
  showButtonReturn?: boolean
  methodW_fullscreen?: boolean
  communityIdMananger?: number
}
const ConfigCommunity = ({
  showButtonReturn,
  methodW_fullscreen,
  communityIdMananger,
}: ConfigCommunityProps) => {
  const navigation = useNavigate()
  const location = useLocation()
  const [isPrivate, setIsPrivate] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [imageChanged, setImageChanged] = useState(false)
  const communityId = location.state?.communityIdState ?? communityIdMananger
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const previewURL = URL.createObjectURL(file)
      setImagePreview(previewURL)
      setImageChanged(true)
    }
  }
  const { register, handleSubmit, reset, setError, control, formState, watch } =
    useForm<ConfigCommunityFormData>({
      resolver: zodResolver(configCommunitySchema),
      defaultValues: {
        nameComunity: '',
        description: '',
        category: '',
        whoCanPost: 'members',
        whoCanComment: 'members',
        rules: '',
        limit: 500,
        isPrivate: false,
      },
    })
  const nameValue = watch('nameComunity') || ''
  const descriptionValue = watch('description') || ''
  const rulesValue = watch('rules') || ''
  const { errors, isDirty, isSubmitting } = formState

  useEffect(() => {
    const loadCommunityData = async () => {
      setIsInitialLoading(true)
      try {
        const response = await getConfigCommunities(communityId)

        // O reset do useForm preenche todos os campos de uma vez

        const data = {
          image: response.image || '',
          nameComunity: response.nameComunity || '',
          description: response.description || '',
          category: response.category ? String(response.category) : '',
          whoCanPost: response.whoCanPost || 'members',
          whoCanComment: response.whoCanComment || 'members',
          limit: response.memberLimit || 500,
          rules: response.rules || '',
          isPrivate: !!response.isPrivate,
        }

        reset(data, {
          keepIsSubmitted: false,
          keepDirty: false,
          keepValues: false,
        })

        if (response.image) setImagePreview(response.image)
        setIsPrivate(!!data.isPrivate)
      } catch (error) {
        console.log(error)
      } finally {
        setIsInitialLoading(false)
      }
    }

    loadCommunityData()
  }, [communityId, reset])

  const onSubmit = async (formData: ConfigCommunityFormData) => {
    try {
      let finalImageUrl = imagePreview
      const imageFile = inputRef.current?.files?.[0]

      if (imageFile instanceof File) {
        const formData = new FormData()
        formData.append('file', imageFile)
        formData.append('upload_preset', 'posts_tess')
        formData.append('folder', 'comunidades')

        const cloudinaryRes = await fetch(
          `https://api.cloudinary.com/v1_1/di5dwqjq7/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        )

        const cloudinaryData = await cloudinaryRes.json()
        if (cloudinaryData.secure_url) {
          finalImageUrl = cloudinaryData.secure_url
        }
      }

      const payload = {
        ...formData,
        image: finalImageUrl ?? undefined,
        limit: Number(formData.limit),
      }

      await updateCommunityDetails(
        communityId,
        payload as ConfigCommunityFormData
      )
      MessagePerson('Alterações salvas com sucesso', null, 'success')
      setImageChanged(false)
      navigation('/comunidades')
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('comunidade')) {
          setError('nameComunity', {
            type: 'server',
            message: error.message,
          })
          return
        }
        MessagePerson(error.message, null, 'error')
      }
    }
  }

  if (isInitialLoading) {
    return (
      <div className="flex h-screen w-[90vw] items-center justify-center xl:w-[1000px]">
        <LoadingComponent />
      </div>
    )
  }

  return (
    <div
      className={`mb-4 mt-4 px-4 md:mx-auto ${
        methodW_fullscreen
          ? 'w-[90vw] xl:w-[1000px]'
          : 'w-[90vw] md:max-w-[calc(100vw-20rem)] dm:max-w-[calc(100vw-30rem)] ny:max-w-[calc(100vw-50rem)]'
      } `}
    >
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Título */}
        <div className="flex flex-col items-center justify-between gap-1 sm:flex-row">
          <div className="flex flex-col space-y-4">
            <h1 className="text-center text-xl font-bold text-zinc-800 dark:text-zinc-100 md:text-left md:text-4xl">
              Configurações da Comunidade
            </h1>
            <p className="mt-3 whitespace-normal break-words text-center text-base text-zinc-500 dark:text-zinc-400 md:text-left md:text-lg lg:text-xl">
              Gerencie como sua comunidade funciona
            </p>
          </div>

          {!showButtonReturn && (
            <Button
              onClick={() => navigation(-1)}
              type="button"
              className="flex items-center gap-2 border-zinc-300 text-zinc-700 shadow-md hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <ArrowLeft size={16} />
              Voltar
            </Button>
          )}
        </div>

        {/* --- CARD: Informações básicas --- */}
        <Card className="mt-12 border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-zinc-900 dark:text-zinc-100">
              Informações básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Foto */}
            <p className="text-center text-sm font-semibold text-zinc-600 dark:text-zinc-400">
              Capa da Comunidade
            </p>
            <div className="flex flex-col items-center gap-4">
              <div className="relative flex h-[100px] w-full max-w-[240px] items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-purple-500/60 to-indigo-500/60 shadow-lg ring-2 ring-purple-300/40 transition-all duration-300 hover:shadow-xl im:h-[150px] im:w-[340px] im:max-w-[340px]">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Foto da comunidade"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 text-white/80" />
                )}
              </div>

              <Button
                onClick={() => inputRef.current?.click()}
                variant="outline"
                size="sm"
                type="button"
                className="flex gap-2 transition-all hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600"
              >
                <Upload size={16} />
                Alterar foto
              </Button>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  handleImageChange(e)
                }}
                ref={(el) => {
                  inputRef.current = el
                }}
              />
            </div>

            {/* Nome */}
            <div className="space-y-1">
              <Label className="text-zinc-800 dark:text-zinc-200">
                Nome da comunidade
              </Label>
              <Input
                {...register('nameComunity')}
                className={`border-zinc-300 focus:ring-purple-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 ${errors.nameComunity?.message ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Ex: Programadores Brasil"
              />

              <MessageForms
                error={errors.nameComunity?.message || ''}
                valueLength={nameValue.length}
                maxLength={50}
              />
            </div>

            {/* Descrição */}
            <div className="space-y-1">
              <Label className="text-zinc-800 dark:text-zinc-200">
                Descrição
              </Label>
              <Textarea
                {...register('description')}
                className={`max-h-[500px] border-zinc-300 focus:ring-purple-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 ${errors.description?.message ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Sobre o que é sua comunidade?"
              />
              {errors.description && (
                <p className="text-red-500">{errors.description.message}</p>
              )}
              <MessageForms
                error={errors.description?.message || ''}
                valueLength={descriptionValue.length}
                maxLength={256}
              />
            </div>

            {/* Categoria */}
            <div className="space-y-1">
              <Label className="text-zinc-800 dark:text-zinc-200">
                Categoria
              </Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
                  >
                    <SelectTrigger className="border-zinc-300 focus:ring-purple-600 dark:border-zinc-700 dark:bg-zinc-800">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent className="border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
                      <SelectItem value="ansiedade">
                        Sobre como vencer a Ansiedade
                      </SelectItem>
                      <SelectItem value="depressao">
                        Sobre como vencer a Depressão
                      </SelectItem>
                      <SelectItem value="arte">
                        Sobre o controle Emocional
                      </SelectItem>
                      <SelectItem value="tristeza">
                        Sobre como vencer a Tristeza
                      </SelectItem>
                      <SelectItem value="outros">Assuntos Gerais</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-red-500">{errors.category.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* --- CARD: Administração --- */}
        <Card className="border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-zinc-900 dark:text-zinc-100">
              Administração
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-1">
              <Label className="text-zinc-800 dark:text-zinc-200">
                Quem pode postar?
              </Label>
              <Controller
                name="whoCanPost"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="border-zinc-300 focus:ring-purple-600 dark:border-zinc-700 dark:bg-zinc-800">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
                      <SelectItem value="members">Todos os membros</SelectItem>
                      <SelectItem value="admins">
                        Somente administradores
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.whoCanPost && (
                <p className="text-red-500">{errors.whoCanPost.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-zinc-800 dark:text-zinc-200">
                Quem pode comentar?
              </Label>
              <Controller
                name="whoCanComment"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="border-zinc-300 focus:ring-purple-600 dark:border-zinc-700 dark:bg-zinc-800">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
                      <SelectItem value="members">Todos os membros</SelectItem>
                      <SelectItem value="admins">
                        Somente administradores
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.whoCanComment && (
                <p className="text-red-500">{errors.whoCanComment.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* --- CARD: Segurança e Regras --- */}
        <Card className="border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-zinc-900 dark:text-zinc-100">
              Segurança & Regras
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="w-full space-y-2">
              <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                Limite de membros
              </label>

              <div className="flex items-center gap-4">
                <Controller
                  name="limit"
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        type="range"
                        min={10}
                        max={999}
                        value={field.value ? String(field.value) : ''}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-purple-600 dark:bg-zinc-700"
                      />

                      <div className="relative">
                        <input
                          type="number"
                          min={10}
                          max={999}
                          value={field.value ? String(field.value) : ''}
                          onChange={(e) => {
                            const v = Number(e.target.value)
                            if (v >= 10 && v <= 999)
                              field.onChange(Number(e.target.value))
                          }}
                          className="w-20 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium shadow-sm outline-none transition-all focus:border-purple-600 focus:ring-2 focus:ring-purple-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                        />
                        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-zinc-400">
                          /999
                        </span>
                      </div>
                    </>
                  )}
                />
                {errors.limit && (
                  <p className="text-red-500">{errors.limit.message}</p>
                )}
              </div>

              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Defina o total máximo de membros da comunidade.
              </p>
            </div>

            <div className="space-y-1">
              <Label className="text-zinc-800 dark:text-zinc-200">
                Regras da comunidade
              </Label>
              <Textarea
                {...register('rules')}
                className={`max-h-[500px] border-zinc-300 focus:ring-purple-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 ${errors.rules?.message ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Liste as regras que os membros devem seguir."
              />
              <MessageForms
                error={errors.rules?.message || ''}
                valueLength={rulesValue.length}
                maxLength={256}
              />
            </div>

            <div className="flex w-full flex-col items-start justify-between rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50 md:flex-row md:items-center">
              <div className="flex min-w-0 items-start gap-3">
                {isPrivate ? (
                  <Lock className="h-6 w-6 shrink-0 text-purple-600 dark:text-purple-400" />
                ) : (
                  <Globe className="h-6 w-6 shrink-0 text-purple-600 dark:text-purple-400" />
                )}

                <div className="min-w-0 max-w-full">
                  <p className="break-words text-sm font-medium text-zinc-800 dark:text-zinc-100">
                    {isPrivate ? 'Comunidade privada' : 'Comunidade pública'}
                  </p>

                  <div className="break-words text-xs text-zinc-500 dark:text-zinc-400">
                    {isPrivate
                      ? 'Somente membros aprovados podem ver e interagir com as postagens.'
                      : 'Qualquer usuário pode participar e visualizar as postagens.'}
                  </div>
                </div>
              </div>
              <div className="ml-3 md:ml-0">
                <Controller
                  name="isPrivate"
                  control={control}
                  render={({ field }) => (
                    <Button
                      onClick={() => {
                        setIsPrivate(field.value ? false : true)
                        field.onChange(!field.value)
                      }}
                      variant="outline"
                      type="button"
                      className="mt-2 rounded-full border-purple-300 text-purple-600 hover:bg-purple-100 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/30"
                    >
                      {field.value ? 'Tornar pública' : 'Tornar privada'}
                    </Button>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botão fixo no mobile */}
        <div className="p-4 sm:p-0">
          <Button
            disabled={(!isDirty && !imageChanged) || isSubmitting}
            className="bg-linear-purple mt-4 h-12 w-full text-lg font-semibold transition-shadow hover:shadow-md"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <span>Salvando</span>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              </div>
            ) : (
              'Salvar alterações'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ConfigCommunity
