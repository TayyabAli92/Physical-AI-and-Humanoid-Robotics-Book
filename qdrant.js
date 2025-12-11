require('dotenv').config();
const { QdrantClient } = require('@qdrant/js-client-rest');

// Initialize Qdrant client with configuration from environment
const client = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

const COLLECTION_NAME = process.env.QDRANT_COLLECTION_NAME || 'book_chunks';

// Function to create the collection if it doesn't exist
const createCollection = async () => {
  try {
    // Check if collection exists
    const collections = await client.getCollections();
    const collectionExists = collections.collections.some(
      collection => collection.name === COLLECTION_NAME
    );

    if (!collectionExists) {
      // Create collection with appropriate vector size for Cohere embeddings
      // Cohere's embed-multilingual-v3.0 produces 1024-dimensional vectors
      await client.createCollection(COLLECTION_NAME, {
        vectors: {
          size: 1024, // Cohere embedding dimension
          distance: 'Cosine',
        },
      });
      console.log(`Collection ${COLLECTION_NAME} created successfully`);
    } else {
      console.log(`Collection ${COLLECTION_NAME} already exists`);
    }
  } catch (error) {
    console.error('Error creating collection:', error);
    throw error;
  }
};

// Function to upsert vectors to the collection
const upsertVectors = async (vectorsData) => {
  try {
    const points = vectorsData.map((data, index) => ({
      id: data.id ? (typeof data.id === 'string' ? parseInt(data.id.replace(/\D/g, '')) || index : data.id) : index,
      vector: data.vector,
      payload: data.payload || {},
    }));

    await client.upsert(COLLECTION_NAME, {
      wait: true, // Wait for operation to complete
      points,
    });

    console.log(`Upserted ${points.length} vectors to ${COLLECTION_NAME}`);
  } catch (error) {
    console.error('Error upserting vectors:', error);
    throw error;
  }
};

// Function to search for similar vectors
const searchVectors = async (queryVector, topK = 5) => {
  try {
    const searchResults = await client.search(COLLECTION_NAME, {
      vector: queryVector,
      limit: topK,
      with_payload: true,
    });

    return searchResults;
  } catch (error) {
    console.error('Error searching vectors:', error);
    throw error;
  }
};

module.exports = {
  client,
  createCollection,
  upsertVectors,
  searchVectors,
  COLLECTION_NAME
};