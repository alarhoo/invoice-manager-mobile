import InvoicesList from '@/components/lists/InvoicesList'
import { useAppContext } from '@/src/context/AppContext'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Tabs, TabScreen, TabsProvider } from 'react-native-paper-tabs'

export default function InvoiceListScreen() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(0)
  const { state } = useAppContext()
  const invoices = state.invoices // Fetch invoices from AppContext

  return (
    <View style={styles.container}>
      <TabsProvider defaultIndex={0}>
        <Tabs value={activeTab} onChangeIndex={setActiveTab} mode='fixed' style={styles.tabs}>
          <TabScreen label='Due' icon='file-document-edit'>
            <View style={styles.listContainer}>
              <InvoicesList
                data={invoices.filter((invoice) => invoice.status === 'Overdue')}
                status='Overdue'
                onInvoicePress={(i) => router.push(`/(tabs)/invoices/${i.id}`)}
              />
            </View>
          </TabScreen>

          <TabScreen label='Completed' icon='file-document'>
            <View style={styles.listContainer}>
              <InvoicesList
                data={invoices.filter((invoice) => invoice.status === 'Paid')}
                status='Paid'
                onInvoicePress={(i) => router.push(`/(tabs)/invoices/${i.id}`)}
              />
            </View>
          </TabScreen>

          <TabScreen label='All' icon='file-document-multiple'>
            <View style={styles.listContainer}>
              <InvoicesList
                data={invoices}
                status='All'
                onInvoicePress={(i) => router.push(`/(tabs)/invoices/${i.id}`)}
              />
            </View>
          </TabScreen>
        </Tabs>
      </TabsProvider>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {},
  listContainer: {
    flex: 1,
  },
})
