import { View, Text, Pressable, Image, Linking, Modal, ActivityIndicator } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'

import email from '../assets/icons/email.png'
import policy from '../assets/icons/policy.png'
import terms from '../assets/icons/terms.png'
import logoutIcon from '../assets/icons/logout.png'
import premium from '../assets/icons/premium.png'
import arrow from '../assets/icons/arrow.png'
import userIcon from '../assets/icons/user.png'
import { RevenueCatContext } from '../context/RevenueCatContext'

const PRIVACY_POLICY_URL = 'https://withstellar.vercel.app/privacypolicy'
const TERMS_URL = 'https://withstellar.vercel.app/termsofuse'
const SUPPORT_EMAIL = 'wilsongambit@gmail.com'

const SettingsScreen = () => {
  const [openModal, setOpenModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const { user, logout, deactivateAccount } = useContext(AuthContext)
  const { customerInfo } = useContext(RevenueCatContext)
  const router = useRouter()

  const hasAccess = customerInfo?.entitlements?.active?.premium_access
  const isTrial = customerInfo?.entitlements?.["premium_access"]?.periodType === 'trial';

  const handleDeactivateAccount = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await deactivateAccount()
    } 
    catch (error) {
      setError(error.message)
    }
    finally {
      setIsLoading(false)
    }
  }

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
          
          {!hasAccess && !isTrial && (
            <Link href='/paywall' >
              <View className='flex-row items-center gap-3 py-3'>
                <Image source={premium} className='size-7' tintColor={'#e9eaec'}/>
                <Text className='text-gray-300 text-xl font-semibold'>Upgrade to Premium</Text>            
              </View>
            </Link>
          )}
          
        </View>
      </View>

      <View>
        <Text className='text-xl text-gray-300 font-normal mb-4 px-5'>Account</Text>
        {user ? (
          <View>
            <Pressable onPress={() => setOpenModal(true)} className='flex-row items-center gap-3 py-3 px-5'>
              <Image source={userIcon} className='size-6' tintColor={'#e9eaec'}/>
              <Text className='text-gray-300 text-xl font-semibold'>Delete account</Text>
            </Pressable>
            <Pressable onPress={logout} className='flex-row items-center gap-3 py-3 px-5'>
              <Image source={logoutIcon} className='size-6' tintColor={'#e9eaec'}/>
              <Text className='text-gray-300 text-xl font-semibold'>Log out</Text>
            </Pressable>
          </View>
        ): (
          <View className='px-5'>
            <Link href='/login' className='w-28 flex-row items-center bg-zinc-800 rounded-lg px-4 py-3'>
              <Text className='text-gray-300 text-xl text-center font-semibold'>Log in</Text>
            </Link>
          </View>          
        )}       
      </View>

      {/* Modal */}
      <Modal 
        visible={openModal} 
        onRequestClose={() => setOpenModal(false)}
        animationType='slide'
      >
        <View className='flex-1 justify-center bg-blackPearl p-10'>
          <Text className='text-gray-300 text-xl font-semibold mb-7'>
            Are you sure you want to delete your account <Text className='italic underline'>{user?.email}</Text>?
          </Text>
          <Pressable onPress={handleDeactivateAccount} disabled={isLoading} className='bg-red-500 items-center w-full py-4 px-4 rounded-xl mb-5'>
            {isLoading ? (
              <ActivityIndicator size='small' color='white'/>
            ): ( 
              <Text className='text-white text-lg text-center font-semibold'>Delete account</Text>
            )}
          </Pressable>
          <Pressable onPress={() => setOpenModal(false)}>
            <Text className='text-white text-lg text-center font-semibold mb-5'>Cancel</Text>
          </Pressable>
          
          {/* Error message */}
          <View className='w-full text-left'>
            {error && <Text className='text-red-500'>{error}</Text>}
          </View>

        </View>
      </Modal>
    </View>
  )
}

export default SettingsScreen