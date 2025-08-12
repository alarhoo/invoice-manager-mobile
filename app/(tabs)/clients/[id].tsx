import KpiCard from '@/components/KpiCard'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Avatar, Card, Divider, List, useTheme } from 'react-native-paper'

const ClientDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>()

  // Mock client data (replace with real data fetching logic)
  const client = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    company: 'Doe Enterprises',
    website: 'https://www.doeenterprises.com',
    address: '123 Main St, Springfield, USA',
  }

  // Mock client-specific KPI data (replace with real data fetching logic)
  const clientKpis = {
    totalInvoices: 15,
    pendingInvoices: 5,
    totalOverdueAmount: 1200,
    totalSalesAmount: 5000,
  }

  const handleEmailPress = (email: string) => {
    Linking.openURL(`mailto:${email}`).catch((err) => console.error('Error opening email app:', err))
  }

  const handlePhonePress = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch((err) => console.error('Error opening phone app:', err))
  }

  const handleWebsitePress = (website: string) => {
    Linking.openURL(website).catch((err) => console.error('Error opening website:', err))
  }

  const handleAddressPress = (address: string) => {
    const encodedAddress = encodeURIComponent(address)
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
    Linking.openURL(mapUrl).catch((err) => console.error('Error opening maps:', err))
  }

  const theme = useTheme()

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Details Card */}
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Text size={64} label={client.name.charAt(0)} style={styles.avatar} />
          <Text variant='headlineSmall' style={[styles.clientName, { color: theme.colors.primary }]}>
            {client.name}
          </Text>
          <Text variant='bodyMedium' style={[styles.companyName, { color: theme.colors.onSurfaceVariant }]}>
            {client.company}
          </Text>

          {/* Contact Icons Row */}
          <View style={styles.contactRow}>
            <TouchableOpacity onPress={() => handlePhonePress(client.phone)}>
              <List.Icon icon='phone' style={styles.contactIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleEmailPress(client.email)}>
              <List.Icon icon='email' style={styles.contactIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleAddressPress(client.address)}>
              <List.Icon icon='map-marker' style={styles.contactIcon} />
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>

      {/* Divider */}
      <Divider style={styles.sectionDivider} />

      {/* Client-Specific KPIs */}
      <Text style={styles.sectionTitle}>Client Overview</Text>
      <View style={styles.kpiGrid}>
        <View style={styles.kpiRow}>
          <KpiCard label='Total Invoices' value={clientKpis.totalInvoices} />
          <KpiCard label='Pending Invoices' value={clientKpis.pendingInvoices} />
        </View>
        <View style={styles.kpiRow}>
          <KpiCard label='Overdue Amount' value={`$${clientKpis.totalOverdueAmount}`} tone='error' />
          <KpiCard label='Total Sales' value={`$${clientKpis.totalSalesAmount}`} tone='success' />
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  profileCard: { marginBottom: 16 },
  profileContent: { alignItems: 'center' },
  avatar: { marginBottom: 12 },
  clientName: { fontWeight: 'bold', marginBottom: 4 },
  companyName: { opacity: 0.7, marginBottom: 12 },
  divider: { marginVertical: 12 },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginVertical: 12,
  },
  contactIcon: { fontSize: 24, opacity: 0.8 },
  sectionDivider: { marginVertical: 16 },
  sectionTitle: { fontWeight: 'bold', marginBottom: 12 },
  kpiGrid: { gap: 16, marginBottom: 16 },
  kpiRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 16 },
})

export default ClientDetail
