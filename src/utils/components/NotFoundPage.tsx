import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-6xl font-bold text-zinc-800 dark:text-zinc-100">
        404
      </h1>
      <p className="text-xl text-zinc-500 dark:text-zinc-400">
        Página não encontrada
      </p>
      <p className="text-sm text-zinc-400 dark:text-zinc-500">
        A página que você tentou acessar não existe.
      </p>
      <Button onClick={() => navigate('/')}>Voltar para o início</Button>
    </div>
  )
}
