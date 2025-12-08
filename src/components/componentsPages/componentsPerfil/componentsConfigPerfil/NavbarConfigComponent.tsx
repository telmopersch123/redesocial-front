import { Button } from '../../../ui/button'

interface NavbarConfigProps {
  activeId: number
  setActiveId: (id: number) => void
}
const NavbarConfig = ({ activeId, setActiveId }: NavbarConfigProps) => {
  const items = [
    { id: 1, label: 'Usuário' },
    { id: 2, label: 'Comunidade' },
    { id: 3, label: 'Atividade' },
  ]

  return (
    <nav className="flex w-full flex-wrap items-center justify-center gap-2 border-b py-4">
      {items.map((item) => (
        <Button
          key={item.id}
          onClick={() => setActiveId(item.id)}
          className={`w-[calc(90%/3)] justify-center rounded-xl px-12 py-2 text-sm font-medium transition-all hover:bg-transparent ${
            activeId === item.id
              ? 'bg-linear-purple text-white shadow-md'
              : 'bg-transparent text-black hover:!text-purple-600 dark:text-white'
          }`}
        >
          {item.label}
        </Button>
      ))}
    </nav>
  )
}

export default NavbarConfig
