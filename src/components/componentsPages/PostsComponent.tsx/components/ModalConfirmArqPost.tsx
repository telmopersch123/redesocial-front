'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Archive, Eye, Upload, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useRefreshPermission } from '../../../../context/RefreshPermissionContext'
import {
  archivePostSchema,
  type ArchivePostFormData,
} from '../../../../lib/validatorSchemas/autoSchemaAutenticator'
import { ArchivedPostsCommunity } from '../../../../services/authService'
import { TooltipComponent } from '../../../globalcomponents/tooltipComponent'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../../ui/alert-dialog'
import { Button } from '../../../ui/button'
import { Dialog, DialogContent, DialogTitle } from '../../../ui/dialog'
import { Textarea } from '../../../ui/textarea'

interface ModalConfirmArchivePostProps {
  nameUser: string
  postId: string | number
  open?: boolean
  setOpen?: (open: boolean) => void
  disabled?: boolean
}

export const ModalConfirmArchivePost = ({
  nameUser,
  postId,
  open,
  setOpen,
  disabled,
}: ModalConfirmArchivePostProps) => {
  const [loading, setLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const { allowRefresh, resetRefresh } = useRefreshPermission()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<ArchivePostFormData>({
    resolver: zodResolver(archivePostSchema),
    defaultValues: {
      motivo: '',
      imagens: [],
    },
  })
  const motivo = watch('motivo')
  const imagens = watch('imagens') || []
  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (
      !['image/png', 'image/jpeg'].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      setError('imagens', {
        type: 'manual',
        message: 'Apenas imagens PNG ou JPG de até 5MB',
      })
      e.target.value = ''
      return
    }

    clearErrors('imagens')
    setValue('imagens', [file])
  }

  const onSubmit = async (data: ArchivePostFormData) => {
    setLoading(true)
    try {
      let mediaUrl = null
      const mediaType = 'image'
      if (imagens) {
        const formData = new FormData()
        formData.append('file', imagens[0])
        formData.append('upload_preset', 'posts_tess')
        formData.append('folder', 'comunidades')

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/di5dwqjq7/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        )

        const result = await response.json()
        mediaUrl = result.secure_url
      }
      await ArchivedPostsCommunity(postId, mediaType, mediaUrl, data.motivo)
      toast.success('Post arquivado com sucesso')
      reset({
        motivo: '',
        imagens: [],
      })
      setPreviewImage(null)
      setValue('imagens', [])
      if (setOpen !== undefined) {
        setOpen(false)
      }
      allowRefresh()
    } catch {
      toast.error('Erro ao arquivar post')
      if (setOpen !== undefined) {
        setOpen(true)
      }
      resetRefresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <TooltipComponent description="Arquivar Postagem">
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              className={`dark:hover:text-purple-40 group flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-700 shadow-sm transition-all hover:border-purple-400 hover:bg-purple-50 hover:text-purple-600 dark:border-gray-700 dark:bg-[#1b1b1b] dark:text-gray-300 dark:hover:border-purple-500 dark:hover:bg-purple-500/10 ${disabled && 'hidden'}`}
            >
              <Archive className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span className="text-sm font-medium">Arquivar</span>
            </Button>
          </AlertDialogTrigger>
        </TooltipComponent>

        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Arquivar postagem?</AlertDialogTitle>
            <AlertDialogDescription>
              Moderador, você deseja arquivar a postagem de{' '}
              <span className="font-medium">@{nameUser}</span>? Para prosseguir,
              informe uma justificativa obrigatória e, se necessário, adicione
              imagens como evidência.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <Textarea
                {...register('motivo')}
                placeholder="Justificativa do arquivamento..."
                className={`h-[120px] resize-none ${
                  errors.motivo
                    ? 'border-red-500 focus-visible:ring-red-500'
                    : ''
                }`}
              />
              {errors.motivo && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.motivo.message}
                </p>
              )}

              <div className="space-y-8">
                <label className="text-sm font-medium text-muted-foreground">
                  Evidências / Prints (opcional)
                </label>

                {imagens.length === 0 && (
                  <label
                    htmlFor="archive-images"
                    className={`ml-1 flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed py-6 text-center transition-colors ${
                      errors.imagens
                        ? 'border-red-500 bg-red-50'
                        : 'border-purple-300 bg-purple-50 hover:border-purple-400 hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-900/20 dark:hover:bg-purple-900/30'
                    } `}
                  >
                    <Upload className="h-6 w-6 text-purple-600 dark:text-purple-400" />

                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                      Clique para anexar evidências da infração
                    </p>

                    <p className="text-xs text-muted-foreground">
                      PNG, JPG ou JPEG
                    </p>

                    <input
                      id="archive-images"
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={handleAddImages}
                      className="hidden"
                    />
                  </label>
                )}
                {errors.imagens && (
                  <p className="text-center text-xs text-red-500">
                    {errors.imagens.message}
                  </p>
                )}
                {imagens.length > 0 && (
                  <div className="flex items-center justify-center gap-3">
                    <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg border">
                      <img
                        src={URL.createObjectURL(imagens[0])}
                        alt="preview"
                        className="h-full w-full object-cover"
                      />

                      <Button
                        type="button"
                        onClick={() =>
                          setPreviewImage(URL.createObjectURL(imagens[0]))
                        }
                        className="absolute left-1 top-1 rounded-full bg-black/60 p-1 text-white transition hover:bg-black/80"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        type="button"
                        onClick={() => setValue('imagens', [])}
                        className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white transition hover:bg-black/80"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>

              <Button
                type="submit"
                disabled={!motivo.trim() || loading}
                className="bg-purple-600 text-white hover:bg-purple-700"
              >
                {loading ? (
                  <>
                    Arquivando
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  </>
                ) : (
                  'Arquivar'
                )}
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
      {previewImage && (
        <Dialog
          open={!!previewImage}
          onOpenChange={() => setPreviewImage(null)}
        >
          <DialogContent className="max-w-[90vw] border-none bg-transparent p-0 shadow-none">
            <DialogTitle className="sr-only">Preview da Imagem</DialogTitle>

            <div className="relative flex items-center justify-center">
              <img
                src={previewImage ?? ''}
                alt="Preview"
                className="max-h-[85vh] max-w-[85vw] rounded-xl object-contain shadow-2xl"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
