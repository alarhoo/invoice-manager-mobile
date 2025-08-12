import { Stack, useRouter } from 'expo-router'
import { View } from 'react-native'
import { IconButton } from 'react-native-paper'

export default function ItemsLayout() {
  const router = useRouter()
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          title: 'Items',
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <IconButton icon='magnify' iconColor='#fff' size={24} onPress={() => setSearchVisible(!searchVisible)} />
              <IconButton icon='plus' iconColor='#fff' size={24} onPress={() => router.push('/items/add')} />
            </View>
          ),
        }}
      />
      <Stack.Screen name='[id]' options={{ title: 'Item Detail' }} />
      <Stack.Screen name='select' options={{ title: 'Select Item' }} />
      <Stack.Screen name='add' options={{ title: 'Create New Item' }} />
    </Stack>
  )
}
