import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { Card, List, Text } from 'react-native-paper'

const EstimateDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <Card.Content>
          <List.Item
            title={`Estimate ${id}`}
            description='Estimate details placeholder.'
            left={(p) => <List.Icon {...p} icon='file-document-edit-outline' />}
          />
          <Text style={{ marginTop: 8 }}>Replace with real estimate detail content.</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 16 },
})

export default EstimateDetail
