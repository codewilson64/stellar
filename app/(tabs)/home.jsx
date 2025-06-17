import { FlatList, Image, Pressable, ScrollView, Text, View, ActivityIndicator } from 'react-native'
import { useContext } from 'react'
import { Link, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import logo from '../../assets/icons/logo.png'
import SelfGrowthSection from '../../components/SelfGrowthSection'
import InvestmentsSection from '../../components/InvestmentsSection'
import HealthSection from '../../components/HealthSection'
import { BooksContext } from '../../context/BooksContext'

const Home = () => {
  const { books } = useContext(BooksContext)
  const router = useRouter()

  if(!books) {
    return <ActivityIndicator size="large" className='flex-1 justify-center'/>;
  }

  return (
    <View className='flex-1 bg-blackPearl'>
      <View className='flex-1'>
        
        <View className='flex-row justify-between items-center gap-2 border border-b-gray-600/50 border-l-0 border-r-0 border-t-0 px-5'>
          <View className='flex-row items-center gap-2'>
            <Image source={logo} className='size-10 rounded-full'/>
            <Text className='text-2xl text-white font-bold mt-4 mb-4 text-center'>Stellar</Text>
          </View>

          <Link href='/settings'>
            <Ionicons name="settings-outline" size={20} color="#e9eaec" />
          </Link>
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
                  className='w-40 h-60 rounded-lg mb-3' 
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
        
        <SelfGrowthSection />
        <InvestmentsSection />
        <HealthSection />

        </ScrollView>
      </View>
    </View>
  )
}

export default Home

