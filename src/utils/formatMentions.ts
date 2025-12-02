import { usuariosMentions } from '../context/openMentions'

const escapeHTML = (str: string) =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
export const formatMentions = (text: string, userId: number) => {
  const safe = escapeHTML(text)

  return safe.replace(/@[\w._-]+/g, (match) => {
    const username = match.slice(1)

    if (usuariosMentions.includes(username)) {
      return `<a href="/usuarios/perfil/${userId}" class="text-purple-600 underline">@${username}</a>`
    }

    return match
  })
}
