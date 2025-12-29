import type { Post } from '../../../../types'

export interface ActionsPostsPropsHandleLike {
  id: number
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
  posts: Post[] | Post
}

export interface ActionsPostsPropsHandleSave {
  id: number
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
  posts: Post[] | Post
}

export const handleSalvar = ({
  id,
  setPosts,
  posts,
}: ActionsPostsPropsHandleSave) => {
  if (Array.isArray(posts)) {
    setPosts(
      posts.map((p: Post) => (p.id === id ? { ...p, salvo: !p.salvo } : p))
    )
  }
}
