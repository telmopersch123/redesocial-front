import { Edit2, X, type LucideIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useLimitForms } from '../../../../hooks/useLimitForms'
import { MessageForms } from '../../../formCustomer/MessageForms'
import { Button } from '../../../ui/button'
import { Card, CardContent, CardHeader } from '../../../ui/card'
import { Label } from '../../../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../ui/select'
import { Separator } from '../../../ui/separator'
import { Textarea } from '../../../ui/textarea'
import DialogAddMetodo from './AddMetodoDialog'
import { ConfigDialog } from './ConfigDialog'
import { sentimentos } from './UserPerfilComponent'

interface InformacaoBasicaProps {
  nomeUser: string
  selectedAvatar: number | null
  coresFundos: string[]

  setSelectedAvatar: (selectedAvatar: number) => void
  setFile: (file: string | null) => void
  avataresSimbolicos: { icon: LucideIcon; nome: string; id: number }[]
  abrirDialogConfig: () => void
  setRawFile: React.Dispatch<React.SetStateAction<File | null>>
  setNomeUser: React.Dispatch<React.SetStateAction<string>>
  localBio: string
  setLocalBio: React.Dispatch<React.SetStateAction<string>>
  localSentimento: string
  setLocalSentimento: React.Dispatch<React.SetStateAction<string>>
  localMetodos: string[]
  setLocalMetodos: React.Dispatch<React.SetStateAction<string[]>>
}

const BasicInformationComponent = ({
  nomeUser,
  selectedAvatar,
  coresFundos,
  setSelectedAvatar,
  setFile,
  avataresSimbolicos,
  abrirDialogConfig,
  setRawFile,
  setNomeUser,
  localBio: bio,
  setLocalBio: setBio,
  localSentimento: sentimentoAtual,
  setLocalSentimento: setSentimentoAtual,
  localMetodos: metodosAutocuidado,
  setLocalMetodos: setMetodosAutocuidado,
}: InformacaoBasicaProps) => {
  const BiographyControl = useLimitForms(256)

  useEffect(() => {
    if (bio !== undefined) {
      BiographyControl.setValue(bio)
    }
  }, [bio])
  function removerMetodo(i: number) {
    setMetodosAutocuidado((prev: string[]) =>
      prev.filter((_, index) => index !== i)
    )
  }
  return (
    <Card>
      <CardHeader className="flex flex-col-reverse items-center justify-between space-y-0 om:flex-row">
        <h1 className="text-2xl font-semibold tracking-tight">
          Informações Básicas
        </h1>
        <ConfigDialog nomeUser={nomeUser} />
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
            value={BiographyControl.value}
            onChange={(e) => {
              BiographyControl.handleChange(e)
              setBio(e.target.value)
            }}
            placeholder="Escreva algo sobre você..."
            className="min-h-20 resize-none"
          />
          <MessageForms
            error={BiographyControl.error}
            valueLength={BiographyControl.value.length}
            maxLength={BiographyControl.maxLength}
          />
        </div>

        <Separator />

        {/* Sentimento */}
        <div className="space-y-2">
          <Label>Como você está se sentindo hoje?</Label>
          <Select
            onValueChange={(value) => {
              setSentimentoAtual(value)
            }}
            value={sentimentoAtual}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {(() => {
                  const s =
                    sentimentos.find((s) => s.value === sentimentoAtual) ||
                    sentimentos[1]
                  return (
                    <div className="flex items-center gap-2">
                      <span>{s.emoji}</span>
                      <span>{s.label}</span>
                    </div>
                  )
                })()}
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
          <div className="grid grid-cols-4 gap-3 dm:grid-cols-8">
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
                    setRawFile(null)
                  }}
                  variant="ghost"
                  className={`relative flex h-24 flex-col items-center justify-center rounded-2xl border-2 p-3 px-5 transition-all duration-300 hover:scale-105 ${
                    isSelected
                      ? 'border-[#a5c9ff] ring-2 ring-[#a5c9ff]/40'
                      : 'border-[#a5c9ff]/40'
                  }`}
                >
                  <span className={`${bgColor} rounded-xl p-3 text-white/80`}>
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

          <div className="max-h-[400px] space-y-2">
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

export default BasicInformationComponent
