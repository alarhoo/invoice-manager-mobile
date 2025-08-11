export type KPIs = {
  totalInvoices: number
  pendingInvoices: number
  totalOverdueAmount: number
  totalSalesAmount: number
  totalClients: number
  totalItems: number
}

export type SalesRange = 'week' | 'month' | 'year'

export type SalesSeries = {
  labels: string[]
  values: number[]
}

export type ClientSummary = { id: string; name: string; email: string }
export type InvoiceSummary = { id: string; clientName: string; amount: number; status: 'Paid' | 'Pending' | 'Overdue' }

// Simulate network delay
const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms))

export async function getKPIs(): Promise<KPIs> {
  await delay()
  // Replace with real API call; shape kept stable for easy swap
  return {
    totalInvoices: 124,
    pendingInvoices: 17,
    totalOverdueAmount: 4820.5,
    totalSalesAmount: 253_410.25,
    totalClients: 86,
    totalItems: 142,
  }
}

export async function getSalesTrend(range: SalesRange): Promise<SalesSeries> {
  await delay()
  // Demo data generator; replace with API response mapping
  if (range === 'week') {
    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      values: [1200, 980, 1520, 1780, 940, 760, 1330],
    }
  }
  if (range === 'month') {
    return {
      labels: Array.from({ length: 12 }, (_, i) => `${i + 1}`),
      values: [
        5400, 7200, 6300, 8100, 9400, 10500, 9900, 11200, 12300, 11800, 13100, 12500,
      ],
    }
  }
  // year
  return {
    labels: ['2021', '2022', '2023', '2024', '2025'],
    values: [152000, 171500, 189300, 214000, 226800],
  }
}

export async function getRecentClients(limit = 5): Promise<ClientSummary[]> {
  await delay()
  const all: ClientSummary[] = [
    { id: 'c1', name: 'Acme Corp', email: 'ops@acme.com' },
    { id: 'c2', name: 'Globex LLC', email: 'hello@globex.com' },
    { id: 'c3', name: 'Initech', email: 'billing@initech.io' },
    { id: 'c4', name: 'Umbrella Co', email: 'contact@umbrella.co' },
    { id: 'c5', name: 'Soylent Inc', email: 'info@soylent.com' },
    { id: 'c6', name: 'Stark Industries', email: 'finance@stark.com' },
  ]
  return all.slice(0, limit)
}

export async function getRecentInvoices(limit = 5): Promise<InvoiceSummary[]> {
  await delay()
  const all: InvoiceSummary[] = [
    { id: 'INV-1024', clientName: 'Acme Corp', amount: 2500, status: 'Paid' },
    { id: 'INV-1025', clientName: 'Globex LLC', amount: 1800, status: 'Pending' },
    { id: 'INV-1026', clientName: 'Initech', amount: 3200, status: 'Overdue' },
    { id: 'INV-1027', clientName: 'Umbrella Co', amount: 950, status: 'Paid' },
    { id: 'INV-1028', clientName: 'Soylent Inc', amount: 1200, status: 'Pending' },
    { id: 'INV-1029', clientName: 'Stark Industries', amount: 4950, status: 'Paid' },
  ]
  return all.slice(0, limit)
}

export function formatCurrency(amount: number): string {
  // Keep consistent formatting; swap to Intl.NumberFormat if locale-specific needed
  return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
