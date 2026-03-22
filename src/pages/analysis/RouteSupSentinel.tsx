import {
  AlertOctagon,
  AlertTriangle,
  Ban,
  Clock,
  Eye,
  MessageSquareX,
  RefreshCw,
  SearchCode,
  ShieldAlert,
  UserCheck,
} from 'lucide-react'
import { useState } from 'react'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import { TableFiltersPersons } from './components/tableFiltersPersons'

// Mock de dados ampliado - Focado apenas em usuários
const mockReports: UserReport[] = [
  {
    id: 'REP-1029',
    targetName: 'Vitor K.',
    reason: 'Falsidade Ideológica',
    description: 'Usuário novo usando fotos de terceiros para aplicar golpes.',
    status: 'INITIAL_REVIEW', // Novo!
    createdAt: '21/03/2026',
  },
  {
    id: 'REP-1024',
    targetName: 'João Silva',
    reason: 'Assédio',
    description: 'Mensagens ofensivas repetidas após bloqueio.',
    status: 'PENDING',
    createdAt: '21/03/2026',
  },
  {
    id: 'REP-1025',
    targetName: 'Marcos Oliveira',
    reason: 'Spam',
    description: 'Links de apostas no feed.',
    status: 'UNDER_REVIEW',
    createdAt: '21/03/2026',
  },
  {
    id: 'REP-1030',
    targetName: 'Bruno Dias',
    reason: 'Spam',
    description: 'Divulgação de software malicioso.',
    status: 'RESOLVED', // Finalizado - Inocente
    createdAt: '20/03/2026',
  },
  {
    id: 'REP-1031',
    targetName: 'Lucas Lima',
    reason: 'Discurso de Ódio',
    description: 'Ataques diretos em comentários.',
    status: 'REJECTED', // Finalizado - Banido
    createdAt: '19/03/2026',
  },
  {
    id: 'REP-1032',
    targetName: 'Amanda S. (Verified)',
    reason: 'Nudez/Conteúdo Sexual',
    description: 'Venda de conteúdo adulto explícito no link da bio.',
    status: 'INITIAL_REVIEW',
    createdAt: '21/03/2026',
  },
  {
    id: 'REP-1033',
    targetName: 'Crypto_King_88',
    reason: 'Spam',
    description:
      'Bot enviando convites para grupos de WhatsApp e Telegram sem parar.',
    status: 'UNDER_REVIEW',
    createdAt: '20/03/2026',
  },
  {
    id: 'REP-1034',
    targetName: 'Anti-Vax-Brasil',
    reason: 'Desinformação',
    description:
      'Perfil criado unicamente para espalhar mentiras sobre saúde pública.',
    status: 'PENDING',
    createdAt: '20/03/2026',
  },
  {
    id: 'REP-1035',
    targetName: 'Henrique L.',
    reason: 'Falsidade Ideológica',
    description: 'Criou conta fingindo ser o suporte oficial da plataforma.',
    status: 'INITIAL_REVIEW',
    createdAt: '19/03/2026',
  },
  {
    id: 'REP-1036',
    targetName: 'Troll_Master',
    reason: 'Assédio',
    description:
      'Perseguindo usuários antigos em todas as postagens com xingamentos.',
    status: 'REJECTED',
    createdAt: '18/03/2026',
  },
  {
    id: 'REP-1037',
    targetName: 'Vendas_Express_BR',
    reason: 'Fraude/Golpe',
    description:
      'Perfil de loja falsa que recebe o pagamento e bloqueia o cliente.',
    status: 'UNDER_REVIEW',
    createdAt: '18/03/2026',
  },
]

export interface UserReport {
  id: string
  targetName: string
  reason:
    | 'Assédio'
    | 'Spam'
    | 'Discurso de Ódio'
    | 'Falsidade Ideológica'
    | 'Nudez/Conteúdo Sexual'
    | string
  description: string
  status:
    | 'PENDING'
    | 'UNDER_REVIEW'
    | 'INITIAL_REVIEW'
    | 'RESOLVED'
    | 'REJECTED'
  createdAt: string
}

