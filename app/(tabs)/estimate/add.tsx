import type { Estimate, LineItem } from '@/lib/estimatesStore'
import { addEstimate } from '@/lib/estimatesStore'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, Platform, ScrollView, View } from 'react-native'
import { Button, Card, Dialog, Divider, IconButton, List, Portal, Text, TextInput } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const AddEstimate = () => {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const params = useLocalSearchParams()

  const init = (): Estimate => ({
    estimateId: `EST-${Date.now()}`,
    title: '',
    selectedClient: null,
    estimateDate: new Date(),
    expiryDate: new Date(),
    lineItems: [],
    discount: { type: 'flat', value: 0 },
    tax: { name: '', value: 0 },
    shipping: 0,
    subtotal: 0,
    total: 0,
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  const [draft, setDraft] = useState<Estimate>(init)
  const [showEstimateDatePicker, setShowEstimateDatePicker] = useState(false)
  const [showExpiryDatePicker, setShowExpiryDatePicker] = useState(false)
  const [discountDialogVisible, setDiscountDialogVisible] = useState(false)
  const [taxDialogVisible, setTaxDialogVisible] = useState(false)
  const [shippingDialogVisible, setShippingDialogVisible] = useState(false)
  const [tempDiscountType, setTempDiscountType] = useState<'percentage' | 'flat'>('flat')
  const [tempDiscountValue, setTempDiscountValue] = useState('')
  const [tempTaxName, setTempTaxName] = useState('')
  const [tempTaxValue, setTempTaxValue] = useState('')
  const [tempShippingValue, setTempShippingValue] = useState('')

  const update = (patch: Partial<Estimate>) =>
    setDraft((prev) => {
      const updated = { ...prev, ...patch, updatedAt: new Date() }
      const subtotal = updated.lineItems.reduce((s, li) => s + li.total, 0)
      const discountAmount =
        updated.discount.type === 'percentage' ? (subtotal * updated.discount.value) / 100 : updated.discount.value
      const taxAmount = ((subtotal - discountAmount) * updated.tax.value) / 100
      const total = subtotal - discountAmount + taxAmount + updated.shipping
      return { ...updated, subtotal, total }
    })

  useEffect(() => {
    if (params.selectedClient && typeof params.selectedClient === 'string') {
      try {
        const client = JSON.parse(params.selectedClient as string)
        update({ selectedClient: client })
      } catch {}
    }
  }, [params.selectedClient])

  useEffect(() => {
    if (params.selectedItem && typeof params.selectedItem === 'string' && params.itemTimestamp) {
      try {
        const item = JSON.parse(params.selectedItem as string)
        const li: LineItem = {
          id: `item-${Date.now()}`,
          name: item.name,
          description: item.description,
          quantity: 1,
          price: item.price,
          itemDiscount: 0,
          total: item.price,
        }
        setDraft((prev) => ({ ...prev, lineItems: [...prev.lineItems, li], updatedAt: new Date() }))
      } catch {}
    }
  }, [params.selectedItem, params.itemTimestamp])

  const updateLI = (id: string, field: keyof LineItem, value: any) => {
    const next = draft.lineItems.map((li) => {
      if (li.id !== id) return li
      const upd = { ...li, [field]: value }
      const qty = upd.quantity || 0
      const price = upd.price || 0
      const disc = upd.itemDiscount || 0
      upd.total = qty * price - disc
      return upd
    })
    update({ lineItems: next })
  }

  const removeLI = (id: string) => update({ lineItems: draft.lineItems.filter((li) => li.id !== id) })

  const formatCurrency = (n: number) => `$${n.toFixed(2)}`
  const formatDate = (d: Date) => d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })

  const save = () => {
    if (!draft.selectedClient) return Alert.alert('Validation', 'Please select a client')
    if (!draft.title.trim()) return Alert.alert('Validation', 'Please enter an estimate title')
    if (draft.lineItems.length === 0) return Alert.alert('Validation', 'Please add at least one item')
    addEstimate(draft)
    router.back()
  }

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
      <Stack.Screen options={{ title: 'New Estimate', headerBackTitle: 'Back' }} />

      {/* Client & Title */}
      <Card style={{ marginBottom: 12 }}>
        <Card.Content>
          <TextInput
            label='Estimate title'
            value={draft.title}
            onChangeText={(v) => update({ title: v })}
            style={{ marginBottom: 12 }}
          />
          <List.Item
            title={draft.selectedClient ? draft.selectedClient.name : 'Select a client'}
            description={draft.selectedClient?.email || undefined}
            left={(p) => <List.Icon {...p} icon='account' />}
            right={(p) => <IconButton {...p} icon='chevron-right' />}
            onPress={() => router.push('/clients/select')}
          />
        </Card.Content>
      </Card>

      {/* Dates */}
      <Card style={{ marginBottom: 12 }}>
        <Card.Content>
          <List.Item
            title='Estimate date'
            description={formatDate(draft.estimateDate)}
            left={(p) => <List.Icon {...p} icon='calendar' />}
            right={(p) => <IconButton {...p} icon='pencil' onPress={() => setShowEstimateDatePicker(true)} />}
          />
          <Divider />
          <List.Item
            title='Expiry date'
            description={formatDate(draft.expiryDate)}
            left={(p) => <List.Icon {...p} icon='calendar-alert' />}
            right={(p) => <IconButton {...p} icon='pencil' onPress={() => setShowExpiryDatePicker(true)} />}
          />
        </Card.Content>
      </Card>

      {showEstimateDatePicker && (
        <DateTimePicker
          value={draft.estimateDate}
          mode='date'
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, selectedDate) => {
            setShowEstimateDatePicker(false)
            if (selectedDate) update({ estimateDate: selectedDate })
          }}
        />
      )}

      {showExpiryDatePicker && (
        <DateTimePicker
          value={draft.expiryDate}
          mode='date'
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, selectedDate) => {
            setShowExpiryDatePicker(false)
            if (selectedDate) update({ expiryDate: selectedDate })
          }}
        />
      )}

      {/* Line items */}
      <Card style={{ marginBottom: 12 }}>
        <Card.Title
          title='Items'
          right={(p) => <IconButton {...p} icon='plus' onPress={() => router.push('/items/select')} />}
        />
        <Card.Content>
          {draft.lineItems.map((li) => (
            <View key={li.id}>
              <List.Item
                title={li.name}
                description={`${li.quantity} × ${formatCurrency(li.price)}`}
                left={(p) => <List.Icon {...p} icon='cube-outline' />}
                right={(p) => (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text>{formatCurrency(li.total)}</Text>
                    <IconButton icon='delete' onPress={() => removeLI(li.id)} />
                  </View>
                )}
              />
              <View style={{ marginLeft: 16, marginBottom: 8 }}>
                <TextInput
                  label='Quantity'
                  keyboardType='numeric'
                  value={String(li.quantity)}
                  onChangeText={(v) => updateLI(li.id, 'quantity', parseFloat(v) || 0)}
                />
                <TextInput
                  label='Price'
                  keyboardType='numeric'
                  value={String(li.price)}
                  onChangeText={(v) => updateLI(li.id, 'price', parseFloat(v) || 0)}
                  style={{ marginTop: 8 }}
                />
                <TextInput
                  label='Item discount'
                  keyboardType='numeric'
                  value={String(li.itemDiscount)}
                  onChangeText={(v) => updateLI(li.id, 'itemDiscount', parseFloat(v) || 0)}
                  style={{ marginTop: 8 }}
                />
              </View>
              <Divider />
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Summary / modifiers */}
      <Card>
        <Card.Content>
          <List.Item
            title='Discount'
            description={draft.discount.type === 'percentage' ? `${draft.discount.value}%` : `$${draft.discount.value}`}
            left={(p) => <List.Icon {...p} icon='tag' />}
            right={(p) => <IconButton {...p} icon='pencil' onPress={() => setDiscountDialogVisible(true)} />}
          />
          <Divider />
          <List.Item
            title='Tax'
            description={draft.tax.name ? `${draft.tax.name} (${draft.tax.value}%)` : `${draft.tax.value}%`}
            left={(p) => <List.Icon {...p} icon='percent' />}
            right={(p) => <IconButton {...p} icon='pencil' onPress={() => setTaxDialogVisible(true)} />}
          />
          <Divider />
          <List.Item
            title='Shipping'
            description={`$${draft.shipping}`}
            left={(p) => <List.Icon {...p} icon='truck' />}
            right={(p) => <IconButton {...p} icon='pencil' onPress={() => setShippingDialogVisible(true)} />}
          />
          <Divider />
          <List.Item title='Subtotal' right={() => <Text>{`$${draft.subtotal.toFixed(2)}`}</Text>} />
          <List.Item title='Total' right={() => <Text>{`$${draft.total.toFixed(2)}`}</Text>} />
        </Card.Content>
      </Card>

      <View style={{ height: 16 }} />
      <Button mode='contained' onPress={save}>
        Save Estimate
      </Button>

      {/* Discount dialog */}
      <Portal>
        <Dialog visible={discountDialogVisible} onDismiss={() => setDiscountDialogVisible(false)}>
          <Dialog.Title>Discount</Dialog.Title>
          <Dialog.Content>
            <List.Item
              title='Type'
              description={tempDiscountType}
              left={(p) => <List.Icon {...p} icon='tune' />}
              right={() => (
                <View style={{ flexDirection: 'row' }}>
                  <Button
                    mode={tempDiscountType === 'flat' ? 'contained' : 'text'}
                    onPress={() => setTempDiscountType('flat')}
                  >
                    $
                  </Button>
                  <Button
                    mode={tempDiscountType === 'percentage' ? 'contained' : 'text'}
                    onPress={() => setTempDiscountType('percentage')}
                  >
                    %
                  </Button>
                </View>
              )}
            />
            <TextInput
              label='Value'
              keyboardType='numeric'
              value={tempDiscountValue}
              onChangeText={setTempDiscountValue}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDiscountDialogVisible(false)}>Cancel</Button>
            <Button
              onPress={() => {
                update({ discount: { type: tempDiscountType, value: parseFloat(tempDiscountValue) || 0 } })
                setDiscountDialogVisible(false)
                setTempDiscountValue('')
              }}
            >
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>

        {/* Tax */}
        <Dialog visible={taxDialogVisible} onDismiss={() => setTaxDialogVisible(false)}>
          <Dialog.Title>Tax</Dialog.Title>
          <Dialog.Content>
            <TextInput label='Name' value={tempTaxName} onChangeText={setTempTaxName} />
            <TextInput label='Value (%)' keyboardType='numeric' value={tempTaxValue} onChangeText={setTempTaxValue} />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setTaxDialogVisible(false)}>Cancel</Button>
            <Button
              onPress={() => {
                update({ tax: { name: tempTaxName, value: parseFloat(tempTaxValue) || 0 } })
                setTaxDialogVisible(false)
                setTempTaxName('')
                setTempTaxValue('')
              }}
            >
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>

        {/* Shipping */}
        <Dialog visible={shippingDialogVisible} onDismiss={() => setShippingDialogVisible(false)}>
          <Dialog.Title>Shipping</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label='Amount'
              keyboardType='numeric'
              value={tempShippingValue}
              onChangeText={setTempShippingValue}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShippingDialogVisible(false)}>Cancel</Button>
            <Button
              onPress={() => {
                update({ shipping: parseFloat(tempShippingValue) || 0 })
                setShippingDialogVisible(false)
                setTempShippingValue('')
              }}
            >
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  )
}

export default AddEstimate
