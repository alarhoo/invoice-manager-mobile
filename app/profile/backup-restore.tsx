import React from 'react'
import { View } from 'react-native'
import { Button, Text } from 'react-native-paper'

export default function BackupRestoreScreen() {
  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text variant='titleLarge'>Backup & Restore</Text>
      <Button mode='contained' onPress={() => {}} icon='cloud-upload'>
        Backup Now
      </Button>
      <Button mode='outlined' onPress={() => {}} icon='cloud-download'>
        Restore from Backup
      </Button>
    </View>
  )
}
