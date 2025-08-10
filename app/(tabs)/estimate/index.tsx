import { Estimate, addEstimate, getEstimates, subscribe } from '@/lib/estimatesStore'
import { Stack, useRouter } from 'expo-router'
import React from 'react'
import { FlatList, RefreshControl, View } from 'react-native'
import { Card, IconButton, List, Searchbar, Text } from 'react-native-paper'

const Estimates = () => {
  const router = useRouter()
  const [search, setSearch] = React.useState('')
  const [items, setItems] = React.useState<Estimate[]>(getEstimates())
  const [refreshing, setRefreshing] = React.useState(false)

  React.useEffect(() => {
    return subscribe(setItems)
  }, [])

  // Seed some dummy data if empty (layout-only concern for demo)
  React.useEffect(() => {
    if (items.length === 0) {
      const now = new Date()
      const demo: Estimate = {
        estimateId: `EST-${now.getTime()}`,
        title: 'Website Redesign',
        selectedClient: { id: 'c1', name: 'Acme Corp' },
        estimateDate: now,
        expiryDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        lineItems: [
          { id: 'li1', name: 'Design', quantity: 1, price: 1200, itemDiscount: 0, total: 1200 },
          { id: 'li2', name: 'Development', quantity: 1, price: 2800, itemDiscount: 0, total: 2800 },
        ],
        discount: { type: 'flat', value: 0 },
        tax: { name: 'VAT', value: 10 },
        shipping: 0,
        subtotal: 4000,
        total: 4400,
        status: 'draft',
        createdAt: now,
        updatedAt: now,
      }
      addEstimate(demo)
    }
  }, [items.length])

  const filtered = React.useMemo(() => {
    if (!search.trim()) return items
    const q = search.toLowerCase()
    return items.filter((e) =>
      [e.title, e.estimateId, e.selectedClient?.name].some((v) => (v || '').toLowerCase().includes(q))
    )
  }, [items, search])

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: 'Estimates',
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <IconButton icon='magnify' onPress={() => {}} disabled />
              <IconButton icon='plus' onPress={() => router.push('/(tabs)/estimate/add')} />
            </View>
          ),
        }}
      />

      <Searchbar placeholder='Search' value={search} onChangeText={setSearch} style={{ margin: 12 }} />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.estimateId}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(false)} />}
        renderItem={({ item }) => (
          <Card style={{ marginHorizontal: 12, marginBottom: 12 }}>
            <Card.Content>
              <List.Item
                title={item.title || item.estimateId}
                description={item.selectedClient?.name || 'No client'}
                left={(p) => <List.Icon {...p} icon='file-document-edit-outline' />}
                right={(p) => (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ marginRight: 8 }}>{new Date(item.estimateDate).toLocaleDateString()}</Text>
                    <IconButton
                      {...p}
                      icon='chevron-right'
                      onPress={() => router.push(`/(tabs)/estimate/${item.estimateId}`)}
                    />
                  </View>
                )}
              />
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={() => (
          <View style={{ padding: 24 }}>
            <Text>There are no estimates yet.</Text>
          </View>
        )}
      />
    </View>
  )
}

export default Estimates
