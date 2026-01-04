import { format } from 'date-fns'
import {
  ArrowLeft,
  Check,
  CheckCheck,
  Fullscreen,
  Image,
  MessageCircle,
  MessageSquare,
} from 'lucide-react'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { EmojiInput } from '../components/componentsPages/componentsMensagens/EmojiInput'
import { GalleryDialog } from '../components/componentsPages/componentsMensagens/GalleryDialog'
import { MessageForms } from '../components/formCustomer/MessageForms'
import { TooltipComponent } from '../components/globalcomponents/tooltipComponent'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useAuth } from '../context/getMe'
import { useLimitForms } from '../hooks/useLimitForms'
import { getContatos } from '../services/authService'
import { socket } from '../services/socket'

interface MSG {
  id: string
  content: string
  tempId?: string
  remetente: 'eu' | 'outro'
  senderId: number
  receiverId?: number
  createdAt: Date
  status?: 'pending' | 'sent'
}

interface Contato {
  chatId: number
  contact: {
    name: string
    avatar: string
  }
  lastMessage: {
    id: string
    createdAt: Date
    chatId: string
    senderId: number
    content: string
  }
  createdAt: string
}

const MessagePage = () => {
  const [contatos, setContatos] = useState<Contato[]>([])
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
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
  const { chatId } = useParams<{ chatId: string }>()
  const { user } = useAuth()

  const navigateFlex = useNavigate()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }
  const handleOpen = (id: number) => {
    if (Number(selectedChat) === id) {
      return
    }
    navigateFlex(`/mensagens/${id}`)
    setSelectedChat(id.toString())
    if (window.innerWidth < 768) {
      setContatMessage(true)
      setChatMessage(true)
    } else {
      setContatMessage(false)
      setChatMessage(false)
    }
  }
  const handleSendMessage = async () => {
    if (inputText.trim() === '' || inputText.length > 5000) return
    const tempId = `temp-${Math.random().toString(36)}`
    const newMessage: MSG = {
      id: tempId,
      tempId,
      content: inputText,
      remetente: 'eu',
      senderId: Number(user?.id),
      createdAt: new Date(),
      status: 'pending',
    }

    setMessages((prev) => [...prev, newMessage])

    socket.emit('chat:send', {
      chatId: selectedChat ?? undefined,
      content: inputText,
      tempId,
    })

    setInputText('')
    messageInput.handleChange({ target: { value: '' } } as ChangeEvent<
      HTMLTextAreaElement | HTMLInputElement
    >)
    inputRef.current?.focus()
  }
  const handleFullScreen = () => {
    setContatMessage((valor) => !valor)
    setFullscreen((valor) => !valor)
  }
  const handleAddEmoji = (emoji: string) => {
    setInputText((prevInput) => prevInput + emoji)
  }

  useEffect(() => {
    setSelectedChat(null)
    setContatMessage(false)
  }, [])
  useEffect(() => {
    const handleChatCreated = ({ chatId }: { chatId: string }) => {
      setSelectedChat(chatId)
      socket.emit('chat:join', chatId)
    }

    socket.on('chat:created', handleChatCreated)
    return () => {
      socket.off('chat:created', handleChatCreated)
    }
  }, [])
  useEffect(() => {
    async function fetchContatos() {
      try {
        const response = await getContatos()
        setContatos(response)
      } catch (error) {
        console.log(error)
      }
    }

    fetchContatos()
  }, [])
  useEffect(() => {
    const handleReceiveMessage = (incoming: MSG | MSG[]) => {
      const messagesArray = Array.isArray(incoming) ? incoming : [incoming]
      setMessages((prev) => {
        // Cria um mapa com chave única por mensagem (id ou tempId)
        const messageMap = new Map<string, MSG>()

        prev.forEach((m) => {
          const key = m.tempId ?? m.id
          if (key) messageMap.set(key, m)
        })

        messagesArray.forEach((msg) => {
          const remetente = msg.senderId === Number(user?.id) ? 'eu' : 'outro'

          const status =
            msg.status ||
            (msg.senderId === Number(user?.id) ? 'sent' : undefined)

          if (msg.tempId && messageMap.has(msg.tempId)) {
            // Atualiza mensagem temporária com id real
            messageMap.set(msg.tempId, {
              ...msg,
              remetente,
              status,
            })
          } else if (
            !msg.tempId &&
            ![...messageMap.values()].some((m) => m.id === msg.id)
          ) {
            messageMap.set(msg.id, {
              ...msg,
              remetente,
              status,
            })
          }
        })

        // Retorna as mensagens em ordem cronológica
        return [...messageMap.values()].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      })
    }

    socket.on('chat:receive', handleReceiveMessage)

    return () => {
      socket.off('chat:receive', handleReceiveMessage)
    }
  }, [user?.id])
  useEffect(() => {
    const handleHistory = (msgs: MSG[]) => {
      console.log(msgs)
      setMessages((prev) => {
        const map = new Map<string, MSG>()

        prev.forEach((m) => {
          map.set(m.tempId ?? m.id, m)
        })

        msgs.forEach((msg) => {
          map.set(msg.id, {
            ...msg,
            remetente: msg.senderId === Number(user?.id) ? 'eu' : 'outro',
            status: 'sent',
          })
        })

        return [...map.values()].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      })
    }

    socket.on('chat:history', handleHistory)

    return () => {
      socket.off('chat:history', handleHistory)
    }
  }, [user?.id])
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  useEffect(() => {
    if (!chatId) return

    setSelectedChat(chatId)
  }, [chatId])
  useEffect(() => {
    if (!selectedChat) {
      return
    }
    setMessages([])
    socket.emit('chat:join', selectedChat)
    socket.emit('chat:history', { chatId: selectedChat })
  }, [selectedChat])
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
  useEffect(() => {
    if (localStorage.getItem('selectedImage')) {
      const stored = JSON.parse(localStorage.getItem('selectedImage') || '{}')
      if (!stored) return
      setImage(stored.path)
    } else {
      setImage('')
    }
  }, [open])

  const contactSelect = contatos.find((c) => c.chatId === Number(selectedChat))

  return (
    <div className="flex h-screen w-full flex-col gap-0 p-2 md:w-[calc(100vw-16rem)] md:flex-row md:gap-4 md:p-4 dm:w-[calc(100vw-18rem)]">
      {/* ===== LISTA DE CONVERSAS ===== */}
      <div
        className={`mt-10 flex min-h-[calc(100vh-4rem)] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 md:mt-0 dm:w-1/2 ${contatMessage && 'hidden'}`}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              Conversas
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto">
          {contatos.length > 0 ? (
            contatos.map((contato: Contato) => (
              <Button
                key={contato.chatId}
                onClick={() => handleOpen(contato.chatId)}
                variant="ghost"
                className={`group flex w-full items-center gap-3 rounded-none border-b border-zinc-100 px-4 py-10 text-left transition-all duration-150 hover:bg-zinc-100 active:scale-[0.99] dark:border-zinc-800 dark:hover:bg-zinc-800 ${
                  Number(selectedChat) === contato.chatId
                    ? 'bg-zinc-100 dark:bg-zinc-800'
                    : 'bg-transparent'
                }`}
              >
                <img
                  src={`https://i.pravatar.cc/48?img=${contato.chatId + 10}`}
                  alt={contato.contact.name}
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-700"
                />

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium leading-tight text-zinc-900 group-hover:text-zinc-950 dark:text-zinc-100 dark:group-hover:text-zinc-50">
                        {contato.contact.name}
                      </span>
                      <span className="hidden text-[11px] text-zinc-400 dark:text-zinc-500 dm:inline xl:hidden">
                        {contato.createdAt}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-400 dark:text-zinc-500 dm:hidden xl:inline">
                      {contato.createdAt}
                    </span>
                  </div>

                  <p className="mt-0.5 truncate text-sm leading-snug text-zinc-500 dark:text-zinc-400">
                    {contato.lastMessage.content}
                  </p>
                </div>
              </Button>
            ))
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center text-zinc-500 dark:text-zinc-400">
              <MessageSquare className="mb-3 h-12 w-12 text-zinc-400 dark:text-zinc-600" />
              <p className="text-sm">Nenhuma conversa ainda</p>
            </div>
          )}
        </div>
      </div>

      {/* ===== ÁREA DO CHAT ===== */}
      <div
        className={`relative mt-10 min-h-[calc(100vh-4rem)] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-zinc-200 md:mt-0 md:w-full lg:w-3/4 ${image ? '' : 'bg-white dark:bg-zinc-900'} ${fullscreen ? '!w-full' : ''} ${chatMenssage ? 'flex' : 'hidden'} shadow-xl dark:border-zinc-800`}
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

            <div className="absolute right-2 top-2 z-10 flex justify-end space-x-2">
              <TooltipComponent
                Tag={
                  <Button
                    onClick={handleFullScreen}
                    className="hidden items-center justify-end bg-black/20 text-white backdrop-blur-sm hover:bg-black/30 dm:flex"
                  >
                    <Fullscreen className="h-5 w-5" />
                  </Button>
                }
                description="Tela cheia"
              />
              <TooltipComponent
                Tag={
                  <Button
                    onClick={() => setOpen(true)}
                    variant="ghost"
                    className="flex items-center justify-end bg-black/20 text-white shadow-[0_0px_1px_white] hover:text-white"
                  >
                    <Image className="h-5 w-5" />
                  </Button>
                }
                description="Galeria"
              />
              <GalleryDialog open={open} setOpen={setOpen} />
            </div>

            <div className="flex flex-1 flex-col">
              {/* HEADER DO CHAT */}
              <div className="flex items-center gap-4 rounded-none border-b border-zinc-200 bg-white/40 p-5 pb-4 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/60">
                <button
                  onClick={() => {
                    setSelectedChat(null)
                    setContatMessage(false)
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full transition-all hover:bg-white/60 hover:shadow-sm dm:hidden"
                >
                  <ArrowLeft className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                </button>

                <img
                  src={`https://i.pravatar.cc/56?img=${contactSelect?.contact.avatar}`}
                  alt={contactSelect?.contact.name}
                  className="h-12 w-12 rounded-full object-cover shadow-lg ring-2 ring-white/60"
                />

                <div className="flex-1">
                  <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {contactSelect?.contact.name}
                  </h2>

                  {/* <div className="inline-flex items-center gap-1 rounded-full bg-green-50/70 px-2 py-0.5 text-[11px] font-medium shadow-sm dark:bg-green-900/30">
                    {FicticiostatusUser[0] !== 'online' ? (
                      <>
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                        <p className="text-green-600 dark:text-green-400">
                          Online
                        </p>
                      </>
                    ) : (
                      <>
                        <span className="h-1.5 w-1.5 rounded-full bg-zinc-500"></span>
                        <p className="text-zinc-500 dark:text-zinc-400">
                          Offline
                        </p>
                      </>
                    )}
                  </div> */}
                </div>
              </div>

              {/* MENSAGENS */}
              <div className="chat-messages invisivel-scroll flex-1 space-y-6 overflow-y-auto bg-gradient-to-b pb-8">
                <div className="scrollbar-invisible mr-1 flex h-[calc(100vh-11.5rem)] flex-col space-y-4 overflow-y-auto pb-8 pt-1 md:pb-0">
                  {messages.length === 0 ? (
                    <div className="m-auto flex h-full flex-col items-center justify-center text-center">
                      <div className="flex flex-col items-center justify-center rounded-md p-10 text-center backdrop-blur-md">
                        <div className="mb-5 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-50 p-6 shadow-inner dark:from-zinc-800 dark:to-zinc-900">
                          <MessageCircle className="h-12 w-12 text-zinc-400 dark:text-zinc-600" />
                        </div>
                        <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                          Nenhuma mensagem ainda
                        </p>
                        <p className="mt-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
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
                              : 'ml-1.5 justify-start sm:-ml-5'
                          }`}
                        >
                          <div
                            className={`group relative max-w-[75%] rounded-2xl px-5 py-3.5 shadow-sm transition-all duration-200 hover:shadow-lg ${
                              msg.remetente === 'eu'
                                ? 'rounded-br-md bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-purple-500/20'
                                : 'ml-2 rounded-bl-md bg-white text-zinc-800 shadow-gray-100 ring-1 ring-zinc-200/80 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700 sm:ml-9'
                            }`}
                          >
                            <p
                              className={`break-words text-sm leading-relaxed ${msg.content.length > 80 ? 'text-justify' : 'text-left'}`}
                            >
                              {msg.content}
                            </p>

                            <div className="mt-2 flex items-center justify-end gap-1.5">
                              <span
                                className={`text-xs font-medium tracking-tight ${msg.remetente === 'eu' ? 'text-purple-100' : 'text-zinc-400 dark:text-zinc-500'}`}
                              >
                                {format(msg.createdAt, 'HH:mm')}
                              </span>
                              {msg.remetente === 'eu' &&
                                (msg.status === 'sent' ? (
                                  <CheckCheck className="h-3.5 w-3.5 text-purple-100 opacity-90" />
                                ) : (
                                  <Check className="h-3.5 w-3.5 text-purple-100 opacity-90" />
                                ))}
                            </div>

                            {msg.remetente === 'eu' ? (
                              <div className="absolute -right-1 top-3 h-3 w-3 rotate-45 bg-gradient-to-r from-purple-600 to-violet-600"></div>
                            ) : (
                              <div className="absolute -left-1 top-3 h-3 w-3 rotate-45 bg-white ring-1 ring-zinc-200/80 dark:bg-zinc-800 dark:ring-zinc-700"></div>
                            )}
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0.5 m-auto w-[99%] rounded-2xl border border-zinc-300 bg-white/80 py-3 text-sm shadow-sm backdrop-blur-sm transition-all placeholder:text-zinc-400 focus-within:border-purple-500 dark:border-zinc-700 dark:bg-zinc-900/80 dark:placeholder:text-zinc-500">
                <div className="relative flex">
                  <div className="ml-1">
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
                    className="w-[calc(100%-4rem)] !border-none !text-lg !shadow-none !outline-none !ring-0 focus:!outline-none dark:bg-transparent dark:text-zinc-100"
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
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 p-8 dark:from-purple-900/50 dark:to-pink-900/50">
              <MessageSquare className="h-16 w-16 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="mb-2 text-2xl font-semibold text-zinc-800 dark:text-zinc-100">
              Suas mensagens
            </h3>
            <p className="max-w-sm text-zinc-500 dark:text-zinc-400">
              Selecione uma conversa ao lado para começar a trocar mensagens
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MessagePage
