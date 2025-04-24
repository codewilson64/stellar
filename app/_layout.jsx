import './global.css'
import { Stack } from 'expo-router'
import { BookmarkContextProvider } from '../context/BookmarkContext'
import { AuthContextProvider } from '../context/AuthContext'

const RootLayout = () => {
  return (
    <AuthContextProvider>
        <BookmarkContextProvider>
          <Stack>
            <Stack.Screen name='index' options={{headerShown: false}}/>
            <Stack.Screen name='(auth)' options={{headerShown: false}}/>
            <Stack.Screen name='(tabs)' options={{headerShown: false}}/>
            <Stack.Screen name='books/[id]' options={{headerShown: false}}/>
            <Stack.Screen name='category/[category]' options={{headerShown: false}}/>
            <Stack.Screen name='summary/[id]' options={{headerShown: false}}/>
          </Stack>
        </BookmarkContextProvider>
    </AuthContextProvider>
  )
}

export default RootLayout

