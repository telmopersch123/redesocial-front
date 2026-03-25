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
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
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

import toast from 'react-hot-toast'
import {
  applyBanPerm,
  applySevenDayBan,
  getUserReportsAdmin,
  updateStatusReportsUsers,
} from '../../services/authService'
import { ActionDecisionDialog } from './components/actionDecisionDialog'
import { useInfiniteScrollAdmin } from './components/infiniteScroll'
import { TableFiltersPersons } from './components/tableFiltersPersons'

export interface UserReport {
  id: string
  targetName: string
  userIdReported: number
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

const handleTriggerAction = (
  setIsModalOpen: Dispatch<SetStateAction<boolean>>,
  setIsActionModalOpen: Dispatch<SetStateAction<boolean>>
) => {
  setIsModalOpen(false)
  setIsActionModalOpen(true)
}
const handleOpenReport = (
  report: UserReport,
  setIsModalOpen: Dispatch<SetStateAction<boolean>>,
  setSelectedReport: Dispatch<SetStateAction<UserReport | null>>
) => {
  setSelectedReport(report)
  setIsModalOpen(true)
}
const handleOpenStatusChange = (
  report: UserReport,
  setIsStatusModalOpen: Dispatch<SetStateAction<boolean>>,
  setSelectedReport: Dispatch<SetStateAction<UserReport | null>>
) => {
  setSelectedReport(report)
  setIsStatusModalOpen(true)
}

export const RouterSupSentinelPersons = () => {
  const isFetchingRef = useRef(false)
  const pageRef = useRef(1)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [reports, setReports] = useState<UserReport[]>([])
  const [isLoadingFechReportUsers, setIsLoadingFechReportUsers] =
    useState(false)

  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)

