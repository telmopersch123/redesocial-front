import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
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

// Mock de dados para o front inicial
const userStats = [
  { id: 1, name: 'Usuário Beta', media: 4.8, status: 'bom', tendencia: 'up' },
  {
    id: 2,
    name: 'Usuário Gamma',
    media: 3.2,
    status: 'estavel',
    tendencia: 'stable',
  },
  {
    id: 3,
    name: 'Usuário Delta',
    media: 1.5,
    status: 'queda',
    tendencia: 'down',
  },
  { id: 4, name: 'Usuário Beta', media: 4.8, status: 'bom', tendencia: 'up' },
  {
    id: 5,
    name: 'Usuário Gamma',
    media: 3.2,
    status: 'estavel',
    tendencia: 'stable',
  },
  {
    id: 6,
    name: 'Usuário Delta',
    media: 1.5,
    status: 'queda',
    tendencia: 'down',
  },
  { id: 7, name: 'Usuário Beta', media: 4.8, status: 'bom', tendencia: 'up' },
  {
    id: 8,
    name: 'Usuário Gamma',
    media: 3.2,
    status: 'estavel',
    tendencia: 'stable',
  },
  {
    id: 9,
    name: 'Usuário Delta',
    media: 1.5,
    status: 'queda',
    tendencia: 'down',
  },
  { id: 10, name: 'Usuário Beta', media: 4.8, status: 'bom', tendencia: 'up' },
  {
    id: 11,
    name: 'Usuário Gamma',
    media: 3.2,
    status: 'estavel',
    tendencia: 'stable',
  },
  {
    id: 12,
    name: 'Usuário Delta',
    media: 1.5,
    status: 'queda',
    tendencia: 'down',
  },
]

export const RouteSup = () => {
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
                <div className="text-2xl font-bold">84%</div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium uppercase text-slate-500">
                  Alertas Críticos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Médias Semanais</CardTitle>
              <CardDescription>
                Visualização da evolução emocional por usuário.
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                  {userStats.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell>{u.media.toFixed(1)}</TableCell>
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
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
