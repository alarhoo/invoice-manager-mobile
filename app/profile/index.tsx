import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Avatar, Divider, List, Text } from 'react-native-paper'

export default function ProfileScreen() {
  const router = useRouter()

  const onLogout = () => {
    // TODO: plug real sign-out when auth is wired
    router.replace('/auth/login')
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar.Image size={72} source={{ uri: 'https://i.pravatar.cc/150?img=47' }} />
        <View style={{ marginLeft: 16 }}>
          <Text variant='titleLarge'>Emma Phillips</Text>
          <Text style={styles.muted}>emma.phillips@gmail.com</Text>
          <Text style={styles.muted}>(581)-307-6902</Text>
        </View>
      </View>

      <Divider style={{ marginVertical: 12 }} />

      <List.Section>
        <List.Item
          title='My Business'
          left={(props) => <List.Icon {...props} icon='briefcase' />}
          right={(props) => <List.Icon {...props} icon='chevron-right' />}
          onPress={() => router.push('/profile/business')}
        />
        <List.Item
          title='Reports'
          left={(props) => <List.Icon {...props} icon='chart-bar' />}
          right={(props) => <List.Icon {...props} icon='chevron-right' />}
          onPress={() => router.push('/profile/reports')}
        />
        <List.Item
          title='Settings'
          left={(props) => <List.Icon {...props} icon='cog' />}
          right={(props) => <List.Icon {...props} icon='chevron-right' />}
          onPress={() => router.push('/profile/settings')}
        />
        <List.Item
          title='Backup & Restore'
          left={(props) => <List.Icon {...props} icon='backup-restore' />}
          right={(props) => <List.Icon {...props} icon='chevron-right' />}
          onPress={() => router.push('/profile/backup-restore')}
        />
      </List.Section>

      <View style={{ flex: 1 }} />
      <Divider />
      <List.Item
        title='Log out'
        titleStyle={{ color: '#d00' }}
        left={(props) => <List.Icon {...props} color={'#d00'} icon='logout' />}
        onPress={onLogout}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  muted: { color: '#6b7280' },
})
