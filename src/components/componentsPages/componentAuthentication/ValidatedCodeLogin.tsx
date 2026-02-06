// src/components/auth/ValidatedCodeLogin.tsx
import { CornerUpLeft } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../../context/getMe'
import { verify2FALogin } from '../../../services/authService' // Sua função de 2FA
import { alertMessage } from '../../../utils/components/alertMensage'
import { Button } from '../../ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'

interface ValidatedCodeLoginProps {
  userId: number
  rememberMe: boolean
  onBack: () => void
}

const ValidatedCodeLogin = ({
  userId,
  rememberMe,
  onBack,
}: ValidatedCodeLoginProps) => {
  const { setUser } = useAuth()
  const [timerForgot, setTimerForgot] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [verificationCode, setVerificationCode] = useState([
    '',
    '',
    '',
    '',
    '',
    '',
  ])

  const timerRef = useRef<number | null>(null)
  const codeRefs = Array.from({ length: 6 }, () =>
    useRef<HTMLInputElement>(null)
  )

  const handleCodeChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value
    if (value.length > 1) return

    const newCode = [...verificationCode]
    newCode[index] = value.slice(-1)
    setVerificationCode(newCode)

    if (value.length === 1 && index < 5) {
      codeRefs[index + 1].current?.focus()
    }
    if (value.length === 0 && index > 0) {
      codeRefs[index - 1].current?.focus()
    }
  }

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    let current = 60
    setTimerForgot(current)
    timerRef.current = setInterval(() => {
      current -= 1
      setTimerForgot(current)
      if (current === 0) clearInterval(timerRef.current!)
    }, 1000)
  }

  async function handleValidate2FA() {
    const codeStr = verificationCode.join('')
    if (codeStr.length < 6) return

    try {
      setIsLoading(true)
      const user = await verify2FALogin(userId, codeStr, rememberMe)
      if (user) {
        setUser(user)
        window.location.href = '/'
      }
    } catch (err: any) {
      alertMessage('Erro', err.message || 'Código inválido', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    startTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  return (
    <Card className="m-auto w-full max-w-md border-0 bg-white text-black shadow-2xl">
      <CardHeader className="bg-linear-purple relative rounded-md py-10 text-center text-white">
        <Button
          type="button"
          onClick={onBack}
          className="absolute left-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 shadow-md backdrop-blur-sm hover:scale-110"
        >
          <CornerUpLeft className="h-5 w-5 text-white" />
        </Button>
        <CardTitle className="text-3xl font-bold">Segurança</CardTitle>
        <CardDescription className="text-white/90">
          Confirme o código de 2 etapas
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 bg-white pt-8">
        <div className="space-y-3 rounded-xl border border-purple-200/40 bg-gradient-to-br from-purple-50/60 to-purple-100/20 p-4 shadow-lg backdrop-blur-sm">
          <Label className="text-sm font-medium text-purple-900">
            Código enviado para seu e-mail
          </Label>
          <div className="flex justify-center gap-2">
            {verificationCode.map((_, i) => (
              <Input
                key={i}
                ref={codeRefs[i]}
                maxLength={1}
                className="h-12 w-12 rounded-xl border-purple-300 text-center text-xl font-bold focus:border-purple-500"
                value={verificationCode[i]}
                onChange={(e) => handleCodeChange(i, e)}
              />
            ))}
          </div>
        </div>

        <Button
          onClick={handleValidate2FA}
          disabled={verificationCode.some((d) => d === '') || isLoading}
          className="bg-linear-purple h-12 w-full font-bold text-white"
        >
          {isLoading ? 'Verificando...' : 'Confirmar Login'}
        </Button>

        {timerForgot > 0 && (
          <p className="text-center text-xs font-medium text-purple-600">
            Aguarde {timerForgot}s para reenviar
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default ValidatedCodeLogin
