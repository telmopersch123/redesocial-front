import {
  Ban,
  Clock,
  FileText,
  ImageIcon,
  Layout,
  Maximize2,
  RefreshCw,
  SearchCode,
  UserCheck,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
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
import {
  banReportsPosts,
  getPostsReports,
  updateStatusReportsPosts,
} from '../../services/authService'
import { MessagePerson } from '../../utils/components/MessagePerson'
import { useInfiniteScrollAdmin } from './components/infiniteScroll'
import { TableFilters } from './components/tableFiltersPost'

// --- Interfaces e Mocks ---
export interface PostReport {
  id: string
  authorName: string
  reason: string
  postContent: string
  PostIdReported: number
  descriptionReport?: string
  imagens?: {
    url: string
  }[]
  status:
    | 'INITIAL_REVIEW'
    | 'PENDING'
    | 'UNDER_REVIEW'
    | 'RESOLVED'
    | 'REJECTED'
  createdAt: string
}

// --- Helpers de Estilo (Consistência com User Sentinel) ---
const STATUS_STYLES: Record<string, string> = {
  INITIAL_REVIEW: 'bg-rose-500 text-white hover:bg-rose-600 shadow-sm',
  PENDING:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  UNDER_REVIEW:
    'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  RESOLVED:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  REJECTED: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-500',
}

function validateType(type: string) {
  const translations: Record<string, string> = {
    assedio_ou_bullying: 'Assédio ou Bullying',
    discurso_de_odio: 'Discurso de Ódio',
    conteudo_improprio: 'Conteúdo Impróprio',
    spam_ou_comportamento_suspeito: 'Spam ou Comportamento Suspeito',
    falsa_identidade: 'Falsa Identidade',
    outro: 'Outro',
  }
  if (translations[type]) {
    return translations[type]
  }
  const formatted = type.replace(/_/g, ' ').toLowerCase()

  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}
function cnStatus(status: string) {
  return STATUS_STYLES[status] || 'bg-zinc-100 text-zinc-600'
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    INITIAL_REVIEW: 'Nova Denúncia',
    PENDING: 'Aguardando',
    UNDER_REVIEW: 'Em Análise',
    RESOLVED: 'Resolvido',
    REJECTED: 'Removido',
  }
  return labels[status] || status
}

