import { Stack } from 'expo-router'

export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen name='index' />
      <Stack.Screen name='add' />
      <Stack.Screen name='explore' />
      <Stack.Screen name='[id]' />
    </Stack>
  )
}
