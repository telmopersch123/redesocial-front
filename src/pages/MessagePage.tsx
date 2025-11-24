import { format } from 'date-fns'
import {
  ArrowLeft,
  CheckCheck,
  Fullscreen,
  MessageCircle,
  MessageSquare,
} from 'lucide-react'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { EmojiInput } from '../components/componentsPages/componentsMensagens/EmojiInput'
import { GalleryDialog } from '../components/componentsPages/componentsMensagens/GalleryDialog'
import { MessageForms } from '../components/formCustomer/MessageForms'
import { TooltipComponent } from '../components/globalcomponents/tooltipComponent'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useLimitForms } from '../hooks/useLimitForms'

interface MSG {
  id: string
  texto: string
  remetente: 'eu' | 'outro'
  data: Date
}
const contatos = [
  {
    id: 1,
    nome: 'Maria Oliveira',
    ultimaMsg: 'Oi, tudo bem?',
    hora: '10:23',
    avatar: 11,
  },
  {
    id: 2,
    nome: 'João Silva',
    ultimaMsg: 'Vamos marcar aquela reunião.',
    hora: 'Ontem',
    avatar: 12,
  },
  {
    id: 3,
    nome: 'Carla Mendes',
    ultimaMsg: 'Perfeito, obrigada!',
    hora: 'Segunda',
    avatar: 13,
  },
  {
    id: 4,
    nome: 'Lucas Ferreira',
    ultimaMsg: 'Pode me enviar o arquivo?',
    hora: '15:47',
    avatar: 14,
  },
  {
    id: 5,
    nome: 'Ana Paula',
    ultimaMsg: 'Até logo',
    hora: '09:12',
    avatar: 15,
  },
]
const FicticiostatusUser: ('online' | 'offline')[] = [
  'online',
  'offline',
  'online',
  'offline',
  'online',
]
const mensagensFicticias: Record<number, MSG[]> = {
  1: [
    {
      id: '1',
      texto:
        'Boa noite pessoal do grupo 👋 Só vim avisar que sábado o churrasco tá confirmado na minha casa Tragam carne, bebida e boa energia! Começa 16h, quem chegar cedo ajuda a acender a churrasqueira 🔥Boa noite pessoal do grupo 👋 Só vim avisar que sábado o churrasco tá confirmado na minha casa Tragam carne, bebida e boa energia! Começa 16h, quem chegar cedo ajuda a acender a churrasqueira 🔥Boa noite pessoal do grupo 👋 Só vim avisar que sábado o churrasco tá confirmado na minha casa Tragam carne, bebida e boa energia! Começa 16h, quem chegar cedo ajuda a acender a churrasqueira 🔥Boa noite pessoal do grupo 👋 Só vim avisar que sábado o churrasco tá confirmado na minha casa Tragam carne, bebida e boa energia! Começa 16h, quem chegar cedo ajuda a acender a churrasqueira 🔥Boa noite pessoal do grupo 👋 Só vim avisar que sábado o churrasco tá confirmado na minha casa Tragam carne, bebida e boa energia! Começa 16h, quem chegar cedo ajuda a acender a churrasqueira 🔥',
      remetente: 'outro',
      data: new Date(2025, 10, 20, 10, 20),
    },
    {
      id: '2',
      texto:
        'Boa noite pessoal do grupo 👋 Só vim avisar que sábado o churrasco tá confirmado na minha casa Tragam carne, bebida e boa energia! Começa 16h, quem chegar cedo ajuda a acender a churrasqueira 🔥Boa noite pessoal do grupo 👋 Só vim avisar que sábado o churrasco tá confirmado na minha casa Tragam carne, bebida e boa energia! Começa 16h, quem chegar cedo ajuda a acender a churrasqueira 🔥Boa noite pessoal do grupo 👋 Só vim avisar que sábado o churrasco tá confirmado na minha casa Tragam carne, bebida e boa energia! Começa 16h, quem chegar cedo ajuda a acender a churrasqueira 🔥Boa noite pessoal do grupo 👋 Só vim avisar que sábado o churrasco tá confirmado na minha casa Tragam carne, bebida e boa energia! Começa 16h, quem chegar cedo ajuda a acender a churrasqueira 🔥Boa noite pessoal do grupo 👋 Só vim avisar que sábado o churrasco tá confirmado na minha casa Tragam carne, bebida e boa energia! Começa 16h, quem chegar cedo ajuda a acender a churrasqueira 🔥',
      remetente: 'eu',
      data: new Date(2025, 10, 20, 10, 21),
    },
    {
      id: '3',
      texto: 'Tudo ótimo por aqui!',
      remetente: 'eu',
      data: new Date(2025, 10, 20, 10, 23),
    },
    {
      id: '4',
      texto: 'Que bom',
      remetente: 'outro',
      data: new Date(2025, 10, 20, 10, 24),
    },
  ],
  2: [
    {
      id: '5',
      texto: 'E aí, podemos marcar aquela reunião?',
      remetente: 'outro',
      data: new Date(2025, 10, 19, 14, 30),
    },
    {
      id: '6',
      texto: 'Claro! Que dia você prefere?',
      remetente: 'eu',
      data: new Date(2025, 10, 19, 14, 35),
    },
  ],
}

