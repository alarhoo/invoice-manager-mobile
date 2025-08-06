import { useRouter } from 'expo-router'
import { Button, Text, View } from 'react-native'

export default function InvoiceListScreen() {
  const router = useRouter()

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Invoice List</Text>
      <Button title='Add Invoice' onPress={() => router.push('/invoices/add')} />
    </View>
  )
}
