import { BadgeCheck } from 'lucide-react'

interface PasswordRequirementsProps {
  password: string
  focusPassword: boolean
  hasNumber: (value: string) => boolean
  hasSpecialChar: (value: string) => boolean
  hasMinLength: (value: string) => boolean
}

export const PasswordRequirements = ({
  password,
  focusPassword,
  hasNumber,
  hasSpecialChar,
  hasMinLength,
}: PasswordRequirementsProps) => {
  return (
    <div
      className={`pointer-events-none transition-all duration-200 ${
        focusPassword ? '!mb-5 h-20 opacity-100' : 'h-0 opacity-0'
      }`}
    >
      <p className="flex items-center gap-1 text-sm text-muted-foreground">
        <BadgeCheck
          className={`h-5 w-5 text-green-500 transition-all duration-100 ${
            hasNumber(password) ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
        />
        Contém número
      </p>

      <p className="flex items-center gap-1 text-sm text-muted-foreground">
        <BadgeCheck
          className={`h-5 w-5 text-green-500 transition-all duration-300 ${
            hasSpecialChar(password)
              ? 'scale-100 opacity-100'
              : 'scale-50 opacity-0'
          }`}
        />
        Contém caractere especial
      </p>

      <p className="flex items-center gap-1 text-sm text-muted-foreground">
        <BadgeCheck
          className={`h-5 w-5 text-green-500 transition-all duration-300 ${
            hasMinLength(password)
              ? 'scale-100 opacity-100'
              : 'scale-50 opacity-0'
          }`}
        />
        Mínimo de 6 caracteres
      </p>
    </div>
  )
}