const MessagePage = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null)
  const [image, setImage] = useState<string>('')
  const [contatMessage, setContatMessage] = useState<boolean>(false)
  const [chatMenssage, setChatMessage] = useState<boolean>(false)
  const [fullscreen, setFullscreen] = useState<boolean>(false)
  const [inputText, setInputText] = useState('')
  const [open, setOpen] = useState<boolean>(false)
  const [messages, setMessages] = useState<MSG[]>([])
  const messageInput = useLimitForms(5000)
  const inputRef = useRef<HTMLInputElement>(null)
  const responsive = 1000
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { id: idUser } = useParams()
  const pathname = useLocation().pathname
  const navigateFlex = useNavigate()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (selectedChat !== null) {
      const timer = setTimeout(scrollToBottom, 100)
      return () => clearTimeout(timer)
    }
  }, [selectedChat])

  useEffect(() => {
    setSelectedChat(null)
    setContatMessage(false)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < responsive && selectedChat !== null) {
        setContatMessage(true)
      } else if (window.innerWidth >= responsive) {
        setContatMessage(false)
      }
      if (window.innerWidth < responsive && selectedChat === null) {
        setChatMessage(false)
      } else {
        setChatMessage(true)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [selectedChat])

  const handleOpen = (id: number) => {
    if (selectedChat === id) {
      return
    }
    setSelectedChat(id)
    navigateFlex(`/mensagens/${id}`)
    if (window.innerWidth < 768) {
      setContatMessage(true)
      setChatMessage(true)
    } else {
      setContatMessage(false)
      setChatMessage(false)
    }
  }

  useEffect(() => {
    if (selectedChat !== null) {
      setMessages(mensagensFicticias[selectedChat] || [])
    }
  }, [selectedChat])

  useEffect(() => {
    if (idUser !== undefined && idUser !== null && pathname !== '/mensagens') {
      setSelectedChat(parseInt(idUser))
    } else {
      setSelectedChat(null)
    }
  }, [idUser])

  const handleSendMessage = () => {
    if (inputText.trim() === '' || inputText.length > 5000) return

    const newMensage: MSG = {
      id: Date.now().toString(),
      texto: inputText,
      remetente: 'eu',
      data: new Date(),
    }
    if (selectedChat !== null) {
      setMessages((prevMessages) => [...prevMessages, newMensage])
      setInputText('')
      messageInput.handleChange({ target: { value: '' } } as ChangeEvent<
        HTMLTextAreaElement | HTMLInputElement
      >)

      setTimeout(() => {
        inputRef.current?.focus()
      })
    }
  }
  const handleFullScreen = () => {
    setContatMessage((valor) => !valor)
    setFullscreen((valor) => !valor)
  }
  const handleAddEmoji = (emoji: string) => {
    setInputText((prevInput) => prevInput + emoji)
  }
  useEffect(() => {
    if (localStorage.getItem('selectedImage')) {
      const stored = JSON.parse(localStorage.getItem('selectedImage') || '{}')
      if (!stored) return
      setImage(stored.path)
    } else {
      setImage('')
    }
  }, [open])
  const contactSelect = contatos.find((c) => c.id === selectedChat)

  return (
    <div className="flex h-screen w-full flex-col gap-0 p-2 md:w-[calc(100vw-16rem)] md:flex-row md:gap-4 md:p-4 dm:w-[calc(100vw-18rem)]">
      {/* ===== LISTA DE CONVERSAS ===== */}
      <div
        className={`mt-10 flex min-h-[calc(100vh-4rem)] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-gray-300 bg-white md:mt-0 dm:w-1/2 ${contatMessage && 'hidden'}`}
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
                onClick={() => {
                  handleOpen(contato.id)
                }}
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

                      <span className="hidden text-[11px] text-gray-400 dm:inline xl:hidden">
                        {contato.hora}
                      </span>
                    </div>

                    <span className="text-[11px] text-gray-400 dm:hidden xl:inline">
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
        className={`relative mt-10 min-h-[calc(100vh-4rem)] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-gray-300 md:mt-0 md:w-full lg:w-3/4 ${image ? '' : 'bg-white'} ${fullscreen ? '!w-full' : ''} ${chatMenssage ? 'flex' : 'hidden'} shadow-xl`}
      >
        {selectedChat !== null ? (
          <>
            {image && (
              <div
                className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${image})`,
                  imageRendering: 'auto',
                }}
              />
            )}
            <div
              className={`absolute right-2 top-2 z-10 flex justify-end space-x-2 border-gray-100`}
            >
              <TooltipComponent
                Tag={
                  <Button
                    onClick={() => {
                      handleFullScreen()
                    }}
                    className="hidden items-center justify-end bg-black/20 text-white shadow-[0_0px_1px_white] hover:text-white dm:flex"
                  >
                    <Fullscreen className="h-5 w-5" />
                  </Button>
                }
                description="Tela cheia"
              />
              <GalleryDialog open={open} setOpen={setOpen} />
            </div>

            <div className="relative flex flex-1 flex-col sm:mt-6 sm:pl-6">
              {/* HEADER DO CHAT — Clean e sereno */}
              <div className="flex items-center gap-4 rounded-none border-b border-white/20 bg-white/40 p-5 pb-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] backdrop-blur-md sm:rounded-s-full">
                <button
                  onClick={() => {
                    setSelectedChat(null)
                    setContatMessage(false)
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full transition-all hover:bg-white/60 hover:shadow-sm dm:hidden"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-700" />
                </button>

                <img
                  src={`https://i.pravatar.cc/56?img=${contactSelect?.avatar}`}
                  alt={contactSelect?.nome}
                  className="h-12 w-12 rounded-full object-cover shadow-lg ring-2 ring-white/60"
                />

                <div className="flex-1">
                  <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                    {contactSelect?.nome}
                  </h2>

                  <div
                    style={{
                      textShadow: '0px 1px 1px rgba(255,255,255,0.4)',
                    }}
                    className={`$ inline-flex items-center gap-1 rounded-full bg-green-50/70 px-2 py-0.5 text-[11px] font-medium shadow-sm`}
                  >
                    {FicticiostatusUser[0] !== 'online' ? (
                      <>
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                        <p className="rounded-full text-green-500">Online</p>
                      </>
                    ) : (
                      <>
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-500"></span>
                        <p className="rounded-full text-gray-500">Offline</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* MENSAGENS — Fundo sereno + scroll invisível */}
              <div className="chat-messages invisivel-scroll flex-1 space-y-6 overflow-y-auto bg-gradient-to-b pb-8">
                <div className="scrollbar-invisible mr-1 flex h-[730px] flex-col space-y-4 overflow-y-auto pb-10 pt-1">
                  {messages.length === 0 ? (
                    <div className="m-auto flex h-full flex-col items-center justify-center text-center">
                      <div className="flex flex-col items-center justify-center rounded-md p-10 text-center backdrop-blur-md">
                        <div className="mb-5 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 p-6 shadow-inner">
                          <MessageCircle className="h-12 w-12 text-gray-300" />
                        </div>
                        <p
                          style={{}}
                          className="text-lg font-semibold text-black"
                        >
                          Nenhuma mensagem ainda
                        </p>
                        <p className="mt-2 font-mono text-sm font-semibold text-black/70">
                          Comece a conversa!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`animate-fade-in flex slide-in-from-bottom-1 ${
                            msg.remetente === 'eu'
                              ? 'justify-end'
                              : 'justify-start'
                          }`}
                        >
                          <div
                            className={`group relative max-w-[75%] rounded-2xl px-5 py-3.5 shadow-sm transition-all duration-200 hover:shadow-lg ${
                              msg.remetente === 'eu'
                                ? 'rounded-br-md bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/20'
                                : 'ml-2 rounded-bl-md bg-white text-gray-800 shadow-gray-100 ring-1 ring-gray-200/80 sm:ml-9'
                            }`}
                          >
                            <p
                              className={`break-words text-sm leading-relaxed ${
                                msg.texto.length > 80
                                  ? 'text-justify'
                                  : 'text-left'
                              }`}
                            >
                              {msg.texto}
                            </p>

                            <div className="mt-2 flex items-center justify-end gap-1.5">
                              <span
                                className={`text-xs font-medium tracking-tight ${
                                  msg.remetente === 'eu'
                                    ? 'text-blue-100'
                                    : 'text-gray-400'
                                }`}
                              >
                                {format(msg.data, 'HH:mm')}
                              </span>
                              {msg.remetente === 'eu' && (
                                <CheckCheck className="h-3.5 w-3.5 text-blue-100 opacity-90" />
                              )}
                            </div>

                            {/* Pequeno triângulo de fala (opcional, mas fica lindo) */}
                            {msg.remetente === 'eu' ? (
                              <div className="absolute -right-1 top-3 h-3 w-3 rotate-45 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                            ) : (
                              <div className="absolute -left-1 top-3 h-3 w-3 rotate-45 bg-white ring-1 ring-gray-200/80"></div>
                            )}
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>
              </div>

              {/* INPUT — Elegante, fixo no fundo, com foco suave */}

              <div
                className={`absolute inset-x-0 bottom-1 m-auto w-[98%] rounded-2xl border border-gray-300 bg-white/80 !py-3 text-sm shadow-sm !ring-0 backdrop-blur-sm transition-all placeholder:text-gray-400 focus:border-blue-500 ${
                  inputText.length > 5000 ? '!border-red-600' : ''
                }`}
              >
                <div className="relative flex">
                  <div className="border-1 ml-1 rounded-md border">
                    <EmojiInput onSelect={handleAddEmoji} />
                  </div>
                  <Input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => {
                      messageInput.handleChange(e)
                      setInputText(e.target.value)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    placeholder="Digite uma mensagem..."
                    className={`w-[calc(100%-4rem)] truncate !border-none !text-lg !shadow-none !outline-none !ring-0 focus:!outline-none`}
                  />

                  {inputText.length > 5000 && (
                    <div className="absolute -bottom-[0.8rem] left-16 flex items-center px-2">
                      <MessageForms
                        error={messageInput.error}
                        valueLength={messageInput.value.length}
                        maxLength={messageInput.maxLength}
                      />
                    </div>
                  )}

                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || inputText.length > 5000}
                    className="bg-linear-purple mr-2 rounded-xl px-6 py-3.5 font-medium text-white transition-all hover:shadow-md active:scale-95 disabled:opacity-50"
                  >
                    Enviar
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* TELA INICIAL — Quando nada selecionado */
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 p-8">
              <MessageSquare className="h-16 w-16 text-blue-600" />
            </div>
            <h3 className="mb-2 text-2xl font-semibold text-gray-800">
              Suas mensagens
            </h3>
            <p className="max-w-sm text-gray-500">
              Selecione uma conversa ao lado para começar a trocar mensagens
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MessagePage
