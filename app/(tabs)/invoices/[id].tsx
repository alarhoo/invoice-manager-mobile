import { useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Card, Chip, Divider, FAB, IconButton, Portal, Text } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function InvoiceDetailScreen() {
  const { id } = useLocalSearchParams()
  const insets = useSafeAreaInsets()
  const [fabMenuVisible, setFabMenuVisible] = useState(false)
  const [itemsExpanded, setItemsExpanded] = useState(false)

  // Mock invoice data - replace with actual Firestore data
  const invoiceData = {
    id: id,
    status: 'Overdue',
    date: '2025-01-15',
    dueDate: '2025-02-14',
    client: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Business Street\nNew York, NY 10001\nUnited States',
    },
    items: [
      {
        id: '1',
        name: 'Web Development',
        description: 'Custom website development with responsive design',
        image: null,
        quantity: 1,
        price: 2500.0,
      },
      {
        id: '2',
        name: 'SEO Optimization',
        description: 'Search engine optimization for 6 months',
        image: null,
        quantity: 6,
        price: 300.0,
      },
      {
        id: '3',
        name: 'Content Management',
        description: 'Monthly content updates and maintenance',
        image: null,
        quantity: 3,
        price: 200.0,
      },
    ],
    payment: {
      subtotal: 4300.0,
      discount: 300.0,
      tax: 430.0,
      total: 4430.0,
      paymentMade: 1000.0,
      balanceDue: 3430.0,
    },
  }

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return '#4CAF50'
      case 'Draft':
        return '#FF9800'
      case 'Overdue':
        return '#F44336'
      case 'Pending':
        return '#2196F3'
      default:
        return '#757575'
    }
  }

  const calculateItemTotal = (quantity: number, price: number) => quantity * price

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 100 }]}
      >
        {/* Invoice Details Section */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text variant='titleLarge' style={styles.sectionTitle}>
                Invoice Details
              </Text>
              <Chip
                style={[styles.statusChip, { backgroundColor: getStatusColor(invoiceData.status) }]}
                textStyle={styles.statusText}
              >
                {invoiceData.status}
              </Chip>
            </View>

            <View style={styles.detailRow}>
              <Text variant='bodyLarge' style={styles.label}>
                Invoice ID:
              </Text>
              <Text variant='bodyLarge' style={styles.value}>
                {invoiceData.id}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text variant='bodyLarge' style={styles.label}>
                Date:
              </Text>
              <Text variant='bodyLarge' style={styles.value}>
                {formatDate(invoiceData.date)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text variant='bodyLarge' style={styles.label}>
                Due Date:
              </Text>
              <Text variant='bodyLarge' style={[styles.value, { color: '#F44336' }]}>
                {formatDate(invoiceData.dueDate)}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Client Section */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text variant='titleLarge' style={styles.sectionTitle}>
                Client Information
              </Text>
            </View>

            <View style={styles.clientTwoColumn}>
              <View style={styles.clientColumn}>
                <View style={styles.clientItem}>
                  <Text variant='labelSmall' style={styles.clientLabel}>
                    Client Name
                  </Text>
                  <Text variant='bodyMedium' style={styles.clientValue}>
                    {invoiceData.client.name}
                  </Text>
                </View>
                <View style={styles.clientItem}>
                  <Text variant='labelSmall' style={styles.clientLabel}>
                    Email Address
                  </Text>
                  <Text variant='bodyMedium' style={styles.clientValue}>
                    {invoiceData.client.email}
                  </Text>
                </View>
              </View>
              <View style={styles.clientColumn}>
                <View style={styles.clientItem}>
                  <Text variant='labelSmall' style={styles.clientLabel}>
                    Phone Number
                  </Text>
                  <Text variant='bodyMedium' style={styles.clientValue}>
                    {invoiceData.client.phone}
                  </Text>
                </View>
                <View style={styles.clientItem}>
                  <Text variant='labelSmall' style={styles.clientLabel}>
                    Address
                  </Text>
                  <Text variant='bodyMedium' style={styles.clientValue}>
                    {invoiceData.client.address}
                  </Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Items Section */}
        <Card style={styles.card}>
          <Card.Content>
            <View
              style={[styles.sectionHeader, styles.clickableHeader]}
              onTouchEnd={() => setItemsExpanded(!itemsExpanded)}
            >
              <Text variant='titleLarge' style={styles.sectionTitle}>
                Items & Services
              </Text>
              <IconButton icon={itemsExpanded ? 'chevron-up' : 'chevron-down'} size={20} />
            </View>

            {/* Show summary when collapsed, all items when expanded */}
            {!itemsExpanded ? (
              <View style={styles.itemsSummary}>
                <Text variant='bodyMedium' style={styles.summaryText}>
                  {invoiceData.items.length} items • Total Qty:{' '}
                  {invoiceData.items.reduce((sum, item) => sum + item.quantity, 0)}
                </Text>
              </View>
            ) : (
              <>
                {invoiceData.items.map((item, index) => (
                  <View key={item.id}>
                    <View style={styles.itemRow}>
                      <View style={styles.itemInfo}>
                        <Text variant='titleMedium' style={styles.itemName}>
                          {item.name}
                        </Text>
                        <Text variant='bodyMedium' style={styles.itemDescription}>
                          {item.description}
                        </Text>
                      </View>
                      <View style={styles.itemNumbers}>
                        <Text variant='bodySmall' style={styles.itemQuantityRight}>
                          Qty: {item.quantity} x {formatCurrency(item.price)}
                        </Text>
                        <Text variant='titleMedium' style={styles.itemTotalAmount}>
                          {formatCurrency(calculateItemTotal(item.quantity, item.price))}
                        </Text>
                      </View>
                    </View>
                    {index < invoiceData.items.length - 1 && <Divider style={styles.itemDivider} />}
                  </View>
                ))}
              </>
            )}

            <Divider style={styles.subtotalDivider} />
            <View style={styles.subtotalRow}>
              <Text variant='titleMedium' style={styles.subtotalLabel}>
                Subtotal:
              </Text>
              <Text variant='titleMedium' style={styles.subtotalAmount}>
                {formatCurrency(invoiceData.payment.subtotal)}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Payment Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant='titleLarge' style={[styles.sectionTitle, { marginBottom: 24 }]}>
              Payment Summary
            </Text>

            <View style={styles.paymentRow}>
              <Text variant='bodyLarge' style={styles.paymentLabel}>
                Subtotal:
              </Text>
              <Text variant='bodyLarge' style={styles.paymentValue}>
                {formatCurrency(invoiceData.payment.subtotal)}
              </Text>
            </View>

            <View style={styles.paymentRow}>
              <Text variant='bodyLarge' style={styles.paymentLabel}>
                Discount:
              </Text>
              <Text variant='bodyLarge' style={[styles.paymentValue, { color: '#4CAF50' }]}>
                -{formatCurrency(invoiceData.payment.discount)}
              </Text>
            </View>

            <View style={styles.paymentRow}>
              <Text variant='bodyLarge' style={styles.paymentLabel}>
                Tax:
              </Text>
              <Text variant='bodyLarge' style={styles.paymentValue}>
                {formatCurrency(invoiceData.payment.tax)}
              </Text>
            </View>

            <Divider style={styles.paymentDivider} />

            <View style={styles.paymentRow}>
              <Text variant='titleMedium' style={styles.totalLabel}>
                Total:
              </Text>
              <Text variant='titleMedium' style={styles.totalValue}>
                {formatCurrency(invoiceData.payment.total)}
              </Text>
            </View>

            <View style={styles.paymentRow}>
              <Text variant='bodyLarge' style={styles.paymentLabel}>
                Payment Made:
              </Text>
              <Text variant='bodyLarge' style={[styles.paymentValue, { color: '#4CAF50' }]}>
                {formatCurrency(invoiceData.payment.paymentMade)}
              </Text>
            </View>

            <Divider style={styles.paymentDivider} />

            <View style={styles.balanceRow}>
              <Text variant='titleLarge' style={styles.balanceLabel}>
                Balance Due:
              </Text>
              <Text variant='titleLarge' style={styles.balanceValue}>
                {formatCurrency(invoiceData.payment.balanceDue)}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Floating Action Button */}
      <Portal>
        <FAB.Group
          open={fabMenuVisible}
          visible
          icon={fabMenuVisible ? 'close' : 'dots-vertical'}
          actions={[
            {
              icon: 'pencil',
              label: 'Edit',
              onPress: () => {
                setFabMenuVisible(false)
                // Navigate to edit invoice
                console.log('Edit invoice')
              },
            },
            {
              icon: 'eye',
              label: 'Preview',
              onPress: () => {
                setFabMenuVisible(false)
                // Show preview
                console.log('Preview invoice')
              },
            },
            {
              icon: 'send',
              label: 'Send',
              onPress: () => {
                setFabMenuVisible(false)
                // Send invoice
                console.log('Send invoice')
              },
            },
          ]}
          onStateChange={({ open }) => setFabMenuVisible(open)}
          onPress={() => {
            if (fabMenuVisible) {
              setFabMenuVisible(false)
            }
          }}
        />
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
  clickableHeader: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  sectionTitle: {
    fontWeight: '600',
    // marginBottom: 16,
  },
  statusChip: {
    paddingHorizontal: 0,
  },
  statusText: {
    color: 'white',
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    flex: 1,
  },
  value: {
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  clientInfo: {
    marginTop: 0,
  },
  clientTwoColumn: {
    flexDirection: 'row',
    gap: 16,
  },
  clientColumn: {
    flex: 1,
  },
  clientItem: {
    marginBottom: 12,
  },
  clientValue: {
    fontWeight: '500',
    marginTop: 4,
  },
  clientLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  itemRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemsSummary: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  summaryText: {
    opacity: 0.7,
  },
  itemInfo: {
    flex: 1,
    // marginRight: 16,
  },
  itemName: {
    fontWeight: '600',
    marginBottom: 6,
  },
  itemDescription: {
    marginBottom: 4,
    // lineHeight: 20,
  },
  itemNumbers: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  itemQuantityRight: {
    marginBottom: 6,
    textAlign: 'right',
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemPrice: {},
  itemTotal: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  itemTotalAmount: {
    fontWeight: '600',
    textAlign: 'right',
  },
  itemDivider: {
    marginVertical: 8,
  },
  subtotalDivider: {
    marginTop: 16,
    marginBottom: 12,
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtotalLabel: {
    fontWeight: '600',
  },
  subtotalAmount: {
    fontWeight: '600',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  paymentLabel: {
    flex: 1,
  },
  paymentValue: {
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  paymentDivider: {
    marginVertical: 12,
  },
  totalLabel: {
    fontWeight: '600',
    flex: 1,
  },
  totalValue: {
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  balanceLabel: {
    color: '#F44336',
    fontWeight: '700',
    flex: 1,
  },
  balanceValue: {
    color: '#F44336',
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
})