  const [isActionModalOpen, setIsActionModalOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<UserReport | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false)
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    reason: 'all',
  })

  const onLoadMore = useCallback(() => {
    if (isFetchingRef.current || !hasMore || loading) return
    const nextPage = pageRef.current + 1
    fetchReports(nextPage, true)
  }, [hasMore, loading])

  const { scrollContainerRef, sentinelRef } = useInfiniteScrollAdmin({
    enabled: hasMore && !loading,
    hasMore,
    onLoadMore: onLoadMore,
  })

  const fetchReports = async (pageNumber: number, append = false) => {
    append ? setIsLoadingFechReportUsers(true) : setLoading(true)
    try {
      const response = await getUserReportsAdmin(pageNumber)
      setReports((prev) =>
        append ? [...prev, ...response.data] : response.data
      )
      console.log(response)
      setHasMore(response.hasMore)
      pageRef.current = pageNumber
    } catch (error) {
      console.error(error)
    } finally {
      isFetchingRef.current = false
      append ? setIsLoadingFechReportUsers(false) : setLoading(false)
    }
  }

  useEffect(() => {
    pageRef.current = 1
    fetchReports(1)
  }, [])

  const handleApplySevenDaysBan = async () => {
    try {
      await applySevenDayBan(
        selectedReport!.id,
        selectedReport!.userIdReported,
        selectedReport!.reason
      )
      setReports((prev) =>
        prev.map((r) =>
          r.id === selectedReport?.id ? { ...r, status: 'REJECTED' } : r
        )
      )
      setIsActionModalOpen(false)
      toast.success('Usuário banido por 7 dias.')
    } catch (error) {
      toast.error('Falha ao banir usuário.')
    }
  }

  const handleApplyPermBan = async () => {
    try {
      await applyBanPerm(
        selectedReport!.id,
        selectedReport!.userIdReported,
        selectedReport!.reason
      )
      setReports((prev) =>
        prev.map((r) =>
          r.id === selectedReport?.id ? { ...r, status: 'REJECTED' } : r
        )
      )
      setIsActionModalOpen(false)
      toast.success('Usuário banido permanentemente.')
    } catch (error) {
      toast.error('Falha ao banir usuário.')
    }
  }

  const handleUpdateStatus = async (newStatus: UserReport['status']) => {
    if (!selectedReport) return
    try {
      await updateStatusReportsUsers(newStatus, selectedReport!.id)
      setReports((prev) =>
        prev.map((r) =>
          r.id === selectedReport?.id
            ? { ...r, status: selectedReport.status }
            : r
        )
      )
      setIsStatusModalOpen(false)
      toast.success('Status atualizado com sucesso.')
    } catch (error) {
      toast.error('Falha ao atualizar status.')
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    pageRef.current = 1

    try {
      await fetchReports(1, false)
    } catch (error) {
      console.log(error)
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="space-y-6 p-8">
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

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-center p-4">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2.5 rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm transition-all hover:border-zinc-300 hover:bg-zinc-50 active:scale-95 disabled:pointer-events-none disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            <RefreshCw
              className={`h-4 w-4 text-blue-600 dark:text-blue-500 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            {isRefreshing ? 'Atualizando...' : 'Atualizar Dados'}
          </button>
        </div>
        <TableFiltersPersons
          onFilterChange={(newFilters) => setFilters(newFilters)}
        />
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div
          ref={scrollContainerRef}
          className="custom-scrollbar max-h-[900px] overflow-y-auto"
        >
          <Table>
            <TableHeader className="sticky top-0 z-20 bg-zinc-50 shadow-sm dark:bg-zinc-900">
              <TableRow>
                <TableHead className="w-[150px] bg-inherit">
                  ID do Caso
                </TableHead>
                <TableHead className="bg-inherit">Usuário Denunciado</TableHead>
                <TableHead className="bg-inherit">Motivo Principal</TableHead>
                <TableHead className="bg-inherit">Data</TableHead>
                <TableHead className="bg-inherit">Status</TableHead>
                <TableHead className="bg-inherit text-right">Análise</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Carregando denúncias...
                  </TableCell>
                </TableRow>
              ) : reports.length > 0 ? (
                reports.map((report) => (
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
                      onClick={() =>
                        handleOpenStatusChange(
                          report,
                          setIsStatusModalOpen,
                          setSelectedReport
                        )
                      }
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
                        onClick={() =>
                          handleOpenReport(
                            report,
                            setIsModalOpen,
                            setSelectedReport
                          )
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Nenhuma denúncia encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div
            ref={sentinelRef}
            className="py-2 text-center text-xs text-zinc-400"
          >
            {isLoadingFechReportUsers && 'Carregando mais...'}
            {!hasMore &&
              reports.length > 0 &&
              'Todos os registros já foram carregados'}
          </div>
        </div>
      </div>

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

            <div className="flex flex-col gap-2 pt-4">
              <Button
                variant="destructive"
                onClick={() =>
                  handleTriggerAction(setIsModalOpen, setIsActionModalOpen)
                }
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
              onClick={() => handleUpdateStatus('INITIAL_REVIEW')} // Chama a função com o valor correto
            />
            <StatusOption
              active={selectedReport?.status === 'PENDING'}
              icon={<Clock className="h-4 w-4 text-amber-500" />}
              label="Aguardando"
              desc="Na fila de espera"
              onClick={() => handleUpdateStatus('PENDING')}
            />
            <StatusOption
              active={selectedReport?.status === 'UNDER_REVIEW'}
              icon={<SearchCode className="h-4 w-4 text-blue-500" />}
              label="Em Análise"
              desc="Agente trabalhando"
              onClick={() => handleUpdateStatus('UNDER_REVIEW')}
            />
            <StatusOption
              active={selectedReport?.status === 'RESOLVED'}
              icon={<UserCheck className="h-4 w-4 text-green-500" />}
              label="Resolvido"
              desc="Nenhuma infração"
              onClick={() => handleUpdateStatus('RESOLVED')}
            />
            <StatusOption
              active={selectedReport?.status === 'REJECTED'}
              icon={<Ban className="h-4 w-4 text-zinc-500" />}
              label="Rejeitado/Banido"
              desc="Punição aplicada"
              onClick={() => handleUpdateStatus('REJECTED')}
            />
          </div>
        </DialogContent>
      </Dialog>

      <ActionDecisionDialog
        isOpen={isActionModalOpen}
        onOpenChange={setIsActionModalOpen}
        userName={selectedReport?.targetName}
        handleApplySevenDaysBan={handleApplySevenDaysBan}
        handleApplyPermBan={handleApplyPermBan}
      />
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
