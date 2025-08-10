export type LineItem = {
  id: string
  name: string
  description?: string
  quantity: number
  price: number
  itemDiscount: number
  total: number
}

export type Client = {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
}

export type DiscountTax = {
  type: 'percentage' | 'flat'
  value: number
}

export type TaxInfo = {
  name: string
  value: number
}

export type Estimate = {
  estimateId: string
  title: string
  selectedClient: Client | null
  estimateDate: Date
  expiryDate: Date
  lineItems: LineItem[]
  discount: DiscountTax
  tax: TaxInfo
  shipping: number
  subtotal: number
  total: number
  status: 'draft' | 'sent' | 'accepted' | 'declined'
  createdAt: Date
  updatedAt: Date
}

type Listener = (items: Estimate[]) => void

const store: { items: Estimate[]; listeners: Set<Listener> } = {
  items: [],
  listeners: new Set(),
}

export function getEstimates() {
  return store.items
}

export function addEstimate(e: Estimate) {
  store.items = [e, ...store.items]
  emit()
}

export function updateEstimate(id: string, patch: Partial<Estimate>) {
  store.items = store.items.map((e) => (e.estimateId === id ? { ...e, ...patch, updatedAt: new Date() } : e))
  emit()
}

export function subscribe(listener: Listener) {
  store.listeners.add(listener)
  return () => store.listeners.delete(listener)
}

function emit() {
  for (const l of store.listeners) l(store.items)
}
