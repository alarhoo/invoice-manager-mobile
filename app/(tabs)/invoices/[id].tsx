import { useLocalSearchParams } from 'expo-router'
import { Text, View } from 'react-native'

export default function InvoiceDetailScreen() {
  const { id } = useLocalSearchParams()

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Invoice Detail - ID: {id}</Text>
    </View>
  )
}
