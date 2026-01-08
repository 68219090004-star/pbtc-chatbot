// lib/db.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

// Helper functions
export async function getDb() {
  const client = await clientPromise;
  return client.db();
}

export async function getUsersCollection() {
  const db = await getDb();
  return db.collection('users');
}

export async function getChatsCollection() {
  const db = await getDb();
  return db.collection('chats');
}

export async function getMessagesCollection() {
  const db = await getDb();
  return db.collection('messages');
}