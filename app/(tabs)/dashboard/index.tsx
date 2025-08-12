import KpiCard from '@/components/KpiCard'
import ClientsList from '@/components/lists/ClientsList'
import InvoicesList from '@/components/lists/InvoicesList'
import { KPIs, SalesRange, formatCurrency, getKPIs, getSalesTrend } from '@/lib/dashboardData'
import { useRouter } from 'expo-router'
import React from 'react'
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native'
import { LineChart } from 'react-native-chart-kit'
import { Card, SegmentedButtons, Text, useTheme } from 'react-native-paper'

const DashboardScreen = () => {
  const router = useRouter()
  const theme = useTheme()
  const screenWidth = Dimensions.get('window').width

  // Dashboard state sourced via data services
  const [kpis, setKpis] = React.useState<KPIs | null>(null)
  const [salesRange, setSalesRange] = React.useState<SalesRange>('month')
  const [salesLabels, setSalesLabels] = React.useState<string[]>([])
  const [salesValues, setSalesValues] = React.useState<number[]>([])
  const hasChartVariance = React.useMemo(() => {
    if (salesValues.length < 2) return false
    const min = Math.min(...salesValues)
    const max = Math.max(...salesValues)
    return Number.isFinite(min) && Number.isFinite(max) && max !== min
  }, [salesValues])

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      const k = await getKPIs()
      if (!mounted) return
      setKpis(k)
    })()
    return () => {
      mounted = false
    }
  }, [])

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      const s = await getSalesTrend(salesRange)
      if (!mounted) return
      // Ensure arrays align and values are finite
      const len = Math.min(s.labels.length, s.values.length)
      const labels = s.labels.slice(0, len)
      const values = s.values.slice(0, len).map((v) => (typeof v === 'number' && Number.isFinite(v) ? v : 0))
      setSalesLabels(labels)
      setSalesValues(values)
    })()
    return () => {
      mounted = false
    }
  }, [salesRange])

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
    labelColor: (_opacity = 1) => theme.colors.onSurface,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: theme.colors.primary,
    },
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text variant='headlineSmall' style={styles.sectionTitle}>
        Business Overview
      </Text>

      <View style={styles.kpiGrid}>
        <KpiCard label='Total Invoices' value={kpis?.totalInvoices ?? 0} />
        <KpiCard label='Pending Invoices' value={kpis?.pendingInvoices ?? 0} />
        <KpiCard label='Overdue Amount' value={formatCurrency(kpis?.totalOverdueAmount ?? 0)} tone='error' />
        <KpiCard label='Total Sales' value={formatCurrency(kpis?.totalSalesAmount ?? 0)} tone='success' />
        <KpiCard label='Total Clients' value={kpis?.totalClients ?? 0} />
        <KpiCard label='Total Items' value={kpis?.totalItems ?? 0} />
      </View>

      {/* Sales Trend Chart */}
      <Text variant='headlineSmall' style={styles.sectionTitle}>
        Sales Trend
      </Text>
      <Card style={styles.chartCard}>
        <Card.Content>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <SegmentedButtons
              value={salesRange}
              onValueChange={(v) => setSalesRange(v as SalesRange)}
              buttons={[
                { value: 'week', label: 'Week' },
                { value: 'month', label: 'Month' },
                { value: 'year', label: 'Year' },
              ]}
            />
          </View>
          {hasChartVariance ? (
            <LineChart
              data={{ labels: salesLabels, datasets: [{ data: salesValues }] }}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          ) : (
            <View style={{ paddingVertical: 32, alignItems: 'center' }}>
              <Text variant='bodyMedium' style={{ opacity: 0.6 }}>
                Not enough data to display chart.
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Recent Clients Section */}
      <Text variant='headlineSmall' style={styles.sectionTitle}>
        Recent Clients
      </Text>
      <Card style={styles.listCard}>
        <Card.Content>
          <ClientsList
            mode='compact'
            limit={5}
            virtualized={false}
            scrollEnabled={false}
            onClientPress={(c) => router.push(`/(tabs)/clients/${c.id}`)}
          />
        </Card.Content>
      </Card>

      {/* Recent Invoices Section */}
      <Text variant='headlineSmall' style={styles.sectionTitle}>
        Recent Invoices
      </Text>
      <Card style={styles.listCard}>
        <Card.Content>
          <InvoicesList
            mode='compact'
            limit={5}
            virtualized={false}
            scrollEnabled={false}
            onInvoicePress={(i) => router.push(`/(tabs)/invoices/${i.id}`)}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 8 },
  listCard: {
    marginBottom: 16,
  },
  chartCard: {
    marginBottom: 16,
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
