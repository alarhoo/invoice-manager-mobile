import React from 'react'
import { View } from 'react-native'
import { Text } from 'react-native-paper'

export default function MyBusinessScreen() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant='titleLarge'>My Business</Text>
      <Text style={{ marginTop: 12 }}>
        This is a placeholder. Add your business profile details, branding, address, taxes, and preferences here.
      </Text>
    </View>
  )
}
