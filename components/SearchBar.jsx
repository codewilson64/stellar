import { View, Text, Image, TextInput } from 'react-native'
import React from 'react'
import search from '../assets/icons/search.png'

const SearchBar = () => {
  return (
    <View className='flex-row items-center rounded-full px-5 py-4'>
      <Image source={search} className='size-5' resizeMode='contain' tintColor={'#0096ff'}/>
      <TextInput 
        placeholder='Search'
        value=''
        onChangeText={() => {}}
        placeholderTextColor='#a8b5db'
        className='flex-1 ml-2 text-white'
      />
    </View>
  )
}

export default SearchBar