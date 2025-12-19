export async function logoutUser(): Promise<boolean> {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
    return res.ok
  } catch (err) {
    console.error('Erro ao deslogar:', err)
    return false
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      credentials: 'include', // envia o cookie HTTP-only
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) throw new Error('Credenciais inválidas')

    const data = await res.json()
    return data.user // já retorna só o usuário
  } catch (err) {
    console.error(err)
    return null
  }
}
