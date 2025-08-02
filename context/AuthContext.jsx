import { createContext, useEffect, useState } from "react";
import { account } from '../lib/appwrite'
import { ID } from "react-native-appwrite";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

export const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const router = useRouter()

    // login
    const login = async (email, password) => {
       try {
        await account.createEmailPasswordSession(email, password)
        const response = await account.get()
        setUser(response)
      } catch (error) {
        console.error("Login Error:", error)
        let message = "Login failed."

        if (error.code === 400) {
          message = "Incorrect email or password."
        } else if (error.code === 500) {
          message = "Server error. Please try again later."
        }

        throw new Error(message)
      }
    }

    // signup
    const signup = async (email, password) => {
      try {
        await account.create(ID.unique(), email, password)
        await login(email, password)
      } catch (error) {
        let message = "Signup failed."

        if (error.code === 409) {
          message = "This email is already registered."
        } else if (error.code === 400) {
          if (error.message.toLowerCase().includes("password")) {
            message = "Password must be at least 8 characters long."
          } else {
            message = "Invalid input. Please check your email and password."
          }
        } else if (error.code === 500) {
          message = "Server error during signup. Please try again later."
        }

        console.error("Signup Error:", error)
        throw new Error(message)
      }
    }

     // logout
    const logout = async () => {
      await account.deleteSession("current")
      setUser(null)
      router.push('/login')
    }

    // deactivate account
    const deactivateAccount = async () => {
      try {
        // Deactivate the account
        await account.updateStatus()
        console.log('Account deactivated successfully');

        // Attempt to delete the session
        try {
          await account.deleteSession('current');
          console.log('Session deleted successfully');
        } catch (sessionError) {
          console.warn('Failed to delete session (proceeding anyway):', sessionError.message);
          // Continue even if session deletion fails
        }

        // Clear user state and navigate to homepage
        setUser(null)
        router.push('/')
      } 
      catch (error) {
        console.log('failed deactivating account', error)
        Alert.alert('Error', `Failed to deactivate account: ${error.message}`)
        throw new Error(`failed deactivating account: ${error.message}`)
      }
    }

    const getInitialUserValue = async () => {
      try {
        const response = await account.get()
        setUser(response)
      } catch (error) {
        setUser(null)
      }
    }

    useEffect(() => {
      getInitialUserValue()
    }, [])

    return (
      <AuthContext.Provider value={{user, signup, login, deactivateAccount, logout}}>
        {children}
      </AuthContext.Provider>
    )
}