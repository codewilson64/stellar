import { createContext, useEffect, useState } from "react";
import { databases } from '../lib/appwrite'
import { Query } from "react-native-appwrite";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DATABASE_ID = '680737df001e31e206f7'
const BOOKS_COLLECTION_ID = '6815c2ba000533b37bee'
const CHAPTERS_COLLECTION_ID = '6815c854002efdadd675'

const updateChaptersWithBookId = async () => {
  const chapters = [
    { id: "6852991200222a796ff0", bookId: "68528a20001751c5e61c" },
    { id: "6852986f001f1a4db856", bookId: "68528a20001751c5e61c" },
    { id: "685297890021b88bd49c", bookId: "68528a20001751c5e61c" },
    { id: "685296d9002ee5844ba1", bookId: "68528a20001751c5e61c" },
    { id: "685295f00009ed2d58fc", bookId: "68528a20001751c5e61c" },
    { id: "685294dd0012b21ffbd0", bookId: "68528a20001751c5e61c" },
    { id: "68528f250021ea92bf4f", bookId: "68528a20001751c5e61c" },
    { id: "68528e98002556a947c8", bookId: "68528a20001751c5e61c" },
  ];

  for (const { id, bookId } of chapters) {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        CHAPTERS_COLLECTION_ID,
        id,
        { book_id: bookId }
      );
      console.log(`Updated chapter ${id}`);
    } catch (error) {
      console.error(`Failed to update ${id}: ${error.message}`);
    }
  }
};

export const BooksContext = createContext()

export const BooksContextProvider = ({ children }) => {
  const [books, setBooks] = useState([])

  // Fetch Books
  const fetchBooks = async () => {
    try {
      // Before fetch books, check if there is caches
      const cached = await AsyncStorage.getItem('cachedBooks')
      const lastFetch = await AsyncStorage.getItem('booksLastFetch')

      const now = new Date().getTime()
      const oneDay = 24 * 60 * 60 * 1000

      if (cached && lastFetch && now - Number(lastFetch) < oneDay) {
        setBooks(JSON.parse(cached))
        console.log('Loaded from cache', cached)
        return
      }

      // If no caches, then fetch books from database
      const response = await databases.listDocuments(
        DATABASE_ID,
        BOOKS_COLLECTION_ID,
        [
          Query.orderDesc('$createdAt'),
          Query.limit(30)
        ]
      )    
      const shuffled = response.documents.sort(() => 0.5 - Math.random())
      const randomBooks = shuffled.slice(0, 10)

      // Cache only these fields (for performance)
      const trimmedBooks = randomBooks.map(book => ({
        id: book.$id,
        title: book.title,
        image: book.image
      }))

      // Store to local storage to save appwrite read usage
      await AsyncStorage.setItem('cachedBooks', JSON.stringify(trimmedBooks))
      await AsyncStorage.setItem('booksLastFetch', now.toString())

      setBooks(trimmedBooks)
    } 
    catch (error) {
      console.log(error.message)
    }
  }

  // Fetch Chapters
  const fetchChapters = async (bookId) => {
    try {
      const cacheKey = `cachedChapters_${bookId}`
      const cached = await AsyncStorage.getItem(cacheKey)

      if(cached) {
        console.log(`Loaded chapters for book ${bookId} from cache`, cached)
        return JSON.parse(cached)
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        CHAPTERS_COLLECTION_ID,
        [Query.equal('book_id', bookId)]
      )

      // Cache only these fields (for performance)
      const chapters = response.documents.map(chapter => ({
        id: chapter.$id,
        title: chapter.title,
        summary: chapter.summary
      }))
      
      // Store to local storage to save read usage
      await AsyncStorage.setItem(cacheKey, JSON.stringify(chapters))

      return chapters
    } 
    catch (error) {
      console.log(error.message)  
    }
  }

  // Fetch Single Book
  const fetchSingleBook = async (id) => {
    try {
      const cacheKey = `cacheBook_${id}`
      const cached = await AsyncStorage.getItem(cacheKey)

      if (cached) {
        console.log(`Loaded ${id} from cache`, cached)
        return JSON.parse(cached)
      }

      const response = await databases.getDocument(
        DATABASE_ID,
        BOOKS_COLLECTION_ID,
        id
      )

      // Cache only these fields (for performance)
      const trimmedBooks = {
        id: response.$id,
        title: response.title,
        author: response.author,
        image: response.image,
        description: response.description
      }

      // Store to local storage to save read usage
      await AsyncStorage.setItem(cacheKey, JSON.stringify(trimmedBooks))

      return trimmedBooks
    } 
    catch (error) {
      console.log(error.message)   
      return null
    }
  }

  // Fetch Random Category
  const fetchRandomCategory = async (category) => {
    try {
      const cacheKey = `cachedBooks_${category}`
      const timestampKey = `booksLastFetch_${category}`

      const cached = await AsyncStorage.getItem(cacheKey)
      const lastFetch = await AsyncStorage.getItem(timestampKey)

      const now = new Date().getTime()
      const oneDay = 24 * 60 * 60 * 1000

      if (cached && lastFetch && now - Number(lastFetch) < oneDay) {
        console.log(`Loaded ${category} from cache`)
        return JSON.parse(cached)
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        BOOKS_COLLECTION_ID,
        [Query.equal('category', category)]
      )

      const shuffled = response.documents.sort(() => 0.5 - Math.random())
      const randomBooks = shuffled.slice(0, 10)

      // Cache only these fields (for performance)
      const trimmedBooks = randomBooks.map(book => ({
        id: book.$id,
        title: book.title,
        image: book.image
      }))

      // Store to local storage to save read usage
      await AsyncStorage.setItem(cacheKey, JSON.stringify(trimmedBooks))
      await AsyncStorage.setItem(timestampKey, now.toString())

      return trimmedBooks
    } 
    catch (error) {
      console.log(error.message)  
    }
  }

  // Fetch Category
  const fetchCategory = async (category) => {
    try {
      const cacheKey = `cachedCategory_${category}`

      const cached = await AsyncStorage.getItem(cacheKey)

      if (cached) {
        console.log(`Loaded ${category} from cache`, cached)
        return JSON.parse(cached)
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        BOOKS_COLLECTION_ID,
        [
          Query.equal('category', category),
        ]
      )

      // Cache only these fields (for performance)
      const trimmedBooks = response.documents.map(book => ({
        id: book.$id,
        title: book.title,
        image: book.image
      }))

      // Store to local storage to save read usage
      await AsyncStorage.setItem(cacheKey, JSON.stringify(trimmedBooks))

      return trimmedBooks
    } 
    catch (error) {
      console.log(error.message)  
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  // useEffect(() => {
  //   updateChaptersWithBookId() 
  // }, [])

//   useEffect(() => {
//   const clearCache = async () => {
//     await AsyncStorage.clear()
//     console.log("Cache cleared on app start")
//   }

//   clearCache()
// }, [])

  return (
    <BooksContext.Provider value={{books, fetchChapters, fetchSingleBook, fetchRandomCategory, fetchCategory}}>
      { children }
    </BooksContext.Provider>
  )
}