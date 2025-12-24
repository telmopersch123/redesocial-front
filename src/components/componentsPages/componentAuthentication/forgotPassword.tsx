import { zodResolver } from '@hookform/resolvers/zod'
import { Clock, CornerUpLeft } from 'lucide-react'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useResetPassword } from '../../../context/ResetPasswordContext'
import {
  forgotPasswordSchema,
  type ForgotPasswordData,
} from '../../../lib/validatorSchemas/autoSchemaAutenticator'
import { sendCodigoToEmail, valided_code } from '../../../services/authService'
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

interface ForgotPasswordProps {
  setForgotPassword: React.Dispatch<React.SetStateAction<boolean>>
  setPermissionCode: React.Dispatch<React.SetStateAction<boolean>>
}

const ForgotPassword = ({
  setForgotPassword,
  setPermissionCode,
}: ForgotPasswordProps) => {
  const [timerForgot, setTimerForgot] = useState<number>(0)
  const [hiddenCode, setHiddenCode] = useState<boolean>(false)
  const [verificationCode, setVerificationCode] = useState(['', '', '', ''])
  const timerRef = useRef<number | null>(null)
  const { setEmail, setCode, setIsLoading } = useResetPassword()
  const [showMessage, setShowMessage] = useState<boolean>(false)

  const codeRefs = Array.from({ length: 6 }, () =>
    useRef<HTMLInputElement>(null)
  )
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const handleCodeChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value

    const newCode = [...verificationCode]
    newCode[index] = value
    setVerificationCode(newCode)

    if (value.length === 1 && index < 5) {
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

  async function onSubmit(data: ForgotPasswordData) {
    const codeStr = verificationCode.join('')
    if (codeStr.length < 6) {
      if (timerForgot === 0) {
        await sendCodigoToEmail(data.email)
        handleClickForgotPassword()
        setEmail(data.email)
        setHiddenCode(true)
        setShowMessage(false)
      }
      return
    }
    try {
      setIsLoading(true)
      const result = await valided_code(data.email, codeStr)

      if (result) {
        setCode(codeStr)
        setPermissionCode(true)
      } else {
        setPermissionCode(false)

        alertMessage(
          ' Código inválido',
          '  Verifique seu e-mail, enviamos um código para você.',
          'error'
        )
      }
    } catch (error) {
      console.log(error)
      alertMessage(
        'Algo deu errado. Por favor, tente novamente mais tarde',
        null,
        'error'
      )
      setIsLoading(false)
      setPermissionCode(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="m-auto mt-44 w-full max-w-md border-0 bg-white text-black shadow-2xl">
      <CardHeader className="bg-linear-purple relative rounded-md py-10 text-center text-white">
        <Button
          type="button"
          onClick={() => setForgotPassword(false)}
          className="absolute left-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/20"
        >
          <CornerUpLeft className="h-5 w-5 text-white" />
        </Button>
        <CardTitle className="text-3xl font-bold">Recuperar senha</CardTitle>
        <CardDescription className="text-white/90">
          Digite seu e-mail para receber instruções de redefinição
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6 bg-white pt-8">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              {...register('email')}
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="h-12"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          {hiddenCode ? (
            <div className="space-y-3 rounded-xl border border-purple-200/40 bg-gradient-to-br from-purple-50/60 to-purple-100/20 p-4 shadow-lg shadow-purple-200/20 backdrop-blur-sm duration-300 animate-in fade-in zoom-in">
              <Label
                htmlFor="code"
                className="text-sm font-medium tracking-wide text-purple-900"
              >
                Código de verificação
              </Label>

              <div className="flex justify-center gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Input
                    key={i}
                    ref={codeRefs[i]}
                    maxLength={1}
                    className="h-14 w-14 rounded-2xl border border-purple-300/50 bg-white/40 text-center text-2xl font-semibold tracking-wider shadow-inner shadow-purple-200/40 backdrop-blur-sm transition-all duration-200 focus:border-purple-500 focus:bg-white focus:shadow-purple-300/60 focus:ring-purple-500"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="•"
                    onChange={(e) => handleCodeChange(i, e)}
                  />
                ))}
              </div>

              <p className="text-center text-sm font-medium text-purple-700/80">
                Um código foi enviado para o seu e-mail.
              </p>
            </div>
          ) : (
            <>
              {showMessage && (
                <div className="rounded-xl border border-purple-300/40 bg-gradient-to-br from-purple-50/60 to-purple-100/20 p-4 shadow-lg shadow-purple-200/20 backdrop-blur-sm animate-in fade-in zoom-in">
                  <p className="text-center text-sm font-medium text-purple-900 sm:text-base">
                    Enviaremos um código de verificação para o seu e-mail.
                  </p>
                </div>
              )}
            </>
          )}

          <Button
            type="submit"
            onClick={() => setShowMessage(true)}
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
      </form>
    </Card>
  )
}

export default ForgotPassword
