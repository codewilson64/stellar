import { createContext, useEffect, useState } from "react";
import { databases } from '../lib/appwrite'
import { Query } from "react-native-appwrite";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeviceInfo from "react-native-device-info";

import { 
  APPWRITE_DATABASE_ID, 
  APPWRITE_BOOKS_COLLECTION_ID, 
  APPWRITE_CHAPTERS_COLLECTION_ID,
  APPWRITE_FREEBOOK_CACHE_COLLECTION_ID 
} from '@env'

const DATABASE_ID = '680737df001e31e206f7'
const BOOKS_COLLECTION_ID = '6815c2ba000533b37bee'
const CHAPTERS_COLLECTION_ID = '6815c854002efdadd675'
const FREE_BOOK_CACHE_COLLECTION_ID = '68a15948003dbfe1be1f'

const updateChaptersWithBookId = async () => {
  const chapters = [
    { id: "68a32637003d3336c56f", bookId: "68a301000038a77d62be" },
    { id: "68a325680019cc0a9c6e", bookId: "68a301000038a77d62be" },
    { id: "68a32171001e4715213a", bookId: "68a301000038a77d62be" },
    { id: "68a3201a0007b03db68b", bookId: "68a301000038a77d62be" },
    { id: "68a31dde001fda76d85c", bookId: "68a301000038a77d62be" },
    { id: "68a31d050036f8d998eb", bookId: "68a301000038a77d62be" },
    { id: "68a31b3b002978b7a1c6", bookId: "68a301000038a77d62be" },
    { id: "68a302b600136e641e52", bookId: "68a301000038a77d62be" },
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

  const fetchRandomFreeBook = async (forceFetch = false) => {
    try {
      // Step 1: Get unique device ID
      const deviceId = await DeviceInfo.getUniqueId();
      console.log('Device ID:', deviceId)

      const oneDay = 24 * 60 * 60 * 1000

      // Step 2: Check for cached book in Appwrite
      let cachedBookDoc;
      try {
        cachedBookDoc = await databases.getDocument(
          DATABASE_ID,
          FREE_BOOK_CACHE_COLLECTION_ID, // For caching device-specific data
          deviceId // Use deviceId as document ID
        );
        console.log('Cached book document found:', cachedBookDoc)
      } 
      catch (error) {
        console.log('No cached book found in Appwrite for device:', deviceId, error.message);
      }

      // Step 3: Fetch server time securely from Appwrite headers
      const healthResponse = await fetch(`https://fra.cloud.appwrite.io/v1/health`, {
        headers: { 'X-Appwrite-Project': '68048c050008092ba67c' },
      });
      const serverTime = new Date(healthResponse.headers.get('date')).getTime();
      console.log("Server time (from header):", new Date(serverTime).toISOString());

      // Step 4: If cached book is still valid according to server time, return it
      if (
        cachedBookDoc &&
        cachedBookDoc.lastFetch &&
        serverTime - new Date(cachedBookDoc.lastFetch).getTime() < oneDay &&
        !forceFetch
      ) {
        console.log('Load free book from Appwrite cache (server time check):', JSON.parse(cachedBookDoc.book));
        return JSON.parse(cachedBookDoc.book); // Deserialize JSON string to object
      }

      // Step 5: Fetch a new random book
      const response = await databases.listDocuments(
        DATABASE_ID,
        BOOKS_COLLECTION_ID,
        [Query.orderDesc('$createdAt'), Query.limit(30)]
      );
      const shuffled = response.documents.sort(() => 0.5 - Math.random());
      const randomBook = shuffled[0];

      const trimmedBook = {
        id: randomBook.$id,
        title: randomBook.title,
        image: randomBook.image,
      };

      // Step 6: Store the new book and timestamp in Appwrite
      let newDocument
      try {
        // Attempt to get the document to check if it exists
        await databases.getDocument(DATABASE_ID, FREE_BOOK_CACHE_COLLECTION_ID, deviceId);

        // If successful, update the existing document
        newDocument = await databases.updateDocument(
          DATABASE_ID,
          FREE_BOOK_CACHE_COLLECTION_ID,
          deviceId,
          {
            book: JSON.stringify(trimmedBook),
            lastFetch: new Date(serverTime).toISOString(),
          }
        );
        console.log('Updated cached book in Appwrite for device:', deviceId);
      } 
      catch (getError) {
        // If document doesn't exist, create a new one
        newDocument = await databases.createDocument(
          DATABASE_ID,
          FREE_BOOK_CACHE_COLLECTION_ID,
          deviceId,
          {
            book: JSON.stringify(trimmedBook),
            lastFetch: new Date(serverTime).toISOString(),
          }
        );
        console.log('Created cached book in Appwrite for device:', deviceId);
      }
        console.log('Fetched and cached new book in Appwrite for device:', deviceId, trimmedBook);
        return trimmedBook;
      } 
      catch (error) {
        console.log('Error occurred:', error.message);
      }
    };

  // Fetch Books
  const fetchBooks = async () => {
    try {
      // Before fetch books, check if there is caches
      const cached = await AsyncStorage.getItem('cachedBooks')
      const lastFetch = await AsyncStorage.getItem('booksLastFetch')

      const now = new Date().getTime()
      const threeDay = 3 * 24 * 60 * 60 * 1000

      if (cached && lastFetch && now - Number(lastFetch) < threeDay) {
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
      const threeDay = 3 * 24 * 60 * 60 * 1000

      if (cached && lastFetch && now - Number(lastFetch) < threeDay) {
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
      // Check category from cache
      const cacheKey = `cachedCategory_${category}`
      const cached = await AsyncStorage.getItem(cacheKey)

      if (cached) {
        console.log(`Loaded ${category} from cache`, cached)
        return JSON.parse(cached)
      }

      // If not yet cached, fetch category from database
      const response = await databases.listDocuments(
        DATABASE_ID,
        BOOKS_COLLECTION_ID,
        [
          Query.equal('category', category),
          Query.limit(100)
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

  // useEffect(() => {
  //   const clearCache = async () => {
  //     await AsyncStorage.clear()
  //     console.log("Cache cleared on app start")
  //   }

  //   clearCache()
  // }, [])

  return (
    <BooksContext.Provider value={{
      books, 
      fetchChapters, 
      fetchSingleBook, 
      fetchRandomFreeBook, 
      fetchRandomCategory, 
      fetchCategory, 
    }}>
      { children }
    </BooksContext.Provider>
  )
}