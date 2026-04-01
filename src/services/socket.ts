import { io, Socket } from 'socket.io-client'

const { VITE_API_URL } = import.meta.env

export const socket: Socket = io(VITE_API_URL, {
  withCredentials: true,
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
})

// socket.on('connect', () => console.log('✅ socket conectado:', socket.id))
// socket.on('connect_error', (err) => console.log('❌ socket erro:', err.message))
// socket.on('disconnect', (reason) =>
//   console.log('🔌 socket desconectado:', reason)
// )
