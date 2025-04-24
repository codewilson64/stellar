import { View, Text, Image } from 'react-native';
import { MotiView } from 'moti';
import { Link } from 'expo-router';
import logo from '../assets/icons/logo.png'

const OnboardingScreen = () => {
  return (
    <View className='flex-1 justify-between items-center bg-blackPearl px-6 py-12'>
     
      {/* Top Content */}
      <MotiView 
        from={{ opacity: 0, translateY: 40 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 1000 }}
        className='flex-1 justify-center items-center'
      >
        <Image source={logo} className='size-32 rounded-full mb-7'/>
        <Text className='text-white font-bold text-center text-5xl mb-3'>Welcome</Text>
        <Text className='text-gray-200 font-normal text-lg text-center'>Let's create your account to start reading</Text>
      </MotiView>
      
      {/* Bottom Button */}
      <Link 
        href='/signup' 
        className='bg-[#13a2f5] items-center w-full py-5 px-4 rounded-xl'
      >
        <Text className='text-white text-lg text-center font-semibold'>Get started</Text>
      </Link>

    </View>
  );
};

export default OnboardingScreen;
