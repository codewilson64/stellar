import { View, Text, Image, ActivityIndicator, Pressable } from 'react-native'
import { useContext, useEffect, useState } from 'react'
import { BooksContext } from '../context/BooksContext'
import { useRouter } from 'expo-router'

import next from '../assets/icons/next.png'

const DailyFreeSummary = () => {
  const [book, setBook] = useState(null)
  const router = useRouter()

  const { fetchRandomFreeBook } = useContext(BooksContext)

  useEffect(() => {
    const loadFreeBook = async () => {
      const data = await fetchRandomFreeBook()
      setBook(data)
    }

    loadFreeBook()
  }, [])

  if(!book) {
    return (
      <ActivityIndicator size="large" className='flex-1 justify-center bg-blackPearl'/>
    )
  }

  return (
    <Pressable 
      onPress={() => router.push({
        pathname: `books/${book.id}`,
        params: { freeDaily: 'true' } // flag for free access
      })}
      className='flex-1 bg-[#13a2f5] rounded-2xl p-7'
    >
      <View className='flex-row items-center justify-between'>
        <View className='w-[70%] flex-col gap-7'>
          <Text className='text-3xl text-white font-bold'>Free summary today</Text>
          <View className='flex-row items-center gap-3'>
            <Text className='text-lg text-white font-normal'>Read it now</Text>
            <Image source={next} className='size-4' tintColor={'white'}/>
          </View>
        </View>
        <View>
          <Image source={{uri: book.image}} className='w-28 h-40 rounded-lg' resizeMode='cover'/>
        </View>
      </View>
    </Pressable>
  )
}

export default DailyFreeSummary