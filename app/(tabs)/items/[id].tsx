import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { Card, List, Text } from 'react-native-paper'

const ItemDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>()

  // Dummy detail – replace with real fetch
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <Card.Content>
          <List.Item
            title={`Item #${id}`}
            description='Item detail page'
            left={(p) => <List.Icon {...p} icon='package-variant' />}
          />
          <Text style={{ marginTop: 8 }}>This is a placeholder for item details.</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 16 },
})

export default ItemDetail
