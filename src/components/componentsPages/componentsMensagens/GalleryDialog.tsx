import { Check, Image, ImageIcon, ImageOff, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
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
import { TooltipComponent } from '../../globalcomponents/tooltipComponent'
import { GalleryItem } from './ItemsGallery'
interface propsGallery {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export type SelectedImage = {
  index: number
  url: string
}

export function GalleryDialog({ open, setOpen }: propsGallery) {
  const [selected, setSelected] = useState<SelectedImage | null>(null)
  const wallpapers = useMemo(
    () => Array.from({ length: 10 }, (_, i) => `/papel${i + 1}.jpg`),
    []
  )
  useEffect(() => {
    if (localStorage.getItem('selectedImage')) {
      const stored = JSON.parse(localStorage.getItem('selectedImage') || '{}')
      if (!stored) return
      setSelected({ index: stored.index, url: `/papel${stored.index}.jpg` })
    } else {
      setSelected(null)
    }
  }, [open])
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipComponent
        Tag={
          <DialogTrigger asChild>
            <Button className="flex items-center justify-end bg-black/20 text-white shadow-[0_0px_1px_white] hover:text-white">
              <Image className="h-5 w-5" />
            </Button>
          </DialogTrigger>
        }
        description="Galeria de Imagens"
      />
      <DialogContent className="flex h-[92vh] w-[96vw] max-w-7xl flex-col overflow-hidden rounded-md bg-white p-0 dark:bg-gray-950">
        <DialogHeader className="shrink-0 border-b border-gray-200/70 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 px-8 pb-6 pt-8 dark:border-gray-800 dark:from-gray-900 dark:to-purple-950/20">
          <DialogTitle className="flex items-center gap-3 text-3xl font-light tracking-tight text-gray-900 dark:text-white">
            <ImageIcon className="h-9 w-9 text-indigo-600 dark:text-indigo-400" />
            Galeria de Imagens
          </DialogTitle>
          <DialogDescription className="mt-2 text-base text-gray-600 dark:text-gray-400">
            Clique na imagem para selecionar • Apenas uma por vez
          </DialogDescription>
        </DialogHeader>

        <div className="scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 flex-1 overflow-y-auto px-8 pb-2 pt-6">
          <div className="grid auto-rows-fr grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {wallpapers.map((wallpaper, i) => (
              <GalleryItem
                key={i}
                wallpaper={wallpaper}
                index={i}
                selectedIndex={selected?.index ?? null}
                onSelect={(index) => {
                  if (selected?.index === index) setSelected(null)
                  else setSelected({ index, url: wallpaper })
                }}
              />
            ))}
          </div>
        </div>

        {/* Footer fixo na parte inferior */}
        <DialogFooter className="flex shrink-0 items-center gap-2 border-t border-gray-200/70 bg-gray-50/90 px-8 py-6 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/95">
          <TooltipComponent
            Tag={
              <Button
                onClick={() => {
                  localStorage.removeItem('selectedImage')
                  setSelected(null)
                }}
              >
                <ImageOff className="h-5 w-5" />
              </Button>
            }
            description="Limpar Seleção"
          />
          <DialogClose asChild>
            <Button variant="outline" size="lg" className="px-8 font-medium">
              <X className="mr-2 h-5 w-5" />
              Cancelar
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              size="lg"
              onClick={() => {
                if (selected !== null)
                  localStorage.setItem(
                    'selectedImage',
                    JSON.stringify({
                      index: selected.index,
                      path: selected.url,
                    })
                  )
              }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 px-10 font-medium shadow-lg hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl"
            >
              <Check className="mr-2 h-5 w-5" strokeWidth={3} />
              Confirmar Seleção
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
