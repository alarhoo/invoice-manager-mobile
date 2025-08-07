import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Button, Card, Text, TextInput } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const ItemAdd = () => {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  // Form state
  const [itemName, setItemName] = useState('')
  const [itemDescription, setItemDescription] = useState('')
  const [itemPrice, setItemPrice] = useState('')
  const [itemImage, setItemImage] = useState<string | null>(null)

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    })

    if (!result.canceled) {
      setItemImage(result.assets[0].uri)
    }
  }

  const handleSaveItem = () => {
    // Validate form
    if (!itemName.trim()) {
      alert('Please enter item name')
      return
    }

    if (!itemPrice.trim()) {
      alert('Please enter item price')
      return
    }

    const price = parseFloat(itemPrice)
    if (isNaN(price) || price <= 0) {
      alert('Please enter a valid price')
      return
    }

    // Here you would save to Firestore
    console.log('Saving item:', {
      name: itemName,
      description: itemDescription,
      price: price,
      image: itemImage,
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
            Item Information
          </Text>

          <TextInput
            label='Item Name *'
            value={itemName}
            onChangeText={setItemName}
            placeholder='Web Development'
            left={<TextInput.Icon icon='package-variant' />}
            style={styles.input}
          />

          <TextInput
            label='Description'
            value={itemDescription}
            onChangeText={setItemDescription}
            placeholder='Brief description of the item/service'
            multiline
            numberOfLines={3}
            left={<TextInput.Icon icon='text' />}
            style={styles.input}
          />

          <TextInput
            label='Price *'
            value={itemPrice}
            onChangeText={setItemPrice}
            placeholder='0.00'
            keyboardType='numeric'
            left={<TextInput.Icon icon='currency-usd' />}
            style={styles.input}
          />

          {/* Image Picker */}
          <View style={styles.imageSection}>
            <Text variant='labelLarge' style={styles.imageLabel}>
              Item Image (Optional)
            </Text>
            <TouchableOpacity onPress={handlePickImage} style={styles.imagePicker}>
              {itemImage ? (
                <Image source={{ uri: itemImage }} style={styles.previewImage} />
              ) : (
                <View style={styles.placeholderContainer}>
                  <Text variant='bodyMedium' style={styles.placeholderText}>
                    Tap to add image
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button mode='outlined' onPress={() => router.back()} style={[styles.button, styles.cancelButton]}>
          Cancel
        </Button>
        <Button mode='contained' onPress={handleSaveItem} style={[styles.button, styles.saveButton]}>
          Save Item
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
  imageSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  imageLabel: {
    marginBottom: 8,
    opacity: 0.7,
  },
  imagePicker: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    opacity: 0.5,
    textAlign: 'center',
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

export default ItemAdd
