import React, { useContext, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, Pressable, Image, ScrollView } from 'react-native';
import { RevenueCatContext } from '../context/RevenueCatContext';
import { useRouter } from 'expo-router';

import logo from '../assets/icons/logo.png'
import check from '../assets/icons/check.png'
import selectedCheck from '../assets/icons/selected_check.png'
import close from '../assets/icons/close.png'

export default function PaywallScreen() {
  const [selectedPlan, setSelectedPlan] = useState('monthly')
  const { customerInfo, offerings, purchase } = useContext(RevenueCatContext)

  const router = useRouter()

  const handlePurchase = async (pkg) => {
    try {
      await purchase(pkg)
      if (
        customerInfo?.entitlements?.active &&
        customerInfo.entitlements.active['premium_access']
    ) {
        Alert.alert('Success', "You're now a PRO user!");
      } else {
        console.log('Entitlement not found:', customerInfo.entitlements);
        Alert.alert('Purchase succeeded but no entitlement found.');
      }
    } catch (e) {
      if (!e.userCancelled) {
        Alert.alert('Purchase failed', e.message);
      }
    }
  };
    
    const weekly = offerings?.current?.weekly;
    const monthly = offerings?.current?.monthly;
    const annual = offerings?.current?.annual;

    const selectedPackage = selectedPlan === 'weekly'
    ? weekly
    : selectedPlan === 'monthly'
    ? monthly
    : annual;

    if (!offerings || !weekly || !monthly || !annual) {
      console.log("Waiting for offerings...");
      return <ActivityIndicator size="large" className='flex-1 justify-center'/>;
    }

  return (
    <View className='relative flex-1 justify-between items-center bg-blackPearl px-6'>
      <View className="absolute top-5 left-5 z-50">
        <Pressable onPress={router.back}>
          <Image source={close} style={{ tintColor: 'white' }} className="size-8" />
        </Pressable>
      </View>

      <ScrollView 
        contentContainerStyle={{paddingBottom: 40, paddingTop: 40}}
        showsVerticalScrollIndicator={false}
      >
      <View className='flex-col w-full justify-center items-center gap-8 py-3'>
        <Image source={logo} className='size-32 rounded-full'/>
        <Text className='font-bold text-white text-3xl'>Upgrade to Stellar Premium</Text>

        <View className='flex-col w-full gap-3'>
          <View className='flex-row items-center gap-3'>
            <Image source={check} className='size-5' />
            <Text className='text-lg font-semibold text-white'>Unlock all book summaries</Text>
          </View>
          <View className='flex-row items-center gap-3'>
            <Image source={check} className='size-5' />
            <Text className='text-lg font-semibold text-white'>15-min summaries, daily new releases</Text>
          </View>
          <View className='flex-row items-center gap-3'>
            <Image source={check} className='size-5'/>
            <Text className='text-lg font-semibold text-white'>Read anytime & anywhere</Text>
          </View>
          <View className='flex-row items-center gap-3'>
            <Image source={check} className='size-5'/>
            <Text className='text-lg font-semibold text-white'>More knowledge, more power</Text>
          </View>
        </View>
      </View>

      
      <View className='w-full flex-col gap-5'>
      <Pressable 
          onPress={() => setSelectedPlan('weekly')}
          className={`w-full ${selectedPlan === 'weekly' ? 'border-[#13a2f5]' : 'border-gray-400/60'} border mx-auto py-5 px-4 rounded-xl`}>
          <View className='flex-row items-center gap-3'>
            { selectedPlan === 'weekly' ? (
              <Image source={selectedCheck} className='size-5'/>
            ) : (
              <View className='rounded-full border border-gray-400/60 p-2'></View>
            )}
            <View>
              <Text className='font-bold text-xl text-white'>Weekly</Text>
              <Text className='text-white text-lg'>{weekly.product.priceString}/week</Text>
            </View>
          </View>
        </Pressable>

        <Pressable 
          onPress={() => setSelectedPlan('monthly')}
          className={`w-full ${selectedPlan === 'monthly' ? 'border-[#13a2f5]' : 'border-gray-400/60'} border mx-auto py-5 px-4 rounded-xl`}>
          <View className='flex-row items-center gap-3'>
            { selectedPlan === 'monthly' ? (
              <Image source={selectedCheck} className='size-5'/>
            ) : (
              <View className='rounded-full border border-gray-400/60 p-2'></View>
            )}
            <View>
              <Text className='font-bold text-xl text-white'>Monthly</Text>
              <Text className='text-white text-lg'>{monthly.product.priceString}/month</Text>
            </View>
          </View>
        </Pressable>

        <Pressable 
          onPress={() => setSelectedPlan('annual')}
          className={`relative overflow-hidden w-full ${selectedPlan === 'annual' ? 'border-[#13a2f5]' : 'border-gray-400/60'} border mx-auto py-5 px-4 rounded-xl`}>
          <View className='flex-row items-center gap-3'>
            { selectedPlan === 'annual' ? (
              <Image source={selectedCheck} className='size-5'/>
            ) : (
              <View className='rounded-full border border-gray-400/60 p-2'></View>
            )}
            <View>
              <Text className='font-bold text-xl text-white'>Yearly</Text>
              <Text className='text-white text-lg'>{annual.product.priceString}/year</Text>
            </View>
          </View>

          <View className='absolute bg-[#13a2f5] right-0 top-0 border border-t-0 border-r-0 border-gray-400/60 p-2 rounded-bl-xl'>
            <Text className='text-sm font-semibold'>25% OFF</Text>
          </View>
        </Pressable>

        <Pressable 
          onPress={() => handlePurchase(selectedPackage)}
          className='w-full bg-[#13a2f5] items-center border border-gray-400/60 mx-auto py-5 px-4 rounded-xl'>
          <Text className='text-white text-xl font-semibold'>Continue</Text>
        </Pressable>
      </View>
      </ScrollView>
      
    </View>
  );
}
