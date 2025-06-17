import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import AuthUserOnly from '../../components/auth/AuthUserOnly'

const DashboardLayout = () => {
  return (
      <Tabs 
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#181818',
            borderColor: 'rgba(75, 85, 99, 0.5)',
            height: 55,
          }
        }}
      >
        <Tabs.Screen 
          name='home'
          options={{title: 'Home', tabBarIcon: ({focused}) => (
            <Ionicons 
              size={24}
              name={focused ? 'home' : 'home-outline'}
              color={focused ? '#0096ff' : 'gray'}
            />
          )}}
        />
        <Tabs.Screen 
          name='search'
          options={{title: 'Explore', tabBarIcon: ({focused}) => (
            <Ionicons 
              size={24}
              name={focused ? 'search' : 'search-outline'}
              color={focused ? '#0096ff' : 'gray'}
            />
          )}}
        />
        <Tabs.Screen 
          name='saved'
          options={{title: 'Library', tabBarIcon: ({focused}) => (
            <Ionicons
              size={24}
              name={focused ? 'bookmark' : 'bookmark-outline'}
              color={focused ? '#0096ff' : 'gray'}
            />
          )}}
      />
      </Tabs>
  )
}

export default DashboardLayout