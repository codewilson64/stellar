import { useContext, useEffect, useRef, useState } from 'react'
import { View, Text, Image, ScrollView, Pressable, ActivityIndicator, FlatList, Dimensions } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { BooksContext } from '../../context/BooksContext'
import { ThemeContext } from '../../context/ThemeContext'

import arrow from '../../assets/icons/arrow.png'
import next from '../../assets/icons/next.png'
import back from '../../assets/icons/back.png'

const { width } = Dimensions.get('window')

const SummaryDetails = () => {
  const [summary, setSummary] = useState(null)
  const flatListRef = useRef(null)

  const { id } = useLocalSearchParams()
  const { fetchChapters } = useContext(BooksContext)
  const { theme, toggleTheme } = useContext(ThemeContext)
  const router = useRouter()
  const isDark = theme === 'dark'
  
  useEffect(() => {
    const loadChapters = async () => {
      const data = await fetchChapters(id)
      setSummary(data)
    }

    loadChapters()
  }, [id])

  if(!summary || summary.length === 0) {
    return (
      <ActivityIndicator size="large" className='flex-1 justify-center bg-blackPearl'/>
    )
  }

  return (
    <View 
      style={{ flex: 1, backgroundColor: isDark ? '#181818' : '#FFFFFF' }}
    >
      {/* Toggle Button */}
      <View className={`px-5 py-3 flex-row justify-between items-center border ${isDark ? 'border-b-gray-600/50' : 'border-b-gray-300/60'} border-l-0 border-r-0 border-t-0`}>
        <Pressable onPress={router.back}>
          <Image source={arrow} style={{tintColor: `${isDark ? 'gray' : 'black'}`}} className='size-6'/>          
        </Pressable>

        <Pressable onPress={toggleTheme} className='bg-gray-300/30 p-2 rounded-full'>
          <Feather
            name={isDark ? 'sun' : 'moon'}
            size={23}
            color={isDark ? '#f5dd4b' : '#1F2937'}
          />
        </Pressable>
      </View>

      {/* Paginated Chapters */}
      <FlatList
        ref={flatListRef}
        data={summary}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ScrollView 
            style={{ width, paddingHorizontal: 20 }}
            contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={{ color: isDark ? '#E5E7EB' : '#000', fontSize: 26, fontWeight: 'bold', marginBottom: 16 }} className='leading-snug'>
              {item.title}
            </Text>
            <Text style={{ color: isDark ? '#E5E7EB' : '#000', fontSize: 18 }} className='leading-relaxed'>
              {item.summary}
            </Text>

            {/* Navigation Controls */}
            <View className='flex-row justify-center items-center gap-5 px-5 py-14'>
              {index > 0 && (
                <Pressable onPress={() => {
                  flatListRef.current.scrollToIndex({ index: index - 1 })
                }} className={`${isDark ? 'bg-zinc-600/50' : 'bg-zinc-200/50'} px-4 py-3 rounded-lg`}>
                  <Image source={back} style={{tintColor: `${isDark ? '#E5E7EB' : 'black'}`}} className='size-5'/>
                </Pressable>
              )}

              {/* Page indicator */}
              <Text
                style={{
                  textAlign: 'center',
                  color: isDark ? '#E5E7EB' : 'black',
                  fontSize: 15,
                }}
              >
                {index + 1} of {summary.length}
              </Text>

              {index < summary.length - 1 && (
                <Pressable onPress={() => {
                  flatListRef.current.scrollToIndex({ index: index + 1 })
                }} className={`${isDark ? 'bg-zinc-600/50' : 'bg-zinc-200/50'} px-4 py-3 rounded-lg`}>
                  <Image source={next} style={{tintColor: `${isDark ? '#E5E7EB' : 'black'}`}} className='size-5'/>
                </Pressable>
              )}
              {index === summary.length - 1 && (
                <Pressable onPress={router.back} className='bg-[#13a2f5] px-4 py-3 rounded-lg ml-auto'>
                  <Text className='text-white text-base font-semibold'>Finish summary</Text>
                </Pressable>
              )}
            </View>
          </ScrollView>
        )}
      />

      
    </View>
  )
}

export default SummaryDetails