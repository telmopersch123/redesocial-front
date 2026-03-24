import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Badge } from '../../components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import { getEmotionalPersons } from '../../services/authService'
import { useInfiniteScrollAdmin } from './components/infiniteScroll'
import { TableFiltersEmocional } from './components/tableFiltersAnaly'
interface UserStatRow {
  entryId: number
  userId: number
  name: string
  media: number | null
  status: 'bom' | 'estavel' | 'queda'
  tendencia: 'up' | 'stable' | 'down'
}
interface EmotionalStat {
  entryId: number
  userId: number
  name: string
  media: number | null
  createdAt: string
}

function calcStatus(media: number | null): 'bom' | 'estavel' | 'queda' {
  if (!media) return 'estavel'
  if (media >= 3.5) return 'bom'
  if (media >= 2.5) return 'estavel'
  return 'queda'
}
function calcTendencia(media: number | null): 'up' | 'stable' | 'down' {
  if (!media) return 'stable'
  if (media >= 3.5) return 'up'
  if (media >= 2.5) return 'stable'
  return 'down'
}

export const RouteSup = () => {
  const isFetchingRef = useRef(false)
  const pageRef = useRef(1)
  const [rows, setRows] = useState<UserStatRow[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    reason: 'all',
  })

  const onLoadMore = useCallback(() => {
    if (isFetchingRef.current || !hasMore || loading) return
    const nextPage = pageRef.current + 1
    fetchPage(nextPage, true)
  }, [hasMore, loading])

  const { scrollContainerRef, sentinelRef } = useInfiniteScrollAdmin({
    enabled: hasMore && !loading,
    hasMore,
    onLoadMore: onLoadMore,
  })

  async function fetchPage(pageNumber: number, append = false) {
    if (isFetchingRef.current && append) return
    isFetchingRef.current = true
    try {
      append ? setLoadingMore(true) : setLoading(true)
      console.log(pageNumber)
      const response = await getEmotionalPersons(pageNumber)
      const mapped: UserStatRow[] = response.data.map((u: EmotionalStat) => ({
        entryId: u.entryId,
        userId: u.userId,
        name: u.name,
        media: u.media,
        status: calcStatus(u.media),
        tendencia: calcTendencia(u.media),
      }))

      setRows((prev) => (append ? [...prev, ...mapped] : mapped))
      setHasMore(response.hasMore)
      pageRef.current = pageNumber
    } catch (error) {
      console.log(error)
    } finally {
      isFetchingRef.current = false
      append ? setLoadingMore(false) : setLoading(false)
    }
  }

  useEffect(() => {
    pageRef.current = 1
    fetchPage(1)
  }, [])

  const totalQueda = rows.filter((u) => u.status === 'queda').length
  const pctEstavel = rows.length
    ? Math.round(((rows.length - totalQueda) / rows.length) * 100)
    : 0
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-zinc-900">
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Monitoramento Emocional
            </h1>
            <p className="mt-2 text-slate-500">
              Médias semanais calculadas com base nos registros dos usuários.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium uppercase text-slate-500">
                  Saúde Estável
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? '...' : `${pctEstavel}%`}
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium uppercase text-slate-500">
                  Alertas Críticos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? '...' : totalQueda}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold tracking-tight">
              Denúncias de Usuários
            </h1>
            <TableFiltersEmocional
              onFilterChange={(newFilters) => setFilters(newFilters)}
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Médias Semanais</CardTitle>
              <CardDescription>
                Visualização da evolução emocional por usuário.
              </CardDescription>
            </CardHeader>
            <CardContent
              ref={scrollContainerRef}
              className="max-h-[700px] overflow-y-auto"
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Média Semanal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Tendência</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="py-8 text-center text-sm text-zinc-500"
                      >
                        Carregando dados...
                      </TableCell>
                    </TableRow>
                  ) : rows.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="py-8 text-center text-sm text-zinc-500"
                      >
                        Nenhum usuário encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((u) => (
                      <TableRow key={u.entryId}>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell>{u.media?.toFixed(1) ?? '—'}</TableCell>
                        <TableCell>
                          {u.status === 'bom' && (
                            <Badge className="border-none bg-green-100 px-3 py-1 text-green-700 hover:bg-green-100">
                              🟢 Bom
                            </Badge>
                          )}
                          {u.status === 'estavel' && (
                            <Badge className="border-none bg-yellow-100 px-3 py-1 text-yellow-700 hover:bg-yellow-100">
                              🟡 Estável
                            </Badge>
                          )}
                          {u.status === 'queda' && (
                            <Badge className="border-none bg-red-100 px-3 py-1 text-red-700 hover:bg-red-100">
                              🔴 Em Queda
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {u.tendencia === 'up' && (
                            <TrendingUp className="inline text-green-500" />
                          )}
                          {u.tendencia === 'down' && (
                            <TrendingDown className="inline text-red-500" />
                          )}
                          {u.tendencia === 'stable' && (
                            <Minus className="inline text-yellow-500" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              <div
                ref={sentinelRef}
                className="py-2 text-center text-xs text-zinc-400"
              >
                {loadingMore && 'Carregando mais...'}
                {!hasMore &&
                  rows.length > 0 &&
                  'Todos os registros dos ultimos 7 dias já foram carregados'}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
