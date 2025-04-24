import { Client, Account, Avatars } from 'react-native-appwrite';

export const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('68048c050008092ba67c')
    .setPlatform('dev.codewilson.stellar');

export const account = new Account(client)
export const avatars = new Avatars(client)
