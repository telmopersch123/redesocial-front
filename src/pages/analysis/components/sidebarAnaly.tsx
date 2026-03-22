import {
  BarChart3,
  ChevronRight,
  FileWarning,
  LogOut,
  ShieldCheck,
  UserX,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Button } from '../../../components/ui/button'
import { cn } from '../../../lib/utils'

const menuItems = [
  {
    title: 'Médias Semanais',
    icon: BarChart3,
    path: '/analysis', // Rota principal do suporte
    description: 'Relatórios de métricas',
  },
  {
    title: 'Denúncias de Perfis',
    icon: UserX,
    path: '/analysis/denuncias-perfil',
    description: 'Moderação de contas',
  },
  {
    title: 'Denúncias de Posts',
    icon: FileWarning,
    path: '/analysis/denuncias-posts',
    description: 'Conteúdo inapropriado',
  },
]

export function SidebarAnalysis() {
  return (
    <aside className="sticky top-0 flex h-screen w-72 flex-col border-r bg-zinc-50/50 backdrop-blur-xl dark:bg-zinc-950/50">
      {/* Header do Painel */}
      <div className="flex items-center gap-3 px-6 py-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20">
          <ShieldCheck className="h-6 w-6 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold leading-none text-zinc-900 dark:text-zinc-100">
            Painel Support
          </span>
          <span className="mt-1 text-[11px] font-medium uppercase tracking-wider text-blue-600">
            Administrativo
          </span>
        </div>
      </div>

      {/* Navegação Principal */}
      <nav className="flex-1 space-y-1 px-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/analysis'} // Evita que '/' ative todas as rotas
          >
            {({ isActive }) => (
              <div
                className={cn(
                  'group relative flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-200',
                  isActive
                    ? 'bg-white shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800'
                    : 'hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50'
                )}
              >
                {/* Indicador lateral ativo */}
                {isActive && (
                  <div className="absolute left-0 h-5 w-1 rounded-r-full bg-blue-600" />
                )}

                <item.icon
                  className={cn(
                    'h-5 w-5 transition-colors',
                    isActive
                      ? 'text-blue-600'
                      : 'text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100'
                  )}
                />

                <div className="flex flex-col overflow-hidden">
                  <span
                    className={cn(
                      'truncate text-sm font-semibold',
                      isActive
                        ? 'text-zinc-900 dark:text-zinc-100'
                        : 'text-zinc-600 dark:text-zinc-400'
                    )}
                  >
                    {item.title}
                  </span>
                </div>

                {isActive && (
                  <ChevronRight className="ml-auto h-4 w-4 text-zinc-400" />
                )}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Ações de Conta */}
      <div className="mt-auto border-t border-zinc-200 bg-zinc-100/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-zinc-500 transition-all hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-semibold">Sair do Sistema</span>
        </Button>
      </div>
    </aside>
  )
}
