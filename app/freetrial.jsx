import { useContext, useState } from 'react'
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { RevenueCatContext } from '../context/RevenueCatContext'
import Purchases from 'react-native-purchases'

import logo from '../assets/icons/logo.png'
import close from '../assets/icons/close.png'
import unlock from '../assets/trial/unlock.png'
import bell from '../assets/trial/bell.png'
import star from '../assets/trial/star.png'

const freetrial = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  const { offerings, purchase, customerInfo } = useContext(RevenueCatContext)

  const isTrial = customerInfo?.entitlements?.["premium_access"]?.periodType === 'trial';
  console.log( 'isTrial: ' , isTrial)
  console.log(monthly?.product?.introPrice.period)

  const monthly = offerings?.current?.monthly;
  console.log("Monthly Product", monthly)
  
  const handleFreeTrial = async () => {
      try {
        setIsLoading(true)

        const info = await purchase(monthly)

        const entitlement = info?.entitlements?.active?.["premium_access"];
        const periodType = entitlement?.periodType;
        
        if (entitlement && periodType === 'trial') {
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

  return (
    <SafeAreaView className='flex-1 bg-blackPearl'>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }} // Increased paddingBottom to avoid overlap with fixed footer
        showsVerticalScrollIndicator={false}
      >
        <View className="py-3 flex-row items-center">
          <Pressable onPress={() => router.push('/home')}>
            <Image source={close} style={{ tintColor: 'gray' }} className="size-8" />
          </Pressable>
        </View>

        <View className='flex-col items-center gap-14 mt-5'>
          <View className='flex-col items-center gap-8'>  
            <Image source={logo} className='size-32 rounded-full'/>
            <View className='flex-col items-center gap-3'>
              <Text className='font-bold text-white text-5xl'>Try Stellar for</Text>
              <Text className='font-bold text-[#13a2f5] text-5xl'>7 days free</Text>
            </View>
          </View>
        
          <View className='flex-col w-full gap-10'>
            <View className='flex-row items-start gap-4'>
              <Image source={unlock} className='size-6 mt-2' tintColor={'#13a2f5'}/>
                <View>
                  <Text className='text-2xl font-semibold text-white'>Today</Text>
                  <Text className='text-lg font-normal text-gray-300'>Unlock access to all premium features</Text>
                </View>
            </View>
            <View className='flex-row items-start gap-4'>
              <Image source={bell} className='size-6 mt-2' tintColor={'#13a2f5'}/>
                <View>
                  <Text className='text-2xl font-semibold text-white'>Day 5</Text>
                  <Text className='text-lg font-normal text-gray-300'>Get a reminder that your trial is about to end</Text>
                </View>
            </View>
            <View className='flex-row items-start gap-4'>
              <Image source={star} className='size-6 mt-2' tintColor={'#13a2f5'}/>
                <View>
                  <Text className='text-2xl font-semibold text-white'>Day 7</Text>
                  <Text className='text-lg font-normal text-gray-300'>Your trial ends unless canceled.</Text>
                </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className='absolute bottom-0 left-0 right-0 px-5 pb-10 bg-blackPearl'>
        <View className='w-full flex-col gap-5'>
          <Text className='text-gray-300 text-center text-md'>
            Free access for 7 days, then {monthly?.product.priceString} per month
          </Text>
          <Pressable 
            disabled={isLoading}
            onPress={handleFreeTrial}
            className='w-full bg-[#13a2f5] items-center py-5 px-4 rounded-xl'>
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ): (
                <Text className='text-white text-xl font-semibold'>Start 7-day free trial</Text>
              )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default freetrial