import { View, Text, Pressable } from 'react-native'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext)

  return (
    <View className='flex-1 justify-center items-center bg-blackPearl'>
      <Text className='text-2xl text-white font-bold'>{user.email}</Text>
      <Pressable onPress={logout}>
        <Text className='text-[#13a2f5] underline'>Log out</Text>
      </Pressable>
    </View>
  )
}

export default ProfilePage