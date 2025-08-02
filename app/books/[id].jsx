import { View, Text, Image, ScrollView, Pressable, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useContext, useEffect, useState } from 'react'

import { BookmarkContext } from '../../context/BookmarkContext'
import { RevenueCatContext } from '../../context/RevenueCatContext'

import bookmark from '../../assets/icons/bookmark.png'
import close from '../../assets/icons/close.png'
import { BooksContext } from '../../context/BooksContext'
import { AuthContext } from '../../context/AuthContext'

const BookDetails = () => {
  const [book, setBook] = useState(null)
  const { id } = useLocalSearchParams()
  const router = useRouter()

  const { fetchSingleBook } = useContext(BooksContext)
  const { customerInfo } = useContext(RevenueCatContext)
  const { bookmarkedBooks, toggleBookmark } = useContext(BookmarkContext)
  const { user } = useContext(AuthContext)

  const isBookmarked = book && bookmarkedBooks.some(b => b.id === book.id)

  useEffect(() => {
    const loadBook = async () => {
      const data = await fetchSingleBook(id)
      setBook(data)
    }

    loadBook()
  }, [id])

  if(!book) {
    return (
      <ActivityIndicator size="large" className='flex-1 justify-center bg-blackPearl'/>
    )
  }

  return (
    <View className='flex-1 bg-blackPearl'>
      <ScrollView contentContainerStyle={{paddingBottom: 0}}>

        <View className='flex-row justify-between w-full px-5 mt-8 mb-6'>  
          <Pressable onPress={router.back}>
            <Image source={close} style={{tintColor: 'gray'}} className='size-8'/>          
          </Pressable>

          <Image 
            source={{uri: book.image}}
            className='w-[15rem] h-[22rem] rounded-lg'
            resizeMode='cover'
          />

          <Pressable onPress={() => toggleBookmark(book)}>
            <Image 
              source={bookmark} 
              style={{ tintColor: isBookmarked ? '#0096ff' : 'gray'}} 
              className='size-7'
            />
          </Pressable>
        </View>

        <View className='flex-col justify-center items-center mb-10'>
          <Text className='text-lg text-gray-300 font-bold mb-3'>SUMMARY</Text>
          <Text className='text-3xl text-white font-bold px-5 mb-3'>{book.title}</Text>
          <Text className='text-lg text-gray-300'>{book.author}</Text>
        </View>

        <View className='px-5 mb-12'>
          <Text className=' text-2xl text-white font-bold mb-3'>What's inside?</Text>
          <Text className='text-lg text-gray-300'>{book.description}</Text>
        </View>

        <Pressable 
          onPress={() => {
            const hasAccess = user?.email === "wilsongambit@gmail.com" || customerInfo?.entitlements?.active?.premium_access
            if(hasAccess) {
              router.push(`/summary/${book.id}`)
            } else {
              router.push('/paywall')
            }
          }}
          className='bg-[#13a2f5] items-center w-40 mx-auto py-5 px-4 mb-10 rounded-xl'
        >
          <Text className='text-white text-lg font-semibold'>Start reading</Text>
        </Pressable>

      </ScrollView>
    </View>
  )
}

export default BookDetails