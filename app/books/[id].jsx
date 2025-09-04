import { View, Text, Image, ScrollView, Pressable, ActivityIndicator, SafeAreaView } from 'react-native'
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
  const { freeDaily } = useLocalSearchParams()
  const router = useRouter()

  const { fetchSingleBook } = useContext(BooksContext)
  const { customerInfo } = useContext(RevenueCatContext)
  const { bookmarkedBooks, toggleBookmark } = useContext(BookmarkContext)
  const { user } = useContext(AuthContext)

  const isBookmarked = book && bookmarkedBooks.some(b => b.id === book.id)

  const isFromFreeDaily = freeDaily === 'true';
  const isTrial = customerInfo?.entitlements?.["premium_access"]?.periodType === 'trial';
  const hasAccess = user?.email === "wilsongambit@gmail.com" || customerInfo?.entitlements?.active?.premium_access
  console.log('Has access: ', hasAccess?.isActive)
  console.log("Is trial: ", isTrial)
  console.log('From daily free?: ', isFromFreeDaily)

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
    <SafeAreaView className='flex-1 bg-blackPearl'>
      <ScrollView contentContainerStyle={{paddingBottom: 180}}>

        <View className='flex-row justify-between w-full px-5 pt-6 mb-6'>  
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
          <Text className='text-lg text-gray-400 font-bold mb-3'>SUMMARY</Text>
          <Text className='text-3xl text-[#E5E7EB] font-bold px-5 mb-3'>{book.title}</Text>
          <Text className='text-lg text-[#E5E7EB]'>{book.author}</Text>
        </View>

        <View className='px-5 mb-12'>
          <Text className='text-2xl text-[#E5E7EB] font-bold mb-3'>What's inside?</Text>
          <Text className='text-lg text-[#E5E7EB]'>{book.description}</Text>
        </View>

        {/* Key points */}
        <View className=''>
          <View className='border-b border-b-gray-600/50'>
            <Text className='text-2xl text-[#E5E7EB] font-bold mb-3 px-5'>Key points</Text>
          </View>
          {book.chapters?.map((chapter, index) => (
            <View 
              key={chapter.id || index}
            >
              <View className='flex-row items-center gap-7 px-8'>        
                <View>
                  <Text className='text-2xl text-[#13a2f5] font-bold'>{index + 1}</Text>
                </View>
                <View className='w-full p-5 pl-0 border-b border-b-gray-600/50'>
                  <Text className='text-lg text-[#E5E7EB]'>{chapter.title}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
        
      {/* Button */}
      <View className='absolute bottom-0 left-0 right-0 pb-5 items-center'>
        <Pressable 
          onPress={() => {
            if(hasAccess || isTrial || isFromFreeDaily) {
              router.push(`/summary/${book.id}`)
            } else {
              router.push('/paywall')
            }
          }}
          className='bg-[#13a2f5] items-center w-40 mx-auto py-5 px-4 rounded-xl'
        >
          <Text className='text-white text-lg font-semibold'>Start reading</Text>
        </Pressable>
      </View>

    </SafeAreaView>
  )
}

export default BookDetails