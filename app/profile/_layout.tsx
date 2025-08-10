import { Stack } from 'expo-router'

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name='index' options={{ title: 'Profile' }} />
      <Stack.Screen name='business' options={{ title: 'My Business' }} />
      <Stack.Screen name='reports' options={{ title: 'Reports' }} />
      <Stack.Screen name='settings' options={{ title: 'Settings' }} />
      <Stack.Screen name='backup-restore' options={{ title: 'Backup & Restore' }} />
    </Stack>
  )
}
