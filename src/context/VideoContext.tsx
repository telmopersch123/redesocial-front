import { createContext, useState } from 'react'

export interface VideoState {
  [postId: number]: {
    currentTime: number
    playing: boolean
  }
}
interface VideoContextType {
  videoState: VideoState
  setVideoState: React.Dispatch<React.SetStateAction<VideoState>>
}

export const VideoContext = createContext<VideoContextType>({
  videoState: {},
  setVideoState: () => {},
})

export const VideoProvider = ({ children }: { children: React.ReactNode }) => {
  const [videoState, setVideoState] = useState<VideoState>({})
  return (
    <VideoContext.Provider value={{ videoState, setVideoState }}>
      {children}
    </VideoContext.Provider>
  )
}
