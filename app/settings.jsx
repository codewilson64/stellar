import { View, Text, Pressable, Image } from 'react-native'
import { Link } from 'expo-router'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

import rate from '../assets/icons/rate.png'
import email from '../assets/icons/email.png'
import policy from '../assets/icons/policy.png'
import terms from '../assets/icons/terms.png'
import logoutIcon from '../assets/icons/logout.png'
import premium from '../assets/icons/premium.png'

const SettingsScreen = () => {
  const { logout } = useContext(AuthContext)

  return (
    <View className='flex-1 bg-blackPearl'>
      <View className='mt-4 mb-4'>
        <Text className='text-white text-2xl font-bold text-center'>Settings</Text>
      </View>

      <View className='mb-10'>
        <Text className='text-xl text-gray-300 font-normal mb-4 px-5'>Support</Text>

        <View className='flex-col gap-2 px-5'>
          <View className='flex-row items-center gap-3 py-3'>
            <Image source={rate} className='size-7' tintColor={'#e9eaec'}/>
            <Text className='text-gray-300 text-xl font-semibold'>Rate the App</Text>
          </View>

          <View className='flex-row items-center gap-3 py-3'>
            <Image source={email} className='size-7' tintColor={'#e9eaec'}/>
            <Text className='text-gray-300 text-xl font-semibold'>Email Support</Text>
          </View>

          <View className='flex-row items-center gap-3 py-3'>
            <Image source={policy} className='size-7' tintColor={'#e9eaec'}/>
            <Text className='text-gray-300 text-xl font-semibold'>Privacy Policy</Text>
          </View>

          <View className='flex-row items-center gap-3 py-3'>
            <Image source={terms} className='size-7' tintColor={'#e9eaec'}/>
            <Text className='text-gray-300 text-xl font-semibold'>Terms of Service</Text>
          </View>

          <Link href='/paywall' >
            <View className='flex-row items-center gap-3 py-3'>
              <Image source={premium} className='size-7' tintColor={'#e9eaec'}/>
              <Text className='text-gray-300 text-xl font-semibold'>Upgrade to Premium</Text>            
            </View>
          </Link>
          
        </View>
      </View>

      <View>
        <Text className='text-xl text-gray-300 font-normal mb-4 px-5'>Account</Text>

        <Pressable onPress={logout} className='flex-row items-center gap-3 py-3 px-5'>
          <Image source={logoutIcon} className='size-6' tintColor={'#e9eaec'}/>
          <Text className='text-gray-300 text-xl font-semibold'>Log out</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default SettingsScreen