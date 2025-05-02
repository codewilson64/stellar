import { createContext, useEffect, useState } from "react";
import Purchases from 'react-native-purchases';
import { Platform } from 'react-native';

const API_KEY = Platform.select({
    android: 'goog_vzomalaIHTpRXTdepqDgadcMXBV',
  });

export const RevenueCatContext = createContext()

export const RevenueCatProvider = ({ children }) => {
  const [customerInfo, setCustomerInfo] = useState(null)
  const [offerings, setOfferings] = useState(null)

  useEffect(() => {
    Purchases.configure({ apiKey: API_KEY });

    const fetchOfferings = async () => {
      try {
        const offeringsResult = await Purchases.getOfferings();
        setOfferings(offeringsResult);

        const info = await Purchases.getCustomerInfo();
        setCustomerInfo(info);

      } catch (e) {
        console.log('Failed to fetch offerings:', e);
      }
    };

    fetchOfferings();
  }, []);

  const purchase = async (pkg) => {
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      setCustomerInfo(customerInfo);
      
    } catch (e) {
      console.warn('Purchase failed:', e);
    }
  };

  return (
    <RevenueCatContext.Provider value={{customerInfo, offerings, purchase}}>
      {children}
    </RevenueCatContext.Provider>
  )
}
