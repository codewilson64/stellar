import { View, Text, Image, ScrollView, Pressable } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useContext, useEffect, useState } from 'react'

import bookmark from '../../assets/icons/bookmark.png'
import close from '../../assets/icons/close.png'
import { BookmarkContext } from '../../context/BookmarkContext'

const BookDetails = () => {
  const [book, setBook] = useState(null)
  const router = useRouter()
  const { id } = useLocalSearchParams()

  const { bookmarkedBooks, toggleBookmark } = useContext(BookmarkContext)
  const isBookmarked = book && bookmarkedBooks.some(b => b.id === book.id)

  useEffect(() => {
    const getBookDetails = async () => {
      try {
        const response = await fetch('https://codewilson64.github.io/book-cover-api/book.json')
        const data = await response.json()
        
         // Find book - loosely compare to allow string/number mismatch
        const bookDetails = data.find(item => item.id == id) 
        
        if(bookDetails) {
          console.log('Book found', bookDetails)
          setBook(bookDetails)
        } else {
          console.log('Book not found')
        }
      } 
      catch (error) {
        console.error('Error fetching book details:', error)
      }    
    }

    if(id) {
      getBookDetails()
    }
  }, [id])

  if(!book) {
    return (
      <Text>Loading...</Text>
    )
  }

  return (
    <View className='flex-1 bg-blackPearl'>
      <ScrollView contentContainerStyle={{paddingBottom: 0}}>

        <View className='relative mt-8 mb-6 mx-auto'>  
          <Pressable onPress={router.back}>
            <Image source={close} style={{tintColor: 'white'}} className='size-8 absolute top-0 -left-20'/>          
          </Pressable>

          <Image 
            source={{uri: book.image}}
            className='w-[15rem] h-[22rem] rounded-lg'
            resizeMode='cover'
          />

          <Pressable onPress={() => toggleBookmark(book)} className='absolute top-0 -right-20'>
            <Image 
              source={bookmark} 
              style={{ tintColor: isBookmarked ? '#0096ff' : 'white'}} 
              className='size-7'
            />
          </Pressable>
        </View>

        <View className='flex-col justify-center items-center mb-10'>
          <Text className='text-lg text-gray-300 font-bold mb-3'>SUMMARY</Text>
          <Text className='text-3xl text-white font-bold mb-3'>{book.title}</Text>
          <Text className='text-lg text-gray-300'>{book.author}</Text>
        </View>

        <View className='px-5 mb-12'>
          <Text className=' text-2xl text-white font-bold mb-3'>What's inside?</Text>
          <Text className='text-lg text-gray-300'>{book.description}</Text>
        </View>

        <Pressable onPress={() => router.push(`summary/${book.id}`)} className='bg-zinc-800 items-center w-40 border border-gray-400/60 mx-auto py-5 px-4 rounded-xl'>
          <Text className='text-white text-lg font-semibold'>Start reading</Text>
        </Pressable>

      </ScrollView>
    </View>
  )
}

export default BookDetails