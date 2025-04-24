import { ActivityIndicator, View } from "react-native"
import { useContext, useEffect } from "react"
import { AuthContext } from "../../context/AuthContext"
import { useRouter } from "expo-router"

const AuthUserOnly = ({ children }) => {
  const { user } = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    if(user === null) {
      router.replace('/login')
    }
  }, [user])

  if(!user) {
    return (
      <View className='flex-1 justify-center items-center bg-blackPearl'>
        <ActivityIndicator size='large' color='white'/>
      </View>
    )
  }

  return children
}

export default AuthUserOnly