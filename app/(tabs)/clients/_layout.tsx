import { Stack } from 'expo-router'

export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          title: 'Client List',
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
