import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Avatar, Card, Text } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface Item {
  id: string
  name: string
  description: string
  price: number
  image?: string
}

const ItemsList = () => {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  // Mock items data - replace with actual Firestore data
  const items: Item[] = [
    {
      id: '1',
      name: 'Web Development',
      description: 'Custom website development with responsive design',
      price: 2500.0,
    },
    {
      id: '2',
      name: 'SEO Optimization',
      description: 'Search engine optimization for 6 months',
      price: 300.0,
    },
    {
      id: '3',
      name: 'Content Management',
      description: 'Monthly content updates and maintenance',
      price: 200.0,
    },
    {
      id: '4',
      name: 'Logo Design',
      description: 'Professional logo design with multiple concepts',
      price: 500.0,
    },
    {
      id: '5',
      name: 'Social Media Management',
      description: 'Complete social media management package',
      price: 800.0,
    },
  ]

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`

  const handleItemSelect = (item: Item) => {
    router.push(`/(tabs)/items/${item.id}`)
  }

  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity onPress={() => handleItemSelect(item)}>
      <Card style={styles.itemCard}>
        <Card.Content>
          <View style={styles.itemRow}>
            <Avatar.Icon size={40} icon='package-variant' style={styles.itemIcon} />
            <View style={styles.itemInfo}>
              <Text variant='titleMedium' style={styles.itemName}>
                {item.name}
              </Text>
              <Text variant='bodyMedium' style={styles.itemDescription}>
                {item.description}
              </Text>
            </View>
            <View style={styles.itemPrice}>
              <Text variant='titleMedium' style={styles.priceText}>
                {formatCurrency(item.price)}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  )

  return (
    <View style={[styles.container]}>
      {/* Create New Item Button */}
      {/* <View style={styles.header}>
        <Button
          mode='contained'
          onPress={() => router.push('/(tabs)/items/add')}
          icon='plus'
          style={styles.createButton}
        >
          Create New Item
        </Button>
      </View> */}

      {/* Search Bar */}
      {/* <Searchbar
        placeholder='Search items...'
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      /> */}

      {/* Items List */}
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContainer, { paddingBottom: insets.bottom + 20 }]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  createButton: {
    marginBottom: 8,
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  listContainer: {
    padding: 16,
  },
  itemCard: {
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDescription: {
    opacity: 0.7,
  },
  itemPrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontWeight: '600',
  },
  separator: {
    height: 8,
  },
})

export default ItemsList
