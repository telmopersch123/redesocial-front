import { Activity, CloudSunRain, Leaf, MoonStar, Sun } from 'lucide-react'

export const feelingStatus: Record<
  string,
  { Icon: React.ElementType; color: string; label: string; bg: string }
> = {
  feliz: {
    Icon: Sun,
    color: 'text-amber-500 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    label: 'Radiante',
  },
  triste: {
    Icon: MoonStar,
    color: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-50 dark:bg-sky-900/20',
    label: 'Melancólico',
  },
  esperancoso: {
    Icon: Leaf,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    label: 'Esperançoso',
  },
  agradecido: {
    Icon: CloudSunRain,
    color: 'text-rose-500 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-900/20',
    label: 'Agradecido',
  },
  ansioso: {
    Icon: Activity,
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    label: 'Inquieto',
  },
}
