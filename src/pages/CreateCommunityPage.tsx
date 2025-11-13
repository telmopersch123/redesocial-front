'use client'

import { Fullscreen, Globe, Lock, SquarePlus, Upload, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import FullscreenDialog from '../components/componentsPages/componentsFeed/FullscreenDialog'
import { MessageForms } from '../components/formCustomer/MessageForms'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Separator } from '../components/ui/separator'
import { Textarea } from '../components/ui/textarea'
import { useLimitForms } from '../hooks/useLimitForms'

const CreateCommunityPage = () => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPrivate, setIsPrivate] = useState(false)
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const nameCommunity = useLimitForms(50)
  const descriptionCommunity = useLimitForms(256)
  const communityRules = useLimitForms(256)
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

  return (
    <>
      <div className="mb-4 mt-16 flex w-[calc(100vw-0rem)] flex-col gap-8 px-4 md:w-[calc(100vw-20rem)]">
        <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">
          Criar nova comunidade
        </h1>
        <p className="text-gray-500">
          Construa um espaço acolhedor onde pessoas com interesses em comum
          possam se conectar, compartilhar e crescer juntas 🌱
        </p>

        <Card className="rounded-2xl border border-gray-200 bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">
              Detalhes principais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
                onChange={nameCommunity.handleChange}
                placeholder="Ex: Bem-estar e Meditação"
                className="focus:!ring-purple-600"
              />
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
                onChange={descriptionCommunity.handleChange}
                id="description"
                placeholder="Descreva o propósito e as intenções da sua comunidade..."
                rows={4}
                className="resize-none focus:!ring-purple-600"
              />
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
              <select
                id="category"
                className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-700 shadow-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-300"
              >
                <option value="">Selecione uma categoria</option>
                <option value="autoajuda">Autoajuda</option>
                <option value="mindfulness">Mindfulness</option>
                <option value="fé">Fé & Espiritualidade</option>
                <option value="saúde">Saúde mental</option>
                <option value="outros">Outros</option>
              </select>
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
                className="resize-none focus:!ring-purple-600"
              />
              <MessageForms
                error={communityRules.error}
                valueLength={communityRules.value.length}
                maxLength={communityRules.maxLength}
              />
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
              <NavLink to="/comunidades" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-gray-600 hover:bg-gray-100 sm:w-auto"
                >
                  Cancelar
                </Button>
              </NavLink>
              <Button className="bg-linear-purple w-full text-white hover:shadow-lg sm:w-auto">
                <SquarePlus className="mr-2 h-4 w-4" /> Criar comunidade
              </Button>
            </div>
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
