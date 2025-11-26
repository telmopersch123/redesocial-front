import { z } from 'zod'
const passwordRegex =
  /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/

export const resetSchema = z
  .object({
    password: z
      .string()
      .min(6, 'A senha precisa ter pelo menos 6 caracteres')
      .regex(
        passwordRegex,
        'A senha deve conter pelo menos um número e um caractere especial'
      ),
    confirmPassword: z
      .string()
      .min(6, 'A senha precisa ter pelo menos 6 caracteres'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword'],
  })

export const forgotPasswordSchema = z.object({
  email: z.email('Insira um email válido'),
})

export const loginSchema = z.object({
  email: z.email('Insira um email valido'),
  password: z
    .string()
    .min(6, 'A senha precisa ter pelo menos 6 caracteres')
    .regex(
      passwordRegex,
      'A senha deve conter pelo menos um número e um caractere especial'
    ),
})

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Nome muito curto'),
    email: z.email('E-mail inválido'),
    password: z
      .string()
      .min(6, 'A senha precisa ter pelo menos 6 caracteres')
      .regex(
        passwordRegex,
        'A senha deve conter pelo menos um número e um caractere especial'
      ),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: 'Você precisa aceitar os termos!',
    }),
    sexo: z.enum(['masculino', 'feminino']).refine((val) => val !== undefined, {
      message: 'Selecione seu sexo',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })
export type ResetFormData = z.infer<typeof resetSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>
