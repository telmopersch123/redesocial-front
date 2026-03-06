'use client'

import { Flag } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom' // ou 'next/navigation' se for Next.js
import { Button } from '../../../components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog'
import { useAuth } from '../../../context/getMe' // ajuste o caminho do seu hook de auth

import { Label } from '../../../components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'
import { Textarea } from '../../../components/ui/textarea'

const ReportDialog = () => {
  const { user: authUser } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleOpenAttempt = (e: React.MouseEvent) => {
    if (!authUser?.id) {
      e.preventDefault()
      navigate('/auth')
      return
    }
    setOpen(true)
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
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um motivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="assedio">Assédio ou bullying</SelectItem>
                <SelectItem value="odio">Discurso de ódio</SelectItem>
                <SelectItem value="improprio">Conteúdo impróprio</SelectItem>
                <SelectItem value="spam">
                  Spam ou comportamento suspeito
                </SelectItem>
                <SelectItem value="falsa_identidade">
                  Falsa identidade
                </SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Descrição (opcional)</Label>
            <Textarea
              placeholder="Descreva o ocorrido…"
              className="h-24 resize-none"
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button variant="destructive" className="px-5 font-semibold">
            Enviar denúncia
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ReportDialog
