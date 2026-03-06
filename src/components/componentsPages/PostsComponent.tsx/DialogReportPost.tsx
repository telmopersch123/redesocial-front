'use client'

import { Flag } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom' // ou 'next/navigation'
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
import { useAuth } from '../../../context/getMe' // ajuste o caminho conforme seu projeto
import { TooltipComponent } from '../../globalcomponents/tooltipComponent'

const DialogReportPost = () => {
  const { user: authUser } = useAuth()
  const navigate = useNavigate()

  const [motivo, setMotivo] = useState('')
  const [imagens, setImagens] = useState<File[]>([])
  const [open, onOpenChange] = useState(false)

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const filesArray = Array.from(e.target.files)
    setImagens((prev) => [...prev, ...filesArray])
  }

  // Intercepta a abertura do modal
  const handleOpenAttempt = (e: React.MouseEvent) => {
    if (!authUser?.id) {
      e.preventDefault()
      navigate('/auth')
      return
    }
    onOpenChange(true)
  }

  const handleEnviar = () => {
    // Aqui você faria a chamada para sua API
    const data = {
      motivo,
      imagens,
    }

    onOpenChange(false)
    setMotivo('')
    setImagens([])
    toast.success('Denúncia enviada para análise')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <TooltipComponent description="Denunciar Post">
          <Button
            variant="ghost"
            className="flex items-center gap-1.5 text-sm font-medium transition-all hover:text-red-600"
            onClick={handleOpenAttempt}
          >
            <Flag className="h-5 w-5" />
            Denunciar
          </Button>
        </TooltipComponent>
      </DialogTrigger>

      <DialogContent className="z-[80] w-[95%] rounded-md border-none om:max-w-md">
        <DialogHeader>
          <DialogTitle>Denunciar Post</DialogTitle>
          <DialogDescription>
            Explique o motivo da denúncia. Adicione imagens, se necessário.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Motivo da denúncia
            </label>
            <Textarea
              placeholder="Descreva o motivo da denúncia (mínimo 80 caracteres)..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="min-h-[120px] resize-none"
              maxLength={1000}
            />
            <span className="text-right text-xs text-gray-400">
              {motivo.length}/1000
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Adicionar imagens (opcional)
            </label>

            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleAddImages}
            />

            <div className="max-w-sm overflow-x-auto">
              {imagens.length > 0 && (
                <div className="mt-2 flex w-max flex-row gap-3">
                  {imagens.map((img, index) => (
                    <div
                      key={index}
                      className="relative h-20 w-[100px] rounded-md border"
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        alt="preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleEnviar}
            disabled={!motivo.trim() || motivo.length < 80}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Enviar denúncia
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogReportPost
