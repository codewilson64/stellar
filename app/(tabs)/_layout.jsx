import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import AuthUserOnly from '../../components/auth/AuthUserOnly'

const DashboardLayout = () => {
  return (
    <AuthUserOnly>
      <Tabs 
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#181818',
            height: 60,
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
          options={{title: 'Search', tabBarIcon: ({focused}) => (
            <Ionicons 
              size={24}
              name={focused ? 'search' : 'search-outline'}
              color={focused ? '#0096ff' : 'gray'}
            />
          )}}
        />
        <Tabs.Screen 
          name='saved'
          options={{title: 'Saved', tabBarIcon: ({focused}) => (
            <Ionicons
              size={24}
              name={focused ? 'heart' : 'heart-outline'}
              color={focused ? '#0096ff' : 'gray'}
            />
          )}}
      />
      </Tabs>
    </AuthUserOnly>
  )
}

export default DashboardLayout