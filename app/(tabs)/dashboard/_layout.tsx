import { Stack, useRouter } from 'expo-router'
import { Avatar } from 'react-native-paper'

export default function TabLayout() {
  const router = useRouter()
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          title: 'InvoiceLekka',
          headerRight: () => (
            <Avatar.Icon
              size={36}
              icon='account'
              style={{ marginRight: 4 }}
              onTouchEnd={() => router.push('/profile')}
            />
          ),
        }}
      />
    </Stack>
  )
}
