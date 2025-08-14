import React from 'react'
import { FlatList, View } from 'react-native'
import { Divider, IconButton, List } from 'react-native-paper'

export type ClientsListProps = {
  data: Client[]
  mode?: 'compact' | 'full'
  onClientPress?: (c: Client) => void
  scrollEnabled?: boolean
}

export default function ClientsList({ data, mode = 'full', onClientPress, scrollEnabled = true }: ClientsListProps) {
  return (
    <FlatList
      data={data}
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
          {index < data.length - 1 && <Divider />}
        </View>
      )}
      scrollEnabled={scrollEnabled}
    />
  )
}
