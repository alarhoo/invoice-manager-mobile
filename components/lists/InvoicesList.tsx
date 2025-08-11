import { formatCurrency } from '@/lib/dashboardData'
import { Invoice } from '@/lib/invoicesData'
import React from 'react'
import { FlatList, View } from 'react-native'
import { Divider, List, Surface, Text, useTheme } from 'react-native-paper'

export type InvoicesListProps = {
  limit?: number
  status?: 'Paid' | 'Pending' | 'Overdue' | 'All'
  search?: string
  mode?: 'compact' | 'full'
  onInvoicePress?: (i: Invoice) => void
  virtualized?: boolean
  scrollEnabled?: boolean
}

export default function InvoicesList({
  limit = 20,
  status = 'All',
  search,
  mode = 'full',
  onInvoicePress,
  virtualized = true,
  scrollEnabled = true,
}: InvoicesListProps) {
  const theme = useTheme()
  const [items, setItems] = React.useState<Invoice[]>([])
  const [offset, setOffset] = React.useState<number | undefined>(0)
  const [loading, setLoading] = React.useState(false)

  const getStatusColor = (s: Invoice['status']) => {
    if (!virtualized) {
      return (
        <View>
          {items.map((item, index) => (
            <View key={item.id}>
              <List.Item
                title={item.id}
                description={item.clientName}
                left={(props) => <List.Icon {...props} icon='file-document' />}
                right={() => (
                  <View style={{ alignItems: 'flex-end', gap: 4 }}>
                    <Text variant='titleMedium' style={{ fontWeight: 'bold' }}>
                      {formatCurrency(item.amount)}
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
              {index < items.length - 1 && <Divider />}
            </View>
          ))}
        </View>
      )
    }
  }

  return (
    <FlatList
      data={items}
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
                  {formatCurrency(item.amount)}
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
          {index < items.length - 1 && <Divider />}
        </View>
      )}
      onEndReachedThreshold={0.5}
      onEndReached={() => load()}
      scrollEnabled={scrollEnabled}
    />
  )

  return (
    <FlatList
      data={items}
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
                  {formatCurrency(item.amount)}
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
          {index < items.length - 1 && <Divider />}
        </View>
      )}
      onEndReachedThreshold={0.5}
      onEndReached={() => load()}
    />
  )
}
