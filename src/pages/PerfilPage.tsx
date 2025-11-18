import { motion } from 'framer-motion'
import { Edit2, Heart, MessageCircle, Share2 } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { FollowersDialog } from '../components/componentsPages/componentsPerfil/FollowersDialog'
import { FriendsDialog } from '../components/componentsPages/componentsPerfil/FriendsDialog'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Separator } from '../components/ui/separator'

const PerfilUsuario = () => {
  const posts = [
    {
      id: 1,
      mood: 'ansioso',
      content:
        'Hoje foi um dia difícil... a ansiedade bateu forte de manhã, mas consegui respirar fundo e dar um passo de cada vez. Estou orgulhoso de mim por não desistir.',
      likes: 42,
      comments: 8,
      time: '3h',
    },
    {
      id: 2,
      mood: 'agradecido',
      content:
        'Gratidão por mais um dia. Acordei, respirei, tenho saúde e pessoas que se importam comigo. Às vezes a gente esquece o quanto isso já é muito.',
      likes: 89,
      comments: 12,
      time: '1d',
    },
    {
      id: 3,
      mood: 'ansioso',
      content:
        'Hoje foi um dia difícil... a ansiedade bateu forte de manhã, mas consegui respirar fundo e dar um passo de cada vez. Estou orgulhoso de mim por não desistir.',
      likes: 42,
      comments: 8,
      time: '3h',
    },
    {
      id: 4,
      mood: 'agradecido',
      content:
        'Gratidão por mais um dia. Acordei, respirei, tenho saúde e pessoas que se importam comigo. Às vezes a gente esquece o quanto isso já é muito.',
      likes: 89,
      comments: 12,
      time: '1d',
    },
    {
      id: 5,
      mood: 'agradecido',
      content:
        'Gratidão por mais um dia. Acordei, respirei, tenho saúde e pessoas que se importam comigo. Às vezes a gente esquece o quanto isso já é muito.',
      likes: 89,
      comments: 12,
      time: '1d',
    },
    {
      id: 6,
      mood: 'esperancoso',
      content:
        'Pela primeira vez em meses, senti um fio de esperança. Como se o amanhã pudesse ser melhor. Alguém mais já sentiu isso?',
      likes: 156,
      comments: 27,
      time: '2d',
    },
    {
      id: 7,
      mood: 'esperancoso',
      content:
        'Pela primeira vez em meses, senti um fio de esperança. Como se o amanhã pudesse ser melhor. Alguém mais já sentiu isso?',
      likes: 156,
      comments: 27,
      time: '2d',
    },
    {
      id: 8,
      mood: 'esperancoso',
      content:
        'Pela primeira vez em meses, senti um fio de esperança. Como se o amanhã pudesse ser melhor. Alguém mais já sentiu isso?',
      likes: 156,
      comments: 27,
      time: '2d',
    },
    {
      id: 9,
      mood: 'esperancoso',
      content:
        'Pela primeira vez em meses, senti um fio de esperança. Como se o amanhã pudesse ser melhor. Alguém mais já sentiu isso?',
      likes: 156,
      comments: 27,
      time: '2d',
    },
    {
      id: 10,
      mood: 'esperancoso',
      content:
        'Pela primeira vez em meses, senti um fio de esperança. Como se o amanhã pudesse ser melhor. Alguém mais já sentiu isso?',
      likes: 156,
      comments: 27,
      time: '2d',
    },
    {
      id: 11,
      mood: 'ansioso',
      content:
        'Hoje foi um dia difícil... a ansiedade bateu forte de manhã, mas consegui respirar fundo e dar um passo de cada vez. Estou orgulhoso de mim por não desistir.',
      likes: 42,
      comments: 8,
      time: '3h',
    },
    {
      id: 12,
      mood: 'ansioso',
      content:
        'Hoje foi um dia difícil... a ansiedade bateu forte de manhã, mas consegui respirar fundo e dar um passo de cada vez. Estou orgulhoso de mim por não desistir.',
      likes: 42,
      comments: 8,
      time: '3h',
    },
    {
      id: 13,
      mood: 'ansioso',
      content:
        'Hoje foi um dia difícil... a ansiedade bateu forte de manhã, mas consegui respirar fundo e dar um passo de cada vez. Estou orgulhoso de mim por não desistir.',
      likes: 42,
      comments: 8,
      time: '3h',
    },
    {
      id: 14,
      mood: 'ansioso',
      content:
        'Hoje foi um dia difícil... a ansiedade bateu forte de manhã, mas consegui respirar fundo e dar um passo de cada vez. Estou orgulhoso de mim por não desistir.',
      likes: 42,
      comments: 8,
      time: '3h',
    },
    {
      id: 15,
      mood: 'ansioso',
      content:
        'Hoje foi um dia difícil... a ansiedade bateu forte de manhã, mas consegui respirar fundo e dar um passo de cada vez. Estou orgulhoso de mim por não desistir.',
      likes: 42,
      comments: 8,
      time: '3h',
    },
    {
      id: 16,
      mood: 'ansioso',
      content:
        'Hoje foi um dia difícil... a ansiedade bateu forte de manhã, mas consegui respirar fundo e dar um passo de cada vez. Estou orgulhoso de mim por não desistir.',
      likes: 42,
      comments: 8,
      time: '3h',
    },
    {
      id: 17,
      mood: 'ansioso',
      content:
        'Hoje foi um dia difícil... a ansiedade bateu forte de manhã, mas consegui respirar fundo e dar um passo de cada vez. Estou orgulhoso de mim por não desistir.',
      likes: 42,
      comments: 8,
      time: '3h',
    },

    {
      id: 18,
      mood: 'ansioso',
      content:
        'Hoje foi um dia difícil... a ansiedade bateu forte de manhã, mas consegui respirar fundo e dar um passo de cada vez. Estou orgulhoso de mim por não desistir.',
      likes: 42,
      comments: 8,
      time: '3h',
    },
    {
      id: 19,
      mood: 'ansioso',
      content:
        'Hoje foi um dia difícil... a ansiedade bateu forte de manhã, mas consegui respirar fundo e dar um passo de cada vez. Estou orgulhoso de mim por não desistir.',
      likes: 42,
      comments: 8,
      time: '3h',
    },

    {
      id: 20,
      mood: 'ansioso',
      content:
        'Hoje foi um dia difícil... a ansiedade bateu forte de manhã, mas consegui respirar fundo e dar um passo de cada vez. Estou orgulhoso de mim por não desistir.',
      likes: 42,
      comments: 8,
      time: '3h',
    },

    {
      id: 21,
      mood: 'ansioso',
      content:
        'Hoje foi um dia difícil... a ansiedade bateu forte de manhã, mas consegui respirar fundo e dar um passo de cada vez. Estou orgulhoso de mim por não desistir.',
      likes: 42,
      comments: 8,
      time: '3h',
    },
  ]

  return (
    <div className="mb-4 mt-12 min-h-screen w-[1000px] overflow-hidden bg-gradient-to-b pb-4">
      {/* Header do Perfil */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="from-purple-50/60 via-white to-pink-50/40 px-5 pb-10 pt-8"
      >
        <div className="mx-auto">
          <div className="flex items-end gap-6">
            {/* Avatar com hover de edição */}
            <div className="group relative">
              <Avatar className="h-28 w-28 shadow-2xl ring-4 ring-white sm:h-32 sm:w-32">
                <AvatarImage
                  src="https://i.pravatar.cc/300"
                  alt="Carlos Almeida"
                />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-3xl font-bold text-white">
                  CA
                </AvatarFallback>
              </Avatar>
              <NavLink to="config">
                <div className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center rounded-full bg-black/50 opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100">
                  <Edit2 className="h-8 w-8 text-white" />{' '}
                  <p className="text-white">Editar</p>
                </div>
              </NavLink>
            </div>

            {/* Info do usuário */}
            <div className="flex-1">
              <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                Carlos Almeida
              </h1>
              <p className="text-lg font-medium text-purple-600">
                @carlosalmeida
              </p>
              <p className="mt-2 text-gray-600">
                Aqui compartilho minha jornada com a ansiedade e o crescimento
                pessoal
              </p>

              {/* Stats */}
              <div className="mt-5 flex gap-8 text-sm">
                <FriendsDialog />
                <FollowersDialog />
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3">
              <Button className="bg-linear-purple rounded-full px-8 font-semibold shadow-lg hover:shadow-xl">
                Seguir
              </Button>
              <NavLink to="/mensagens">
                <Button
                  variant="outline"
                  className="rounded-full border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  Mensagem
                </Button>
              </NavLink>
            </div>
          </div>
        </div>
      </motion.header>
      <Separator className="mb-4" />
      {/* Feed de Posts - Um abaixo do outro */}
      <main className="mx-auto px-5">
        <div className="grid grid-cols-2 gap-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              <Card className="h-[300px] overflow-hidden rounded-3xl border-none bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl">
                <div className="flex flex-col p-6">
                  {/* Cabeçalho do post */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-11 w-11 ring-2 ring-purple-100">
                        <AvatarImage src="https://i.pravatar.cc/300" />
                        <AvatarFallback>CA</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Carlos Almeida
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {post.time} atrás
                        </p>
                      </div>
                    </div>
                    <span className="text-3xl">
                      {post.mood === 'ansioso' && 'Anxiety'}
                      {post.mood === 'agradecido' && 'Grateful'}
                      {post.mood === 'esperancoso' && 'Hopeful'}
                    </span>
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1">
                    <p className="line-clamp-3 text-lg leading-relaxed text-gray-800">
                      {post.content}
                    </p>
                  </div>

                  {/* Ações */}
                  <div className="mt-20 flex items-center justify-between border-t pt-4">
                    <button className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-rose-600">
                      <Heart className="h-5 w-5" />
                      <span className="text-sm font-medium">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-purple-600">
                      <MessageCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">
                        {post.comments}
                      </span>
                    </button>
                    <button className="text-muted-foreground transition-colors hover:text-blue-600">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default PerfilUsuario
