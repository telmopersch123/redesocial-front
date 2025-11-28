import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Bookmark, Clock, Heart, Play, Share2, Users } from 'lucide-react'
import React, { useState } from 'react'

import type { Post } from '../../../types'
import { Badge } from '../../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import PostComponentDialog from './PostComponentDialog'

interface PostCardProps {
  posts: Post[]
  valuePost: Post
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
}
const CardsPostComponent = ({ posts, valuePost, setPosts }: PostCardProps) => {
  const [novoComentario, setNovoComentario] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleLike = (id: number) => {
    setPosts(
      posts.map((p: Post) =>
        p.id === id
          ? { ...p, likes: p.likes + (p.likes % 2 === 0 ? 1 : -1) }
          : p
      )
    )
  }

  const handleSalvar = (id: number) => {
    setPosts(
      posts.map((p: Post) => (p.id === id ? { ...p, salvo: !p.salvo } : p))
    )
  }

  return (
    <Card
      key={valuePost.id}
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          {valuePost.avatar ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-sm font-bold text-white">
              {valuePost.avatar}
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-500">
              <Users className="h-5 w-5" />
            </div>
          )}
          <div>
            <CardTitle className="text-base text-gray-800">
              <span className="font-semibold text-purple-600">
                {valuePost.community}
              </span>{' '}
              • {valuePost.autor}
            </CardTitle>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(valuePost.data, {
                addSuffix: true,
                locale: ptBR,
              })}
              {valuePost.friend && (
                <Badge
                  variant="secondary"
                  className="bg-green-500 text-white hover:bg-green-600"
                >
                  Amigo
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-0 pt-0">
        <p className="mb-4 text-gray-700">{valuePost.conteudo}</p>

        {(valuePost.imagem || valuePost.video) && (
          <div className="relative -mx-6 mt-3 h-[500px] overflow-hidden rounded-b-xl bg-gray-100">
            <img
              src={valuePost.imagem}
              alt={valuePost.community}
              className="h-full w-full object-cover"
            />
            {valuePost.video && (
              <div
                onClick={() => setDialogOpen(true)}
                className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/30"
              >
                <div className="bg-linear-purple rounded-full p-4 shadow-xl backdrop-blur-sm transition-transform hover:scale-110">
                  <Play className="h-10 w-10 text-white" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ações */}
        <div className="my-3 flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleLike(valuePost.id)}
              className={`flex items-center gap-1.5 text-sm font-medium transition-all ${
                valuePost.likes % 2 === 1
                  ? 'text-red-500'
                  : 'text-gray-600 hover:text-red-500'
              }`}
            >
              <Heart
                className={`h-5 w-5 ${valuePost.likes % 2 === 1 ? 'fill-current' : ''}`}
              />
              {valuePost.likes}
            </button>
            <PostComponentDialog
              valuePost={valuePost}
              novoComentario={novoComentario}
              setNovoComentario={setNovoComentario}
              setPosts={setPosts}
              posts={posts}
              open={dialogOpen}
              onOpenChange={setDialogOpen}
            />
            <button className="flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-all hover:text-blue-600">
              <Share2 className="h-5 w-5" />
              Compartilhar
            </button>
          </div>
          <button
            onClick={() => handleSalvar(valuePost.id)}
            className={`transition-all ${
              valuePost.salvo
                ? 'text-purple-600'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            {valuePost.salvo ? (
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  background:
                    'linear-gradient(to right, #a8c8ff, #adc5ff, #b2c2ff, #b6c1ff, #b9c0ff, #bcbfff, #bebdff, #c1bcff, #c4bbff)',
                  maskImage:
                    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z'/></svg>\")",
                  maskRepeat: 'no-repeat',
                  maskSize: 'cover',
                  maskPosition: 'center',
                  WebkitMaskImage:
                    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z'/></svg>\")",
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskSize: 'cover',
                  WebkitMaskPosition: 'center',
                }}
              />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

export default CardsPostComponent
