import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { ImageBackground, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Card, IconButton, List, Text } from 'react-native-paper'

const ItemDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>()

  // Dummy item data – replace with real fetch
  const item = {
    id,
    name: 'Sample Item',
    description: 'This is a detailed description of the sample item.',
    price: 49.99,
    stock: 120,
    imageUrl: 'https://nypost.com/wp-content/uploads/sites/2/2023/05/cindy-adams-lisa-ann-052.jpg',
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Image Section with Overlay */}
      <View style={styles.imageContainer}>
        <ImageBackground source={{ uri: item.imageUrl }} style={styles.image} imageStyle={styles.imageStyle}>
          <TouchableOpacity style={styles.editButton} onPress={() => console.log('Edit item')}>
            <IconButton icon='pencil' size={24} color='#fff' />
          </TouchableOpacity>
          <View style={styles.imageOverlay} />
        </ImageBackground>
      </View>

      {/* Details Section */}
      <Card style={styles.detailsCard}>
        <Card.Content>
          <Text variant='headlineSmall' style={styles.itemName}>
            {item.name}
          </Text>
          <Text variant='bodyMedium' style={styles.itemDescription}>
            {item.description}
          </Text>

          <View style={styles.infoRow}>
            <List.Icon icon='currency-usd' />
            <Text variant='bodyLarge' style={styles.infoText}>
              Price: ${item.price.toFixed(2)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <List.Icon icon='warehouse' />
            <Text variant='bodyLarge' style={styles.infoText}>
              Stock: {item.stock}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: 8,
  },
  editButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  detailsCard: {
    padding: 16,
  },
  itemName: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemDescription: {
    opacity: 0.7,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 8,
  },
})

export default ItemDetail
