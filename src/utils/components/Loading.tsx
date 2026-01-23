interface LoadingOverlayProps {
  isLoading: boolean
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
}: LoadingOverlayProps) => {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="loader"></div>
    </div>
  )
}

export const LoadingComponent = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative h-8 w-8">
        <div className="absolute inset-0 rounded-full border-2 border-zinc-300/40 dark:border-zinc-600/40" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-zinc-400 border-t-zinc-500 dark:border-zinc-500 dark:border-t-zinc-300" />
      </div>
    </div>
  )
}
