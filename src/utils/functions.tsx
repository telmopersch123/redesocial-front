import type { Persons } from '../types'

export const filter = (
  search: string,
  usuarios: Persons[],
  setValues: React.Dispatch<React.SetStateAction<typeof usuarios>>,
  setEmpty: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (search.trim() === '') {
    setValues(usuarios)
    setEmpty(false)
    return
  }
  const results = usuarios.filter((seguidor) =>
    seguidor.nome.toLowerCase().includes(search.toLowerCase())
  )
  if (results.length === 0) {
    setEmpty(true)
    setValues([])
    return
  }
  setEmpty(false)
  setValues(results)
}
