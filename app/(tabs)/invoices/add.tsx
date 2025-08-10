import DateTimePicker from '@react-native-community/datetimepicker'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { ActionSheetIOS, Alert, Linking, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
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

interface Client {
  id: string
  name: string
  email: string
  phone: string
  address: string
}

interface DiscountTax {
  type: 'percentage' | 'flat'
  value: number
}

interface TaxInfo {
  name: string
  value: number
}

// Invoice structure matching Firestore schema
interface InvoiceDraft {
  invoiceId: string
  invoiceTitle: string
  selectedClient: Client | null
  invoiceDate: Date
  dueDate: Date
  lineItems: LineItem[]
  discount: DiscountTax
  tax: TaxInfo
  shipping: number
  attachments: string[]
  subtotal: number
  total: number
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  createdAt: Date
  updatedAt: Date
}

const InvoiceAdd = () => {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const params = useLocalSearchParams()

  // Initialize invoice draft with proper structure
  const initializeInvoiceDraft = (): InvoiceDraft => ({
    invoiceId: `INV-${Date.now()}`,
    invoiceTitle: '',
    selectedClient: null,
    invoiceDate: new Date(),
    dueDate: new Date(),
    lineItems: [],
    discount: { type: 'flat', value: 0 },
    tax: { name: '', value: 0 },
    shipping: 0,
    attachments: [],
    subtotal: 0,
    total: 0,
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  // Main invoice state
  const [invoiceDraft, setInvoiceDraft] = useState<InvoiceDraft>(initializeInvoiceDraft)

  // Dialog states
  const [showInvoiceDatePicker, setShowInvoiceDatePicker] = useState(false)
  const [showDueDatePicker, setShowDueDatePicker] = useState(false)
  const [discountDialogVisible, setDiscountDialogVisible] = useState(false)
  const [taxDialogVisible, setTaxDialogVisible] = useState(false)
  const [shippingDialogVisible, setShippingDialogVisible] = useState(false)
  const [discountTypeMenuVisible, setDiscountTypeMenuVisible] = useState(false)

  // Temporary dialog states
  const [tempDiscountType, setTempDiscountType] = useState<'percentage' | 'flat'>('flat')
  const [tempDiscountValue, setTempDiscountValue] = useState('')
  const [tempTaxName, setTempTaxName] = useState('')
  const [tempTaxValue, setTempTaxValue] = useState('')
  const [tempShippingValue, setTempShippingValue] = useState('')

  // Update invoice draft function
  const updateInvoiceDraft = useCallback((updates: Partial<InvoiceDraft>) => {
    setInvoiceDraft((prev) => {
      const updated = { ...prev, ...updates, updatedAt: new Date() }

      // Recalculate totals
      const subtotal = updated.lineItems.reduce((sum, item) => sum + item.total, 0)
      const discountAmount =
        updated.discount.type === 'percentage' ? (subtotal * updated.discount.value) / 100 : updated.discount.value
      const taxAmount = ((subtotal - discountAmount) * updated.tax.value) / 100
      const total = subtotal - discountAmount + taxAmount + updated.shipping

      return {
        ...updated,
        subtotal,
        total,
      }
    })
  }, [])

  // Handle incoming client selection from client selection screen
  useEffect(() => {
    if (params.selectedClient && typeof params.selectedClient === 'string') {
      try {
        const client = JSON.parse(params.selectedClient)
        updateInvoiceDraft({ selectedClient: client })
      } catch (error) {
        console.error('Error parsing selected client:', error)
      }
    }
  }, [params.selectedClient, updateInvoiceDraft])

  // Handle incoming item selection from item selection screen
  useEffect(() => {
    if (params.selectedItem && typeof params.selectedItem === 'string' && params.itemTimestamp) {
      try {
        const item = JSON.parse(params.selectedItem)
        const newLineItem: LineItem = {
          id: `item-${Date.now()}`,
          name: item.name,
          description: item.description,
          quantity: 1,
          price: item.price,
          itemDiscount: 0,
          total: item.price,
        }

        // Avoid including invoiceDraft.lineItems in dependencies
        setInvoiceDraft((prev) => ({
          ...prev,
          lineItems: [...prev.lineItems, newLineItem],
          updatedAt: new Date(),
        }))
      } catch (error) {
        console.error('Error parsing selected item:', error)
      }
    }
  }, [params.selectedItem, params.itemTimestamp])

  // Helper functions
  const removeLineItem = (id: string) => {
    const updatedLineItems = invoiceDraft.lineItems.filter((item) => item.id !== id)
    updateInvoiceDraft({ lineItems: updatedLineItems })
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    const updatedLineItems = invoiceDraft.lineItems.map((item) => {
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
    updateInvoiceDraft({ lineItems: updatedLineItems })
  }

  const calculateSubtotal = () => {
    return invoiceDraft.subtotal
  }

  const calculateDiscount = () => {
    const subtotal = invoiceDraft.subtotal
    if (invoiceDraft.discount.type === 'percentage') {
      return (subtotal * invoiceDraft.discount.value) / 100
    }
    return invoiceDraft.discount.value
  }

  const calculateTax = () => {
    const subtotal = invoiceDraft.subtotal
    const discountAmount = calculateDiscount()
    const taxableAmount = subtotal - discountAmount
    return (taxableAmount * invoiceDraft.tax.value) / 100
  }

  const calculateTotal = () => {
    return invoiceDraft.total
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
    router.push('/(tabs)/items/select')
  }

  const handleSelectClient = () => {
    router.push('/(tabs)/clients/select')
  }

  const handlePhonePress = (phoneNumber: string) => {
    const phoneUrl = `tel:${phoneNumber}`
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(phoneUrl)
        } else {
          Alert.alert('Error', 'Phone app is not available on this device')
        }
      })
      .catch((error) => {
        console.error('Error opening phone app:', error)
        Alert.alert('Error', 'Failed to open phone app')
      })
  }

  const handleAddressPress = (address: string) => {
    const encodedAddress = encodeURIComponent(address)
    const mapUrl = Platform.OS === 'ios' ? `maps://maps.apple.com/?q=${encodedAddress}` : `geo:0,0?q=${encodedAddress}`

    Linking.canOpenURL(mapUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(mapUrl)
        } else {
          // Fallback to Google Maps web
          const googleMapsUrl = `https://maps.google.com/?q=${encodedAddress}`
          Linking.openURL(googleMapsUrl)
        }
      })
      .catch((error) => {
        console.error('Error opening maps:', error)
        Alert.alert('Error', 'Failed to open maps')
      })
  }

  const handleDiscountSave = () => {
    updateInvoiceDraft({
      discount: {
        type: tempDiscountType,
        value: parseFloat(tempDiscountValue) || 0,
      },
    })
    setDiscountDialogVisible(false)
    setTempDiscountValue('')
  }

  const handleTaxSave = () => {
    updateInvoiceDraft({
      tax: {
        name: tempTaxName,
        value: parseFloat(tempTaxValue) || 0,
      },
    })
    setTaxDialogVisible(false)
    setTempTaxName('')
    setTempTaxValue('')
  }

  const handleShippingSave = () => {
    updateInvoiceDraft({ shipping: parseFloat(tempShippingValue) || 0 })
    setShippingDialogVisible(false)
    setTempShippingValue('')
  }

  const removeAttachment = (index: number) => {
    const updatedAttachments = invoiceDraft.attachments.filter((_, i) => i !== index)
    updateInvoiceDraft({ attachments: updatedAttachments })
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
          updateInvoiceDraft({
            attachments: [...invoiceDraft.attachments, ...newAttachments],
          })
          Alert.alert('Success', `${validFiles.length} file(s) attached successfully.`)
        }
      }
    }

    showActionSheet()
  }

  const handleSaveInvoice = () => {
    // Validate form
    if (!invoiceDraft.selectedClient) {
      Alert.alert('Validation Error', 'Please select a client')
      return
    }

    if (!invoiceDraft.invoiceTitle.trim()) {
      Alert.alert('Validation Error', 'Please enter an invoice title')
      return
    }

    if (invoiceDraft.lineItems.length === 0) {
      Alert.alert('Validation Error', 'Please add at least one line item')
      return
    }

    // Here you would save to Firestore with the complete invoice structure
    console.log('Saving invoice to Firestore:', invoiceDraft)

    // Navigate back to invoice list
    router.back()
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Create Invoice',
          headerShown: true,
          headerBackTitle: 'Back',
        }}
      />
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          {/* Invoice Details Section */}
          <Card style={styles.card}>
            <Card.Content>
              <Text variant='titleLarge' style={styles.sectionTitle}>
                Invoice Details
              </Text>

              <TextInput
                label='Invoice ID'
                value={invoiceDraft.invoiceId}
                editable={false}
                left={<TextInput.Icon icon='identifier' />}
                style={styles.compactInput}
              />

              <TextInput
                label='Invoice Title *'
                value={invoiceDraft.invoiceTitle}
                onChangeText={(text) => updateInvoiceDraft({ invoiceTitle: text })}
                placeholder='Enter invoice title'
                left={<TextInput.Icon icon='file-document-edit' />}
                style={styles.compactInput}
              />

              <TouchableOpacity onPress={() => setShowInvoiceDatePicker(true)}>
                <TextInput
                  label='Invoice Date *'
                  value={formatDate(invoiceDraft.invoiceDate)}
                  left={<TextInput.Icon icon='calendar' />}
                  editable={false}
                  style={styles.compactInput}
                  pointerEvents='none'
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowDueDatePicker(true)}>
                <TextInput
                  label='Due Date *'
                  value={formatDate(invoiceDraft.dueDate)}
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
                title={invoiceDraft.selectedClient ? invoiceDraft.selectedClient.name : 'Select Client'}
                description={invoiceDraft.selectedClient ? invoiceDraft.selectedClient.email : 'Tap to select a client'}
                left={() => <List.Icon icon='account' />}
                right={() => <List.Icon icon='chevron-right' />}
                onPress={handleSelectClient}
                style={styles.clickableRow}
              />

              {invoiceDraft.selectedClient && (
                <View style={styles.clientDetails}>
                  <TouchableOpacity
                    style={styles.contactRow}
                    onPress={() => handlePhonePress(invoiceDraft.selectedClient!.phone)}
                    activeOpacity={0.7}
                  >
                    <List.Icon icon='phone' size={24} />
                    <Text variant='bodyMedium' style={styles.contactText}>
                      {invoiceDraft.selectedClient.phone}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.contactRow}
                    onPress={() => handleAddressPress(invoiceDraft.selectedClient!.address)}
                    activeOpacity={0.7}
                  >
                    <List.Icon icon='map-marker' size={24} />
                    <Text variant='bodyMedium' style={styles.contactText}>
                      {invoiceDraft.selectedClient.address}
                    </Text>
                  </TouchableOpacity>
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

              {invoiceDraft.lineItems.length === 0 ? (
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
                  {invoiceDraft.lineItems.map((item, index) => (
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
                            label='Price *'
                            value={item.price.toString()}
                            onChangeText={(value) => updateLineItem(item.id, 'price', parseFloat(value) || 0)}
                            placeholder='0.00'
                            keyboardType='numeric'
                            left={<TextInput.Icon icon='currency-usd' />}
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
                      </View>

                      <View style={styles.totalContainer}>
                        <Text variant='labelMedium' style={styles.totalLabel}>
                          Line Total
                        </Text>
                        <Text variant='titleMedium' style={styles.totalValue}>
                          {formatCurrency(item.total)}
                        </Text>
                      </View>

                      {index < invoiceDraft.lineItems.length - 1 && <Divider style={styles.itemDivider} />}
                    </View>
                  ))}

                  <Button mode='outlined' onPress={handleAddItems} icon='plus' style={styles.addMoreItemsButton}>
                    Add Line Item
                  </Button>
                </>
              )}

              {invoiceDraft.lineItems.length > 0 && (
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
                  invoiceDraft.discount.value > 0
                    ? invoiceDraft.discount.type === 'percentage'
                      ? `Discount (${invoiceDraft.discount.value}%) ${formatCurrency(calculateDiscount())}`
                      : `Discount ${formatCurrency(invoiceDraft.discount.value)}`
                    : 'Tap to add'
                }
                right={() => (
                  <Text>{invoiceDraft.discount.value > 0 ? formatCurrency(calculateDiscount()) : 'Tap to add'}</Text>
                )}
                onPress={() => {
                  setTempDiscountType(invoiceDraft.discount.type)
                  setTempDiscountValue(invoiceDraft.discount.value.toString())
                  setDiscountDialogVisible(true)
                }}
                style={styles.clickableRow}
              />

              {/* Tax Row */}
              <List.Item
                title='Tax'
                description={
                  invoiceDraft.tax.value > 0 && invoiceDraft.tax.name
                    ? `${invoiceDraft.tax.name} (${invoiceDraft.tax.value}%)`
                    : 'Tap to add'
                }
                right={() => <Text>{invoiceDraft.tax.value > 0 ? formatCurrency(calculateTax()) : 'Tap to add'}</Text>}
                onPress={() => {
                  setTempTaxName(invoiceDraft.tax.name)
                  setTempTaxValue(invoiceDraft.tax.value.toString())
                  setTaxDialogVisible(true)
                }}
                style={styles.clickableRow}
              />

              {/* Shipping Row */}
              <List.Item
                title='Shipping'
                description={invoiceDraft.shipping > 0 ? formatCurrency(invoiceDraft.shipping) : 'Tap to add'}
                right={() => (
                  <Text>{invoiceDraft.shipping > 0 ? formatCurrency(invoiceDraft.shipping) : 'Tap to add'}</Text>
                )}
                onPress={() => {
                  setTempShippingValue(invoiceDraft.shipping.toString())
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

              {invoiceDraft.attachments.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text variant='bodyMedium' style={styles.emptyText}>
                    No files attached. Tap the attachment icon to add photos or videos.
                  </Text>
                </View>
              ) : (
                <View>
                  {invoiceDraft.attachments.map((attachment, index) => (
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
        </ScrollView>

        {/* Fixed Bottom Buttons */}
        <View style={[styles.fixedBottomContainer, { paddingBottom: insets.bottom }]}>
          <Button mode='outlined' onPress={() => router.back()} style={[styles.button, styles.cancelButton]}>
            Cancel
          </Button>
          <Button mode='contained' onPress={handleSaveInvoice} style={[styles.button, styles.saveButton]}>
            Save Invoice
          </Button>
        </View>
      </View>

      {/* Date Pickers */}
      {showInvoiceDatePicker && (
        <DateTimePicker
          value={invoiceDraft.invoiceDate}
          mode='date'
          display='default'
          onChange={(event, selectedDate) => {
            setShowInvoiceDatePicker(false)
            if (selectedDate) {
              updateInvoiceDraft({ invoiceDate: selectedDate })
            }
          }}
        />
      )}

      {showDueDatePicker && (
        <DateTimePicker
          value={invoiceDraft.dueDate}
          mode='date'
          display='default'
          onChange={(event, selectedDate) => {
            setShowDueDatePicker(false)
            if (selectedDate) {
              updateInvoiceDraft({ dueDate: selectedDate })
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  fixedBottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    marginTop: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginVertical: 1,
  },
  contactText: {
    flex: 1,
    marginLeft: 16,
    opacity: 0.8,
    color: '#1976d2',
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
    marginTop: 12,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    opacity: 0.7,
    fontWeight: '500',
  },
  totalValue: {
    fontWeight: '600',
    color: '#2e7d32',
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
    marginVertical: 0,
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
