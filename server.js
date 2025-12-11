require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { embedText } = require('./embeddings');
const { searchVectors } = require('./qdrant');

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-pro' });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// RAG endpoints for chat widget
app.post('/api/v1/rag', async (req, res) => {
  try {
    const { query, top_k = 5 } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    console.log('RAG query received:', query);

    // Step 1: Generate embedding for the query
    console.log('Generating embedding for query...');
    const queryEmbedding = await embedText(query);

    // Step 2: Search in Qdrant for similar content
    console.log('Searching in Qdrant...');
    const searchResults = await searchVectors(queryEmbedding, top_k);

    // Step 3: Prepare context from search results
    let contextText = '';
    if (searchResults && searchResults.length > 0) {
      contextText = searchResults.map(result =>
        `Source: ${result.payload?.source || 'Unknown'}\n` +
        `Content: ${result.payload?.text || ''}\n` +
        `---\n`
      ).join('');
    } else {
      contextText = 'No relevant content found in the book.';
    }

    // Step 4: Create prompt for Gemini
    const prompt = `Based on the following book content, please answer the question. If the answer is not in the provided content, please say "This information is not in the book."

Book Content:
${contextText}

Question: ${query}

Answer:`;

    // Step 5: Generate response using Gemini
    console.log('Generating response with Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Step 6: Return the response
    res.json({
      query: query,
      answer: text,
      sources: searchResults.map(result => ({
        id: result.id,
        score: result.score,
        source: result.payload?.source || 'Unknown',
        text: result.payload?.text?.substring(0, 200) + '...' || ''
      }))
    });
  } catch (error) {
    console.error('Error processing RAG query:', error);

    // Check if it's a Gemini API error
    if (error.status === 503 && error.statusText === 'Service Unavailable') {
      // Return a more informative response for overloaded model
      res.status(503).json({
        error: 'Model is temporarily overloaded. Please try again in a moment.',
        query: req.body.query,
        answer: "I'm currently experiencing high demand. Please try your question again in a moment, or try rephrasing your question."
      });
    } else {
      res.status(500).json({
        error: 'Internal server error',
        query: req.body.query,
        answer: "Sorry, I'm having trouble processing your request right now. Please try again later."
      });
    }
  }
});

// RAG endpoint for selected text mode
app.post('/api/v1/rag/selected', async (req, res) => {
  try {
    const { query, selected_text } = req.body;

    if (!query || !selected_text) {
      return res.status(400).json({ error: 'Query and selected_text are required' });
    }

    console.log('RAG selected text query received:', query);

    // Create prompt with selected text as high-priority context
    const prompt = `Based on the following selected text content, please answer the question. If the answer is not in the provided content, please say "This information is not in the selected text."

Selected Text Context:
${selected_text}

Question: ${query}

Answer:`;

    // Generate response using Gemini
    console.log('Generating response with Gemini for selected text...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Return the response
    res.json({
      query: query,
      answer: text,
      context_used: selected_text.substring(0, 200) + '...'
    });
  } catch (error) {
    console.error('Error processing RAG selected text query:', error);

    // Check if it's a Gemini API error
    if (error.status === 503 && error.statusText === 'Service Unavailable') {
      // Return a more informative response for overloaded model
      res.status(503).json({
        error: 'Model is temporarily overloaded. Please try again in a moment.',
        query: req.body.query,
        answer: "I'm currently experiencing high demand. Please try your question again in a moment, or try rephrasing your question.",
        context_used: req.body.selected_text ? req.body.selected_text.substring(0, 200) + '...' : ''
      });
    } else {
      res.status(500).json({
        error: 'Internal server error',
        query: req.body.query,
        answer: "Sorry, I'm having trouble processing your request right now. Please try again later.",
        context_used: req.body.selected_text ? req.body.selected_text.substring(0, 200) + '...' : ''
      });
    }
  }
});

// POST /ask endpoint (legacy)
app.post('/ask', async (req, res) => {
  try {
    const { query, question, chat_session_id, highlighted_text, context } = req.body;

    // Use query or question field (to support both frontend versions)
    const userQuery = query || question;
    if (!userQuery) {
      return res.status(400).json({ error: 'Query is required' });
    }

    console.log('Received query:', userQuery);

    // Step 1: Generate embedding for the query
    console.log('Generating embedding for query...');
    const queryEmbedding = await embedText(userQuery);

    // Step 2: Search in Qdrant for similar content
    console.log('Searching in Qdrant...');
    const searchResults = await searchVectors(queryEmbedding, 5); // Top 5 results

    // Step 3: Prepare context from search results
    let contextText = '';
    if (searchResults && searchResults.length > 0) {
      contextText = searchResults.map(result =>
        `Source: ${result.payload?.source || 'Unknown'}\n` +
        `Content: ${result.payload?.text || ''}\n` +
        `---\n`
      ).join('');
    } else {
      contextText = 'No relevant content found in the book.';
    }

    // Step 4: Create prompt for Gemini
    let prompt;
    if (highlighted_text) {
      // If highlighted text is provided, include it as high-priority context
      prompt = `Based on the following book content, please answer the question. The highlighted text is provided as additional context. If the answer is not in the provided content, please say "This information is not in the book."

Highlighted Text Context:
${highlighted_text}

Book Content:
${contextText}

Question: ${userQuery}

Answer:`;
    } else {
      prompt = `Based on the following book content, please answer the question. If the answer is not in the provided content, please say "This information is not in the book."

Book Content:
${contextText}

Question: ${userQuery}

Answer:`;
    }

    // Step 5: Generate response using Gemini
    console.log('Generating response with Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Step 6: Return the response
    res.json({
      query: userQuery,
      answer: text,
      chat_session_id: chat_session_id || null,
      sources: searchResults.map(result => ({
        id: result.id,
        score: result.score,
        source: result.payload?.source || 'Unknown',
        text: result.payload?.text?.substring(0, 200) + '...' || ''
      }))
    });
  } catch (error) {
    console.error('Error processing query:', error);

    // Check if it's a Gemini API error
    if (error.status === 503 && error.statusText === 'Service Unavailable') {
      // Return a more informative response for overloaded model
      res.status(503).json({
        error: 'Model is temporarily overloaded. Please try again in a moment.',
        query: userQuery,
        answer: "I'm currently experiencing high demand. Please try your question again in a moment, or try rephrasing your question."
      });
    } else {
      res.status(500).json({
        error: 'Internal server error',
        query: userQuery,
        answer: "Sorry, I'm having trouble processing your request right now. Please try again later."
      });
    }
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'RAG Chatbot API is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Use POST /ask to send queries`);
});

module.exports = app;