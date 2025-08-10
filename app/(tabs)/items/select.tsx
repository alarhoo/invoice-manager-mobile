import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { Button, Card, Searchbar, Text } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface Item {
  id: string
  name: string
  description: string
  price: number
  category: string
  unit: string
}

const ItemSelectionScreen = () => {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  // Mock items data - replace with actual Firestore data
  const items: Item[] = [
    {
      id: '1',
      name: 'Website Design',
      description: 'Custom website design with responsive layout',
      price: 1500,
      category: 'Design',
      unit: 'project',
    },
    {
      id: '2',
      name: 'Logo Design',
      description: 'Professional logo design with 3 concepts',
      price: 350,
      category: 'Design',
      unit: 'project',
    },
    {
      id: '3',
      name: 'Mobile App Development',
      description: 'Native mobile app development for iOS and Android',
      price: 5000,
      category: 'Development',
      unit: 'project',
    },
    {
      id: '4',
      name: 'SEO Consultation',
      description: 'Search engine optimization consultation and strategy',
      price: 125,
      category: 'Marketing',
      unit: 'hour',
    },
    {
      id: '5',
      name: 'Content Writing',
      description: 'Professional content writing for web and marketing',
      price: 75,
      category: 'Writing',
      unit: 'hour',
    },
    {
      id: '6',
      name: 'Database Setup',
      description: 'Database design and setup with optimization',
      price: 800,
      category: 'Development',
      unit: 'project',
    },
    {
      id: '7',
      name: 'Social Media Management',
      description: 'Monthly social media content and management',
      price: 450,
      category: 'Marketing',
      unit: 'month',
    },
    {
      id: '8',
      name: 'UI/UX Design',
      description: 'User interface and experience design for applications',
      price: 95,
      category: 'Design',
      unit: 'hour',
    },
  ]

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleItemSelect = (item: Item) => {
    // Pass selected item back to invoice screen via router params and replace to keep stack clean
    router.replace({
      pathname: '/(tabs)/invoices/add',
      params: {
        selectedItem: JSON.stringify(item),
        itemTimestamp: Date.now().toString(),
      },
    })
  }

  const handleAddNewItem = () => {
    router.push('/(tabs)/items/add')
  }

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`

  const renderItemCard = ({ item }: { item: Item }) => (
    <Card style={styles.itemCard} onPress={() => handleItemSelect(item)}>
      <Card.Content>
        <View style={styles.itemHeader}>
          <Text variant='titleMedium' style={styles.itemName}>
            {item.name}
          </Text>
          <Text variant='titleMedium' style={styles.itemPrice}>
            {formatCurrency(item.price)}
          </Text>
        </View>
        <Text variant='bodyMedium' style={styles.itemDescription}>
          {item.description}
        </Text>
        <View style={styles.itemFooter}>
          <Text variant='bodySmall' style={styles.itemCategory}>
            📂 {item.category}
          </Text>
          <Text variant='bodySmall' style={styles.itemUnit}>
            📏 per {item.unit}
          </Text>
        </View>
      </Card.Content>
    </Card>
  )

  return (
    <View style={[styles.container]}>
      <View style={styles.content}>
        <Searchbar
          placeholder='Search items and services...'
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        <Button mode='contained' onPress={handleAddNewItem} icon='plus' style={styles.addButton}>
          Add New Item/Service
        </Button>

        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItemCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text variant='bodyLarge' style={styles.emptyText}>
                No items found
              </Text>
              <Text variant='bodyMedium' style={styles.emptySubtext}>
                {searchQuery ? 'Try adjusting your search terms' : 'Add your first item or service to get started'}
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
  itemCard: {
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemName: {
    fontWeight: '600',
    flex: 1,
    marginRight: 16,
  },
  itemPrice: {
    fontWeight: '600',
    color: '#2e7d32',
  },
  itemDescription: {
    marginBottom: 12,
    opacity: 0.8,
    lineHeight: 20,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemCategory: {
    opacity: 0.6,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  itemUnit: {
    opacity: 0.6,
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

export default ItemSelectionScreen
