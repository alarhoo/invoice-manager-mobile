import { Tabs, usePathname } from 'expo-router'
import React from 'react'
import { Platform } from 'react-native'

import { HapticTab } from '@/components/HapticTab'
import { IconSymbol } from '@/components/ui/IconSymbol'
import TabBarBackground from '@/components/ui/TabBarBackground'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'

export default function TabLayout() {
  const colorScheme = useColorScheme()
  const pathname = usePathname()

  // Hide tab bar on detail/add/select routes within tabs for a cleaner stack UX
  const hideTabBar =
    (pathname.includes('/invoices/') && !pathname.endsWith('/invoices')) ||
    (pathname.includes('/estimate/') && !pathname.endsWith('/estimate')) ||
    pathname.endsWith('/clients/select') ||
    pathname.endsWith('/items/select') ||
    (pathname.includes('/clients/') && !pathname.endsWith('/clients')) ||
    (pathname.includes('/items/') && !pathname.endsWith('/items'))

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: hideTabBar
          ? { display: 'none' }
          : Platform.select({
              ios: {
                // Use a transparent background on iOS to show the blur effect
                position: 'absolute',
              },
              default: {},
            }),
      }}
    >
      <Tabs.Screen
        name='dashboard'
        title='Home'
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name='house.fill' color={color} />,
        }}
      />
      <Tabs.Screen
        name='invoices'
        title='Invoices'
        options={{
          title: 'Invoices',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name='receipt' color={color} />,
        }}
      />
      <Tabs.Screen
        name='estimate'
        title='Estimate'
        options={{
          title: 'Estimate',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name='request_quote.fill' color={color} />,
        }}
      />
      <Tabs.Screen
        name='clients'
        title='Clients'
        options={{
          title: 'Clients',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name='people.fill' color={color} />,
        }}
      />
      <Tabs.Screen
        name='items'
        title='Items'
        options={{
          title: 'Items',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name='box.fill' color={color} />,
        }}
      />
      {/* 
      <Tabs.Screen
        name='profile'
        title='Profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name='paperplane.fill' color={color} />,
        }}
      /> */}
      {/* <Tabs.Screen name='estimate' options={{ title: 'Estimate' }} />
      <Tabs.Screen name='invoices' options={{ title: 'Invoices' }} />
      <Tabs.Screen name='profile' options={{ title: 'Profile' }} /> */}
    </Tabs>
  )
}
