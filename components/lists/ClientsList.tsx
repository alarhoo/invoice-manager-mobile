import { Client, listClients } from '@/lib/clientsData'
import React from 'react'
import { FlatList, View } from 'react-native'
import { Divider, IconButton, List } from 'react-native-paper'

export type ClientsListProps = {
  limit?: number
  mode?: 'compact' | 'full'
  search?: string
  onClientPress?: (c: Client) => void
  virtualized?: boolean
  scrollEnabled?: boolean
}

export default function ClientsList({
  limit = 20,
  mode = 'full',
  search,
  onClientPress,
  virtualized = true,
  scrollEnabled = true,
}: ClientsListProps) {
  const [items, setItems] = React.useState<Client[]>([])
  const [offset, setOffset] = React.useState<number | undefined>(0)
  const [loading, setLoading] = React.useState(false)

  const load = React.useCallback(async () => {
    if (loading || offset === undefined) return
    setLoading(true)
    const res = await listClients({ limit, offset, search })
    setItems((prev) => (offset === 0 ? res.items : [...prev, ...res.items]))
    setOffset(res.nextOffset)
    setLoading(false)
  }, [limit, offset, search, loading])

  React.useEffect(() => {
    setItems([])
    setOffset(0)
  }, [search, limit])

  React.useEffect(() => {
    if (offset === 0 && items.length === 0) {
      void load()
    }
  }, [offset, items.length, load])

  if (!virtualized) {
    return (
      <View>
        {items.map((item, index) => (
          <View key={item.id}>
            <List.Item
              title={item.name}
              description={mode === 'compact' ? item.email : item.email}
              left={(props) => <List.Icon {...props} icon='account' />}
              right={(props) => <IconButton {...props} icon='chevron-right' />}
              onPress={() => onClientPress?.(item)}
            />
            {index < items.length - 1 && <Divider />}
          </View>
        ))}
      </View>
    )
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <View>
          <List.Item
            title={item.name}
            description={mode === 'compact' ? item.email : item.email}
            left={(props) => <List.Icon {...props} icon='account' />}
            right={(props) => <IconButton {...props} icon='chevron-right' />}
            onPress={() => onClientPress?.(item)}
          />
          {index < items.length - 1 && <Divider />}
        </View>
      )}
      onEndReachedThreshold={0.5}
      onEndReached={() => load()}
      scrollEnabled={scrollEnabled}
    />
  )
}
