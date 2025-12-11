# Quickstart Guide: RAG Chatbot Integration Fix + Agent SDK Migration

**Date**: 2025-12-10
**Feature**: RAG Chatbot Integration Fix + Agent SDK Migration
**Branch**: 001-rag-chatbot

## Overview

This guide provides a quick setup and deployment process for the RAG chatbot system using OpenAI Agent SDK, Cohere embeddings, Qdrant vector database, and ChatKit frontend integration.

## Prerequisites

- Python 3.11+
- Node.js 16+ (for frontend development)
- Qdrant Cloud Free Tier account
- Cohere API key
- Google Gemini API key
- OpenAI API key (for Agent SDK)

## Environment Setup

1. Create a `.env` file in the project root:

```bash
# Backend configuration
GEMINI_API_KEY=your_gemini_api_key_here
QDRANT_URL=your_qdrant_cluster_url_here
QDRANT_API_KEY=your_qdrant_api_key_here
COHERE_API_KEY=your_cohere_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Optional: specify port for backend
BACKEND_PORT=8000
```

2. Install backend dependencies:

```bash
pip install fastapi uvicorn qdrant-client openai cohere-google-vertexai google-generativeai python-dotenv
```

## Backend Setup

1. Start the FastAPI server:

```bash
uvicorn backend.main:app --reload --port 8000
```

2. The API will be available at `http://localhost:8000`

## Frontend Integration

1. The ChatKit widget will be available to integrate into your Docusaurus book pages
2. Add the widget to your HTML pages with the appropriate agent ID

## API Endpoints

### 1. Embed Content
`POST /embed`

Upload book content to generate embeddings and store in Qdrant:

```bash
curl -X POST http://localhost:8000/embed \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Your book content here...",
    "source_path": "book/chapter1.md"
  }'
```

### 2. RAG Query
`POST /rag`

Query the RAG system with a question:

```bash
curl -X POST http://localhost:8000/rag \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Your question here?",
    "top_k": 5
  }'
```

### 3. Selected Text RAG
`POST /rag/selected`

Query using only selected text (bypasses Qdrant):

```bash
curl -X POST http://localhost:8000/rag/selected \
  -H "Content-Type: application/json" \
  -d '{
    "selected_text": "The text the user selected...",
    "query": "Your question about the selected text?"
  }'
```

## OpenAI Agent Setup

1. Create the agent with the required tools:

```python
from openai import OpenAI

client = OpenAI()

agent = client.beta.agents.create(
  name="RAG Agent",
  instructions="You are a helpful assistant that answers questions based on book content provided through tools.",
  model="gpt-4",
  tools=[
    {"type": "function", "function": retrieve_chunks_function},
    {"type": "function", "function": answer_with_context_function}
  ]
)

# The returned agent ID should be used in the frontend
AGENT_ID = agent.id
```

## Qdrant Collection Setup

The system will automatically create a collection named "book_chunks" with:
- Vector size: 1024 (for Cohere embeddings)
- Distance: cosine

## Frontend Widget Integration

1. The ChatKit widget will appear as a floating button in the bottom-right corner
2. It will have the ARIA label "Open chatbot" for accessibility
3. If backend is unavailable, it will show "Chatbot is unavailable. Please try again later."

## Development Workflow

1. Run embedding pipeline to process book content:

```bash
python backend/scripts/embed_pipeline.py
```

2. Verify embeddings exist before querying:

```bash
# Check if embeddings are available
curl http://localhost:8000/health
```

3. Test the RAG functionality:

```bash
# Test a question
curl -X POST http://localhost:8000/rag \
  -H "Content-Type: application/json" \
  -d '{"query": "What is RAG?"}'
```

## Error Handling

- If embeddings are missing, the system will return: "Embedding not found: Re-run embed pipeline"
- API endpoints will return appropriate HTTP status codes
- Frontend will handle network errors gracefully

## Troubleshooting

1. **Embedding not found**: Run the embedding pipeline again
2. **Qdrant connection issues**: Verify QDRANT_URL and QDRANT_API_KEY
3. **API rate limits**: Check your Cohere and Gemini API usage
4. **Frontend not loading**: Verify agent ID is correctly configured

## Next Steps

1. Deploy backend to Render.com (or similar platform)
2. Integrate frontend widget with your Docusaurus book
3. Test end-to-end functionality
4. Monitor performance and optimize as needed