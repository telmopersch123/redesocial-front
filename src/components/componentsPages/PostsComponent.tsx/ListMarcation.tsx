import { Popover, PopoverContent } from '@radix-ui/react-popover'

import { PopoverTrigger } from '../../ui/popover'

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
      <PopoverTrigger asChild>
        <button className="bg-transparent"></button>
      </PopoverTrigger>
      <PopoverContent
        forceMount
        side="top"
        align="start"
        sideOffset={5}
        className="z-[9999] mb-5 max-h-[200px] w-60 overflow-y-auto rounded bg-white p-3 shadow"
      >
        <div className="space-y-1">
          {sugestoes.map((nome, i) => (
            <button
              key={i}
              onClick={() => {
                setClickedMention(false)
                setNovoComentario((prev) => {
                  const partes = prev.split(/\s+/) // pega palavras
                  partes[partes.length - 1] = `@${nome}` // substitui a última (a que tem @)
                  return partes.join(' ') + ' ' // adiciona um espaço depois
                })
              }}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition hover:bg-muted/60 focus:bg-muted/60"
            >
              <img
                src={`https://i.pravatar.cc/50?img=${i + 10}`}
                alt=""
                className="h-8 w-8 rounded-full object-cover"
              />

              <div className="flex flex-col">
                <span className="text-sm font-medium">@{nome}</span>
                <span className="text-xs text-muted-foreground">
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
