import { Link, useRouter } from 'expo-router'
import { View, Text, TextInput, Image, TouchableWithoutFeedback, Keyboard, Pressable, ActivityIndicator } from 'react-native'
import { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'

import logo from '../../assets/icons/logo.png'
import emailIcon from '../../assets/icons/email.png' 
import passwordIcon from '../../assets/icons/password.png'
import googleIcon from '../../assets/icons/google.png'

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const router = useRouter()
  const { login } = useContext(AuthContext)

  const handleLogin = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await login(email, password)
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className='flex-1 bg-blackPearl'>

        <View className='flex-row justify-between items-center gap-2 px-5'>
          <View className='flex-row items-center gap-2'>
            <Image source={logo} className='size-10 rounded-full'/>
            <Text className='text-2xl text-white font-bold mt-4 mb-4 text-center'>Stellar</Text>
          </View>
        
          <Link href='/home' className='bg-zinc-800 rounded-lg px-4 py-3'>
            <Text className='text-white font-semibold text-md'>Skip</Text>
          </Link>
        </View>

        <View className='flex-1 justify-center px-10 bg-blackPearl'>
          <View className='flex-col mb-12'>
            <Text className='text-4xl text-white font-bold mb-4 leading-10'>
              Let's start your new journey with Stellar!
            </Text>
            <Text className='text-gray-200 font-normal text-lg text-left'>
              Create your first account
            </Text>
          </View>

          <View className='w-full flex-row items-center mb-5 border text-white border-gray-400/60 bg-zinc-800 rounded-lg px-5 py-4'>
            <Image source={emailIcon} tintColor={'#13a2f5'} className='size-5 mr-2'/>
            <TextInput 
              placeholder='Email'
              placeholderTextColor='#ccc'
              keyboardType='email-address'
              className='flex-1 text-white'
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View className='w-full flex-row items-center mb-5 border text-white border-gray-400/60 bg-zinc-800 rounded-lg px-5 py-4'>
            <Image source={passwordIcon} tintColor={'#13a2f5'} className='size-5 mr-2'/>
            <TextInput 
              placeholder='password'
              placeholderTextColor='#ccc'
              secureTextEntry
              className='flex-1 text-white'
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <Pressable onPress={handleLogin} disabled={isLoading} className='bg-[#13a2f5] items-center w-full py-4 px-4 rounded-xl mb-5'>
            {isLoading ? (
              <ActivityIndicator size='small' color='white'/>
            ) : (
              <Text className='text-white text-lg text-center font-semibold'>Log in</Text>
            )}
          </Pressable>

          {/* <Pressable className='flex-row items-center justify-center w-full border border-blue-500 py-3 px-4 rounded-xl mb-12'>
            <View className='items-center rounded-full p-2 mr-2'>
              <Image source={googleIcon} className='size-6 rounded-full' resizeMode='contain'/>
            </View>
            <Text className='text-white text-lg text-center font-semibold'>Continue with Google</Text>
          </Pressable> */}

          {/* Error message */}
          <View className='w-full text-left'>
            {error && <Text className='text-red-500 mb-12'>{error}</Text>}
          </View>

          <View className='flex-row gap-1 justify-center'>
            <Text className='text-gray-200'>Don't have an account?</Text>
            <Pressable onPress={() => router.replace('/signup')}>
              <Text className='text-[#13a2f5] underline'>Sign up</Text>
            </Pressable>
          </View>
        </View>

      </View>
    </TouchableWithoutFeedback>
  )
}

export default LoginScreen