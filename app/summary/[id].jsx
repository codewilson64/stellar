import { useEffect, useState } from 'react'
import { View, Text, ScrollView, Pressable } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

const SummaryDetails = () => {
  const [summary, setSummary] = useState(null)
  const { id } = useLocalSearchParams()

  useEffect(() => {
    const getSummaryDetails = async () => {
      try {
        const response = await fetch('https://codewilson64.github.io/book-cover-api/book.json')
        const data = await response.json()
        
         // Find book - loosely compare to allow string/number mismatch
        const summaryDetails = data.find(item => item.id == id) 
        
        if(summaryDetails) {
          // console.log('Summary found', summaryDetails)
          setSummary(summaryDetails)
        } else {
          console.log('Summary not found')
        }
      } 
      catch (error) {
        console.error('Error fetching summary details:', error)
      }    
    }

    if(id) {
      getSummaryDetails()
    }
  }, [id])

  if(!summary) {
    return (
      <Text>Loading...</Text>
    )
  }

  return (
    <ScrollView 
      className='flex-1 bg-blackPearl'
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40, paddingTop: 40}}
    >
      {summary.chapters.map((chapter, index) => (
        <View key={index} className={`px-5 ${index === summary.chapters.length - 1 ? 'mb-10' : 'mb-24'}`}>
          <Text className='text-gray-200 text-3xl font-bold mb-6'>{chapter.title}</Text>
          <Text className={`text-gray-200 text-xl font-normal`}>{chapter.summary}</Text>      
        </View>
      ))}

        <Pressable className='bg-zinc-800 items-center w-50 border border-gray-400/60 mx-auto py-5 px-5 rounded-xl'>
          <Text className='text-white text-lg font-semibold'>Finish summary</Text>
        </Pressable>    
    </ScrollView>
  )
}

export default SummaryDetails