import * as ImagePicker from 'expo-image-picker'
import React from 'react'
import { Alert, ScrollView, StyleSheet, View } from 'react-native'
import { Avatar, Button, Divider, List, TextInput } from 'react-native-paper'

type Business = {
  logoUri?: string
  name: string
  website?: string
  email?: string
  phone?: string
  address1?: string
  address2?: string
  gstin?: string
}

export default function MyBusinessScreen() {
  const [editing, setEditing] = React.useState(false)
  const [data, setData] = React.useState<Business>({
    name: 'Your Business Name',
    website: 'https://example.com',
    email: 'hello@example.com',
    phone: '+1 555-555-5555',
    address1: '123 Main Street',
    address2: 'Suite 100',
    gstin: '',
  })
  const [form, setForm] = React.useState<Business>(data)

  React.useEffect(() => {
    if (editing) setForm(data)
  }, [editing])

  const pickLogo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need access to your photos to select a logo.')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    })
    if (!result.canceled) {
      setForm((prev) => ({ ...prev, logoUri: result.assets[0]?.uri }))
    }
  }

  const save = () => {
    // Minimal validation example
    if (!form.name?.trim()) {
      Alert.alert('Validation', 'Business name is required.')
      return
    }
    setData(form)
    setEditing(false)
  }

  const cancel = () => setEditing(false)

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        {editing ? (
          <View style={styles.avatarRow}>
            {form.logoUri ? (
              <Avatar.Image size={72} source={{ uri: form.logoUri }} />
            ) : (
              <Avatar.Icon size={72} icon='briefcase' />
            )}
            <Button mode='text' onPress={pickLogo} style={{ marginLeft: 12 }}>
              Change Logo
            </Button>
          </View>
        ) : data.logoUri ? (
          <Avatar.Image size={72} source={{ uri: data.logoUri }} />
        ) : (
          <Avatar.Icon size={72} icon='briefcase' />
        )}

        <View style={{ flex: 1 }} />

        {!editing ? (
          <Button mode='contained' onPress={() => setEditing(true)}>
            Edit
          </Button>
        ) : (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button mode='text' onPress={cancel}>
              Cancel
            </Button>
            <Button mode='contained' onPress={save}>
              Save
            </Button>
          </View>
        )}
      </View>

      <Divider style={{ marginVertical: 12 }} />

      {!editing ? (
        <List.Section>
          <List.Item
            title='Business name'
            description={data.name || '-'}
            left={(p) => <List.Icon {...p} icon='domain' />}
          />
          <List.Item title='Website' description={data.website || '-'} left={(p) => <List.Icon {...p} icon='web' />} />
          <List.Item title='Email' description={data.email || '-'} left={(p) => <List.Icon {...p} icon='email' />} />
          <List.Item title='Phone' description={data.phone || '-'} left={(p) => <List.Icon {...p} icon='phone' />} />
          <List.Item
            title='Address line 1'
            description={data.address1 || '-'}
            left={(p) => <List.Icon {...p} icon='map-marker' />}
          />
          <List.Item
            title='Address line 2'
            description={data.address2 || '-'}
            left={(p) => <List.Icon {...p} icon='map-marker-outline' />}
          />
          <List.Item
            title='GSTIN (optional)'
            description={data.gstin || '-'}
            left={(p) => <List.Icon {...p} icon='file-document' />}
          />
        </List.Section>
      ) : (
        <View style={{ gap: 12 }}>
          <TextInput
            label='Business name'
            value={form.name}
            onChangeText={(v) => setForm((s) => ({ ...s, name: v }))}
            left={<TextInput.Icon icon='domain' />}
          />
          <TextInput
            label='Business website'
            value={form.website}
            onChangeText={(v) => setForm((s) => ({ ...s, website: v }))}
            autoCapitalize='none'
            left={<TextInput.Icon icon='web' />}
          />
          <TextInput
            label='Email address'
            value={form.email}
            onChangeText={(v) => setForm((s) => ({ ...s, email: v }))}
            keyboardType='email-address'
            autoCapitalize='none'
            left={<TextInput.Icon icon='email' />}
          />
          <TextInput
            label='Phone number'
            value={form.phone}
            onChangeText={(v) => setForm((s) => ({ ...s, phone: v }))}
            keyboardType='phone-pad'
            left={<TextInput.Icon icon='phone' />}
          />
          <TextInput
            label='Address line 1'
            value={form.address1}
            onChangeText={(v) => setForm((s) => ({ ...s, address1: v }))}
            left={<TextInput.Icon icon='map-marker' />}
          />
          <TextInput
            label='Address line 2'
            value={form.address2}
            onChangeText={(v) => setForm((s) => ({ ...s, address2: v }))}
            left={<TextInput.Icon icon='map-marker-outline' />}
          />
          <TextInput
            label='GSTIN (optional)'
            value={form.gstin}
            onChangeText={(v) => setForm((s) => ({ ...s, gstin: v }))}
            left={<TextInput.Icon icon='file-document' />}
          />
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  avatarRow: { flexDirection: 'row', alignItems: 'center' },
})
