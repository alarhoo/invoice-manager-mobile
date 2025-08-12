import React from 'react'
import { Card, Text, useTheme } from 'react-native-paper'

export type KpiCardProps = {
  label: string
  value: string | number
  tone?: 'success' | 'warning' | 'error'
}

const KpiCard = ({ label, value, tone }: KpiCardProps) => {
  const theme = useTheme()
  const color =
    tone === 'success' ? '#2e7d32' : tone === 'warning' ? '#f57c00' : tone === 'error' ? theme.colors.error : undefined

  return (
    <Card style={{ flexBasis: '48%', flexGrow: 1, marginBottom: 12 }}>
      <Card.Content style={{ alignItems: 'center', paddingVertical: 18 }}>
        <Text variant='bodyLarge' style={{ opacity: 0.7, marginBottom: 6 }}>
          {label}
        </Text>
        <Text variant='headlineMedium' style={{ fontWeight: 'bold', color }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </Text>
      </Card.Content>
    </Card>
  )
}

export default KpiCard
