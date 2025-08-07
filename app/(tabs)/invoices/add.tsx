import DateTimePicker from '@react-native-community/datetimepicker'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ActionSheetIOS, Alert, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { ImagePickerResponse, launchCamera, launchImageLibrary, MediaType } from 'react-native-image-picker'
import { Button, Card, Dialog, Divider, IconButton, List, Menu, Portal, Text, TextInput } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface LineItem {
  id: string
  name: string
  description: string
  quantity: number
  price: number
  itemDiscount: number
  total: number
}

interface DiscountTax {
  type: 'percentage' | 'flat'
  value: number
}

const InvoiceAdd = () => {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  // Form state
  const [invoiceId, setInvoiceId] = useState(`INV-${Date.now()}`) // Auto-generated
  const [invoiceTitle, setInvoiceTitle] = useState('')
  const [selectedClient, setSelectedClient] = useState<any>(null) // Changed to object

  // Date pickers
  const [invoiceDate, setInvoiceDate] = useState(new Date())
  const [dueDate, setDueDate] = useState(new Date())
  const [showInvoiceDatePicker, setShowInvoiceDatePicker] = useState(false)
  const [showDueDatePicker, setShowDueDatePicker] = useState(false) // Line items
  const [lineItems, setLineItems] = useState<LineItem[]>([])

  // Payment details
  const [discount, setDiscount] = useState<DiscountTax>({ type: 'flat', value: 0 })
  const [tax, setTax] = useState<{ name: string; value: number }>({ name: '', value: 0 })
  const [shipping, setShipping] = useState(0)

  // Dialog states
  const [discountDialogVisible, setDiscountDialogVisible] = useState(false)
  const [taxDialogVisible, setTaxDialogVisible] = useState(false)
  const [shippingDialogVisible, setShippingDialogVisible] = useState(false)
  const [discountTypeMenuVisible, setDiscountTypeMenuVisible] = useState(false)
  const [tempDiscountType, setTempDiscountType] = useState<'percentage' | 'flat'>('flat')
  const [tempDiscountValue, setTempDiscountValue] = useState('')
  const [tempTaxName, setTempTaxName] = useState('')
  const [tempTaxValue, setTempTaxValue] = useState('')
  const [tempShippingValue, setTempShippingValue] = useState('') // Attachments
  const [attachments, setAttachments] = useState<string[]>([])

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id))
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }

          // Recalculate total
          const qty = updatedItem.quantity || 0
          const price = updatedItem.price || 0
          const itemDiscount = updatedItem.itemDiscount || 0
          updatedItem.total = qty * price - itemDiscount

          return updatedItem
        }
        return item
      })
    )
  }

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + item.total, 0)
  }

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal()
    if (discount.type === 'percentage') {
      return (subtotal * discount.value) / 100
    }
    return discount.value
  }

  const calculateTax = () => {
    const subtotal = calculateSubtotal()
    const discountAmount = calculateDiscount()
    const taxableAmount = subtotal - discountAmount
    return (taxableAmount * tax.value) / 100
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const discountAmount = calculateDiscount()
    const taxAmount = calculateTax()
    return subtotal - discountAmount + taxAmount + shipping
  }

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const handleAddItems = () => {
    router.push('/items')
  }

  const handleSelectClient = () => {
    // Navigate to client selection screen
    router.push('/clients/select')
  }

  const handleDiscountSave = () => {
    setDiscount({
      type: tempDiscountType,
      value: parseFloat(tempDiscountValue) || 0,
    })
    setDiscountDialogVisible(false)
    setTempDiscountValue('')
  }

  const handleTaxSave = () => {
    setTax({
      name: tempTaxName,
      value: parseFloat(tempTaxValue) || 0,
    })
    setTaxDialogVisible(false)
    setTempTaxName('')
    setTempTaxValue('')
  }

  const handleShippingSave = () => {
    setShipping(parseFloat(tempShippingValue) || 0)
    setShippingDialogVisible(false)
    setTempShippingValue('')
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const handleAttachFiles = () => {
    const showActionSheet = () => {
      if (Platform.OS === 'ios') {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ['Cancel', 'Choose Photos/Videos', 'Take Photo'],
            cancelButtonIndex: 0,
          },
          (buttonIndex) => {
            if (buttonIndex === 1) {
              openImageLibrary()
            } else if (buttonIndex === 2) {
              openCamera()
            }
          }
        )
      } else {
        // For Android, show alert dialog
        Alert.alert('Select Files', 'Choose the type of file to attach', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Photos/Videos', onPress: openImageLibrary },
          { text: 'Take Photo', onPress: openCamera },
        ])
      }
    }

    const openImageLibrary = () => {
      const options = {
        mediaType: 'mixed' as MediaType,
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
        quality: 0.8,
        selectionLimit: 5,
      }

      launchImageLibrary(options, handleImageResponse)
    }

    const openCamera = () => {
      const options = {
        mediaType: 'mixed' as MediaType,
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
        quality: 0.8,
      }

      launchCamera(options, handleImageResponse)
    }

    const handleImageResponse = (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled file picker')
        return
      }

      if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage)
        Alert.alert('Error', 'Failed to select files. Please try again.')
        return
      }

      if (response.assets) {
        // Check file size (2MB limit) and add files
        const validFiles = response.assets.filter((file) => {
          const fileSizeInMB = (file.fileSize || 0) / (1024 * 1024)
          if (fileSizeInMB > 2) {
            Alert.alert('File Too Large', `File "${file.fileName}" is too large. Please select files under 2MB.`)
            return false
          }
          return true
        })

        if (validFiles.length > 0) {
          const newAttachments = validFiles.map((file) => file.fileName || `attachment_${Date.now()}`)
          setAttachments([...attachments, ...newAttachments])
          Alert.alert('Success', `${validFiles.length} file(s) attached successfully.`)
        }
      }
    }

    showActionSheet()
  }

  const handleSaveInvoice = () => {
    // Validate form
    if (!selectedClient) {
      alert('Please select a client')
      return
    }

    if (!invoiceTitle.trim()) {
      alert('Please enter an invoice title')
      return
    }

    if (lineItems.length === 0) {
      alert('Please add at least one line item')
      return
    }

    // Here you would save to Firestore
    console.log('Saving invoice:', {
      invoiceId: invoiceId,
      title: invoiceTitle,
      client: selectedClient,
      invoiceDate: invoiceDate,
      dueDate: dueDate,
      lineItems: lineItems,
      subtotal: calculateSubtotal(),
      discount: discount,
      tax: tax,
      shipping: shipping,
      total: calculateTotal(),
      attachments: attachments,
    })

    // Navigate back to invoice list
    router.back()
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 100 }]}
      >
        {/* Invoice Details Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant='titleLarge' style={styles.sectionTitle}>
              Invoice Details
            </Text>

            <TextInput
              label='Invoice ID'
              value={invoiceId}
              editable={false}
              left={<TextInput.Icon icon='identifier' />}
              style={styles.compactInput}
            />

            <TextInput
              label='Invoice Title *'
              value={invoiceTitle}
              onChangeText={setInvoiceTitle}
              placeholder='Enter invoice title'
              left={<TextInput.Icon icon='file-document-edit' />}
              style={styles.compactInput}
            />

            <TouchableOpacity onPress={() => setShowInvoiceDatePicker(true)}>
              <TextInput
                label='Invoice Date *'
                value={formatDate(invoiceDate)}
                left={<TextInput.Icon icon='calendar' />}
                editable={false}
                style={styles.compactInput}
                pointerEvents='none'
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowDueDatePicker(true)}>
              <TextInput
                label='Due Date *'
                value={formatDate(dueDate)}
                left={<TextInput.Icon icon='calendar-clock' />}
                editable={false}
                style={styles.compactInput}
                pointerEvents='none'
              />
            </TouchableOpacity>
          </Card.Content>
        </Card>

        {/* Client Information Section */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text variant='titleLarge' style={styles.sectionTitle}>
                Client Information
              </Text>
            </View>

            {/* Client Selection Row */}
            <List.Item
              title={selectedClient ? selectedClient.name : 'Select Client'}
              description={selectedClient ? selectedClient.email : 'Tap to select a client'}
              left={() => <List.Icon icon='account' />}
              right={() => <List.Icon icon='chevron-right' />}
              onPress={handleSelectClient}
              style={styles.clickableRow}
            />

            {selectedClient && (
              <View style={styles.clientDetails}>
                <Text variant='bodyMedium' style={styles.clientInfo}>
                  📧 {selectedClient.email}
                </Text>
                <Text variant='bodyMedium' style={styles.clientInfo}>
                  📞 {selectedClient.phone}
                </Text>
                <Text variant='bodyMedium' style={styles.clientInfo}>
                  📍 {selectedClient.address}
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Items & Services Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant='titleLarge' style={styles.sectionTitle}>
              Items & Services
            </Text>

            {lineItems.length === 0 ? (
              <View style={styles.emptyState}>
                <Text variant='bodyMedium' style={styles.emptyText}>
                  No items added yet.
                </Text>
                <Button mode='contained' onPress={handleAddItems} icon='plus' style={styles.addLineItemButton}>
                  Add Line Item
                </Button>
              </View>
            ) : (
              <>
                {lineItems.map((item, index) => (
                  <View key={item.id}>
                    <View style={styles.itemHeader}>
                      <Text variant='titleMedium' style={styles.itemNumber}>
                        {item.name || `Item ${index + 1}`}
                      </Text>
                      <IconButton icon='delete' size={16} onPress={() => removeLineItem(item.id)} />
                    </View>

                    <Text variant='bodyMedium' style={styles.itemDescription}>
                      {item.description}
                    </Text>

                    <View style={styles.threeColumn}>
                      <View style={styles.smallColumn}>
                        <TextInput
                          label='Quantity *'
                          value={item.quantity.toString()}
                          onChangeText={(value) => updateLineItem(item.id, 'quantity', parseInt(value) || 0)}
                          placeholder='1'
                          keyboardType='numeric'
                          style={styles.compactInput}
                        />
                      </View>
                      <View style={styles.smallColumn}>
                        <TextInput
                          label='Discount'
                          value={item.itemDiscount.toString()}
                          onChangeText={(value) => updateLineItem(item.id, 'itemDiscount', parseFloat(value) || 0)}
                          placeholder='0.00'
                          keyboardType='numeric'
                          left={<TextInput.Icon icon='currency-usd' />}
                          style={styles.compactInput}
                        />
                      </View>
                      <View style={styles.smallColumn}>
                        <View style={styles.totalContainer}>
                          <Text variant='labelMedium' style={styles.totalLabel}>
                            Total
                          </Text>
                          <Text variant='titleMedium' style={styles.totalValue}>
                            {formatCurrency(item.total)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {index < lineItems.length - 1 && <Divider style={styles.itemDivider} />}
                  </View>
                ))}

                <Button mode='outlined' onPress={handleAddItems} icon='plus' style={styles.addMoreItemsButton}>
                  Add Line Item
                </Button>
              </>
            )}

            {lineItems.length > 0 && (
              <>
                <Divider style={styles.subtotalDivider} />
                <View style={styles.summaryRow}>
                  <Text variant='titleMedium' style={styles.summaryLabel}>
                    Subtotal:
                  </Text>
                  <Text variant='titleMedium' style={styles.summaryAmount}>
                    {formatCurrency(calculateSubtotal())}
                  </Text>
                </View>
              </>
            )}
          </Card.Content>
        </Card>

        {/* Payment Summary Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant='titleLarge' style={styles.sectionTitle}>
              Payment Summary
            </Text>

            <View style={styles.summaryRow}>
              <Text variant='bodyLarge' style={styles.paymentLabel}>
                Subtotal:
              </Text>
              <Text variant='bodyLarge' style={styles.paymentValue}>
                {formatCurrency(calculateSubtotal())}
              </Text>
            </View>

            {/* Discount Row */}
            <List.Item
              title='Discount'
              description={
                discount.value > 0
                  ? discount.type === 'percentage'
                    ? `Discount (${discount.value}%) ${formatCurrency(calculateDiscount())}`
                    : `Discount ${formatCurrency(discount.value)}`
                  : 'Tap to add'
              }
              right={() => <Text>{discount.value > 0 ? formatCurrency(calculateDiscount()) : 'Tap to add'}</Text>}
              onPress={() => {
                setTempDiscountType(discount.type)
                setTempDiscountValue(discount.value.toString())
                setDiscountDialogVisible(true)
              }}
              style={styles.clickableRow}
            />

            {/* Tax Row */}
            <List.Item
              title='Tax'
              description={tax.value > 0 && tax.name ? `${tax.name} (${tax.value}%)` : 'Tap to add'}
              right={() => <Text>{tax.value > 0 ? formatCurrency(calculateTax()) : 'Tap to add'}</Text>}
              onPress={() => {
                setTempTaxName(tax.name)
                setTempTaxValue(tax.value.toString())
                setTaxDialogVisible(true)
              }}
              style={styles.clickableRow}
            />

            {/* Shipping Row */}
            <List.Item
              title='Shipping'
              description={shipping > 0 ? formatCurrency(shipping) : 'Tap to add'}
              right={() => <Text>{shipping > 0 ? formatCurrency(shipping) : 'Tap to add'}</Text>}
              onPress={() => {
                setTempShippingValue(shipping.toString())
                setShippingDialogVisible(true)
              }}
              style={styles.clickableRow}
            />

            <Divider style={styles.paymentDivider} />

            <View style={styles.totalRow}>
              <Text variant='titleLarge' style={styles.finalTotalLabel}>
                Total:
              </Text>
              <Text variant='titleLarge' style={styles.finalTotalAmount}>
                {formatCurrency(calculateTotal())}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Attachments Section */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text variant='titleLarge' style={styles.sectionTitle}>
                Attachments
              </Text>
              <IconButton icon='paperclip' mode='contained' onPress={handleAttachFiles} size={20} />
            </View>

            {attachments.length === 0 ? (
              <View style={styles.emptyState}>
                <Text variant='bodyMedium' style={styles.emptyText}>
                  No files attached. Tap the attachment icon to add photos or videos.
                </Text>
              </View>
            ) : (
              <View>
                {attachments.map((attachment, index) => (
                  <View key={index} style={styles.attachmentItem}>
                    <Text variant='bodyMedium' style={styles.attachmentName}>
                      📎 {attachment}
                    </Text>
                    <IconButton icon='close' size={16} onPress={() => removeAttachment(index)} />
                  </View>
                ))}
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button mode='outlined' onPress={() => router.back()} style={[styles.button, styles.cancelButton]}>
            Cancel
          </Button>
          <Button mode='contained' onPress={handleSaveInvoice} style={[styles.button, styles.saveButton]}>
            Save Invoice
          </Button>
        </View>
      </ScrollView>

      {/* Date Pickers */}
      {showInvoiceDatePicker && (
        <DateTimePicker
          value={invoiceDate}
          mode='date'
          display='default'
          onChange={(event, selectedDate) => {
            setShowInvoiceDatePicker(false)
            if (selectedDate) {
              setInvoiceDate(selectedDate)
            }
          }}
        />
      )}

      {showDueDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode='date'
          display='default'
          onChange={(event, selectedDate) => {
            setShowDueDatePicker(false)
            if (selectedDate) {
              setDueDate(selectedDate)
            }
          }}
        />
      )}

      {/* Discount Dialog */}
      <Portal>
        <Dialog visible={discountDialogVisible} onDismiss={() => setDiscountDialogVisible(false)}>
          <Dialog.Title>Add Discount</Dialog.Title>
          <Dialog.Content>
            <View style={styles.discountRow}>
              <Menu
                visible={discountTypeMenuVisible}
                onDismiss={() => setDiscountTypeMenuVisible(false)}
                anchor={
                  <TextInput
                    label='Discount Type'
                    value={tempDiscountType === 'percentage' ? 'Percentage (%)' : 'Flat Amount ($)'}
                    onPress={() => setDiscountTypeMenuVisible(true)}
                    right={<TextInput.Icon icon='chevron-down' onPress={() => setDiscountTypeMenuVisible(true)} />}
                    editable={false}
                    style={[styles.compactInput, styles.discountTypeInput]}
                  />
                }
              >
                <Menu.Item
                  onPress={() => {
                    setTempDiscountType('percentage')
                    setDiscountTypeMenuVisible(false)
                  }}
                  title='Percentage (%)'
                />
                <Menu.Item
                  onPress={() => {
                    setTempDiscountType('flat')
                    setDiscountTypeMenuVisible(false)
                  }}
                  title='Flat Amount ($)'
                />
              </Menu>

              <TextInput
                label={tempDiscountType === 'percentage' ? 'Percentage' : 'Amount'}
                value={tempDiscountValue}
                onChangeText={setTempDiscountValue}
                keyboardType='numeric'
                placeholder={tempDiscountType === 'percentage' ? '10' : '100.00'}
                style={[styles.compactInput, styles.discountValueInput]}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDiscountDialogVisible(false)}>Cancel</Button>
            <Button mode='contained' onPress={handleDiscountSave}>
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Tax Dialog */}
      <Portal>
        <Dialog visible={taxDialogVisible} onDismiss={() => setTaxDialogVisible(false)}>
          <Dialog.Title>Add Tax</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label='Tax Name'
              value={tempTaxName}
              onChangeText={setTempTaxName}
              placeholder='e.g., Sales Tax, VAT'
              style={styles.compactInput}
            />

            <TextInput
              label='Tax Rate (%)'
              value={tempTaxValue}
              onChangeText={setTempTaxValue}
              keyboardType='numeric'
              placeholder='8.5'
              style={styles.compactInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setTaxDialogVisible(false)}>Cancel</Button>
            <Button mode='contained' onPress={handleTaxSave}>
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Shipping Dialog */}
      <Portal>
        <Dialog visible={shippingDialogVisible} onDismiss={() => setShippingDialogVisible(false)}>
          <Dialog.Title>Add Shipping</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label='Shipping Amount'
              value={tempShippingValue}
              onChangeText={setTempShippingValue}
              keyboardType='numeric'
              placeholder='15.00'
              left={<TextInput.Icon icon='currency-usd' />}
              style={styles.compactInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShippingDialogVisible(false)}>Cancel</Button>
            <Button mode='contained' onPress={handleShippingSave}>
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  compactInput: {
    marginBottom: 8,
    height: 50,
  },
  clientDetails: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 8,
  },
  clientInfo: {
    marginBottom: 4,
    opacity: 0.8,
  },
  addLineItemButton: {
    marginTop: 16,
  },
  addMoreItemsButton: {
    marginTop: 16,
  },
  discountRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-end',
  },
  discountTypeInput: {
    flex: 1,
  },
  discountValueInput: {
    flex: 1,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  attachmentName: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 16,
  },
  column: {
    flex: 1,
  },
  threeColumn: {
    flexDirection: 'row',
    gap: 12,
  },
  smallColumn: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemNumber: {
    fontWeight: '600',
  },
  itemDescription: {
    marginBottom: 12,
    opacity: 0.7,
  },
  totalContainer: {
    marginTop: 8,
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },
  totalLabel: {
    marginBottom: 4,
    opacity: 0.7,
  },
  totalValue: {
    fontWeight: '600',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    opacity: 0.6,
    textAlign: 'center',
  },
  itemDivider: {
    marginVertical: 16,
  },
  subtotalDivider: {
    marginTop: 16,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontWeight: '600',
  },
  summaryAmount: {
    fontWeight: '600',
  },
  paymentLabel: {
    flex: 1,
  },
  paymentValue: {
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  clickableRow: {
    borderRadius: 8,
    marginVertical: 4,
  },
  shippingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  shippingLabel: {
    flex: 1,
    marginRight: 16,
  },
  shippingInput: {
    flex: 2,
  },
  paymentDivider: {
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  finalTotalLabel: {
    fontWeight: '600',
    flex: 1,
  },
  finalTotalAmount: {
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  button: {
    flex: 1,
  },
  cancelButton: {},
  saveButton: {},
})

export default InvoiceAdd
