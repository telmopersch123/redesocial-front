import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'

interface ListMarcationProps {
  setClickedMention: React.Dispatch<React.SetStateAction<boolean>>
  setNovoComentario: React.Dispatch<React.SetStateAction<string>>
  sugestoes: { id: number; name_at: string; avatar: string }[]
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
        className="z-[9999] w-64 rounded-xl border border-zinc-200 bg-white p-2 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="space-y-1">
          {sugestoes.map((user) => (
            <button
              key={user.id}
              onClick={() => {
                setClickedMention(false)
                setNovoComentario((prev) => {
                  // const partes = prev.split(/\s+/)
                  // partes[partes.length - 1] = `@${user.name_at}`
                  // return partes.join(' ') + ' '
                  return prev.replace(/@[\w._-]*$/, `@${user.name_at} `)
                })
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-none dark:hover:bg-zinc-800 dark:focus:bg-zinc-800"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name_at}
                  className="h-9 w-9 flex-shrink-0 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-700"
                />
              ) : (
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-600 dark:bg-purple-900/30">
                  {user.name_at[0].toUpperCase()}
                </div>
              )}

              <div className="flex flex-col">
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  @{user.name_at}
                </span>
                <span className="text-[10px] font-medium uppercase text-zinc-500">
                  ID: {user.id}
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
