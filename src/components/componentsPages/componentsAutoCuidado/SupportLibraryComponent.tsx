import { forwardRef } from 'react'
import type { BibliotecaApoioItems } from '../../../types'

const SupportLibraryComponent = forwardRef<
  HTMLDivElement,
  BibliotecaApoioItems
>(({ item }, ref) => {
  const { icon: Icon, cor, categoria, tempo, titulo, desc } = item
  return (
    <div
      ref={ref}
      className="flex min-h-[200px] cursor-pointer flex-col rounded-2xl bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-zinc-900 dark:shadow-zinc-800"
    >
      <div
        className="flex h-12 w-full items-center justify-center rounded-t-2xl"
        style={{ backgroundColor: cor }}
      >
        <Icon className="h-6 w-6 text-white" />
      </div>

      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <span
            className="truncate rounded-full px-2 py-1 text-xs font-medium"
            style={{
              backgroundColor: `${cor}33`,
              color: cor,
            }}
          >
            {categoria}
          </span>
          <span className="truncate text-xs text-zinc-500 dark:text-zinc-400">
            {tempo}
          </span>
        </div>

        <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">
          {titulo}
        </h3>
        <p className="truncate text-sm text-zinc-600 dark:text-zinc-400">
          {desc}
        </p>
      </div>
    </div>
  )
})

export default SupportLibraryComponent
