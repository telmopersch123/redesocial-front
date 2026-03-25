'use client'

import { Flag, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom' // ou 'next/navigation' se for Next.js
import { Button } from '../../../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog'
import { useAuth } from '../../../context/getMe' // ajuste o caminho do seu hook de auth

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Label } from '../../../components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'
import { Textarea } from '../../../components/ui/textarea'
import {
  reportUser,
  type CreateReportUserFormData,
} from '../../../lib/validatorSchemas/autoSchemaAutenticator'
import { createReportUser } from '../../../services/authService'
import { MessagePerson } from '../../../utils/components/MessagePerson'

const ReportDialog = ({ profileId }: { profileId: number }) => {
  const { user: authUser } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [descricao, setDescricao] = useState('')
  const [isLoadingReportUser, setLoadingReportUser] = useState(false)
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateReportUserFormData>({
    resolver: zodResolver(reportUser),
    defaultValues: {
      reason: 'assedio_ou_bullying',
    },
  })

  const motivo = watch('reason')
  const handleOpenAttempt = (e: React.MouseEvent) => {
    if (!authUser?.id) {
      e.preventDefault()
      navigate('/auth')
      return
    }
    setOpen(true)
  }

  const onSubmit = async (data: CreateReportUserFormData) => {
    console.log('ola')
    setLoadingReportUser(true)
    try {
      const res = await createReportUser(profileId, descricao, data.reason)
      if (res) {
        MessagePerson(
          'Reportado com sucesso!',
          'Obrigado por nos ajudar...',
          'success'
        )
        setOpen(false)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingReportUser(false)
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={handleOpenAttempt}
          variant="ghost"
          className="flex items-center gap-2 rounded-full border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-all hover:border-red-400 hover:bg-red-100"
        >
          <Flag className="h-4 w-4" />
          Reportar
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[90%] rounded-2xl p-6 im:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Reportar usuário
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Selecione o motivo e descreva o que aconteceu.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Motivo</Label>
            <Select
              onValueChange={(val) =>
                setValue(
                  'reason',
                  val as
                    | 'assedio_ou_bullying'
                    | 'discurso_de_odio'
                    | 'conteudo_improprio'
                    | 'spam_ou_comportamento_suspeito'
                    | 'falsa_identidade'
                    | 'outro'
                )
              }
              value={motivo}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um motivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="assedio_ou_bullying">
                  Assédio ou bullying
                </SelectItem>
                <SelectItem value="discurso_de_odio">
                  Discurso de ódio
                </SelectItem>
                <SelectItem value="conteudo_improprio">
                  Conteúdo impróprio
                </SelectItem>
                <SelectItem value="spam_ou_comportamento_suspeito">
                  Spam ou comportamento suspeito
                </SelectItem>
                <SelectItem value="falsa_identidade">
                  Falsa identidade
                </SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
            {errors.reason && (
              <span className="text-xs text-red-500">
                {errors.reason.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Descrição (opcional)</Label>
            <Textarea
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o ocorrido…"
              className="h-24 resize-none"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            variant="destructive"
            className="px-5 font-semibold"
            disabled={isLoadingReportUser}
          >
            {isLoadingReportUser && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Enviar denúncia
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ReportDialog
