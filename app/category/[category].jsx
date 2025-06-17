import { View, Text, FlatList, Pressable, Image, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useContext, useEffect, useState } from 'react'
import { BooksContext } from '../../context/BooksContext'
import { Dimensions } from 'react-native'

import arrow from '../../assets/icons/arrow.png'

const BookCategory= () => {
  const [books, setBooks] = useState([])
  const router = useRouter()
  const { category } = useLocalSearchParams()

  const { fetchCategory } = useContext(BooksContext)

  const screenWidth = Dimensions.get('window').width
  const itemSpacing = 20
  const horizontalPadding = 30 // paddingLeft + paddingRight (e.g., 20 + 20)
  const itemWidth = (screenWidth - horizontalPadding - itemSpacing) / 2

  useEffect(() => {
    const loadCategory = async () => {
      const data = await fetchCategory(category)
      setBooks(data)
    }

    loadCategory()
  }, [category])

  if(!books) {
    return (
      <ActivityIndicator size="large" className='flex-1 justify-center'/>
    ) 
  }

  return (
    <View className='flex-1 w-full bg-blackPearl'>
      <View className='flex-row items-center gap-4 px-5 py-5'>
        <Pressable onPress={router.back}>
          <Image source={arrow} style={{tintColor: 'gray'}} className='size-6'/>          
        </Pressable>

        <Text className='text-2xl text-white font-bold'>
          {category}
        </Text>
      </View>
      
      <FlatList
        data={books}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'center',
          gap: 20
        }}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/books/${item.id}`)} className='mb-5'>
            <Image 
              source={{ uri: item.image }} 
              style={{ width: itemWidth, height: itemWidth * 1.5 }}
              className='rounded-lg mb-2' 
            />
            <Text 
              className='text-white w-40 font-bold'
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

export default BookCategory