import './global.css'
import { Stack } from 'expo-router'
import { BookmarkContextProvider } from '../context/BookmarkContext'
import { AuthContextProvider } from '../context/AuthContext'
import { RevenueCatProvider } from '../context/RevenueCatContext'
import { Platform, StatusBar } from 'react-native'
import { useEffect } from 'react'
import changeNavigationBarColor from 'react-native-navigation-bar-color'

const RootLayout = () => {
  useEffect(() => {
    if(Platform.OS === 'android') {
      changeNavigationBarColor("#181818", false).catch(console.warn)
    }
  }, [])

  return (
    <AuthContextProvider>
      <RevenueCatProvider>
        <BookmarkContextProvider>
          <StatusBar backgroundColor="#181818" barStyle="light-content"/>
          <Stack>
            <Stack.Screen name='index' options={{headerShown: false}}/>
            <Stack.Screen name='paywall' options={{headerShown: false}}/>
            <Stack.Screen name='settings' options={{headerShown: false}}/>
            <Stack.Screen name='(auth)' options={{headerShown: false}}/>
            <Stack.Screen name='(tabs)' options={{headerShown: false}}/>
            <Stack.Screen name='books/[id]' options={{headerShown: false}}/>
            <Stack.Screen name='category/[category]' options={{headerShown: false}}/>
            <Stack.Screen name='summary/[id]' options={{headerShown: false}}/>
          </Stack>
        </BookmarkContextProvider>
      </RevenueCatProvider>
    </AuthContextProvider>
  )
}

export default RootLayout

