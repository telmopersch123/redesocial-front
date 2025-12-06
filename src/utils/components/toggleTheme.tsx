import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from '../../components/ui/button'

export function ToggleThemeButton() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // evita erro de hidratação (next-themes)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const isDark = theme === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative rounded-full"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Alternar tema"
    >
      <Sun
        className={`h-5 w-5 transition-all ${isDark ? '-rotate-90 scale-0' : 'rotate-0 scale-100'}`}
      />
      <Moon
        className={`absolute h-5 w-5 transition-all ${isDark ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`}
      />
      <span className="sr-only">Alternar tema</span>
    </Button>
  )
}
