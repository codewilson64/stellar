import { View, Text, FlatList, Pressable, Image } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'

const BookCategory= () => {
  const [books, setBooks] = useState([])
  const router = useRouter()
  const { category } = useLocalSearchParams()

  useEffect(() => {
    const getBookCategory = async () => {
      try {
        const response = await fetch('https://codewilson64.github.io/book-cover-api/book.json')
        const data = await response.json()
        
        const booksInCategory = data.filter(item => item.category === category) 
        
        if(booksInCategory.length > 0) {
          // console.log('Book Category found', booksInCategory)
          setBooks(booksInCategory)
        } else {
          console.log('No books found for category:', category)
        }
      } 
      catch (error) {
        console.error('Error fetching book category:', error)
      }    
    }

    if(category) {
      getBookCategory()
    }
  }, [category])

  if(!books) {
    return (
      <Text>Loading...</Text>
    )
  }

  return (
    <View className='flex-1 w-full bg-blackPearl p-5'>
      <Text className='text-2xl text-white font-bold mb-4'>
        {category}
      </Text>
      <FlatList
        data={books}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'flex-start',
          gap: 20
        }}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/books/${item.id}`)} className='mb-5'>
            <Image source={{ uri: item.image }} className='w-[12rem] h-[18rem] rounded-lg mb-2' />
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