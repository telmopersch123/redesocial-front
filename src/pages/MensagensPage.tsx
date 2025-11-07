import { ArrowLeft, MessageCircle, MessageSquare } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../components/ui/button'
const MensagensPage = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null)
  const [clickedOpen, setClickedOpen] = useState<boolean>(false)
  const contatos: Array<{
    id: number
    nome: string
    ultimaMsg: string
    hora: string
  }> = [
    {
      id: 1,
      nome: 'Maria Oliveira',
      ultimaMsg: 'Oi, tudo bem?',
      hora: '10:23',
    },
    {
      id: 2,
      nome: 'João Silva',
      ultimaMsg: 'Vamos marcar aquela reunião.',
      hora: 'Ontem',
    },
    {
      id: 3,
      nome: 'Carla Mendes',
      ultimaMsg: 'Perfeito, obrigada!',
      hora: 'Segunda',
    },
    {
      id: 4,
      nome: 'Lucas Ferreira',
      ultimaMsg: 'Pode me enviar o arquivo?',
      hora: '15:47',
    },
    { id: 5, nome: 'Ana Paula', ultimaMsg: 'Até logo 👋', hora: '09:12' },
  ]
  useEffect(() => {
    setSelectedChat(null)
    setClickedOpen(false)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && selectedChat !== null) {
        setClickedOpen(true)
      } else if (window.innerWidth >= 768) {
        setClickedOpen(false)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [selectedChat])

  const handleOpen = (id: number) => {
    setSelectedChat(id)
    if (window.innerWidth < 768) {
      setClickedOpen(true)
    } else {
      setClickedOpen(false)
    }
  }

  return (
    <div className="dm:w-[calc(100vw-18rem)] flex h-screen w-full flex-col gap-0 p-2 md:w-[calc(100vw-16rem)] md:flex-row md:gap-4 md:p-4">
      {/* ===== LISTA DE CONVERSAS ===== */}
      <div
        className={`dm:w-1/4 mt-10 flex min-h-[calc(100vh-4rem)] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-gray-300 bg-white md:mt-0 md:w-1/2 lg:w-1/4 ${clickedOpen && 'max-[767px]:hidden'}`} // esconde a
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-gray-700" />
            <span className="font-semibold text-gray-900">Conversas</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto">
          {contatos.length > 0 ? (
            contatos.map((contato) => (
              <Button
                key={contato.id}
                onClick={() => handleOpen(contato.id)}
                variant="ghost"
                className={`group flex w-full items-center gap-3 rounded-none border-b border-gray-100 px-4 py-10 text-left transition-all duration-150 hover:bg-gray-50 active:scale-[0.99] ${
                  selectedChat === contato.id ? 'bg-gray-100' : 'bg-transparent'
                }`}
              >
                <img
                  src={`https://i.pravatar.cc/48?img=${contato.id + 10}`}
                  alt={contato.nome}
                  className="h-11 w-11 rounded-full object-cover"
                />

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium leading-tight text-gray-900 group-hover:text-gray-950">
                        {contato.nome}
                      </span>

                      <span className="dm:inline hidden text-[11px] text-gray-400 xl:hidden">
                        {contato.hora}
                      </span>
                    </div>

                    <span className="dm:hidden text-[11px] text-gray-400 xl:inline">
                      {contato.hora}
                    </span>
                  </div>

                  <p className="mt-0.5 truncate text-sm leading-snug text-gray-500">
                    {contato.ultimaMsg}
                  </p>
                </div>
              </Button>
            ))
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center text-gray-500">
              <MessageSquare className="mb-3 h-12 w-12 text-gray-400" />
              <p className="text-sm">Nenhuma conversa ainda</p>
            </div>
          )}
        </div>
      </div>
      {/* ===== ÁREA DO CHAT ===== */}

      <div
        className={`dm:w-3/4 mt-10 min-h-[calc(100vh-4rem)] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-gray-300 bg-white md:mt-0 md:w-1/2 lg:w-3/4 ${window.innerWidth < 768 ? (clickedOpen ? 'flex' : 'hidden') : 'flex'}`}
      >
        {selectedChat !== null ? (
          <div className="flex flex-1 flex-col p-6">
            {/* ===== HEADER DO CHAT ===== */}
            <div className="relative flex items-center border-b pb-3">
              <button
                onClick={() => setClickedOpen(false)}
                className="absolute left-0 mr-2 flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 md:hidden"
              >
                <ArrowLeft className="h-5 w-5 text-gray-700" />
              </button>

              <div className="mx-auto flex flex-col items-center justify-center text-center md:mx-0 md:items-start md:text-left">
                <h2 className="text-lg font-semibold text-gray-800">
                  {contatos.find((c) => c.id === selectedChat)?.nome}
                </h2>
              </div>
            </div>

            <div className="flex flex-1 items-center justify-center text-gray-500">
              <p>Mensagens aparecerão aqui...</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center text-gray-500 md:p-8">
            <MessageSquare className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <p className="hidden text-base md:block">
              Selecione uma conversa para começar
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MensagensPage
