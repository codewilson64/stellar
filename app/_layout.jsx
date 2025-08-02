import 'react-native-url-polyfill/auto'
import './global.css'
import { Stack } from 'expo-router'
import { BookmarkContextProvider } from '../context/BookmarkContext'
import { AuthContextProvider } from '../context/AuthContext'
import { RevenueCatProvider } from '../context/RevenueCatContext'
import { StatusBar } from 'react-native'
import { BooksContextProvider } from '../context/BooksContext'
import { ThemeContextProvider } from '../context/ThemeContext'

const RootLayout = () => {

  return (
    <AuthContextProvider>
      <RevenueCatProvider>
        <BooksContextProvider>
          <BookmarkContextProvider>
            <ThemeContextProvider>
              <StatusBar backgroundColor="#181818" barStyle="light-content"/>
              <Stack>
                <Stack.Screen name='onboarding' options={{headerShown: false}}/>
                <Stack.Screen name='index' options={{headerShown: false}}/>
                <Stack.Screen name='paywall' options={{headerShown: false}}/>
                <Stack.Screen name='settings' options={{headerShown: false}}/>
                <Stack.Screen name='(auth)' options={{headerShown: false}}/>
                <Stack.Screen name='(tabs)' options={{headerShown: false}}/>
                <Stack.Screen name='books/[id]' options={{headerShown: false}}/>
                <Stack.Screen name='category/[category]' options={{headerShown: false}}/>
                <Stack.Screen name='summary/[id]' options={{headerShown: false}}/>
              </Stack>
            </ThemeContextProvider>
          </BookmarkContextProvider>
        </BooksContextProvider>
      </RevenueCatProvider>
    </AuthContextProvider>
  )
}

export default RootLayout

