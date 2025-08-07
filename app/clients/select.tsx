import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { Appbar, Button, Card, Searchbar, Text } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface Client {
  id: string
  name: string
  email: string
  phone: string
  address: string
}

const ClientSelectionScreen = () => {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  // Mock clients data - replace with actual Firestore data
  const clients: Client[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Business Street\nNew York, NY 10001\nUnited States',
    },
    {
      id: '2',
      name: 'Jane Morrison',
      email: 'jane@example.com',
      phone: '+1 (555) 234-5678',
      address: '456 Corporate Ave\nLos Angeles, CA 90210\nUnited States',
    },
    {
      id: '3',
      name: 'Dan Henderson',
      email: 'dan@example.com',
      phone: '+1 (555) 345-6789',
      address: '789 Enterprise Blvd\nChicago, IL 60601\nUnited States',
    },
    {
      id: '4',
      name: 'Lee Mathew',
      email: 'lee@example.com',
      phone: '+1 (555) 456-7890',
      address: '321 Commerce Dr\nMiami, FL 33101\nUnited States',
    },
    {
      id: '5',
      name: 'Bradshaw White',
      email: 'brad@example.com',
      phone: '+1 (555) 567-8901',
      address: '654 Industry Rd\nSeattle, WA 98101\nUnited States',
    },
  ]

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleClientSelect = (client: Client) => {
    // TODO: Pass selected client back to invoice screen
    console.log('Selected client for invoice:', client)
    router.back()
  }

  const handleAddNewClient = () => {
    router.push('/clients/add')
  }

  const renderClientItem = ({ item }: { item: Client }) => (
    <Card style={styles.clientCard} onPress={() => handleClientSelect(item)}>
      <Card.Content>
        <View style={styles.clientHeader}>
          <Text variant='titleMedium' style={styles.clientName}>
            {item.name}
          </Text>
        </View>
        <Text variant='bodyMedium' style={styles.clientEmail}>
          📧 {item.email}
        </Text>
        <Text variant='bodyMedium' style={styles.clientPhone}>
          📞 {item.phone}
        </Text>
        <Text variant='bodySmall' style={styles.clientAddress} numberOfLines={2}>
          📍 {item.address}
        </Text>
      </Card.Content>
    </Card>
  )

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title='Select Client' />
      </Appbar.Header>

      <View style={styles.content}>
        <Searchbar
          placeholder='Search clients...'
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        <Button mode='contained' onPress={handleAddNewClient} icon='plus' style={styles.addButton}>
          Add New Client
        </Button>

        <FlatList
          data={filteredClients}
          keyExtractor={(item) => item.id}
          renderItem={renderClientItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text variant='bodyLarge' style={styles.emptyText}>
                No clients found
              </Text>
              <Text variant='bodyMedium' style={styles.emptySubtext}>
                {searchQuery ? 'Try adjusting your search terms' : 'Add your first client to get started'}
              </Text>
            </View>
          }
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchbar: {
    marginBottom: 16,
    elevation: 2,
  },
  addButton: {
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  clientCard: {
    elevation: 2,
    backgroundColor: '#fff',
  },
  clientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  clientName: {
    fontWeight: '600',
    flex: 1,
  },
  clientEmail: {
    marginBottom: 4,
    opacity: 0.8,
  },
  clientPhone: {
    marginBottom: 4,
    opacity: 0.8,
  },
  clientAddress: {
    opacity: 0.6,
    lineHeight: 18,
  },
  separator: {
    height: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.7,
  },
  emptySubtext: {
    opacity: 0.5,
    textAlign: 'center',
  },
})

export default ClientSelectionScreen
