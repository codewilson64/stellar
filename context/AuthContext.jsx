import { createContext, useEffect, useState } from "react";
import { account } from '../lib/appwrite'
import { ID } from "react-native-appwrite";

export const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    const login = async (email, password) => {
       try {
        await account.createEmailPasswordSession(email, password)
        const response = await account.get()
        setUser(response)
      } catch (error) {
        let message = "Login failed."

        if (error.code === 400) {
          message = "Incorrect email or password."
        } else if (error.code === 500) {
          message = "Server error. Please try again later."
        }

        throw new Error(message)
      }
    }

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

    const logout = async () => {
      await account.deleteSession("current")
      setUser(null)
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
      <AuthContext.Provider value={{user, signup, login, logout}}>
        {children}
      </AuthContext.Provider>
    )
}