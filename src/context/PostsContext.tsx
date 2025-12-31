import { createContext, useContext, useState } from 'react'
import type { Post } from '../types'

interface PostsContextType {
  posts: Post[]
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
  selectedPost: Post | null
  setSelectedPost: React.Dispatch<React.SetStateAction<Post | null>>
}

const PostsContext = createContext<PostsContextType | undefined>(undefined)

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  return (
    <PostsContext.Provider
      value={{
        posts,
        setPosts,
        selectedPost,
        setSelectedPost,
      }}
    >
      {children}
    </PostsContext.Provider>
  )
}

export function usePosts() {
  const context = useContext(PostsContext)

  if (!context) {
    throw new Error('usePosts deve ser usado dentro de PostsProvider')
  }

  return context
}
