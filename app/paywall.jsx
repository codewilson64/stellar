import { useContext, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, Pressable, Image, ScrollView } from 'react-native';
import { RevenueCatContext } from '../context/RevenueCatContext';
import Purchases from 'react-native-purchases';
import { useRouter } from 'expo-router';

import logo from '../assets/icons/logo.png'
import check from '../assets/icons/check.png'
import close from '../assets/icons/close.png'
import { SafeAreaView } from 'react-native-safe-area-context'; 

export default function PaywallScreen() {
  const [selectedPlan, setSelectedPlan] = useState('monthly')
  const { offerings, purchase } = useContext(RevenueCatContext)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const handlePurchase = async (pkg) => {
    try {
      setIsLoading(true)
      const info = await purchase(pkg)
      
      if (info?.entitlements?.active['premium_access']) {
        setIsLoading(false)
        router.back()
      } 
      else {
        setTimeout(async () => {
          const refreshedInfo = await Purchases.getCustomerInfo();

          if (refreshedInfo?.entitlements?.active['premium_access']) {
            setIsLoading(false);
            router.back()
          } 
          else {
            setIsLoading(false);
            Alert.alert(
              'Hold on...',
              "Your purchase went through, but premium access hasn't activated yet. Please restart the app or try again shortly."
            );
          }
        }, 1000); 
      }
    } 
    catch (e) {
      setIsLoading(false)

      if (e.userCancelled) {
        console.log('User cancelled the purchase — no alert shown.');
        return;
      } 
      else {
        Alert.alert('Purchase failed', e.message);
      }
    }
  }

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
    <SafeAreaView className='flex-1 bg-blackPearl'>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
      <View className="py-3 flex-row items-center">
        <Pressable onPress={router.back}>
          <Image source={close} style={{ tintColor: 'gray' }} className="size-8" />
        </Pressable>
      </View>
      
        <View className='flex-col items-center gap-8 mt-5'>
          <Image source={logo} className='size-32 rounded-full'/>
          <Text className='font-bold text-white text-3xl'>Upgrade to Stellar Premium</Text>

          <View className='flex-col w-full gap-3'>
            <View className='flex-row items-center gap-3'>
              <Image source={check} className='size-5' />
              <Text className='text-lg font-semibold text-white'>Unlock all book summaries</Text>
            </View>
            <View className='flex-row items-center gap-3'>
              <Image source={check} className='size-5' />
              <Text className='text-lg font-semibold text-white'>10-min summaries, daily new releases</Text>
            </View>
            <View className='flex-row items-center gap-3'>
              <Image source={check} className='size-5'/>
              <Text className='text-lg font-semibold text-white'>Read anytime & anywhere</Text>
            </View>
          </View>
        </View>
      
        <View className='w-full flex-col gap-5 mt-10'>
        <Pressable 
            onPress={() => setSelectedPlan('weekly')}
            className={`w-full ${selectedPlan === 'weekly' ? 'border-[#13a2f5]' : 'border-gray-400/60'} border mx-auto py-4 px-4 rounded-xl`}>
            <View className='flex-row items-center gap-3'>            
              <View>
                <Text className='font-bold text-xl text-white'>Weekly</Text>
                <Text className='text-white text-lg'>{weekly.product.priceString}/week</Text>
              </View>
            </View>
          </Pressable>

          <Pressable 
            onPress={() => setSelectedPlan('monthly')}
            className={`relative overflow-hidden w-full ${selectedPlan === 'monthly' ? 'border-[#13a2f5]' : 'border-gray-400/60'} border mx-auto py-4 px-4 rounded-xl`}>
            <View className='flex-row items-center gap-3'>       
              <View>
                <Text className='font-bold text-xl text-white'>Monthly</Text>
                <Text className='text-white text-lg'>{monthly.product.priceString}/month</Text>
              </View>
            </View>

            <View className={`absolute ${selectedPlan === 'monthly' ? 'bg-[#13a2f5]' : 'bg-gray-400/60'} right-0 top-0 p-2 rounded-bl-xl`}>
              <Text className='text-md text-white font-semibold'>POPULAR - SAVE 32%</Text>
            </View>
          </Pressable>

          <Pressable 
            onPress={() => setSelectedPlan('annual')}
            className={`relative overflow-hidden w-full ${selectedPlan === 'annual' ? 'border-[#13a2f5]' : 'border-gray-400/60'} border mx-auto py-4 px-4 rounded-xl`}>
            <View className='flex-row items-center gap-3'>         
              <View>
                <Text className='font-bold text-xl text-white'>Yearly</Text>
                <Text className='text-white text-lg'>{annual.product.priceString}/year</Text>
              </View>
            </View>

            <View className={`absolute ${selectedPlan === 'annual' ? 'bg-[#13a2f5]' : 'bg-gray-400/60'} right-0 top-0 p-2 rounded-bl-xl`}>
              <Text className='text-md text-white font-semibold'>BEST VALUE - SAVE 50%</Text>
            </View>
          </Pressable>

          <Pressable 
            disabled={isLoading}
            onPress={() => handlePurchase(selectedPackage)}
            className='w-full bg-[#13a2f5] items-center py-5 px-4 rounded-xl'>
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ): (
                <Text className='text-white text-xl font-semibold'>Continue</Text>
              )}
          </Pressable>
        </View>
      
      </ScrollView>     
    </SafeAreaView>
  );
}
