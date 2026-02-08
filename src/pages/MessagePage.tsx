import { format } from 'date-fns'
import {
  ArrowLeft,
  Check,
  CheckCheck,
  Fullscreen,
  Image,
  MessageCircle,
  MessageSquare,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { EmojiInput } from '../components/componentsPages/componentsMensagens/EmojiInput'
import { GalleryDialog } from '../components/componentsPages/componentsMensagens/GalleryDialog'
import { MessageForms } from '../components/formCustomer/MessageForms'
import { TooltipComponent } from '../components/globalcomponents/tooltipComponent'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useChat, type Contato, type MSG } from '../context/ChatContext'
import { useAuth } from '../context/getMe'
import { useLimitForms } from '../hooks/useLimitForms'
import { getCheckUserChat, getUser } from '../services/authService'
import { socket } from '../services/socket'
import { alertMessage } from '../utils/components/alertMensage'
import { LoadingComponent } from '../utils/components/Loading'

interface HeaderUserView {
  id: number
  name_at: string
  avatar: string | null
}

const MessagePage = () => {
  const {
    resetChatState,
    messagesByChat,
    setMessagesByChat,
    contatos,
    setContatos,
    selectedChat,
    setSelectedChat,
    lastCreatedChatId,
    onlineUsers,
    setIsChatOpen,
    cursorByChat,
    loadingHistoryByChat,
    loadingHistoryInitial,
    setLastCreatedChatId,
    loadingInitial,
    setLoadingInitial,
    unreadByChat,
    markChatAsRead,
  } = useChat()
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const isFetchingHistoryRef = useRef(false)
  const didInitialScrollRef = useRef(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const prevHeightRef = useRef<number>(0)
  const [typingUsers, setTypingUsers] = useState<Set<number>>(new Set())
  const initialClickContact = location.state?.contact?.chatId ?? ''
  const [clickContact, setClickContact] = useState<string>(initialClickContact)
  const chatMessages = selectedChat ? (messagesByChat[selectedChat] ?? []) : []
  const loadingChatMessage = loadingHistoryByChat[selectedChat ?? '']
  let loadingChatMessageInitial = loadingHistoryInitial[selectedChat ?? '']
  const [usersDate, setUsersDate] = useState<HeaderUserView | null>()
  const [image, setImage] = useState<string>('')
  const [contatMessage, setContatMessage] = useState<boolean>(false)
  const [chatMessage, setChatMessage] = useState<boolean>(false)
  const [fullscreen, setFullscreen] = useState<boolean>(false)
  const [inputText, setInputText] = useState('')
  const [open, setOpen] = useState<boolean>(false)
  const messageInput = useLimitForms(5000)
  const inputRef = useRef<HTMLInputElement>(null)
  const responsive = 1000
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { id: ChatIdOrUserId } = useParams<{ id: string }>()
  const isOnline = onlineUsers.has(Number(usersDate?.id))

  const typingTimeout = useRef<number | null>(null)
  // effect de inicialização
  useEffect(() => {
    const sessionValue = sessionStorage.getItem('__internal_nav')
    if (!sessionValue) {
      navigate(`/mensagens`, { replace: true })
      setClickContact('')
    }
  }, [])
  useEffect(() => {
    if (location.state?.chatId === true) {
      setLoadingInitial(true)
    }
  }, [location.state?.chatId])
  useEffect(() => {
    return () => {
      resetChatState()
    }
  }, [])
  // scroll handle reset
  const resetScrollState = () => {
    const el = messagesContainerRef.current
    if (el) {
      el.scrollTop = 0
    }

    prevHeightRef.current = 0
    didInitialScrollRef.current = false
  }
  // scroll handle para subir
  const handleScroll = () => {
    const el = messagesContainerRef.current
    if (!el || !selectedChat) return

    if (el.scrollTop <= 50) {
      const cursor = cursorByChat[selectedChat]
      if (!cursor) return
      if (loadingHistoryByChat[selectedChat]) return
      prevHeightRef.current = el.scrollHeight
      isFetchingHistoryRef.current = true

      socket.emit('chat:history', {
        chatId: selectedChat,
        cursor,
        typeSearch: 'search',
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
  // scroll reset
  useEffect(() => {
    if (!selectedChat) return
    resetScrollState()
  }, [selectedChat])
  // scroll inicial
  useEffect(() => {
    if (!selectedChat) return
    if (!chatMessages.length) return
    if (didInitialScrollRef.current) return

    requestAnimationFrame(() => {
      const el = messagesContainerRef.current
      if (!el) return
      el.scrollTop = el.scrollHeight
      didInitialScrollRef.current = true
    })
  }, [selectedChat, chatMessages.length])
  // scroll para carregar historico
  useEffect(() => {
    const el = messagesContainerRef.current
    if (!el) return
    if (!isFetchingHistoryRef.current) return
    if (prevHeightRef.current === 0) return

    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight - prevHeightRef.current
      prevHeightRef.current = 0
      isFetchingHistoryRef.current = false
    })
  }, [chatMessages.length])
  useEffect(() => {
    if (localStorage.getItem('selectedImage')) {
      const stored = JSON.parse(localStorage.getItem('selectedImage') || '{}')
      if (!stored) return
      setImage(stored.path)
    } else {
      setImage('')
    }
  }, [open])
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

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [selectedChat])
  ////////////////////////
  ////////////////////////
  ////////////////////////
  const handleSendMessage = () => {
    if (!inputText || inputText.trim() === '') return
    if (!user?.id) return
    if (!ChatIdOrUserId) return

    const tempId = crypto.randomUUID()
    const targetId = selectedChat ? selectedChat : String(ChatIdOrUserId)
    if (!clickContact) {
      setLoadingInitial(true)
    }
    const message: MSG = {
      id: tempId,
      tempId,
      chatId: targetId,
      content: inputText,
      remetente: 'eu',
      senderId: Number(user?.id),
      receiverId: usersDate?.id,
      createdAt: new Date(),
      status: 'pending',
      senderName: user?.name_at ?? 'Usuário',
    }
    setMessagesByChat((prev) => ({
      ...prev,
      [targetId]: [...(prev[targetId] ?? []), message],
    }))

    setInputText('')

    socket.emit('message:send', {
      targetId,
      content: inputText,
      tempId,
    })
    resetScrollState()
  }
  const handleTyping = (value: string) => {
    setInputText(value)

    if (!usersDate?.id) return

    socket.emit('typing:start', {
      toUserId: usersDate.id,
    })

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current)
    }

    typingTimeout.current = setTimeout(() => {
      socket.emit('typing:stop', {
        toUserId: usersDate.id,
      })
    }, 1200)
  }
  const handleOpen = (contato: Contato) => {
    setSelectedChat(contato.chatId)
    setClickContact(contato.chatId)
    setIsChatOpen(true)
    navigate(`/mensagens/${contato.chatId}`, { replace: true })
    setUsersDate(() => {
      return {
        id: contato.contact.id,
        name_at: contato.contact.name_at,
        avatar: contato.contact.avatar,
      }
    })
    inputRef.current?.focus()

    const hasMessages =
      messagesByChat[contato.chatId] &&
      messagesByChat[contato.chatId].length > 0

    if (!hasMessages) {
      setLoadingInitial(true)
    }

    socket.emit('chat:history', { chatId: contato.chatId, typeSearch: 'open' })
    socket.emit('chat:read', { chatId: contato.chatId })
  }
  const handleRemoveChat = (chatId: string) => {
    socket.emit('chat:remove', { chatId })

    setMessagesByChat((prev) => {
      const copy = { ...prev }
      delete copy[chatId]
      return copy
    })

    setContatos((prev) => prev.filter((c) => c.chatId !== chatId))

    setSelectedChat(null)
  }
  useEffect(() => {
    socket.on('typing:start', ({ fromUserId }) => {
      setTypingUsers((prev) => new Set(prev).add(fromUserId))
    })

    socket.on('typing:stop', ({ fromUserId }) => {
      setTypingUsers((prev) => {
        const next = new Set(prev)
        next.delete(fromUserId)
        return next
      })
    })

    return () => {
      socket.off('typing:start')
      socket.off('typing:stop')
    }
  }, [])
  useEffect(() => {
    const handleRemoved = ({ chatId }: { chatId: string }) => {
      setContatos((prev) => prev.filter((c) => c.chatId !== chatId))

      setMessagesByChat((prev) => {
        const copy = { ...prev }
        delete copy[chatId]
        return copy
      })
      sessionStorage.removeItem('__internal_nav')
      setSelectedChat(null)
      navigate(`/mensagens`, { replace: true })
      setClickContact('')
      setUsersDate(null)
    }

    socket.on('chat:removed', handleRemoved)

    return () => {
      socket.off('chat:removed', handleRemoved)
    }
  }, [])
  useEffect(() => {
    const handleRead = ({
      chatId,
      messageIds,
      readAt,
    }: {
      chatId: string
      messageIds: string[]
      readAt: string
    }) => {
      setMessagesByChat((prev) => ({
        ...prev,
        [chatId]: (prev[chatId] ?? []).map((msg) =>
          messageIds.includes(msg.id)
            ? {
                ...msg,
                readAt: new Date(readAt),
                deliveredAt: msg.deliveredAt ?? new Date(readAt),
              }
            : msg
        ),
      }))
    }

    socket.on('message:read', handleRead)
    return () => {
      socket.off('message:read', handleRead)
    }
  }, [])
  useEffect(() => {
    if (!ChatIdOrUserId) return
    markChatAsRead(ChatIdOrUserId)
  }, [ChatIdOrUserId])
  useEffect(() => {
    socket.on('message:error', () => {
      alertMessage(
        'Ops! algo deu errado',
        'Por favor, tente novamente mais tarde',
        'error'
      )
    })

    return () => {
      socket.off('message:error')
    }
  }, [socket])
  useEffect(() => {
    if (!ChatIdOrUserId) return

    async function fetchMessages() {
      // Se veio do sidebar com chatId
      if (location.state?.contact) {
        const contato = location.state.contact
        setClickContact(contato.chatId)
        setSelectedChat(contato.chatId)
        setUsersDate({
          id: contato.contact.id,
          name_at: contato.contact.name_at,
          avatar: contato.contact.avatar,
        })
        inputRef.current?.focus()
        socket.emit('chat:history', {
          chatId: contato.chatId,
          typeSearch: 'initial',
        })
        return
      }

      if (location.state?.chatId === false) {
        // Se não veio do sidebar, verificar chat existente
        const userData = await getUser(ChatIdOrUserId)
        setUsersDate(userData)

        const data = await getCheckUserChat(ChatIdOrUserId)

        if (data.exists && data.chatId) {
          setClickContact(data.chatId)
          setSelectedChat(data.chatId)
          inputRef.current?.focus()
          socket.emit('chat:history', {
            chatId: data.chatId,
            typeSearch: 'initial',
          })
        } else {
          // Aqui você pode criar um novo chat ou deixar pronto para enviar primeira mensagem
          setSelectedChat('')
          setClickContact('')
        }
      }
    }

    fetchMessages()
  }, [ChatIdOrUserId, user?.id])
  useEffect(() => {
    if (!lastCreatedChatId) return

    setClickContact(lastCreatedChatId)
    sessionStorage.removeItem('__internal_nav')
    navigate(`/mensagens/${lastCreatedChatId}`, { replace: true })
    setLastCreatedChatId(null)
  }, [lastCreatedChatId])
  useEffect(() => {
    if (!selectedChat) return
    if (!chatMessages.length) return

    const last = chatMessages[chatMessages.length - 1]

    if (last.senderId !== Number(user?.id) && !last.readAt) {
      socket.emit('chat:read', { chatId: selectedChat })
    }
  }, [chatMessages, selectedChat])

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
            contatos
              .filter(
                (contato): contato is Contato => !!contato && !!contato.chatId
              )
              .map((contato: Contato) => {
                return (
                  <Button
                    key={contato.chatId}
                    onClick={() => handleOpen(contato)}
                    variant="ghost"
                    className={`group flex w-full items-center gap-3 rounded-none border-b border-zinc-100 px-4 py-10 text-left transition-all duration-150 hover:bg-zinc-100 active:scale-[0.99] dark:border-zinc-800 dark:hover:bg-zinc-800 ${
                      clickContact === contato.chatId
                        ? 'bg-zinc-100 dark:bg-zinc-800'
                        : 'bg-transparent'
                    }`}
                  >
                    <img
                      src={`https://burst.shopifycdn.com/photos/perfect-yellow-flower.jpg?width=373&format=pjpg&exif=0&iptc=0`}
                      alt={contato.contact.name_at}
                      className="h-11 w-11 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-700"
                    />

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium leading-tight text-zinc-900 group-hover:text-zinc-950 dark:text-zinc-100 dark:group-hover:text-zinc-50">
                            {contato.contact.name_at}
                          </span>
                        </div>
                      </div>
                      {typingUsers.has(contato.contact.id) ? (
                        <span className="text-xs italic text-zinc-500">
                          digitando...
                        </span>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            {contato.lastMessage &&
                              contato.lastMessage.senderId ===
                                Number(user?.id) && (
                                <p className="text-xs font-medium text-purple-600 dark:text-purple-400">
                                  Você:{' '}
                                </p>
                              )}
                            {contato.lastMessage && (
                              <p className="truncate text-sm leading-snug text-zinc-500 dark:text-zinc-400">
                                {contato.lastMessage.content}
                              </p>
                            )}
                          </div>
                        </>
                      )}
                      {unreadByChat[contato.chatId] > 0 &&
                        clickContact !== contato.chatId && (
                          <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-purple-600 px-2 text-xs font-semibold text-white shadow-sm dark:bg-purple-500">
                            {unreadByChat[contato.chatId] >= 9
                              ? '9+'
                              : unreadByChat[contato.chatId]}
                          </span>
                        )}
                    </div>
                  </Button>
                )
              })
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
        className={`relative mt-10 min-h-[calc(100vh-4rem)] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-zinc-200 md:mt-0 md:w-full lg:w-3/4 ${image ? '' : 'bg-white dark:bg-zinc-900'} ${fullscreen ? '!w-full' : ''} ${chatMessage ? 'flex' : 'hidden'} shadow-xl dark:border-zinc-800`}
      >
        {usersDate !== null && usersDate ? (
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
              <div>
                <TooltipComponent
                  Tag={
                    <Button
                      onClick={() => handleRemoveChat(selectedChat!)}
                      variant="ghost"
                      className="flex items-center justify-end border-none bg-red-600 text-white hover:bg-red-700 dark:bg-black/20 dark:hover:bg-black/30 dark:hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  }
                  description="Apagar conversa"
                />
              </div>
              <TooltipComponent
                Tag={
                  <Button
                    onClick={handleFullScreen}
                    className="hidden items-center justify-end bg-black/85 text-white backdrop-blur-sm hover:bg-black/30 dark:bg-black/20 dark:hover:bg-black/30 dm:flex"
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
                    className="flex items-center justify-end bg-black/85 text-white hover:bg-black/30 hover:text-white dark:bg-black/20 dark:hover:bg-black/30"
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
                    setIsChatOpen(false)
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full transition-all hover:bg-white/60 hover:shadow-sm dm:hidden"
                >
                  <ArrowLeft className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                </button>

                <img
                  src={`https://i.pravatar.cc/56?img=${usersDate?.avatar}`}
                  alt={usersDate?.name_at}
                  className="h-12 w-12 rounded-full object-cover shadow-lg ring-2 ring-white/60"
                />

                <div className="flex-1">
                  <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {usersDate?.name_at}
                  </h2>

                  {usersDate && (
                    <div className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium shadow-sm">
                      {isOnline ? (
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
                    </div>
                  )}
                </div>
              </div>

              {/* MENSAGENS */}
              <div className="chat-messages invisivel-scroll flex-1 space-y-6 overflow-y-auto bg-gradient-to-b pb-8">
                <div
                  ref={messagesContainerRef}
                  onScroll={handleScroll}
                  className="scrollbar-invisible mr-1 flex h-[calc(100vh-11.5rem)] flex-col space-y-4 overflow-y-auto pb-8 pt-1 md:pb-0"
                >
                  {loadingChatMessage && chatMessages.length > 29 && (
                    <div className="flex justify-center py-1">
                      <div className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-400/70 dark:bg-zinc-500/60" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-400/70 [animation-delay:120ms] dark:bg-zinc-500/60" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-400/70 [animation-delay:240ms] dark:bg-zinc-500/60" />
                      </div>
                    </div>
                  )}

                  {((loadingChatMessageInitial && chatMessages.length === 0) ||
                    loadingInitial) && <LoadingComponent />}

                  {!loadingChatMessageInitial &&
                  chatMessages.length === 0 &&
                  loadingInitial === false ? (
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
                      {chatMessages.map((msg: MSG) => {
                        return (
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
                                  (msg.readAt ? (
                                    <CheckCheck className="h-3.5 w-3.5 text-blue-400" />
                                  ) : msg.deliveredAt ? (
                                    <CheckCheck className="h-3.5 w-3.5 text-purple-100" />
                                  ) : (
                                    <Check className="h-3.5 w-3.5 text-purple-100" />
                                  ))}
                              </div>

                              {msg.remetente === 'eu' ? (
                                <div className="absolute -right-1 top-3 h-3 w-3 rotate-45 bg-gradient-to-r from-purple-600 to-violet-600"></div>
                              ) : (
                                <div className="absolute -left-1 top-3 h-3 w-3 rotate-45 bg-white ring-1 ring-zinc-200/80 dark:bg-zinc-800 dark:ring-zinc-700"></div>
                              )}
                            </div>
                          </div>
                        )
                      })}
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
                      handleTyping(e.target.value)
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
