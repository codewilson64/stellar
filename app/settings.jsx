import { View, Text, Pressable, Image, Linking } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

import rate from '../assets/icons/rate.png'
import email from '../assets/icons/email.png'
import policy from '../assets/icons/policy.png'
import terms from '../assets/icons/terms.png'
import logoutIcon from '../assets/icons/logout.png'
import premium from '../assets/icons/premium.png'
import arrow from '../assets/icons/arrow.png'

const PRIVACY_POLICY_URL = 'https://withstellar.vercel.app/privacypolicy'
const TERMS_URL = 'https://withstellar.vercel.app/termsofuse'
const SUPPORT_EMAIL = 'wilsongambit@gmail.com'

const SettingsScreen = () => {
  const { user, logout } = useContext(AuthContext)
  const router = useRouter()

  return (
    <View className='flex-1 bg-blackPearl'>

      <View className='flex-row items-center px-5 gap-6 mt-4 mb-8'>
        <Pressable onPress={router.back}>
          <Image source={arrow} style={{tintColor: 'gray'}} className='size-6'/>          
        </Pressable>
        <Text className='text-white text-2xl font-bold text-center'>Settings</Text>
      </View>

      <View className='mb-10'>
        <Text className='text-xl text-gray-300 font-normal mb-4 px-5'>Support</Text>

        <View className='flex-col gap-2 px-5'>
          {/* <View className='flex-row items-center gap-3 py-3'>
            <Image source={rate} className='size-7' tintColor={'#e9eaec'}/>
            <Text className='text-gray-300 text-xl font-semibold'>Rate the App</Text>
          </View> */}

          <Pressable onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=Support Request - Stellar`)}>
            <View className='flex-row items-center gap-3 py-3'>
              <Image source={email} className='size-7' tintColor={'#e9eaec'}/>
              <Text className='text-gray-300 text-xl font-semibold'>Email Support</Text>
            </View>
          </Pressable>

          <Pressable onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}> 
            <View className='flex-row items-center gap-3 py-3'>
              <Image source={policy} className='size-7' tintColor={'#e9eaec'}/>
              <Text className='text-gray-300 text-xl font-semibold'>Privacy Policy</Text>
            </View>
          </Pressable>
          
          <Pressable onPress={() => Linking.openURL(TERMS_URL)}>
            <View className='flex-row items-center gap-3 py-3'>
              <Image source={terms} className='size-7' tintColor={'#e9eaec'}/>
              <Text className='text-gray-300 text-xl font-semibold'>Terms of Service</Text>
            </View>
          </Pressable>

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
        {user ? (
          <Pressable onPress={logout} className='flex-row items-center gap-3 py-3 px-5'>
            <Image source={logoutIcon} className='size-6' tintColor={'#e9eaec'}/>
            <Text className='text-gray-300 text-xl font-semibold'>Log out</Text>
          </Pressable>
        ): (
          <View className='px-5'>
            <Link href='/login' className='w-28 flex-row items-center bg-zinc-800 rounded-lg px-4 py-3'>
              <Text className='text-gray-300 text-xl text-center font-semibold'>Log in</Text>
            </Link>
          </View>
          
        )}       
      </View>
    </View>
  )
}

export default SettingsScreen