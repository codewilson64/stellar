import { useRouter } from 'expo-router'
import { useContext, useEffect, useState } from 'react'
import { View, Text, Image} from 'react-native'
import { RevenueCatContext } from '../context/RevenueCatContext';
import { MotiView } from 'moti';
import AsyncStorage from '@react-native-async-storage/async-storage';

import logo from '../assets/icons/logo.png' 

const OnboardingCheck = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const { customerInfo } = useContext(RevenueCatContext)

  useEffect(() => {
    const checkFlow = async () => {
      try {
        const hasSeen = await AsyncStorage.getItem('hasSeenOnboarding')

        if (hasSeen !== 'true') {
          router.replace('/onboarding')
          return
        }

        // wait until customerInfo is fetched
        if (!customerInfo) return

        const entitlement = customerInfo?.entitlements?.all?.['premium_access'];
        const activeEntitlement = customerInfo?.entitlements?.active?.['premium_access'];

        // Brand new user → never had entitlement
        if (!entitlement) {
          router.replace('/freetrial');
          return;
        }

        // Currently active (trial or paid)
        if (activeEntitlement) {
          router.replace('/home');
          return;
        }

        // If entitlement exists but not active → trial ended or subscription expired
        router.replace('/expires');
          } finally {
            setIsLoading(false)
          }
        }

      const timeout = setTimeout(checkFlow, 1000)
      return () => clearTimeout(timeout)
  }, [customerInfo])

  if (isLoading) {
    return null // or show a splash/loading screen
  }

  return (
    <View className="flex-1 justify-center items-center bg-blackPearl">
      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing', duration: 1000 }}
        style={{ alignItems: 'center' }}
      >
        <Image source={logo} className='size-28 rounded-full mb-5' />
        <Text className="text-white text-4xl font-bold">Stellar</Text>
      </MotiView>
    </View>
  )
}
export default OnboardingCheck