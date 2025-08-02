import { Client, Account, Databases, Avatars } from 'react-native-appwrite';

export const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('68048c050008092ba67c')

export const account = new Account(client)
export const avatars = new Avatars(client)
export const databases = new Databases(client)












  
