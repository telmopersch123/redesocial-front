import { AnimatePresence, motion } from 'framer-motion'
import Lottie from 'lottie-react'
import { Search, User, Users as UsersIcon } from 'lucide-react'
import { useState } from 'react'
import connectionAnimate from '../assets/animations/connectionAnimate.json'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

interface User {
  id: number
  name: string
  avatar: string
  friendsCount: number
}

const fakeUsers: User[] = [
  { id: 1, name: 'Telmo Persch', avatar: '', friendsCount: 284 },
  { id: 2, name: 'Maria Silva', avatar: '', friendsCount: 156 },
  { id: 3, name: 'João Santos', avatar: '', friendsCount: 89 },
  { id: 4, name: 'Ana Oliveira', avatar: '', friendsCount: 412 },
  { id: 5, name: 'Carlos Pereira', avatar: '', friendsCount: 67 },
  { id: 6, name: 'Irlando Pereira', avatar: '', friendsCount: 203 },
  { id: 7, name: 'Pietro Santos', avatar: '', friendsCount: 521 },
  { id: 8, name: 'Telmo Pereira', avatar: '', friendsCount: 98 },
  { id: 9, name: 'Alfredo', avatar: '', friendsCount: 345 },
  { id: 10, name: 'Aninha', avatar: '', friendsCount: 178 },
]

const Users = () => {
  const [usersSurveyed, setUsersSurveyed] = useState<User[]>([])
  const [inputValue, setInputValue] = useState('')

  const searchUsers = (event?: React.KeyboardEvent<HTMLInputElement>) => {
    if (event && event.key !== 'Enter') return
    if (inputValue.length <= 2) return
    if (inputValue.trim() !== '') {
      const filteredUsers = fakeUsers.filter((user) =>
        user.name.toLowerCase().includes(inputValue.toLowerCase())
      )
      setUsersSurveyed(filteredUsers)
    }
  }

  return (
    <div className="mx-auto mt-12 w-[calc(100vw-2rem)] max-w-3xl space-y-8 rounded-2xl bg-gradient-to-br from-gray-50/80 via-white to-purple-50/30 p-6 shadow-xl backdrop-blur-sm md:min-w-[calc(100vw-20rem)] md:p-10">
      {/* Título e Input de Pesquisa */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4 text-center"
      >
        <Label
          htmlFor="searchUsers"
          className="block text-3xl font-extrabold tracking-tight text-gray-800 md:text-4xl"
        >
          Conecte-se com outros membros
        </Label>
        <p className="text-sm text-gray-600 md:text-base">
          Encontre pessoas incríveis na nossa comunidade
        </p>

        <div className="relative mx-auto w-full max-w-xl">
          <Button
            onClick={() => searchUsers()}
            className="bg-linear-purple absolute left-2 top-1/2 h-10 w-10 -translate-y-1/2 shadow-md transition-all duration-200 hover:scale-110"
          >
            <Search className="h-4 w-4 text-white" />
          </Button>
          <Input
            id="searchUsers"
            placeholder="Buscar por nome..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={searchUsers}
            autoComplete="off"
            className="h-14 rounded-xl border border-gray-200/80 bg-white/90 pl-14 pr-5 text-base shadow-inner transition-all duration-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20"
          />
        </div>
      </motion.div>

      {/* Lista de Usuários ou Estado Vazio */}
      <div className="h-[720px] overflow-y-auto rounded-2xl bg-white/60 p-4 shadow-inner md:p-6">
        <AnimatePresence mode="wait">
          {usersSurveyed.length > 0 ? (
            <motion.div
              key="users-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {usersSurveyed.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                >
                  <Card className="om:flex-row group flex flex-col items-center gap-5 rounded-2xl border border-transparent bg-white/90 p-5 shadow-[0_0px_10px_0px_rgba(0,0,0,0.1)] transition-all duration-300 hover:border-purple-300 hover:bg-purple-50/50 hover:shadow-lg">
                    <div className="flex w-full items-center justify-between gap-3">
                      <Avatar className="h-16 w-16 ring-4 ring-white transition-transform duration-300 group-hover:ring-purple-200">
                        {user.avatar ? (
                          <AvatarImage src={user.avatar} alt={user.name} />
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md">
                            <User className="h-8 w-8" />
                          </AvatarFallback>
                        )}
                      </Avatar>

                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-purple-700">
                          {user.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <UsersIcon className="h-4 w-4" />
                          <span className="text-sm text-gray-500">
                            {user.friendsCount} amigo
                            {user.friendsCount !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button className="om:w-fit w-full rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-purple-700 hover:shadow-md active:scale-95">
                      Perfil
                    </button>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex h-full flex-col items-center justify-center text-center"
            >
              <div className="relative flex w-full justify-center">
                <Lottie
                  animationData={connectionAnimate}
                  loop={true}
                  className="h-full w-full sm:h-[500px] sm:w-[500px]"
                />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-700">
                Nenhum usuário encontrado
              </h3>
              <p className="mt-2 max-w-sm text-sm text-gray-500">
                Digite um nome e pressione Enter para buscar.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Rodapé */}

      <div className="text-center text-xs text-gray-400">
        {usersSurveyed.length > 0
          ? `${usersSurveyed.length} membro${usersSurveyed.length > 1 ? 's' : ''} encontrado${usersSurveyed.length > 1 ? 's' : ''}`
          : 'Digite um nome e pressione Enter para buscar'}
      </div>
    </div>
  )
}

export default Users
