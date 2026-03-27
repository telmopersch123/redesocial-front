import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { ExtendedPost } from '../../../pages/community/PostsArchived'
import type { Post } from '../../../types'
import { LoadingComponent } from '../../../utils/components/Loading'
import { MessagePerson } from '../../../utils/components/MessagePerson'
import PostComponentDialog from './PostComponentDialog'

const RouterPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [openDialogPostNotification, setOpenDialogPostNotification] =
    useState(true)
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState<ExtendedPost[]>([])
  const [onePosts, setOnePosts] = useState<Post>()
  const [novoComentario, setNovoComentario] = useState('')

  useEffect(() => {
    setLoading(true)
    async function fetchPost() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/post/${id}`,
          {
            method: 'GET',
            credentials: 'include',
          }
        )
        if (!response.ok) {
          navigate('/')
          MessagePerson(
            'Ocorreu um erro',
            'Essa postagem não existe, ou foi removida.',
            'error'
          )
          return
        }
        const data = await response.json()
        setPosts([data])
        setOnePosts(data)
      } catch (error) {
        console.error('Erro ao buscar post:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [id])

  useEffect(() => {
    if (!openDialogPostNotification) {
      navigate('/', { replace: true })
    }
  }, [openDialogPostNotification])

  return (
    <>
      {loading && <LoadingComponent />}
      <div className="fixed">
        <PostComponentDialog
          valuePosts={onePosts as Post}
          novoComentario={novoComentario}
          setNovoComentario={setNovoComentario}
          setPosts={setPosts}
          posts={posts}
          open={openDialogPostNotification}
          onOpenChange={setOpenDialogPostNotification}
          typePost={'NotificaçãoDialog'}
        />
      </div>
    </>
  )
}

export default RouterPost
