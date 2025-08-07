import { Stack, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { View } from 'react-native'
import { IconButton, Searchbar } from 'react-native-paper'

export default function TabLayout() {
  const router = useRouter()
  const [searchVisible, setSearchVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          title: searchVisible ? '' : 'Invoices',
          headerTitle: searchVisible
            ? () => (
                <Searchbar
                  placeholder='Search'
                  onChangeText={setSearchQuery}
                  value={searchQuery}
                  style={{
                    flex: 1,
                    marginRight: 8,
                    elevation: 0,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: 8,
                  }}
                  inputStyle={{ color: '#fff' }}
                  iconColor='#fff'
                  placeholderTextColor='rgba(255,255,255,0.7)'
                  onBlur={() => {
                    if (!searchQuery) {
                      setSearchVisible(false)
                    }
                  }}
                  autoFocus={searchVisible}
                />
              )
            : undefined,
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <IconButton icon='magnify' iconColor='#fff' size={24} onPress={() => setSearchVisible(!searchVisible)} />
              <IconButton icon='plus' iconColor='#fff' size={24} onPress={() => router.push('/invoices/add')} />
            </View>
          ),
        }}
        initialParams={{ searchQuery, setSearchQuery }}
      />
      <Stack.Screen
        name='add'
        options={{
          title: 'Add New Invoice',
        }}
      />
      <Stack.Screen
        name='[id]'
        options={{
          title: 'Invoice Detail',
        }}
      />
    </Stack>
  )
}
