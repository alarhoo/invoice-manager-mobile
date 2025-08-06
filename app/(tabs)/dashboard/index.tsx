import React from 'react'
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native'
import { LineChart } from 'react-native-chart-kit'
import { Card, Divider, IconButton, List, Surface, Text, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const DashboardScreen = () => {
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const screenWidth = Dimensions.get('window').width

  // Mock data - replace with actual Firestore data
  const kpis = {
    totalInvoices: 24,
    pendingInvoices: 8,
    topClient: 'ABC Corp',
    monthlyRevenue: '$12,500',
  }

  // Mock chart data for monthly invoice totals
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [8500, 12000, 9800, 15200, 11000, 12500],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  }

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
    labelColor: (opacity = 1) => theme.colors.onSurface,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: theme.colors.primary,
    },
  }

  const recentClients = [
    { id: '1', name: 'ABC Corp', email: 'contact@abccorp.com' },
    { id: '2', name: 'XYZ Ltd', email: 'info@xyz.com' },
    { id: '3', name: 'Tech Solutions', email: 'hello@techsol.com' },
    { id: '4', name: 'Digital Agency', email: 'team@digital.com' },
    { id: '5', name: 'StartUp Inc', email: 'hi@startup.com' },
  ]

  const recentInvoices = [
    { id: 'INV-001', client: 'ABC Corp', amount: '$2,500', status: 'Paid' },
    { id: 'INV-002', client: 'XYZ Ltd', amount: '$1,800', status: 'Pending' },
    { id: 'INV-003', client: 'Tech Solutions', amount: '$3,200', status: 'Overdue' },
    { id: 'INV-004', client: 'Digital Agency', amount: '$950', status: 'Paid' },
    { id: 'INV-005', client: 'StartUp Inc', amount: '$1,200', status: 'Pending' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return theme.colors.primary
      case 'Pending':
        return theme.colors.tertiary
      case 'Overdue':
        return theme.colors.error
      default:
        return theme.colors.onSurface
    }
  }

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.contentContainer}>
      {/* KPIs Section */}
      <Text variant='headlineSmall' style={styles.sectionTitle}>
        Business Overview
      </Text>

      <View style={styles.kpiContainer}>
        <Card style={styles.kpiCard}>
          <Card.Content style={styles.kpiContent}>
            <Text variant='bodyLarge' style={styles.kpiLabel}>
              Total Invoices
            </Text>
            <Text variant='headlineMedium' style={styles.kpiValue}>
              {kpis.totalInvoices}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.kpiCard}>
          <Card.Content style={styles.kpiContent}>
            <Text variant='bodyLarge' style={styles.kpiLabel}>
              Pending
            </Text>
            <Text variant='headlineMedium' style={[styles.kpiValue, { color: theme.colors.tertiary }]}>
              {kpis.pendingInvoices}
            </Text>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.kpiContainer}>
        <Card style={styles.kpiCard}>
          <Card.Content style={styles.kpiContent}>
            <Text variant='bodyLarge' style={styles.kpiLabel}>
              Top Client
            </Text>
            <Text variant='titleMedium' style={styles.kpiValue}>
              {kpis.topClient}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.kpiCard}>
          <Card.Content style={styles.kpiContent}>
            <Text variant='bodyLarge' style={styles.kpiLabel}>
              This Month
            </Text>
            <Text variant='headlineMedium' style={[styles.kpiValue, { color: theme.colors.primary }]}>
              {kpis.monthlyRevenue}
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Monthly Analytics Chart */}
      <Text variant='headlineSmall' style={styles.sectionTitle}>
        Monthly Revenue Trend
      </Text>

      <Card style={styles.chartCard}>
        <Card.Content>
          <LineChart
            data={chartData}
            width={screenWidth - 64} // screen width minus padding
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      {/* Recent Clients Section */}
      <Text variant='headlineSmall' style={styles.sectionTitle}>
        Recent Clients
      </Text>

      <Card style={styles.listCard}>
        <Card.Content>
          {recentClients.map((client, index) => (
            <View key={client.id}>
              <List.Item
                title={client.name}
                description={client.email}
                left={(props) => <List.Icon {...props} icon='account' />}
                right={(props) => <IconButton {...props} icon='chevron-right' />}
                onPress={() => {
                  /* Navigate to client details */
                }}
              />
              {index < recentClients.length - 1 && <Divider />}
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Recent Invoices Section */}
      <Text variant='headlineSmall' style={styles.sectionTitle}>
        Recent Invoices
      </Text>

      <Card style={styles.listCard}>
        <Card.Content>
          {recentInvoices.map((invoice, index) => (
            <View key={invoice.id}>
              <List.Item
                title={invoice.id}
                description={invoice.client}
                left={(props) => <List.Icon {...props} icon='file-document' />}
                right={() => (
                  <View style={styles.invoiceRight}>
                    <Text variant='titleMedium' style={styles.invoiceAmount}>
                      {invoice.amount}
                    </Text>
                    <Surface style={[styles.statusBadge, { backgroundColor: getStatusColor(invoice.status) + '20' }]}>
                      <Text variant='labelSmall' style={[styles.statusText, { color: getStatusColor(invoice.status) }]}>
                        {invoice.status}
                      </Text>
                    </Surface>
                  </View>
                )}
                onPress={() => {
                  /* Navigate to invoice details */
                }}
              />
              {index < recentInvoices.length - 1 && <Divider />}
            </View>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100, // Extra padding for tab bar
  },
  sectionTitle: {
    marginVertical: 16,
    marginHorizontal: 4,
    fontWeight: 'bold',
  },
  kpiContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  kpiCard: {
    flex: 1,
    elevation: 2,
  },
  kpiContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  kpiLabel: {
    opacity: 0.7,
    marginBottom: 8,
  },
  kpiValue: {
    fontWeight: 'bold',
  },
  listCard: {
    marginBottom: 16,
    elevation: 2,
  },
  chartCard: {
    marginBottom: 16,
    elevation: 2,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  invoiceRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  invoiceAmount: {
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 10,
  },
})

export default DashboardScreen
