import { Edit2, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Label } from '../../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { Separator } from '../../ui/separator'
import { Textarea } from '../../ui/textarea'
import DialogAddMetodo from './DialogAddMetodos'

interface InformacaoBasicaProps {
  nomeUser: string
  selectedAvatar: number | null
  coresFundos: string[]
  setNomeUser: (nomeUser: string) => void
  sentimentoAtual: string[]
  setSentimentoAtual: (sentimentoAtual: string[]) => void
  setSelectedAvatar: (selectedAvatar: number) => void
  setFile: (file: string | null) => void
  avataresSimbolicos: { icon: any; nome: string; id: number }[]
  abrirDialogConfig: () => void
}
const sentimentos = [
  { value: 'feliz', label: 'Feliz', emoji: '😊' },
  { value: 'esperancoso', label: 'Esperançoso', emoji: '🌱' },
  { value: 'ansioso', label: 'Ansioso', emoji: '😰' },
  { value: 'agradecido', label: 'Agradecido', emoji: '🙏' },
  { value: 'triste', label: 'Triste', emoji: '😢' },
]

const InformacaoBasica = ({
  nomeUser,
  selectedAvatar,
  coresFundos,
  setNomeUser,
  sentimentoAtual,
  setSentimentoAtual,
  setSelectedAvatar,
  setFile,
  avataresSimbolicos,
  abrirDialogConfig,
}: InformacaoBasicaProps) => {
  const [metodosAutocuidado, setMetodosAutocuidado] = useState([
    'Meditar 10 minutos ao acordar',
    'Beber 2L de água',
  ])

  function removerMetodo(i: number) {
    setMetodosAutocuidado((prev) => prev.filter((_, index) => index !== i))
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Básicas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Nome de Exibição */}
        <div className="space-y-2">
          <Label className="text-sm font-medium tracking-wide text-foreground/80">
            Nome de exibição
          </Label>

          <div className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/40 p-3 shadow-sm transition-all duration-300 hover:bg-muted/60 hover:shadow-md">
            <span className="text-base font-semibold text-foreground">
              {nomeUser || 'Usuário'}
            </span>

            <Button
              variant="ghost"
              size="sm"
              onClick={abrirDialogConfig}
              className="flex items-center gap-1 text-sm text-foreground/70 transition-all duration-200 hover:bg-foreground/10 hover:text-foreground"
            >
              <Edit2 className="h-4 w-4" />
              Editar
            </Button>
          </div>
        </div>

        <Separator />

        {/* Lema ou Biografia */}
        <div className="space-y-2">
          <Label>Lema ou biografia</Label>
          <Textarea
            placeholder="Escreva algo sobre você..."
            className="min-h-20 resize-none"
          />
        </div>

        <Separator />

        {/* Sentimento */}
        <div className="space-y-2">
          <Label>Como você está se sentindo hoje?</Label>
          <Select
            onValueChange={(value) => {
              const sentimento = sentimentos.find((s) => s.value === value)
              if (sentimento) {
                setSentimentoAtual([sentimento.value, sentimento.emoji])
              }
            }}
            value={sentimentoAtual[0]}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                <span className="mr-2">{sentimentoAtual[1]}</span>
                {sentimentoAtual[0]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {sentimentos.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  <span className="mr-2">{s.emoji}</span>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Avatar Simbólico */}
        <div className="space-y-3">
          <Label>Avatar Simbólico</Label>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
            {avataresSimbolicos.map((item, index) => {
              const Icon = item.icon
              const isSelected = selectedAvatar === item.id
              const bgColor = coresFundos[index]
              return (
                <Button
                  key={item.id}
                  onClick={() => {
                    setSelectedAvatar(item.id)
                    setFile(null)
                  }}
                  variant="ghost"
                  className={`relative flex h-24 flex-col items-center justify-center rounded-2xl p-3 transition-all duration-300 hover:scale-105 ${
                    isSelected
                      ? 'border-2 border-[#a5c9ff] ring-2 ring-[#a5c9ff]/50'
                      : 'border border-gray-300'
                  }`}
                >
                  <span className={`${bgColor} rounded-xl p-3 text-white`}>
                    <Icon className="!h-8 !w-8" />
                  </span>
                  <span className="mt-1 text-xs font-medium">{item.nome}</span>
                </Button>
              )
            })}
          </div>
        </div>

        <Separator />

        {/* Métodos de Autocuidado */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Métodos de Autocuidado</Label>
            <DialogAddMetodo
              onAddMetodo={(metodo) =>
                setMetodosAutocuidado([...metodosAutocuidado, metodo])
              }
            />
          </div>

          <div className="max-h-[400px] space-y-2 overflow-y-auto">
            {metodosAutocuidado.map((metodo, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border bg-muted/50 p-3"
              >
                <span className="text-sm">{metodo}</span>
                <Button
                  onClick={() => removerMetodo(i)}
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default InformacaoBasica
