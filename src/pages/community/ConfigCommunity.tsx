'use client'

import { ArrowLeft, Globe, Lock, Upload, User } from 'lucide-react'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { useLimitForms } from '../../hooks/useLimitForms'
interface ConfigCommunityProps {
  showButtonReturn?: boolean
  methodW_fullscreen?: boolean
}
const ConfigCommunity = ({
  showButtonReturn,
  methodW_fullscreen,
}: ConfigCommunityProps) => {
  const navigation = useNavigate()
  const [isPrivate, setIsPrivate] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const nameCommunity = useLimitForms(50)
  const descriptionCommunity = useLimitForms(256)
  const rulesCommunity = useLimitForms(256)
  const prohibitedCommunity = useLimitForms(256)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const previewURL = URL.createObjectURL(file)
      setImagePreview(previewURL)
    }
  }

  return (
    <div
      className={`mx-auto mb-4 mt-12 px-5 ${methodW_fullscreen ? 'w-[1000px]' : 'w-[calc(100vw-0rem)] md:w-[calc(100vw-20rem)]'}`}
    >
      {/* Título */}
      <div className="flex flex-col items-center justify-between gap-1 sm:flex-row">
        <div className="flex flex-col space-y-4">
          <h1 className="text-center text-xl font-bold text-gray-800 md:text-left md:text-4xl">
            Configurações da Comunidade
          </h1>
          <p className="mt-3 whitespace-normal break-words text-center text-base text-gray-500 text-muted-foreground md:text-left md:text-lg lg:text-xl">
            Gerencie como sua comunidade funciona
          </p>
        </div>
        {/* Botão de retorno */}
        {!showButtonReturn && (
          <Button
            variant="outline"
            onClick={() => navigation(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Voltar
          </Button>
        )}
      </div>

      {/* --- CARD: Informações básicas --- */}
      <Card className="mt-12 border border-black/5 shadow-sm">
        <CardHeader>
          <CardTitle>Informações básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Foto */}
          <p className="text-center text-sm font-semibold text-muted-foreground">
            Capa da Comunidade
          </p>
          <div className="flex flex-col items-center gap-4">
            {/* Container da imagem */}
            <div className="relative flex h-[100px] w-[240px] items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-purple-500/60 to-indigo-500/60 shadow-lg ring-2 ring-purple-300/40 transition-all duration-300 hover:shadow-xl im:h-[150px] im:w-[340px]">
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

            {/* Botão */}
            <Button
              onClick={() => inputRef.current?.click()}
              variant="outline"
              className="flex gap-2 transition-all hover:bg-purple-600 hover:text-white"
            >
              <Upload size={16} />
              Alterar foto
            </Button>

            {/* Input hidden */}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* Nome */}
          <div className="space-y-1">
            <Label>Nome da comunidade</Label>
            <Input
              onChange={nameCommunity.handleChange}
              className={
                nameCommunity.error ? 'border-red-500 focus:!ring-red-500' : ''
              }
              placeholder="Ex: Programadores Brasil"
            />
            <MessageForms
              error={nameCommunity.error}
              valueLength={nameCommunity.value.length}
              maxLength={nameCommunity.maxLength}
            />
          </div>

          {/* Descrição */}
          <div className="space-y-1">
            <Label>Descrição</Label>
            <Textarea
              onChange={descriptionCommunity.handleChange}
              className={`max-h-[500px] ${descriptionCommunity.error ? 'border-red-500 focus:!ring-red-500' : ''}`}
              placeholder="Sobre o que é sua comunidade?"
            />
            <MessageForms
              error={descriptionCommunity.error}
              valueLength={descriptionCommunity.value.length}
              maxLength={descriptionCommunity.maxLength}
            />
          </div>

          {/* Categoria */}
          <div className="space-y-1">
            <Label>Categoria</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ansiedade">
                  Sobre como vencer a Ansiedade
                </SelectItem>
                <SelectItem value="depressao">
                  Sobre como vencer a Depressão
                </SelectItem>
                <SelectItem value="arte">Sobre o controle Emocional</SelectItem>
                <SelectItem value="tristeza">
                  Sobre como vencer a Tristeza
                </SelectItem>
                <SelectItem value="gerais">Assuntos Gerais</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* --- CARD: Administração --- */}
      <Card className="border border-black/5 shadow-sm">
        <CardHeader>
          <CardTitle>Administração</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Quem pode postar */}
          <div className="space-y-1">
            <Label>Quem pode postar?</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os membros</SelectItem>
                <SelectItem value="admins">Somente administradores</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quem pode comentar */}
          <div className="space-y-1">
            <Label>Quem pode comentar?</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os membros</SelectItem>
                <SelectItem value="admins">Somente administradores</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* --- CARD: Segurança e Regras --- */}
      <Card className="border border-black/5 shadow-sm">
        <CardHeader>
          <CardTitle>Segurança & Regras</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Palavras proibidas */}
          <div className="space-y-1">
            <Label>Palavras proibidas</Label>
            <Textarea
              className={`max-h-[500px] ${prohibitedCommunity.error ? 'border-red-500 focus:!ring-red-500' : ''}`}
              onChange={prohibitedCommunity.handleChange}
              placeholder="Separe por vírgulas para a identificação precisa das palavras, ok? Ex: palavrão1, palavrão2, palavrão3..."
            />
            <MessageForms
              error={prohibitedCommunity.error}
              valueLength={prohibitedCommunity.value.length}
              maxLength={prohibitedCommunity.maxLength}
            />
          </div>

          {/* Regras */}
          <div className="space-y-1">
            <Label>Regras da comunidade</Label>
            <Textarea
              className={`max-h-[500px] ${rulesCommunity.error ? 'border-red-500 focus:!ring-red-500' : ''}`}
              onChange={rulesCommunity.handleChange}
              placeholder="Liste as regras que os membros devem seguir."
            />
            <MessageForms
              error={rulesCommunity.error}
              valueLength={rulesCommunity.value.length}
              maxLength={rulesCommunity.maxLength}
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
        </CardContent>
      </Card>

      {/* Botão fixo no mobile */}
      <div className="p-4 sm:p-0">
        <Button className="bg-linear-purple mt-4 h-12 w-full text-lg font-semibold transition-shadow hover:shadow-md">
          Salvar alterações
        </Button>
      </div>
    </div>
  )
}

export default ConfigCommunity
