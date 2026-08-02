import { Tabs } from 'expo-router'
import { Text } from 'react-native'
import { colors, typography } from '@/constants/tokens'

/** Tabs are named for what you do, not what the screen contains. */
const ICONS: Record<string, string> = {
  index:    '🍽️',
  plan:     '🗓️',
  shop:     '🛒',
  passport: '🌍',
}

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{ICONS[name]}</Text>
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.gray[100],
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: { ...typography.label },
        tabBarActiveTintColor:   colors.coral[400],
        tabBarInactiveTintColor: colors.gray[400],
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ focused }) => <TabIcon name="index" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: 'Plan',
          tabBarIcon: ({ focused }) => <TabIcon name="plan" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarIcon: ({ focused }) => <TabIcon name="shop" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="passport"
        options={{
          title: 'Passport',
          tabBarIcon: ({ focused }) => <TabIcon name="passport" focused={focused} />,
        }}
      />
    </Tabs>
  )
}
