import { View, Text, Image, Pressable } from 'react-native';
import { AnimatePresence, MotiView } from 'moti';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import onboardingImage from '../assets/onboarding/onboarding_image_1.png'

const messages = [
  {
    title: <>Summary in <Text className='text-[#13a2f5]'>10 minutes</Text></>,
    description: 'We read the best books and create summaries for you'
  },
  {
    title: <><Text className='text-[#13a2f5]'>Explore</Text> your favourite books</>,
    description: 'Choose your favourite topic and gain knowledge and insights to become your best self'
  },
  {
    title: <><Text className='text-[#13a2f5]'>Simple</Text> and short summary</>,
    description: 'No need to read a 300+ pages book, we have you covered with the best summaries.'
  },
  {
    title: <><Text className=''>That's it! Let's dive and start your new journey with Stellar</Text></>,
  }
]

const OnboardingScreen = () => {
  const router = useRouter()
  const [step, setStep] = useState(0)

  const handleContinue = async () => {
    if (step < 3) {
      setStep(prev => prev + 1);
    } else {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true')
      router.replace('/login');
    }
  };

  return (
    <View className='flex-1 justify-between items-center bg-blackPearl px-6 py-12'>
     
      {/* Top Content */}
      <View className='flex-1 justify-center items-center'>
        <Image source={onboardingImage} className='w-96 h-96 rounded-xl'/>       
      </View>
      
      {/* Animated Messages */}
      <View className='w-full gap-[90px]'>
        <AnimatePresence exitBeforeEnter>
          <MotiView
            key={step}
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -30 }}
            transition={{ type: 'timing', duration: 300 }}
          >
            <Text className='text-white font-bold text-left text-3xl mb-5 leading-10'>
              {messages[step].title}
            </Text>
            <Text className='text-gray-200 font-normal text-lg text-left'>
              {messages[step].description}
            </Text>
          </MotiView>
        </AnimatePresence>

        {/* Button */}
        <Pressable
          onPress={handleContinue}
          className='bg-[#13a2f5] items-center w-full py-5 px-4 rounded-xl'
        >
          <Text className='text-white text-lg text-center font-semibold'>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default OnboardingScreen
