import { Stack, useRouter } from 'expo-router'
import { View } from 'react-native'
import { IconButton } from 'react-native-paper'

export default function TabLayout() {
  const router = useRouter()
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          title: 'Client List',
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <IconButton icon='magnify' iconColor='#fff' size={24} onPress={() => setSearchVisible(!searchVisible)} />
              <IconButton icon='plus' iconColor='#fff' size={24} onPress={() => router.push('/clients/add')} />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name='select'
        options={{
          title: 'Select Client',
        }}
      />
      <Stack.Screen
        name='add'
        options={{
          title: 'Add Client',
        }}
      />
      <Stack.Screen
        name='explore'
        options={{
          title: 'Explore Clients',
        }}
      />
      <Stack.Screen
        name='[id]'
        options={{
          title: 'Client Details',
        }}
      />
    </Stack>
  )
}
