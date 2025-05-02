import { View, Text, FlatList, Pressable, Image } from 'react-native'
import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'

const SelfGrowthSection = () => {
  const [books, setBooks] = useState([])
  const router = useRouter()

  useEffect(() => {
      const getBookCategory = async () => {
        try {
          const response = await fetch('https://codewilson64.github.io/book-cover-api/book.json')
          const data = await response.json()
          
          const booksInCategory = data.filter(item => item.category === "Self-Growth") 
          
          if(booksInCategory.length > 0) {
            console.log('Book Category found', booksInCategory)
            setBooks(booksInCategory)
          } else {
            console.log('No books found for category:', category)
          }
        } 
        catch (error) {
          console.error('Error fetching Self-Growth section:', error)
        }    
      }

      getBookCategory()
    }, [])

  return (
    <View className='mb-10'>
        <Text className='text-2xl text-white font-bold mb-2 px-5'>Self-Growth</Text>
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
                  className='w-44 h-64 rounded-lg mb-3' 
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