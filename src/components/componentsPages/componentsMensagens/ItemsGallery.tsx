import { Check } from 'lucide-react'
import { memo } from 'react'

interface GalleryItemProps {
  wallpaper: string
  index: number
  selectedIndex: number | null
  onSelect: (i: number) => void
}

export const GalleryItem = memo(
  ({ wallpaper, index, selectedIndex, onSelect }: GalleryItemProps) => {
    const isSelected = selectedIndex === index

    return (
      <div
        onClick={() => onSelect(index)}
        className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl border border-gray-200/60 bg-gray-100 shadow-md transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl dark:border-gray-800 dark:bg-gray-900/80"
      >
        <div
          className={`duration-400 absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100 ${
            isSelected ? 'opacity-100 group-hover:opacity-100' : ''
          }`}
        >
          <div
            className={`scale-0 transition-transform delay-75 duration-300 group-hover:scale-100 ${
              isSelected ? 'scale-100' : ''
            }`}
          >
            <div
              className={`flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-white/25 shadow-2xl backdrop-blur-md ${
                isSelected ? 'border-green-600 bg-green-600/25' : ''
              }`}
            >
              <Check
                className={`h-11 w-11 text-white ${isSelected ? 'text-green-500' : ''}`}
                strokeWidth={4}
              />
            </div>
          </div>
        </div>

        <img
          src={wallpaper}
          alt=""
          loading="lazy"
          className="pointer-events-none h-full w-[1000px] select-none rounded-xl object-fill"
        />

        <div className="absolute right-3 top-3 z-20">
          <span className="rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-xs font-semibold tracking-wider text-white/95 backdrop-blur-sm">
            {index + 1}
          </span>
        </div>
      </div>
    )
  }
)
