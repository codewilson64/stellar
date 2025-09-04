import { useContext, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, Pressable, Image, ScrollView, Modal, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { RevenueCatContext } from '../context/RevenueCatContext';
import Purchases from 'react-native-purchases';
import { Link, useRouter } from 'expo-router';

import logo from '../assets/icons/logo.png'
import check from '../assets/icons/check.png'
import close from '../assets/icons/close.png'
import x from '../assets/icons/x.png'

const PRIVACY_POLICY_URL = 'https://withstellar.vercel.app/privacypolicy'
const TERMS_URL = 'https://withstellar.vercel.app/termsofuse'

export default function PaywallScreen() {
  const [openModal, setOpenModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('annual')
  const { offerings, purchase } = useContext(RevenueCatContext)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const annualIntro = offerings?.current?.availablePackages.find(
    (pkg) => pkg.identifier === "$rc_annual_intro"
  );

  const annual = offerings?.current?.annual;
  const threeMonth = offerings?.current?.threeMonth;
  const monthly = offerings?.current?.monthly;

  const selectedPackage = selectedPlan === 'annual'
  ? annual
  : selectedPlan === 'monthly'
  ? monthly
  : threeMonth;

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

  if (!offerings || !annualIntro || !threeMonth || !monthly || !annual) {
    console.log("Waiting for offerings...");
    return <ActivityIndicator size="large" className='flex-1 justify-center'/>;
  }

  return (
    <SafeAreaView className='flex-1 bg-blackPearl'>
      <ScrollView contentContainerStyle={{paddingBottom: 40}}>
      <View className='px-5'>
        <View className="py-3 flex-row items-center">
          <Pressable onPress={router.back}>
            <Image source={close} style={{ tintColor: 'gray' }} className="size-8" />
          </Pressable>
        </View>
      
        <View className='flex-col items-center gap-8 mt-5'>
          <Image source={logo} className='size-32 rounded-full'/>
          <Text className='font-bold text-[#E5E7EB] text-3xl'>Upgrade to Stellar Premium</Text>

          <View className='flex-col w-full gap-3'>
            <View className='flex-row items-center gap-3'>
              <Image source={check} className='size-5' />
              <Text className='text-lg font-semibold text-[#E5E7EB]'>Unlock all book summaries</Text>
            </View>
            <View className='flex-row items-center gap-3'>
              <Image source={check} className='size-5' />
              <Text className='text-lg font-semibold text-[#E5E7EB]'>10-min summaries, daily new releases</Text>
            </View>
            <View className='flex-row items-center gap-3'>
              <Image source={check} className='size-5'/>
              <Text className='text-lg font-semibold text-[#E5E7EB]'>Read anytime & anywhere</Text>
            </View>
          </View>
        </View>

        <View className='flex-col gap-7 mt-20'>
          <View>
            <Text className='text-[#E5E7EB] text-lg text-center'>
              Subscribe for {annualIntro.product.priceString}/year
            </Text>
            <Text className='text-gray-300/60 text-lg text-center'>
              Only {annualIntro.product.pricePerWeekString}/week
            </Text>
          </View>
        
            <Pressable 
                disabled={isLoading}
                onPress={() => handlePurchase(annualIntro)}
                className='w-full bg-[#13a2f5] items-center py-5 px-4 rounded-xl'>
                {isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                ): (
                    <Text className='text-white text-xl font-semibold'>Subscribe</Text>
                )}
            </Pressable>
            
          <Pressable onPress={() => setOpenModal(true)} className='mb-24'>
            <Text className='text-lg text-center font-semibold text-gray-300/60'>View other plans</Text>
          </Pressable>

          <View className='flex-row items-center justify-center gap-28 pt-3 border-t border-gray-600/50'> 
            <Pressable onPress={() => Linking.openURL(TERMS_URL)}>
              <Text className='text-[#E5E7EB] text-sm font-normal'>Terms & Conditions</Text>
            </Pressable>
            <Pressable onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}>
              <Text className='text-[#E5E7EB] text-sm font-normal'>Privacy Policy</Text>
            </Pressable>
          </View>
        </View>
                
        {/* Modal */}
        <Modal 
          visible={openModal} 
          onRequestClose={() => setOpenModal(false)}
          animationType='slide'
          transparent
        >
          <View className="flex-1 justify-end bg-black/30">
            <View className='w-full flex-col gap-5 p-5 bg-matteBlack rounded-t-2xl'>
              <View className='flex-row justify-between items-center'>
                <Text className='text-white text-xl font-semibold'>Pick your plan</Text>
                <Pressable onPress={() => setOpenModal(false)}>
                  <Image source={x} style={{ tintColor: 'gray' }} className="size-5" />
                </Pressable>
              </View>
                <Pressable 
                  onPress={() => setSelectedPlan('annual')}
                  className={`relative overflow-hidden w-full ${selectedPlan === 'annual' ? 'border-[#13a2f5]' : 'border-gray-400/60'} border mx-auto py-4 px-4 rounded-xl`}>
                    <View className='flex-row justify-between items-end gap-3'>         
                      <View>
                        <Text className='font-bold text-xl text-white'>Yearly</Text>
                        <Text className='text-white text-lg'>{annual.product.priceString}</Text>
                      </View>
                      <View>
                        <Text className='text-gray-300/60 text-sm'>{annual.product.pricePerWeekString}/week</Text>
                      </View>
                    </View>

                    <View className={`absolute ${selectedPlan === 'annual' ? 'bg-[#13a2f5]' : 'bg-gray-400/60'} right-0 top-0 p-2 rounded-bl-xl`}>
                      <Text className='text-md text-white font-semibold'>BEST VALUE - SAVE 45%</Text>
                    </View>
                </Pressable>

                <Pressable 
                  onPress={() => setSelectedPlan('threeMonth')}
                  className={`relative overflow-hidden w-full ${selectedPlan === 'threeMonth' ? 'border-[#13a2f5]' : 'border-gray-400/60'} border mx-auto py-4 px-4 rounded-xl`}>
                    <View className='flex-row justify-between items-end gap-3'>            
                      <View>
                        <Text className='font-bold text-xl text-white'>3-Month</Text>
                        <Text className='text-white text-lg'>{threeMonth.product.priceString}</Text>
                      </View>
                      <View>
                        <Text className='text-gray-300/60 text-sm'>{threeMonth.product.pricePerWeekString}/week</Text>
                      </View>
                    </View>

                    <View className={`absolute ${selectedPlan === 'threeMonth' ? 'bg-[#13a2f5]' : 'bg-gray-400/60'} right-0 top-0 p-2 rounded-bl-xl`}>
                      <Text className='text-md text-white font-semibold'>SAVE 23%</Text>
                    </View>
                </Pressable>

                <Pressable 
                  onPress={() => setSelectedPlan('monthly')}
                  className={`relative overflow-hidden w-full ${selectedPlan === 'monthly' ? 'border-[#13a2f5]' : 'border-gray-400/60'} border mx-auto py-4 px-4 rounded-xl`}>
                    <View className='flex-row justify-between items-end gap-3'>       
                      <View>
                        <Text className='font-bold text-xl text-white'>Monthly</Text>
                        <Text className='text-white text-lg'>{monthly.product.priceString}</Text>
                      </View>
                      <View>
                        <Text className='text-gray-300/60 text-sm'>{monthly.product.pricePerWeekString}/week</Text>
                      </View>
                    </View>

                    <View className={`absolute ${selectedPlan === 'monthly' ? 'bg-[#13a2f5]' : 'bg-gray-400/60'} right-0 top-0 p-2 rounded-bl-xl`}>
                      <Text className='text-md text-white font-semibold'>POPULAR</Text>
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
            </View>
        </Modal>
      </View>     
      </ScrollView>
    </SafeAreaView>
  );
}
