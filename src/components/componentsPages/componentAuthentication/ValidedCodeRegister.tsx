import { Clock, CornerUpLeft } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useResetPassword } from '../../../context/ResetPasswordContext'

import {
  sendVerificationEmail,
  verifyEmailCode,
} from '../../../services/authService'
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

interface ValidatedCodeRegisterProps {
  setShowConfirmPass: React.Dispatch<React.SetStateAction<boolean>>
  setAnalysisSituation: React.Dispatch<React.SetStateAction<boolean>>
}

const ValidatedCodeRegister = ({
  setShowConfirmPass,
  setAnalysisSituation,
}: ValidatedCodeRegisterProps) => {
  const [timerForgot, setTimerForgot] = useState<number>(0)
  const [verificationCode, setVerificationCode] = useState(['', '', '', ''])

  const timerRef = useRef<number | null>(null)

  const { email, setIsLoading, setRegisterToken } = useResetPassword()

  const codeRefs = Array.from({ length: 4 }, () =>
    useRef<HTMLInputElement>(null)
  )

  const handleCodeChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value

    const newCode = [...verificationCode]
    newCode[index] = value
    setVerificationCode(newCode)

    if (value.length === 1 && index < 3) {
      codeRefs[index + 1].current?.focus()
    }

    if (value.length === 0 && index > 0) {
      codeRefs[index - 1].current?.focus()
    }
  }

  const handleClickForgotPassword = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    let current = 60

    setTimerForgot(current)
    timerRef.current = setInterval(() => {
      current -= 1
      setTimerForgot(current)

      if (current === 0) {
        clearInterval(timerRef.current!)
        timerRef.current = null
      }
    }, 1000)
  }

  async function handleValidateCode() {
    const codeStr = verificationCode.join('')
    if (codeStr.length < 4) {
      if (timerForgot === 0) {
        await sendVerificationEmail(email)
        handleClickForgotPassword()
      }
      return
    }
    try {
      setIsLoading(true)
      const result = await verifyEmailCode(email, codeStr)

      if (!result) {
        alertMessage(
          'Código inválido',
          'Verifique o código enviado ao seu e-mail',
          'error'
        )
        return
      }

      setShowConfirmPass(true)
      setRegisterToken(result)
      setAnalysisSituation(true)
    } catch (err) {
      alertMessage(
        'Erro ao validar código',
        'Tente novamente mais tarde',
        'error'
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    handleClickForgotPassword()

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  return (
    <Card className="m-auto mt-44 w-full max-w-md border-0 bg-white text-black shadow-2xl">
      <CardHeader className="bg-linear-purple relative rounded-md py-10 text-center text-white">
        <Button
          type="button"
          onClick={() => {
            setAnalysisSituation(false)
            setShowConfirmPass(false)
          }}
          className="absolute left-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 shadow-md backdrop-blur-sm hover:scale-110"
        >
          <CornerUpLeft className="h-5 w-5 text-white" />
        </Button>

        <CardTitle className="text-3xl font-bold">
          Verifique seu e-mail
        </CardTitle>
        <CardDescription className="text-white/90">
          Digite o código que enviamos para você
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 bg-white pt-8">
        <div className="space-y-3 rounded-xl border border-purple-200/40 bg-gradient-to-br from-purple-50/60 to-purple-100/20 p-4 shadow-lg backdrop-blur-sm animate-in fade-in zoom-in">
          <Label className="text-sm font-medium text-purple-900">
            Código de verificação
          </Label>

          <div className="flex justify-center gap-3">
            {verificationCode.map((_, i) => (
              <Input
                key={i}
                ref={codeRefs[i]}
                maxLength={1}
                inputMode="numeric"
                pattern="[0-9]*"
                className="h-14 w-14 rounded-2xl border border-purple-300/50 bg-white/40 text-center text-2xl font-semibold shadow-inner focus:border-purple-500"
                placeholder="•"
                onChange={(e) => handleCodeChange(i, e)}
              />
            ))}
          </div>

          <p className="text-center text-sm font-medium text-purple-700/80">
            Código enviado para <strong>{email}</strong>
          </p>
        </div>

        <Button
          onClick={() => handleValidateCode()}
          disabled={
            verificationCode.some((digit) => digit === '') && timerForgot > 0
          }
          className="bg-linear-purple h-12 w-full text-white"
        >
          {verificationCode.some((digit) => digit === '') && timerForgot > 0
            ? 'Aguarde...'
            : verificationCode.every((digit) => digit !== '')
              ? 'Validar Código'
              : 'Enviar Código para o E-mail'}
        </Button>

        {timerForgot > 0 && (
          <div className="mt-6 flex items-center justify-center">
            <div className="group flex items-center gap-3 rounded-2xl border border-purple-300/40 bg-gradient-to-r from-purple-50/60 via-white/30 to-purple-50/60 px-6 py-3 shadow-lg backdrop-blur-md transition-all duration-300">
              <Clock className="h-5 w-5 animate-[spin_8s_linear_infinite] text-purple-700 drop-shadow-sm" />

              <div className="flex flex-col">
                <p className="text-xs font-medium text-purple-700/80">
                  Você poderá tentar novamente em:
                </p>

                <p className="animate-[fadeIn_0.6s_ease-out] font-mono text-xl font-bold tracking-widest text-purple-700 drop-shadow-sm">
                  {String(Math.floor(timerForgot / 60)).padStart(2, '0')}:
                  {String(timerForgot % 60).padStart(2, '0')}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ValidatedCodeRegister
