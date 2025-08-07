import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Button, Card, Text, TextInput } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const ClientAdd = () => {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  // Form state
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [clientAddress, setClientAddress] = useState('')
  const [clientCompany, setClientCompany] = useState('')
  const [clientWebsite, setClientWebsite] = useState('')

  const handleSaveClient = () => {
    // Validate form
    if (!clientName.trim()) {
      alert('Please enter client name')
      return
    }

    if (!clientEmail.trim()) {
      alert('Please enter client email')
      return
    }

    // Here you would save to Firestore
    console.log('Saving client:', {
      name: clientName,
      email: clientEmail,
      phone: clientPhone,
      address: clientAddress,
      company: clientCompany,
      website: clientWebsite,
    })

    // Navigate back
    router.back()
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 100 }]}
    >
      <Card style={styles.card}>
        <Card.Content>
          <Text variant='titleLarge' style={styles.sectionTitle}>
            Client Information
          </Text>

          <TextInput
            label='Client Name *'
            value={clientName}
            onChangeText={setClientName}
            placeholder='John Doe'
            left={<TextInput.Icon icon='account' />}
            style={styles.input}
          />

          <TextInput
            label='Email Address *'
            value={clientEmail}
            onChangeText={setClientEmail}
            placeholder='john@example.com'
            keyboardType='email-address'
            left={<TextInput.Icon icon='email' />}
            style={styles.input}
          />

          <TextInput
            label='Phone Number'
            value={clientPhone}
            onChangeText={setClientPhone}
            placeholder='+1 (555) 123-4567'
            keyboardType='phone-pad'
            left={<TextInput.Icon icon='phone' />}
            style={styles.input}
          />

          <TextInput
            label='Company'
            value={clientCompany}
            onChangeText={setClientCompany}
            placeholder='ABC Corporation'
            left={<TextInput.Icon icon='office-building' />}
            style={styles.input}
          />

          <TextInput
            label='Website'
            value={clientWebsite}
            onChangeText={setClientWebsite}
            placeholder='https://example.com'
            keyboardType='url'
            left={<TextInput.Icon icon='web' />}
            style={styles.input}
          />

          <TextInput
            label='Address'
            value={clientAddress}
            onChangeText={setClientAddress}
            placeholder='123 Business Street, City, State, ZIP'
            multiline
            numberOfLines={4}
            left={<TextInput.Icon icon='map-marker' />}
            style={styles.input}
          />
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button mode='outlined' onPress={() => router.back()} style={[styles.button, styles.cancelButton]}>
          Cancel
        </Button>
        <Button mode='contained' onPress={handleSaveClient} style={[styles.button, styles.saveButton]}>
          Save Client
        </Button>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  button: {
    flex: 1,
  },
  cancelButton: {},
  saveButton: {},
})

export default ClientAdd
