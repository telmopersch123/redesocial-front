import {
  AlertOctagon,
  Ban,
  FileText,
  ImageIcon,
  Layout,
  Maximize2,
  RefreshCw,
  SearchCode,
  Trash2,
  UserCheck,
  X,
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
import { TableFilters } from './components/tableFiltersPost'

// --- Interfaces e Mocks ---
export interface PostReport {
  id: string
  authorName: string
  reason: string
  postContent: string
  evidenceImages: string[]
  status:
    | 'INITIAL_REVIEW'
    | 'PENDING'
    | 'UNDER_REVIEW'
    | 'RESOLVED'
    | 'REJECTED'
  createdAt: string
}

const mockPostReports: PostReport[] = [
  {
    id: 'POST-8821',
    authorName: 'Gabriel Leme',
    reason: 'Violência',
    postContent: 'Vídeo contendo brigas de rua incentivando o comportamento.',
    evidenceImages: [
      'https://picsum.photos/800/600?sig=1',
      'https://picsum.photos/800/600?sig=2',
    ],
    status: 'INITIAL_REVIEW',
    createdAt: '21/03/2026',
  },
  {
    id: 'POST-8822',
    authorName: 'Ana Julia M.',
    reason: 'Direitos Autorais',
    postContent: 'Postagem de design proprietário sem autorização da marca.',
    evidenceImages: ['https://picsum.photos/800/600?sig=10'],
    status: 'UNDER_REVIEW',
    createdAt: '21/03/2026',
  },
  {
    id: 'POST-8823',
    authorName: 'Robo_Sales_01',
    reason: 'Spam',
    postContent: 'Promoção repetitiva de cursos de investimento duvidosos.',
    evidenceImages: [
      'https://picsum.photos/800/600?sig=11',
      'https://picsum.photos/800/600?sig=12',
    ],
    status: 'PENDING',
    createdAt: '20/03/2026',
  },
  {
    id: 'POST-8824',
    authorName: 'Carla Dias',
    reason: 'Conteúdo Impróprio',
    postContent: 'Imagem com nudez parcial em contexto não artístico.',
    evidenceImages: ['https://picsum.photos/800/600?sig=15'],
    status: 'INITIAL_REVIEW',
    createdAt: '20/03/2026',
  },
  {
    id: 'POST-8825',
    authorName: 'Felipe Neto',
    reason: 'Fake News',
    postContent:
      'Informações falsas sobre a nova política de privacidade do app.',
    evidenceImages: [
      'https://picsum.photos/800/600?sig=20',
      'https://picsum.photos/800/600?sig=21',
    ],
    status: 'RESOLVED',
    createdAt: '19/03/2026',
  },
  {
    id: 'POST-8826',
    authorName: 'User_992',
    reason: 'Discurso de Ódio',
    postContent: 'Comentários preconceituosos contra minorias religiosas.',
    evidenceImages: [],
    status: 'REJECTED',
    createdAt: '19/03/2026',
  },
  {
    id: 'POST-8827',
    authorName: 'Mariana Silva',
    reason: 'Bullying/Assédio',
    postContent:
      'Exposição de prints de conversas privadas para ridicularizar colega.',
    evidenceImages: [
      'https://picsum.photos/800/600?sig=30',
      'https://picsum.photos/800/600?sig=31',
    ],
    status: 'UNDER_REVIEW',
    createdAt: '18/03/2026',
  },
  {
    id: 'POST-8828',
    authorName: 'Pedro Automóveis',
    reason: 'Fraude/Golpe',
    postContent:
      'Anúncio de veículo com preço absurdamente abaixo do mercado (Phishing).',
    evidenceImages: ['https://picsum.photos/800/600?sig=40'],
    status: 'PENDING',
    createdAt: '18/03/2026',
  },
  {
    id: 'POST-8829',
    authorName: 'Lucas Arantes',
    reason: 'Conteúdo Sensível',
    postContent:
      'Imagens gráficas de acidentes sem o aviso de spoiler/conteúdo sensível.',
    evidenceImages: ['https://picsum.photos/800/600?sig=50'],
    status: 'INITIAL_REVIEW',
    createdAt: '17/03/2026',
  },
  {
    id: 'POST-8830',
    authorName: 'Insta_Bot_Vibe',
    reason: 'Spam',
    postContent: 'Milhares de marcações de usuários em post de sorteio falso.',
    evidenceImages: [
      'https://picsum.photos/800/600?sig=60',
      'https://picsum.photos/800/600?sig=61',
    ],
    status: 'RESOLVED',
    createdAt: '17/03/2026',
  },
  {
    id: 'POST-8831',
    authorName: 'Roberto Carlos',
    reason: 'Direitos Autorais',
    postContent: 'Uso de trilha sonora completa sem pagar licenciamento.',
    evidenceImages: [],
    status: 'UNDER_REVIEW',
    createdAt: '16/03/2026',
  },
  {
    id: 'POST-8832',
    authorName: 'Sandro M.',
    reason: 'Auto-mutilação',
    postContent: 'Postagem com apologia a comportamentos autodestrutivos.',
    evidenceImages: ['https://picsum.photos/800/600?sig=70'],
    status: 'INITIAL_REVIEW',
    createdAt: '16/03/2026',
  },
]

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
  const [selectedPost, setSelectedPost] = useState<PostReport | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [fullscreenImg, setFullscreenImg] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    reason: 'all',
  })
  const handleOpenStatusChange = (report: PostReport) => {
    setSelectedPost(report)
    setIsStatusModalOpen(true)
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-col gap-2">
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-orange-500">
          <Layout className="h-8 w-8" />
          Moderação de Conteúdo (Posts)
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Analise denúncias de postagens e mídias da comunidade.
        </p>
      </div>
      {/* Filtros e Busca */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Denúncias de Posts
        </h1>

        {/* Chamada direta do componente que criamos */}
        <TableFilters onFilterChange={(newFilters) => setFilters(newFilters)} />
      </div>
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
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
            {mockPostReports.map((report) => (
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
                    {report.reason}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <ImageIcon className="h-4 w-4" />
                    <span className="text-xs font-bold">
                      {report.evidenceImages.length}
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
            ))}
          </TableBody>
        </Table>
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
                Conteúdo do Texto
              </label>
              <div className="rounded-lg border bg-zinc-50 p-4 text-sm italic dark:bg-zinc-900">
                "{selectedPost?.postContent}"
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-zinc-400">
                Evidências Visuais
              </label>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {selectedPost?.evidenceImages.map((url, index) => (
                  <div
                    key={index}
                    onClick={() => setFullscreenImg(url)}
                    className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-md border bg-zinc-100 transition-all hover:ring-2 hover:ring-orange-500 dark:bg-zinc-800"
                  >
                    <img
                      src={url}
                      alt="Evidência"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <Maximize2 className="h-6 w-6 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 border-t pt-4">
              <Button variant="destructive" className="flex-1 gap-2">
                <Trash2 className="h-4 w-4" /> Remover Postagem
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
              active={selectedPost?.status === 'INITIAL_REVIEW'}
              label="Nova Denúncia"
              icon={<AlertOctagon className="text-red-500" />}
              onClick={() => setIsStatusModalOpen(false)}
            />
            <StatusOption
              active={selectedPost?.status === 'UNDER_REVIEW'}
              label="Em Análise"
              icon={<SearchCode className="text-blue-500" />}
              onClick={() => setIsStatusModalOpen(false)}
            />
            <StatusOption
              active={selectedPost?.status === 'RESOLVED'}
              label="Resolvido"
              icon={<UserCheck className="text-green-500" />}
              onClick={() => setIsStatusModalOpen(false)}
            />
            <StatusOption
              active={selectedPost?.status === 'REJECTED'}
              label="Removido/Punido"
              icon={<Ban className="text-zinc-500" />}
              onClick={() => setIsStatusModalOpen(false)}
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
