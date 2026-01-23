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
  rememberMe: z.boolean().optional(),
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

export const createCommunitySchema = z.object({
  nameComunity: z
    .string()
    .min(10, 'Nome muito curto, escreva pelo menos 10 caracteres')
    .max(50, 'Nome muito longo'),
  description: z
    .string()
    .min(50, 'Descrição muito curta, escreva pelo menos 50 caracteres')
    .max(256, 'Descrição muito longa'),
  category: z.string().min(1, 'Selecione uma categoria'),
  limit: z.number().min(10).max(999),
  whoCanPost: z.enum(['members', 'admins']),
  whoCanComment: z.enum(['members', 'admins']),
  isPrivate: z.boolean(),
  image: z.string().nullable().optional(),
  rules: z.string().max(256).nullable().optional(),
})

export const configCommunitySchema = z.object({
  image: z.string().nullable().optional(),
  nameComunity: z
    .string()
    .min(10, 'Nome muito curto, escreva pelo menos 10 caracteres')
    .max(50, 'Nome muito longo'),
  description: z
    .string()
    .min(50, 'Descrição muito curta, escreva pelo menos 50 caracteres')
    .max(256, 'Descrição muito longa'),
  category: z.string().min(1, 'Selecione uma categoria'),
  whoCanPost: z.enum(['members', 'admins']).optional(),
  whoCanComment: z.enum(['members', 'admins']).optional(),
  limit: z.number().min(10).max(999).optional(),
  rules: z.string().max(256).nullable().optional(),
  isPrivate: z.boolean().optional(),
})

export const postDialogSchema = z
  .object({
    feeling: z.string().min(1, 'Selecione um sentimento'),
    description: z
      .string()
      .min(10, 'Descrição muito curta, escreva pelo menos 10 caracteres')
      .max(5000, 'Descrição muito longa'),
    tags: z
      .array(z.string().min(1))
      .max(10, 'Você pode adicionar no máximo 10 tags')
      .optional(),
    media: z
      .object({
        url: z.string().refine(
          (val) => {
            try {
              new URL(val)
              return true
            } catch {
              return false
            }
          },
          { message: 'URL de mídia inválida' }
        ),
        type: z.enum(['image', 'video']),
      })
      .optional()
      .nullable(),

    destination: z
      .object({
        type: z.enum(['geral', 'comunidade']),
        communityId: z.number().int().positive().nullable().optional(),
      })
      .optional(),
    anonymous: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    // regra condicional: se for comunidade, precisa de communityId
    if (
      data.destination?.type === 'comunidade' &&
      !data.destination.communityId
    ) {
      ctx.addIssue({
        path: ['destination', 'communityId'],
        message: 'Selecione uma comunidade',
        code: 'custom',
      })
    }
  })

export const usernameSchema = z.object({
  name_at: z
    .string()
    .min(3, 'O nome de usuário deve ter pelo menos 3 caracteres')
    .max(20, 'O nome de usuário pode ter no máximo 20 caracteres')
    .regex(
      /^[a-zA-Z][a-zA-Z0-9._]*$/,
      'Use apenas letras, números, ponto (.) ou underline (_), começando com letra'
    ),
})

export type UsernameFormData = z.infer<typeof usernameSchema>
export type PostDialogSchema = z.infer<typeof postDialogSchema>
export type CreateCommunityFormData = z.infer<typeof createCommunitySchema>
export type ConfigCommunityFormData = z.infer<typeof configCommunitySchema>
export type ResetFormData = z.infer<typeof resetSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>
