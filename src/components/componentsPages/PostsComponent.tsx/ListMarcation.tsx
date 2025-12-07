import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'

interface ListMarcationProps {
  setClickedMention: React.Dispatch<React.SetStateAction<boolean>>
  setNovoComentario: React.Dispatch<React.SetStateAction<string>>
  sugestoes: string[]
}

const ListMarcation = ({
  setClickedMention,
  setNovoComentario,
  sugestoes,
}: ListMarcationProps) => {
  return (
    <Popover open={true}>
      <PopoverTrigger>
        <span
          className="pointer-events-none absolute left-0 top-0 h-0 w-0 opacity-0"
          aria-hidden="true"
        />
      </PopoverTrigger>
      <PopoverContent
        forceMount
        side="top"
        align="start"
        sideOffset={8}
        className="z-[9999] mb-4 w-64 rounded-xl border border-zinc-200 bg-white p-2 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="space-y-1">
          {sugestoes.map((nome, i) => (
            <button
              key={i}
              onClick={() => {
                setClickedMention(false)
                setNovoComentario((prev) => {
                  const partes = prev.split(/\s+/)
                  partes[partes.length - 1] = `@${nome}`
                  return partes.join(' ') + ' '
                })
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-none dark:hover:bg-zinc-800 dark:focus:bg-zinc-800"
            >
              <img
                src={`https://i.pravatar.cc/50?img=${i + 10}`}
                alt={nome}
                className="h-9 w-9 flex-shrink-0 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-700"
              />

              <div className="flex flex-col">
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  @{nome}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Nome do Usuário
                </span>
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
export default ListMarcation
