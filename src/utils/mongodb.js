import { MongoClient } from 'mongodb';

// MongoDB connection string - replace with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'krinastore'; // Your database name

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(DB_NAME);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function getCollection(collectionName) {
  const { db } = await connectToDatabase();
  return db.collection(collectionName);
}

// CRUD operations for items
export const itemsCollection = {
  // Get all items
  async getAll() {
    const collection = await getCollection('items');
    return await collection.find({}).toArray();
  },

  // Get item by ID
  async getById(id) {
    const collection = await getCollection('items');
    return await collection.findOne({ _id: id });
  },

  // Add new item
  async addItem(item) {
    const collection = await getCollection('items');
    const result = await collection.insertOne({
      ...item,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { ...item, _id: result.insertedId };
  },

  // Update item
  async updateItem(id, updates) {
    const collection = await getCollection('items');
    await collection.updateOne(
      { _id: id },
      { 
        $set: { 
          ...updates,
          updatedAt: new Date() 
        } 
      }
    );
    return await this.getById(id);
  },

  // Delete item
  async deleteItem(id) {
    const collection = await getCollection('items');
    return await collection.deleteOne({ _id: id });
  }
};

export default {
  connectToDatabase,
  getCollection,
  itemsCollection
};
