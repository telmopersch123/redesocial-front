import { io, Socket } from 'socket.io-client'

const { VITE_API_URL } = import.meta.env

export const socket: Socket = io(VITE_API_URL, {
  withCredentials: true,
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
})
