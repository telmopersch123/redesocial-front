import { CornerDownRight, MessageCircleX, Send } from 'lucide-react'
import { useLimitForms } from '../../../hooks/useLimitForms'
import type { ComentarioPost } from '../../../types'
import { TooltipComponent } from '../../globalcomponents/tooltipComponent'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'

interface ComentarioItemProps {
  comentario: ComentarioPost
  nivel: number
  respondendoA: number | null
  setRespondendoA: React.Dispatch<React.SetStateAction<number | null>>
  textoResposta: string
  setTextoResposta: (texto: string) => void
  adicionarResposta: (comentarioId: number) => void
  euUser: boolean
}

const CommentItem = ({
  comentario,
  nivel,
  respondendoA,
  setRespondendoA,
  textoResposta,
  setTextoResposta,
  adicionarResposta,
  euUser,
}: ComentarioItemProps) => {
  const comentarios = useLimitForms(5000)
  const estaRespondendo = respondendoA === comentario.id

  return (
    <div
      className={`${
        nivel === 1 ? 'border-l-2 border-purple-200 pl-4 sm:pl-6' : ''
      } ${nivel >= 2 ? 'border-none pl-0' : ''} w-full`}
    >
      <div className="relative flex w-full flex-col gap-3 rounded-lg bg-black/[0.02] p-3 sm:flex-row sm:items-start">
        <div className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
          <div className="flex w-full items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div
                className="h-9 w-9 flex-shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-violet-700 shadow-md"
                aria-hidden
              />

              <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-900">
                  {comentario.autor}
                </p>

                {comentario.respondendoPara && (
                  <p className="mt-0.5 text-xs font-medium text-purple-500">
                    ↳ @{comentario.respondendoPara}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-1 flex items-center gap-2">
              {euUser && (
                <TooltipComponent
                  Tag={
                    <Button className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white hover:!bg-red-700/90">
                      <MessageCircleX />
                    </Button>
                  }
                  description="Remover Comentário"
                />
              )}

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center justify-center text-xs text-purple-600 hover:bg-purple-50"
                onClick={() => {
                  setRespondendoA(comentario.id)
                  setTextoResposta('')
                }}
              >
                <CornerDownRight className="mr-1 h-3.5 w-3.5" />
                Responder
              </Button>
            </div>
          </div>

          <p className="mt-3 break-words text-sm leading-relaxed text-gray-700">
            {comentario.texto}
          </p>
        </div>
      </div>

      {estaRespondendo && (
        <div className="mt-3 w-full px-3">
          <div className="ml-2 flex items-end gap-2 text-xs font-medium text-purple-600">
            <span> Respondendo @{comentario.autor} </span>
            {comentarios.error && textoResposta.trim() !== '' && (
              <span className="mt-2 text-start text-sm text-rose-600">
                Uau rsrs! Você escreveu bastante! Envie a mensagem atual para
                continuar.
              </span>
            )}
          </div>

          <div className="mt-2 flex w-full flex-col flex-wrap justify-start gap-2 ym:flex-row ym:justify-between">
            <div className="w-full ym:w-[60%]">
              <Input
                placeholder="Escreva sua resposta..."
                value={textoResposta}
                onChange={(e) => {
                  setTextoResposta(e.target.value)
                  comentarios.handleChange(e)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    adicionarResposta(comentario.id)
                    setRespondendoA(null)
                  }
                }}
                className={`w-full rounded-full text-sm ${
                  comentarios.error && textoResposta.trim() !== ''
                    ? '!border-rose-300 focus:!ring-rose-500'
                    : 'focus:border-transparent focus:!ring-purple-600'
                }`}
                autoFocus
                aria-label={`Resposta para ${comentario.autor}`}
              />
            </div>

            <div className="flex w-full items-center justify-end gap-2 ym:w-[30%] ym:justify-end">
              <Button
                size="icon"
                className="bg-linear-purple rounded-full text-white hover:shadow-md"
                onClick={() => {
                  adicionarResposta(comentario.id)
                  setRespondendoA(null)
                }}
                disabled={!textoResposta.trim() || !!comentarios.error}
                aria-label="Enviar resposta"
              >
                <Send className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRespondendoA(null)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {comentario.respostas && comentario.respostas.length > 0 && (
        <div className="mt-3 space-y-3">
          {comentario.respostas.map((resposta) => (
            <CommentItem
              key={resposta.id}
              comentario={resposta}
              nivel={nivel + 1}
              respondendoA={respondendoA}
              setRespondendoA={setRespondendoA}
              textoResposta={textoResposta}
              setTextoResposta={setTextoResposta}
              adicionarResposta={adicionarResposta}
              euUser={euUser}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentItem
