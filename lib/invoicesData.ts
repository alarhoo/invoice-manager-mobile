export type Invoice = { id: string; clientName: string; amount: number; status: 'Paid' | 'Pending' | 'Overdue' }

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms))

export type ListInvoicesParams = {
  limit?: number
  offset?: number
  status?: 'Paid' | 'Pending' | 'Overdue' | 'All'
  search?: string
}

export async function listInvoices(
  params: ListInvoicesParams = {}
): Promise<{ items: Invoice[]; nextOffset?: number }> {
  await delay()
  const all: Invoice[] = [
    { id: 'INV-1024', clientName: 'Acme Corp', amount: 2500, status: 'Paid' },
    { id: 'INV-1025', clientName: 'Globex LLC', amount: 1800, status: 'Pending' },
    { id: 'INV-1026', clientName: 'Initech', amount: 3200, status: 'Overdue' },
    { id: 'INV-1027', clientName: 'Umbrella Co', amount: 950, status: 'Paid' },
    { id: 'INV-1028', clientName: 'Soylent Inc', amount: 1200, status: 'Pending' },
    { id: 'INV-1029', clientName: 'Stark Industries', amount: 4950, status: 'Paid' },
    { id: 'INV-1030', clientName: 'Wayne Enterprises', amount: 2220, status: 'Overdue' },
    { id: 'INV-1031', clientName: 'Oscorp', amount: 1330, status: 'Pending' },
  ]
  const { limit = 20, offset = 0, status = 'All', search } = params
  let filtered = all
  if (status !== 'All') filtered = filtered.filter((i) => i.status === status)
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (i) => i.id.toLowerCase().includes(q) || i.clientName.toLowerCase().includes(q) || String(i.amount).includes(q)
    )
  }
  const slice = filtered.slice(offset, offset + limit)
  const nextOffset = offset + slice.length < filtered.length ? offset + slice.length : undefined
  return { items: slice, nextOffset }
}
