import { Stack } from 'expo-router'

export default function ItemsLayout() {
  return (
    <Stack>
      <Stack.Screen name='index' options={{ title: 'Items' }} />
      <Stack.Screen name='[id]' options={{ title: 'Item Detail' }} />
      <Stack.Screen name='select' options={{ title: 'Select Item' }} />
      <Stack.Screen name='add' options={{ title: 'Create New Item' }} />
    </Stack>
  )
}
