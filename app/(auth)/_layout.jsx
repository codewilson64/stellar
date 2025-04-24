import { Stack } from 'expo-router'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import GuestOnly from '../../components/auth/GuestOnly'

const AuthLayout = () => {
  const { user } = useContext(AuthContext)

  console.log('Logged user:', user)

  return (
    <GuestOnly>
      <Stack screenOptions={{headerShown: false}}/>
    </GuestOnly>
  )
}

export default AuthLayout