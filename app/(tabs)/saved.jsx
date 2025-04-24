import { View, Text, FlatList, Image, Pressable } from 'react-native'
import { useContext } from 'react'
import { BookmarkContext } from '../../context/BookmarkContext'
import { useRouter } from 'expo-router'

const SavedPage = () => {
  const { bookmarkedBooks } = useContext(BookmarkContext)
  const router = useRouter()

  console.log('Bookmarked books:', bookmarkedBooks)

  return (
    <View className='flex-1 bg-blackPearl px-5 pt-10'>

      {bookmarkedBooks.length === 0 ? (
        <View className='flex-1 justify-center items-center'>
          <Text className='text-white text-lg font-semibold'>You haven't mark any books yet.</Text>
          <Text className='text-white text-lg font-semibold'>Try marking one!</Text>
        </View>
      ) : (
        <FlatList
          data={bookmarkedBooks}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`books/${item.id}`)} className='flex-row gap-4 mb-5'>
              <Image 
                source={{ uri: item.image }} 
                className='w-40 h-60 rounded-lg mb-2'
              />
              <View className='flex-col gap-2'>
                <Text className='text-white text-lg font-bold'>{item.title}</Text>
                <Text className='text-gray-300'>{item.author}</Text>
              </View>
            </Pressable>
          )}
        />
      )}
  </View>
  )
}

export default SavedPage