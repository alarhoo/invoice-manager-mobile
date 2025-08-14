import ClientsList from '@/components/lists/ClientsList'
import { useAppContext } from '@/src/context/AppContext'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'

const ClientList = () => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const { state } = useAppContext()
  const clients = state.clients // Fetch clients from AppContext

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* <Searchbar
          placeholder='Search clients...'
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        <Button
          mode='contained'
          onPress={() => router.push('/(tabs)/clients/add')}
          icon='plus'
          style={styles.addButton}
        >
          Add New Client
        </Button> */}

        <ClientsList
          data={clients} // Pass clients data dynamically
          search={searchQuery}
          onClientPress={(c) => router.push(`/(tabs)/clients/${c.id}`)}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f5f5f5',
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
    // backgroundColor: '#fff',
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
})

export default ClientList
