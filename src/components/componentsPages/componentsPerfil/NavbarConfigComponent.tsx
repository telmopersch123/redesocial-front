import { Button } from '../../ui/button'

interface NavbarConfigProps {
  activeId: number
  setActiveId: (id: number) => void
}
const NavbarConfig = ({ activeId, setActiveId }: NavbarConfigProps) => {
  const items = [
    { id: 1, label: 'Usuário', path: '/config/usuario' },
    { id: 2, label: 'Comunidade', path: '/config/comunidade' },
  ]

  return (
    <nav className="flex w-full items-center gap-3 border-b bg-white px-4 py-3">
      {items.map((item) => (
        <Button
          key={item.id}
          onClick={() => setActiveId(item.id)}
          className={`rounded-xl bg-white px-4 py-2 text-sm font-medium transition-all ${
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
