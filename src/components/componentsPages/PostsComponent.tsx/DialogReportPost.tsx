'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Flag, Loader2, X } from 'lucide-react' // Loader para feedback de envio
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'
import { useAuth } from '../../../context/getMe'
import {
  reportPostSchema,
  type ReportPostFormData,
} from '../../../lib/validatorSchemas/autoSchemaAutenticator'
import { createReportPost } from '../../../services/authService'
import { MessagePerson } from '../../../utils/components/MessagePerson'
import { TooltipComponent } from '../../globalcomponents/tooltipComponent'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'

interface DialogReportPostProps {
  postId: number
}

const REASON_LABELS: Record<string, string> = {
  assedio_ou_bullying: 'Assédio ou Bullying',
  discurso_de_odio: 'Discurso de Ódio',
  conteudo_improprio: 'Conteúdo Impróprio',
  spam_ou_comportamento_suspeito: 'Spam ou Comportamento Suspeito',
  falsa_identidade: 'Falsa Identidade',
  outro: 'Outro',
}

const DialogReportPost = ({ postId }: DialogReportPostProps) => {
  const { user: authUser } = useAuth()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [imagens, setImagens] = useState<File[]>([])
  const [open, onOpenChange] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReportPostFormData>({
    resolver: zodResolver(reportPostSchema),
    defaultValues: {
      description: '',
    },
  })

  const descriptionValue = watch('description')
  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const filesArray = Array.from(e.target.files)
    setImagens((prev) => [...prev, ...filesArray])
  }

  const removeImage = (index: number) => {
    setImagens((prev) => prev.filter((_, i) => i !== index))
  }

  const handleOpenAttempt = (e: React.MouseEvent) => {
    if (!authUser?.id) {
      e.preventDefault()
      navigate('/auth')
      return
    }
    onOpenChange(true)
  }

  const onSubmit = async (data: ReportPostFormData) => {
    setIsSubmitting(true)
    try {
      await createReportPost({
        postId,
        reason: data.reason,
        description: data.description,
        imagens: imagens,
      })

      MessagePerson('Sucesso', 'Denúncia enviada para análise.', 'success')
      reset()
      setImagens([])
      onOpenChange(false)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <TooltipComponent description="Denunciar Post">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1.5 text-sm font-medium transition-all hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
            onClick={handleOpenAttempt}
          >
            <Flag className="h-5 w-5" />
            <span className="xs:inline hidden">Denunciar</span>
          </Button>
        </TooltipComponent>
      </DialogTrigger>

      {/* Ajustado: h-auto e max-h-screen para não fugir da tela em mobile */}
      <DialogContent className="z-[80] w-[95%] max-w-md overflow-hidden rounded-md border-none p-0 sm:w-full">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Denunciar Post</DialogTitle>
          <DialogDescription>
            Explique o motivo da denúncia e anexe provas se necessário.
          </DialogDescription>
        </DialogHeader>

        {/* ScrollArea no form: evita que os inputs sumam em telas pequenas */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex max-h-[80vh] flex-col overflow-y-auto"
        >
          <div className="space-y-4 p-6 pt-2">
            {/* Select de Motivo */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Motivo</label>
              <Select
                onValueChange={(value) => setValue('reason', value as any)}
              >
                <SelectTrigger
                  className={errors.reason ? 'border-red-500' : ''}
                >
                  <SelectValue placeholder="Selecione um motivo..." />
                </SelectTrigger>
                <SelectContent className="z-[90]">
                  {Object.entries(REASON_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.reason && (
                <span className="text-xs text-red-500">
                  {errors.reason.message}
                </span>
              )}
            </div>

            {/* Descrição */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Descrição detalhada</label>
              <Textarea
                {...register('description')}
                placeholder="Mínimo de 80 caracteres..."
                className={`min-h-[100px] resize-none ${errors.description ? 'border-red-500' : ''}`}
              />
              <div className="flex justify-between">
                {errors.description && (
                  <span className="text-xs text-red-500">
                    {errors.description.message}
                  </span>
                )}
                <span
                  className={`ml-auto text-xs ${descriptionValue.length < 80 ? 'text-red-500' : 'text-zinc-400'}`}
                >
                  {descriptionValue.length}/1000
                </span>
              </div>
            </div>

            {/* Upload de Imagens - REFORMULADO */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Evidências (Opcional)
              </label>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleAddImages}
                className="cursor-pointer"
              />

              {/* Grid de imagens: Agora elas quebram linha ou scrollam internamente */}
              {imagens.length > 0 && (
                <div className="mt-2 grid grid-cols-4 gap-2 rounded-lg border border-dashed bg-zinc-50/50 p-2 dark:bg-zinc-900/50">
                  {imagens.map((img, index) => (
                    <div
                      key={index}
                      className="relative aspect-square w-full rounded-md border bg-zinc-100 dark:bg-zinc-800"
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        alt="preview"
                        className="h-full w-full rounded-md object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -right-1.5 -top-1.5 rounded-full bg-red-600 p-0.5 text-white shadow-md transition-colors hover:bg-red-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="sticky bottom-0 flex flex-row justify-end gap-2 border-t p-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px] bg-red-600 text-white hover:bg-red-700"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Enviar denúncia'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DialogReportPost
