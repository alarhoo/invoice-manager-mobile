import React from 'react'
import { FlatList, View } from 'react-native'
import { Divider, List, Text } from 'react-native-paper'

export type EstimatesListProps = {
  data: Estimate[]
  mode?: 'compact' | 'full'
  onEstimatePress?: (e: Estimate) => void
  scrollEnabled?: boolean
}

export default function EstimatesList({
  data,
  mode = 'full',
  onEstimatePress,
  scrollEnabled = true,
}: EstimatesListProps) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.estimateId}
      renderItem={({ item, index }) => (
        <View>
          <List.Item
            title={item.title}
            description={item.selectedClient?.name || 'No client'}
            left={(props) => <List.Icon {...props} icon='file-document-edit-outline' />}
            right={() => (
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <Text variant='titleMedium' style={{ fontWeight: 'bold' }}>
                  {item.total}
                </Text>
              </View>
            )}
            onPress={() => onEstimatePress?.(item)}
          />
          {index < data.length - 1 && <Divider />}
        </View>
      )}
      scrollEnabled={scrollEnabled}
    />
  )
}
