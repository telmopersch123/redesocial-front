import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Lock, ShieldAlert, UserCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form'
import { Input } from '../../components/ui/input'
import { useAdminAuth } from '../../context/getad'
import {
  adminLoginSchema,
  type AdminLoginFormData,
} from '../../lib/validatorSchemas/autoSchemaAutenticator'
import { MessagePerson } from '../../utils/components/MessagePerson'

export default function AnalysisLogin() {
  const [loadingLogin, setLoadingLogin] = useState(false)
  const navigate = useNavigate()
  const { admin, loading, refreshAdmin } = useAdminAuth()

  const form = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  useEffect(() => {
    if (!loading && admin) {
      navigate('/analysis', { replace: true })
    }
  }, [admin, loading, navigate])

  const onSubmit = async (data: AdminLoginFormData) => {
    setLoadingLogin(true)
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/analysis/login`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: data.username,
            password: data.password,
          }),
        }
      )
      if (!res.ok) {
        MessagePerson(
          'Erro ao autenticar',
          ' verifique suas credenciais e tente novamente.',
          'error'
        )
        return
      }

      if (refreshAdmin) await refreshAdmin()
      navigate('/analysis', { replace: true })
    } catch (error) {
      console.error('Erro ao autenticar:', error)
    } finally {
      setLoadingLogin(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        <span className="ml-3">Verificando autenticação...</span>
      </div>
    )
  }
  if (admin) return null

  return (
    <>
      {loadingLogin && (
        <div>
          <div className="fixed inset-0 z-50 flex items-center justify-center rounded-2xl bg-white/50 backdrop-blur-[1px] transition-all dark:bg-zinc-950/50">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      )}
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="max-w-md border-t-4 border-t-blue-600 shadow-2xl sm:w-[600px]">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <ShieldAlert className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Suporte</CardTitle>
            <CardDescription className="hidden"></CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4" /> Identificador
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="••••••••"
                          className="bg-slate-50 dark:bg-white/5"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Campo Senha (Mascarado) */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Lock className="h-4 w-4" /> Chave de Acesso
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password" // Mascara a senha
                          placeholder="••••••••"
                          className="bg-slate-50 dark:bg-white/5"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-blue-600 py-6 text-lg font-bold text-white transition-all hover:bg-blue-700 active:scale-[0.98]"
                >
                  Autenticar no Painel
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