export const RouterSupSentinel = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    reason: 'all',
  })
  const [selectedReport, setSelectedReport] = useState<UserReport | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false)
  const handleOpenReport = (report: any) => {
    setSelectedReport(report)
    setIsModalOpen(true)
  }

  const handleOpenStatusChange = (report: UserReport) => {
    setSelectedReport(report)
    setIsStatusModalOpen(true)
  }

  return (
    <div className="space-y-6 p-8">
      {/* Header da Página */}
      <div className="flex flex-col gap-2">
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
          <ShieldAlert className="h-8 w-8 text-red-500" />
          Denúncias de Usuários
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Gerencie o comportamento da comunidade e aplique suspensões quando
          necessário.
        </p>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Denúncias de Usuários
        </h1>
        <TableFiltersPersons
          onFilterChange={(newFilters) => setFilters(newFilters)}
        />
      </div>
      {/* Tabela de Denúncias */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
            <TableRow>
              <TableHead className="w-[150px]">ID do Caso</TableHead>
              <TableHead>Usuário Denunciado</TableHead>
              <TableHead>Motivo Principal</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Análise</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockReports.map((report) => (
              <TableRow
                key={report.id}
                className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20"
              >
                <TableCell className="font-mono text-xs text-zinc-500">
                  {report.id}
                </TableCell>
                <TableCell className="font-semibold">
                  {report.targetName}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cnReasonColor(report.reason)}
                  >
                    {report.reason}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-zinc-500">
                  {report.createdAt}
                </TableCell>
                <TableCell
                  className="cursor-pointer"
                  onClick={() => handleOpenStatusChange(report)}
                >
                  <Badge
                    className={`${cnStatus(report.status)} transition-all hover:scale-105`}
                  >
                    {getStatusLabel(report.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleOpenReport(report)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal de Detalhes da Justificativa */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md border-zinc-200 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertOctagon className="h-5 w-5 text-red-500" />
              Dossiê de Denúncia
            </DialogTitle>
            <DialogDescription>
              Analise as evidências antes de tomar uma decisão contra{' '}
              <strong>{selectedReport?.targetName}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-900">
                <span className="text-[10px] font-bold uppercase text-zinc-500">
                  Motivo
                </span>
                <p className="text-sm font-medium">{selectedReport?.reason}</p>
              </div>
              <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-900">
                <span className="text-[10px] font-bold uppercase text-zinc-500">
                  Data do Registro
                </span>
                <p className="text-sm font-medium">
                  {selectedReport?.createdAt}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-zinc-500">
                Relato do Denunciante
              </span>
              <div className="relative rounded-md border bg-zinc-50 p-3 text-sm italic leading-relaxed text-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
                <MessageSquareX className="absolute right-2 top-2 h-4 w-4 text-zinc-300 dark:text-zinc-800" />
                "{selectedReport?.description}"
              </div>
            </div>

            {/* Ações de Moderação */}
            <div className="flex flex-col gap-2 pt-4">
              <Button
                variant="destructive"
                className="w-full gap-2 shadow-lg shadow-red-500/20"
              >
                <AlertTriangle className="h-4 w-4" />
                Aplicar Ações
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent className="max-w-sm border-zinc-200 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-blue-500" />
              Atualizar Status
            </DialogTitle>
            <DialogDescription>
              Caso <strong>{selectedReport?.id}</strong> de{' '}
              {selectedReport?.targetName}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2 py-4">
            <StatusOption
              active={selectedReport?.status === 'INITIAL_REVIEW'}
              icon={<AlertOctagon className="h-4 w-4 text-red-500" />}
              label="Novo Registro"
              desc="Acabou de chegar"
              onClick={() => setIsStatusModalOpen(false)}
            />
            <StatusOption
              active={selectedReport?.status === 'PENDING'}
              icon={<Clock className="h-4 w-4 text-amber-500" />}
              label="Aguardando"
              desc="Na fila de espera"
              onClick={() => setIsStatusModalOpen(false)}
            />
            <StatusOption
              active={selectedReport?.status === 'UNDER_REVIEW'}
              icon={<SearchCode className="h-4 w-4 text-blue-500" />}
              label="Em Análise"
              desc="Agente trabalhando"
              onClick={() => setIsStatusModalOpen(false)}
            />
            <StatusOption
              active={selectedReport?.status === 'RESOLVED'}
              icon={<UserCheck className="h-4 w-4 text-green-500" />}
              label="Resolvido"
              desc="Nenhuma infração"
              onClick={() => setIsStatusModalOpen(false)}
            />
            <StatusOption
              active={selectedReport?.status === 'REJECTED'}
              icon={<Ban className="h-4 w-4 text-zinc-500" />}
              label="Rejeitado/Banido"
              desc="Punição aplicada"
              onClick={() => setIsStatusModalOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const REASON_STYLES: Record<string, string> = {
  Assédio: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'Discurso de Ódio':
    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Spam: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  'Falsidade Ideológica':
    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'Nudez/Conteúdo Sexual':
    'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
}
const STATUS_STYLES: Record<string, string> = {
  INITIAL_REVIEW: 'bg-rose-500 text-white hover:bg-rose-600 shadow-sm',
  PENDING:
    'bg-amber-100 text-amber-700  dark:bg-amber-900/20 dark:text-amber-400',
  UNDER_REVIEW:
    'bg-blue-100 text-blue-700  dark:bg-blue-900/20 dark:text-blue-400',
  RESOLVED:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  REJECTED: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-500',
}
function cnReasonColor(reason: string) {
  return REASON_STYLES[reason] || 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
}
function cnStatus(status: string) {
  return STATUS_STYLES[status] || 'bg-zinc-100 text-zinc-600'
}
function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    INITIAL_REVIEW: 'Nova Denuncia',
    PENDING: 'Aguardando',
    UNDER_REVIEW: 'Em Análise',
    RESOLVED: 'Resolvido',
    REJECTED: 'Banido',
  }
  return labels[status] || status
}
const StatusOption = ({ active, icon, label, desc, onClick }: any) => (
  <Button
    variant="outline"
    className={`h-auto justify-start gap-3 p-3 ${active ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
    onClick={onClick}
  >
    {icon}
    <div className="flex flex-col items-start">
      <span className="text-sm font-bold">{label}</span>
      <span className="text-[10px] text-zinc-500">{desc}</span>
    </div>
  </Button>
)