// --- Componente Principal ---
export const RouterSupSentinelPosts = () => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedPost, setSelectedPost] = useState<PostReport | null>(null)
  const [reports, setReports] = useState<PostReport[]>([])
  const [hasMore, setHasMore] = useState(true)
  const pageRef = useRef(1)
  const isFetchingRef = useRef(false)
  const [isLoadingFechReportPosts, setIsLoadingFechReportPosts] =
    useState(false)
  const [loading, setLoading] = useState(true)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [fullscreenImg, setFullscreenImg] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterReason, setFilterReason] = useState('all')
  const onLoadMore = useCallback(() => {
    if (isFetchingRef.current || !hasMore || loading) return
    const nextPage = pageRef.current + 1
    fetchReportsPosts(nextPage, true)
  }, [hasMore, loading])

  const { scrollContainerRef, sentinelRef } = useInfiniteScrollAdmin({
    enabled: hasMore && !loading,
    hasMore,
    onLoadMore: onLoadMore,
  })

  const handleOpenStatusChange = (report: PostReport) => {
    setSelectedPost(report)
    setIsStatusModalOpen(true)
  }

  async function fetchReportsPosts(pageNumber: number, append = false) {
    append ? setIsLoadingFechReportPosts(true) : setLoading(true)
    try {
      const response = await getPostsReports(
        pageNumber,
        filterStatus,
        filterReason
      )
      setReports((prev) =>
        append ? [...prev, ...response.data] : response.data
      )

      setHasMore(response.hasMore)
      pageRef.current = pageNumber
    } catch (error) {
      console.error(error)
    } finally {
      isFetchingRef.current = false
      append ? setIsLoadingFechReportPosts(false) : setLoading(false)
    }
  }

  const handleApplyBan = async () => {
    try {
      await banReportsPosts(
        selectedPost!.id,
        selectedPost!.PostIdReported,
        selectedPost!.reason
      )
      setReports((prev) =>
        prev.map((r) =>
          r.id === selectedPost!.id ? { ...r, status: 'REJECTED' } : r
        )
      )
      MessagePerson('Postagem banida com sucesso', null, 'success')
      setIsDetailOpen(false)
    } catch (error) {
      console.error('Erro ao excluir postagem:', error)
    }
  }

  const handleUpdateStatus = async (newStatus: PostReport['status']) => {
    if (!selectedPost) return

    try {
      await updateStatusReportsPosts(newStatus, selectedPost.id)

      setReports((prev) =>
        prev.map((r) =>
          r.id === selectedPost.id ? { ...r, status: newStatus } : r
        )
      )

      setIsStatusModalOpen(false)
      MessagePerson('Status atualizado com sucesso!', null, 'success')
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    pageRef.current = 1
    try {
      await fetchReportsPosts(1, false)
    } catch (error) {
      console.error(error)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    pageRef.current = 1
    fetchReportsPosts(1)
  }, [filterStatus, filterReason])

  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-col gap-2">
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-orange-500">
          <Layout className="h-8 w-8" />
          Moderação de Conteúdo
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Analise denúncias de postagens e mídias da comunidade.
        </p>
      </div>
      {/* Filtros e Busca */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
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

        <TableFilters
          setFilterStatus={setFilterStatus}
          setFilterReason={setFilterReason}
        />
      </div>
      <div
        ref={scrollContainerRef}
        className="custom-scrollbar max-h-[70vh] overflow-hidden overflow-y-auto rounded-xl border bg-card shadow-sm"
      >
        <Table>
          <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
            <TableRow>
              <TableHead className="w-[120px]">ID</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Motivo</TableHead>
              <TableHead>Mídias</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
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
                    {report.authorName}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-orange-200 bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-400"
                    >
                      {validateType(report.reason)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <ImageIcon className="h-4 w-4" />
                      <span className="text-xs font-bold">
                        {report.imagens?.length || 0}
                      </span>
                    </div>
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
                      onClick={() => {
                        setSelectedPost(report)
                        setIsDetailOpen(true)
                      }}
                    >
                      <Maximize2 className="h-4 w-4" />
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
          {isLoadingFechReportPosts && 'Carregando mais...'}
          {!hasMore &&
            reports.length > 0 &&
            !isLoadingFechReportPosts &&
            'Todos os registros já foram carregados'}
        </div>
      </div>

      {/* --- MODAL DE DETALHES --- */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-zinc-200 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <FileText className="h-5 w-5 text-orange-500" />
              Dossiê do Post {selectedPost?.id}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-zinc-400">
                Comentário da Denúncia
              </label>
              <div className="max-h-40 w-full min-w-0 overflow-y-auto break-all rounded-lg border bg-zinc-50 p-4 text-sm italic dark:bg-zinc-900">
                {selectedPost?.descriptionReport ||
                  'Nenhum comentário adicional fornecido pelo denunciante.'}
              </div>
              <label className="text-[10px] font-bold uppercase text-zinc-400">
                Conteúdo do Post Denunciado
              </label>
              <div className="w-full min-w-0 break-all rounded-lg border bg-zinc-50 p-4 text-sm italic dark:bg-zinc-900">
                {selectedPost?.postContent}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-zinc-400">
                Evidências da Denúncia ({selectedPost?.imagens?.length || 0})
              </label>

              <div className="grid grid-cols-2 gap-2">
                {selectedPost?.imagens && selectedPost.imagens.length > 0 ? (
                  selectedPost.imagens.map((img, index) => (
                    <div
                      key={index}
                      onClick={() => setFullscreenImg(img.url)}
                      className="group relative aspect-video cursor-zoom-in overflow-hidden rounded-lg border bg-zinc-100 dark:bg-zinc-800"
                    >
                      <img
                        src={img.url}
                        alt={`Evidência ${index + 1}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <Maximize2 className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 rounded-lg border border-dashed p-6 text-center text-sm italic text-zinc-500">
                    Nenhuma imagem anexada a esta denúncia.
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 border-t pt-4">
              <Button
                onClick={() => handleApplyBan()}
                variant="destructive"
                className="flex-1 gap-2"
              >
                <Ban className="h-4 w-4" /> Banir Postagem
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- MODAL DE STATUS (IGUAL AO USER SENTINEL) --- */}
      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-blue-500" /> Atualizar Status
            </DialogTitle>
            <DialogDescription>
              Mudar estágio do caso {selectedPost?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 py-4">
            <StatusOption
              active={selectedPost?.status === 'PENDING'}
              label="Aguardando"
              desc="Aguardando triagem"
              icon={<Clock className="h-4 w-4 text-amber-500" />}
              onClick={() => handleUpdateStatus('PENDING')}
            />
            <StatusOption
              active={selectedPost?.status === 'UNDER_REVIEW'}
              label="Em Análise"
              desc="Verificando diretrizes"
              icon={<SearchCode className="h-4 w-4 text-blue-500" />}
              onClick={() => handleUpdateStatus('UNDER_REVIEW')}
            />
            <StatusOption
              active={selectedPost?.status === 'RESOLVED'}
              label="Resolvido"
              desc="Postagem mantida"
              icon={<UserCheck className="h-4 w-4 text-green-500" />}
              onClick={() => handleUpdateStatus('RESOLVED')}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* --- LIGHTBOX (FULLSCREEN IMAGE) --- */}
      {fullscreenImg && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 duration-200 animate-in fade-in"
          onClick={() => setFullscreenImg(null)}
        >
          <button className="absolute right-6 top-6 text-white hover:text-orange-500">
            <X className="h-8 w-8" />
          </button>
          <img
            src={fullscreenImg}
            className="max-h-full max-w-full rounded-lg shadow-2xl transition-transform"
            alt="Fullscreen"
          />
        </div>
      )}
    </div>
  )
}

// --- Sub-componente de Opção de Status ---
const StatusOption = ({ active, icon, label, onClick }: any) => (
  <Button
    variant="outline"
    className={`h-auto justify-start gap-3 p-4 ${active ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
    onClick={onClick}
  >
    {icon}
    <span className="text-sm font-bold">{label}</span>
  </Button>
)
