import { useRouter } from 'expo-router'
import { View, Text, TextInput, Image, TouchableWithoutFeedback, Keyboard, Pressable, ActivityIndicator } from 'react-native'
import emailIcon from '../../assets/icons/email.png'
import passwordIcon from '../../assets/icons/password.png'
import { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'

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
      <View className='flex-1 justify-center items-center px-10 bg-blackPearl'>

        <Text className='text-2xl text-white font-bold mb-12'>Log in</Text>

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
            placeholder='Password'
            placeholderTextColor='#ccc'
            secureTextEntry
            className='flex-1 text-white'
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <Pressable onPress={handleLogin} disabled={isLoading} className='bg-[#13a2f5] items-center w-full py-5 px-4 rounded-xl mb-12'>
          {isLoading ? (
            <ActivityIndicator size='small' color='white'/>
          ) : (
            <Text className='text-white text-xl text-center font-semibold'>Log in</Text>
          )}
        </Pressable>

        <View className='w-full text-left'>
          {error && <Text className='text-red-500 mb-12'>{error}</Text>}
        </View>

        <View className='flex-row gap-1'>
          <Text className='text-gray-200'>Don't have an account?</Text>
          <Pressable onPress={() => router.replace('/signup')}>
            <Text className='text-[#13a2f5] underline'>Sign up</Text>
          </Pressable>
        </View>

      </View>
    </TouchableWithoutFeedback>
  )
}

export default LoginScreen