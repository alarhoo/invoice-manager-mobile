export type Client = { id: string; name: string; email: string }

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms))

export type ListClientsParams = {
  limit?: number
  offset?: number
  search?: string
}

export async function listClients(params: ListClientsParams = {}): Promise<{ items: Client[]; nextOffset?: number }> {
  await delay()
  const all: Client[] = [
    { id: 'c1', name: 'Acme Corp', email: 'ops@acme.com' },
    { id: 'c2', name: 'Globex LLC', email: 'hello@globex.com' },
    { id: 'c3', name: 'Initech', email: 'billing@initech.io' },
    { id: 'c4', name: 'Umbrella Co', email: 'contact@umbrella.co' },
    { id: 'c5', name: 'Soylent Inc', email: 'info@soylent.com' },
    { id: 'c6', name: 'Stark Industries', email: 'finance@stark.com' },
    { id: 'c7', name: 'Wayne Enterprises', email: 'admin@wayne.com' },
    { id: 'c8', name: 'Oscorp', email: 'ops@oscorp.com' },
  ]
  const { limit = 20, offset = 0, search } = params
  const filtered = search
    ? all.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()))
    : all
  const slice = filtered.slice(offset, offset + limit)
  const nextOffset = offset + slice.length < filtered.length ? offset + slice.length : undefined
  return { items: slice, nextOffset }
}
