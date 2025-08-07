import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { Card, Divider, List, Surface, Text } from 'react-native-paper'
import { Tabs, TabScreen, TabsProvider } from 'react-native-paper-tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function InvoiceListScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  // State for active tab
  const [activeTab, setActiveTab] = useState(0)

  // Mock data - replace with actual Firestore data
  const allInvoices = [
    {
      id: 'INV-001',
      date: '2025-01-15',
      client: 'John Doe',
      amount: 5000,
      status: 'Overdue',
    },
    {
      id: 'INV-002',
      date: '2025-01-20',
      client: 'Jane Morrison',
      amount: 400,
      status: 'Draft',
    },
    {
      id: 'INV-003',
      date: '2025-01-25',
      client: 'Dan Handerson',
      amount: 500,
      status: 'Paid',
    },
    {
      id: 'INV-004',
      date: '2025-02-01',
      client: 'Lee Mathew',
      amount: 550,
      status: 'Overdue',
    },
    {
      id: 'INV-005',
      date: '2025-02-05',
      client: 'Bradshaw White',
      amount: 6500,
      status: 'Overdue',
    },
    {
      id: 'INV-006',
      date: '2025-02-10',
      client: 'Russ Jackson',
      amount: 4565,
      status: 'Overdue',
    },
  ]

  // Filter invoices based on active tab
  const getFilteredInvoices = () => {
    let filtered = allInvoices

    switch (activeTab) {
      case 0: // Due (Overdue)
        return filtered.filter((invoice) => invoice.status === 'Overdue')
      case 1: // Draft
        return filtered.filter((invoice) => invoice.status === 'Draft')
      case 2: // All
        return filtered
      default:
        return filtered
    }
  }

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
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
      default:
        return '#757575'
    }
  }

  const getStatusLabel = (status: string) => {
    return status === 'Overdue' ? 'Overdue' : status
  }

  const renderInvoiceItem = ({ item, index }: { item: any; index: number }) => (
    <View>
      <Card style={styles.invoiceCard} onPress={() => router.push(`/invoices/${item.id}`)}>
        <Card.Content style={styles.invoiceContent}>
          <View style={styles.invoiceHeader}>
            <View style={styles.clientInfo}>
              <Text variant='titleMedium' style={styles.clientName}>
                {item.client}
              </Text>
              <Text variant='bodySmall' style={styles.invoiceId}>
                {item.id}
              </Text>
              <Text variant='bodySmall' style={styles.date}>
                {formatDate(item.date)}
              </Text>
            </View>
            <View style={styles.amountInfo}>
              <Text variant='titleLarge' style={styles.amount}>
                {formatCurrency(item.amount)}
              </Text>
              {item.status !== 'Paid' && (
                <Surface style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                  <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
                </Surface>
              )}
            </View>
          </View>
        </Card.Content>
      </Card>
      {index < getFilteredInvoices().length - 1 && <Divider style={styles.divider} />}
    </View>
  )

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <List.Icon icon='file-document-outline' size={64} />
      </View>
      <Text variant='titleMedium' style={styles.emptyTitle}>
        You have no {activeTab === 0 ? 'due' : activeTab === 1 ? 'draft' : ''} invoices
      </Text>
    </View>
  )

  return (
    <View style={[styles.container, { paddingTop: insets.tops }]}>
      {/* Tab Bar with Content */}
      <TabsProvider defaultIndex={0}>
        <Tabs value={activeTab} onChangeIndex={setActiveTab} mode='fixed' style={styles.tabs}>
          <TabScreen label='Due' icon='file-document-edit'>
            <View style={styles.listContainer}>
              {getFilteredInvoices().length > 0 ? (
                <FlatList
                  data={getFilteredInvoices()}
                  renderItem={({ item, index }) => renderInvoiceItem({ item, index })}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.listContent}
                />
              ) : (
                renderEmptyState()
              )}
            </View>
          </TabScreen>

          <TabScreen label='Completed' icon='file-document'>
            <View style={styles.listContainer}>
              {getFilteredInvoices().length > 0 ? (
                <FlatList
                  data={getFilteredInvoices()}
                  renderItem={({ item, index }) => renderInvoiceItem({ item, index })}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.listContent}
                />
              ) : (
                renderEmptyState()
              )}
            </View>
          </TabScreen>

          <TabScreen label='All' icon='file-document-multiple'>
            <View style={styles.listContainer}>
              {getFilteredInvoices().length > 0 ? (
                <FlatList
                  data={getFilteredInvoices()}
                  renderItem={({ item, index }) => renderInvoiceItem({ item, index })}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.listContent}
                />
              ) : (
                renderEmptyState()
              )}
            </View>
          </TabScreen>
        </Tabs>
      </TabsProvider>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {},
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  invoiceCard: {
    marginHorizontal: 0,
    marginVertical: 0,
    borderRadius: 0,
  },
  invoiceContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  clientInfo: {
    flex: 1,
    marginRight: 16,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  invoiceId: {
    fontSize: 13,
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
  amountInfo: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
  },
  divider: {
    marginHorizontal: 0,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    opacity: 0.3,
    marginBottom: 16,
  },
  emptyTitle: {
    textAlign: 'center',
  },
})
