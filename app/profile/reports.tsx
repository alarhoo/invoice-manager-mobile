import React from 'react'
import { View } from 'react-native'
import { Text } from 'react-native-paper'

export default function ReportsScreen() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant='titleLarge'>Reports</Text>
      <Text style={{ marginTop: 12 }}>
        Placeholder for analytics and export reports (sales, revenue, taxes, clients).
      </Text>
    </View>
  )
}
