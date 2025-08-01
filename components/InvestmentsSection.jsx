import { View, Text, FlatList, Pressable, Image, ActivityIndicator } from 'react-native'
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { BooksContext } from '../context/BooksContext'

const SelfGrowthSection = () => {
  const [books, setBooks] = useState([])
  const router = useRouter()
  const { fetchRandomCategory } = useContext(BooksContext)
  
  useEffect(() => {
    const loadCategory = async () => {
      const data = await fetchRandomCategory("Money & Investments")
      setBooks(data)
    }

    loadCategory()
  }, [])

  if(!books) {
      return (
        <ActivityIndicator size="large" className='flex-1 justify-center'/>
      )
    }

  return (
    <View className='mb-10'>
        <Text className='text-2xl text-white font-bold mb-2 px-5'>Money & Investments</Text>
          <Text className='text-md text-gray-300 mb-3 px-5'>Top-rated summaries</Text>
          <FlatList
            data={books}
            horizontal={true}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => (
              <Pressable onPress={() => router.push(`books/${item.id}`)} className={`ml-5 ${index === books.length - 1 ? 'mr-5' : 'mr-0'}`}>
                <Image 
                  source={{uri: item.image}} 
                  className='w-40 h-60 rounded-lg mb-3' 
                  resizeMode='cover'
                />
                <Text 
                  className='text-gray-200 w-40 font-bold' 
                  numberOfLines={1} 
                  ellipsizeMode='tail'
                >
                  {item.title}
                </Text>
              </Pressable>
            )}
        />
    </View>
  )
}

export default SelfGrowthSection