import { createContext, useEffect, useState } from "react";
import { databases } from '../lib/appwrite'
import { Query } from "react-native-appwrite";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DATABASE_ID = '680737df001e31e206f7'
const BOOKS_COLLECTION_ID = '6815c2ba000533b37bee'
const CHAPTERS_COLLECTION_ID = '6815c854002efdadd675'

const updateChaptersWithBookId = async () => {
  const chapters = [
    { id: "6836da5f0026142eed9d", bookId: "683af23a002bbc7d123e" },
    { id: "6836da0f000cd8258122", bookId: "683af23a002bbc7d123e" },
    { id: "6836d970003247aabf8b", bookId: "683af23a002bbc7d123e" },
    { id: "6836c3b10002bd72f252", bookId: "683af23a002bbc7d123e" },
    { id: "6836c365001c8b861773", bookId: "683af23a002bbc7d123e" },
    { id: "6836c2ce000c82661622", bookId: "683af23a002bbc7d123e" },
    { id: "6836c23c000b8a1aba05", bookId: "683af23a002bbc7d123e" },
    { id: "6836c1b1000c887a97f7", bookId: "683af23a002bbc7d123e" },
    { id: "6836c11f0015cdb47a2d", bookId: "683af23a002bbc7d123e" },
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
      const cached = await AsyncStorage.getItem('cachedBooks')
      const lastFetch = await AsyncStorage.getItem('booksLastFetch')

      const now = new Date().getTime()
      const oneDay = 24 * 60 * 60 * 1000

      if (cached && lastFetch && now - Number(lastFetch) < oneDay) {
        setBooks(JSON.parse(cached))
        console.log('Loaded from cache', cached)
        return
      }

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

      // Store to local storage to save read usage
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
        [Query.equal('category', category)]
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

  return (
    <BooksContext.Provider value={{books, fetchChapters, fetchSingleBook, fetchRandomCategory, fetchCategory}}>
      { children }
    </BooksContext.Provider>
  )
}