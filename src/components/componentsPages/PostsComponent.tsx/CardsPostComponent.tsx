import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Clock, Play, Users } from 'lucide-react'
import React, { useState } from 'react'

import type { Post } from '../../../types'
import { Badge } from '../../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import ActionsPost from './components/SavePostButton'

interface PostCardProps {
  posts: Post[]
  valuePost: Post
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
}

const CardsPostComponent = ({ posts, valuePost, setPosts }: PostCardProps) => {
  const [novoComentario, setNovoComentario] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

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
        <ActionsPost
          valuePost={valuePost}
          novoComentario={novoComentario}
          setNovoComentario={setNovoComentario}
          setPosts={setPosts}
          posts={posts}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
        />
      </CardContent>
    </Card>
  )
}

export default CardsPostComponent
