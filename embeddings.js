require('dotenv').config();
const { CohereClient } = require('cohere-ai');

// Initialize Cohere client with API key from environment
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

const embedText = async (text) => {
  try {
    const response = await cohere.embed({
      texts: [text],
      model: process.env.COHERE_EMBEDDING_MODEL || 'embed-multilingual-v3.0',
      inputType: "search_document"
    });

    return response.embeddings[0]; // Return the first embedding
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
};

const embedTexts = async (texts) => {
  try {
    const response = await cohere.embed({
      texts: texts,
      model: process.env.COHERE_EMBEDDING_MODEL || 'embed-multilingual-v3.0',
      inputType: "search_document"
    });

    return response.embeddings; // Return all embeddings
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw error;
  }
};

module.exports = {
  embedText,
  embedTexts
};