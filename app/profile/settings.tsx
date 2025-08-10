import React from 'react'
import { View } from 'react-native'
import { List, Switch } from 'react-native-paper'

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = React.useState(false)
  return (
    <View style={{ flex: 1 }}>
      <List.Section>
        <List.Subheader>Preferences</List.Subheader>
        <List.Item
          title='Dark Mode'
          left={(props) => <List.Icon {...props} icon='theme-light-dark' />}
          right={() => <Switch value={darkMode} onValueChange={setDarkMode} />}
        />
        <List.Item title='Notifications' left={(props) => <List.Icon {...props} icon='bell' />} />
        <List.Item title='Language' left={(props) => <List.Icon {...props} icon='translate' />} />
      </List.Section>
    </View>
  )
}
