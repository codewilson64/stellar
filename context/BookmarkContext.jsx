import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const BookmarkContext = createContext()

export const BookmarkContextProvider = ({ children }) => {
  const [bookmarkedBooks, setBookMarkedBooks] = useState([])

  // Load bookmarks on startup
  useEffect(() => {
    const loadBookmarks = async () => {
        try {
          const stored = await AsyncStorage.getItem("bookmarks")
          if(stored) {
            setBookMarkedBooks(JSON.parse(stored))
          }
        } 
        catch (error) {
          console.log('Failed to load bookmarks:', error)
        }
    }
    
    loadBookmarks()
  }, [])

  // Save bookmarks on asyncStorage
  useEffect(() => {
    AsyncStorage.setItem("bookmarks", JSON.stringify(bookmarkedBooks))
      .catch(error => console.log('Failed to save bookmarks:', error))
  }, [bookmarkedBooks])

  const toggleBookmark = (book) => {
    const exists = bookmarkedBooks.find(b => b.id === book.id)
    if(exists) {
      setBookMarkedBooks(prev => prev.filter(b => b.id !== book.id))
    }
    else {
      setBookMarkedBooks(prev => [...prev, book])
    }
  }

  return (
    <BookmarkContext.Provider value={{bookmarkedBooks, toggleBookmark}}>
        { children }
    </BookmarkContext.Provider>
  )
}