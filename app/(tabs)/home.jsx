import { FlatList, Image, Pressable, ScrollView, Text, View } from 'react-native'
import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'

import logo from '../../assets/icons/logo.png'

const Home = () => {
  const [books, setBooks] = useState([])
  const router = useRouter()

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("https://codewilson64.github.io/book-cover-api/book.json")
      
        if(!response.ok) {
          console.log('Fetch error')
          return
        }

        const data = await response.json()
        setBooks(data)
      }
      catch (error) {
        console.log('Network error:', error.message)
      }
  
    } 
    fetchBooks()
  }, [])

  return (
    <View className='flex-1 bg-blackPearl'>
      <View 
        className='flex-1'      
      >
        <View className='flex-row items-center gap-2 border border-b-gray-300 border-l-0 border-r-0 border-t-0 px-5'>
          <Image source={logo} className='size-10 rounded-full'/>
          <Text className='text-2xl text-white font-bold mt-4 mb-4 text-center'>Stellar</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 20}}
        >

        <View className='mb-10'>
          <Text className='text-2xl text-white font-bold mt-3 mb-3 px-5'>Today for you</Text>
  
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

        <View className='mb-10'>
          <Text className='text-2xl text-white font-bold mb-2 px-5'>To be productive</Text>
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

        <View>
          <Text className='text-2xl text-white font-bold mb-2 px-5'>To be productive</Text>
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

        </ScrollView>

      </View>
    </View>
  )
}

export default Home

