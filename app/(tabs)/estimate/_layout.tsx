import { Stack } from 'expo-router'

export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen name='index' options={{ title: 'Estimates' }} />
      <Stack.Screen name='[id]' options={{ title: 'Estimate Detail' }} />
      <Stack.Screen name='add' options={{ title: 'New Estimate' }} />
    </Stack>
  )
}
