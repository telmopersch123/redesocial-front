import { Crown, Shield } from 'lucide-react'
import ShowCommunityDialog from './ShowConfigCommunityDialog'

const OptionsCommunity = () => {
  const communities = [
    {
      id: 1,
      name: 'Dev Fullstack Brasil',
      role: 'Owner',
      image:
        'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&w=300&q=80',
    },
    {
      id: 2,
      name: 'UX & UI Designers',
      role: 'Moderator',
      image:
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&w=300&q=80',
    },
    {
      id: 3,
      name: 'Gamers e eSports',
      role: 'Moderator',
      image:
        'https://images.unsplash.com/photo-1626379446070-41d6523be57f?auto=format&w=300&q=80',
    },
  ]

  return (
    <div className="mt-4 flex flex-col gap-4">
      {communities.map((c) => (
        <div
          key={c.id}
          className="flex items-center gap-4 rounded-xl border bg-white p-3 shadow-sm transition-all hover:shadow-md"
        >
          {/* Avatar da comunidade */}
          <img
            src={c.image}
            alt={c.name}
            className="h-14 w-14 rounded-full object-cover"
          />
          <div className="flex flex-1 flex-col">
            <h3 className="font-semibold text-foreground">{c.name}</h3>

            {/* Dono / Moderador */}
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              {c.role === 'Owner' ? (
                <>
                  <Crown size={14} className="text-yellow-500" />
                  <span>Dono da comunidade</span>
                </>
              ) : (
                <>
                  <Shield size={14} className="text-purple-500" />
                  <span>Moderador</span>
                </>
              )}
            </span>
          </div>

          <ShowCommunityDialog />
        </div>
      ))}
    </div>
  )
}

export default OptionsCommunity
