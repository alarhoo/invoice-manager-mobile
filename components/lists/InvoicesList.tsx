import { formatCurrency } from '@/lib/dashboardData'
import { Invoice } from '@/lib/invoicesData'
import React from 'react'
import { FlatList, View } from 'react-native'
import { Divider, List, Surface, Text } from 'react-native-paper'

export type InvoicesListProps = {
  data: Invoice[]
  mode?: 'compact' | 'full'
  onInvoicePress?: (i: Invoice) => void
  scrollEnabled?: boolean
}

export default function InvoicesList({ data, mode = 'full', onInvoicePress, scrollEnabled = true }: InvoicesListProps) {
  const getStatusColor = (s: Invoice['status']) => {
    switch (s) {
      case 'Paid':
        return '#4CAF50'
      case 'Pending':
        return '#FFC107'
      case 'Overdue':
        return '#F44336'
      default:
        return '#757575'
    }
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <View>
          <List.Item
            title={item.id}
            description={item.clientName}
            left={(props) => <List.Icon {...props} icon='file-document' />}
            right={() => (
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <Text variant='titleMedium' style={{ fontWeight: 'bold' }}>
                  {formatCurrency(item.amount || 0)}
                </Text>
                <Surface
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                    backgroundColor: getStatusColor(item.status) + '20',
                  }}
                >
                  <Text
                    variant='labelSmall'
                    style={{ color: getStatusColor(item.status), fontWeight: 'bold', fontSize: 10 }}
                  >
                    {item.status}
                  </Text>
                </Surface>
              </View>
            )}
            onPress={() => onInvoicePress?.(item)}
          />
          {index < data.length - 1 && <Divider />}
        </View>
      )}
      scrollEnabled={scrollEnabled}
    />
  )
}
