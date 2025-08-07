import { Stack } from 'expo-router'

export default function ItemsLayout() {
  return (
    <Stack>
      <Stack.Screen name='index' options={{ title: 'Select Items' }} />
      <Stack.Screen name='add' options={{ title: 'Create New Item' }} />
    </Stack>
  )
}
