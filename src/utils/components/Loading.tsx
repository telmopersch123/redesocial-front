interface LoadingOverlayProps {
  isLoading: boolean
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
}: LoadingOverlayProps) => {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="loader"></div>
    </div>
  )
}

export default LoadingOverlay
