import type { TypeFriend } from '../types'

export const filter = (
  search: string,
  myFriends: TypeFriend[],
  setValues: React.Dispatch<React.SetStateAction<typeof myFriends>>,
  setEmpty: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (search.trim() === '') {
    setValues(myFriends)
    setEmpty(false)
    return
  }
  const results = myFriends.filter((amigo) =>
    amigo.name_at.toLowerCase().includes(search.toLowerCase())
  )
  if (results.length === 0) {
    setEmpty(true)
    setValues([])
    return
  }
  setEmpty(false)
  setValues(results)
}

export const formatDateTime = (date: Date | string) => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}
