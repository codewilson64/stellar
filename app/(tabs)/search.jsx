import { View, Text, Pressable, ScrollView, Image } from 'react-native'
import SearchBar from '../../components/SearchBar'
import { Categories } from '../../constants/category'
import { useRouter } from 'expo-router'

const SearchPage = () => {
  const router = useRouter()

  return (
    <View className='flex-1 bg-blackPearl'>
      <SearchBar />


      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 20}}
      >
        <View className='px-5'>
          <Text className='text-2xl text-white font-bold mt-3 mb-5'>I want to learn about</Text>
        </View>

        <View className='flex-col gap-4 px-5'>
        {Categories.map((item) => (
          <Pressable key={item.id} onPress={() => router.push(`category/${item.category}`)}>
            <View className='flex-row items-center gap-6 w-full p-10 border border-gray-400/60 bg-zinc-800 rounded-xl'>
              <Image 
                source={item.icon} 
                className='size-8' 
                tintColor={'white'} 
                resizeMode='contain'
              />
              <Text className='text-2xl font-bold text-white'>{item.category}</Text>
            </View>
          </Pressable>
        ))}
        </View>
      </ScrollView>


    </View>
  )
}

export default SearchPage