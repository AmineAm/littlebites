import { Tabs } from 'expo-router'
import { colors } from '@/constants/tokens'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown:     false,
        tabBarStyle:     { backgroundColor: colors.white },
        tabBarActiveTintColor:   colors.coral[400],
        tabBarInactiveTintColor: colors.gray[400],
      }}
    >
      <Tabs.Screen name="index"   options={{ title: 'Home' }} />
      <Tabs.Screen name="plan"    options={{ title: 'Plan' }} />
      <Tabs.Screen name="shop"    options={{ title: 'Shop' }} />
      <Tabs.Screen name="explore" options={{ title: 'Passport' }} />
      <Tabs.Screen name="profile" options={{ title: 'Me' }} />
    </Tabs>
  )
}
