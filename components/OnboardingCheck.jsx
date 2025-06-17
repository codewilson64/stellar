import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { View, Text, Image} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MotiView } from 'moti';

import logo from '../assets/icons/logo.png' 

const OnboardingCheck = () => {
  const router = useRouter()

  useEffect(() => {
    const timeout = setTimeout (async () => {
      const hasSeen = await AsyncStorage.getItem('hasSeenOnboarding')
      if(hasSeen === 'true') {
        router.replace('/home')
      }
      else {
        router.replace('/onboarding')
      }
    }, 1000)
    
    return () => clearTimeout(timeout)
  }, [])

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