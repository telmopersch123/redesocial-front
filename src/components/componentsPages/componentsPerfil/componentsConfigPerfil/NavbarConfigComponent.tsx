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
    <nav className="flex w-full flex-wrap items-center justify-center gap-2 border-b bg-white py-4">
      {items.map((item) => (
        <Button
          key={item.id}
          onClick={() => setActiveId(item.id)}
          className={`w-[calc(90%/3)] justify-center rounded-xl bg-white px-12 py-2 text-sm font-medium transition-all ${
            activeId === item.id
              ? 'bg-linear-purple text-white shadow-md'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
          } `}
        >
          {item.label}
        </Button>
      ))}
    </nav>
  )
}

export default NavbarConfig
