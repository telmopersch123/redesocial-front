import type { ListaMencoes } from '../types'

const escapeHTML = (str: string) =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

export const formatMentions = (text: string, mencoes: ListaMencoes = []) => {
  if (!text) return ''
  const safe = escapeHTML(text)
  const listaValidada = mencoes?.map((m) => {
    if ('user' in m) {
      return {
        id: m.user.id,
        name_at: m.user.name_at,
      }
    }
    return m
  })

  return safe.replace(/@[\w._-]+/g, (match) => {
    const username = match.slice(1)
    const usuarioReal = listaValidada.find((u) => u.name_at === username)

    if (usuarioReal) {
      return `<a href="/usuarios/perfil/${usuarioReal.id}" class="text-purple-600 font-bold underline">@${username}</a>`
    }

    return match
  })
}
