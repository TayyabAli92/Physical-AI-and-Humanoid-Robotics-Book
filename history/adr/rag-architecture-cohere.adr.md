# ADR: RAG Chatbot Architecture with Cohere Embeddings

## Status
Accepted

## Context
For the RAG (Retrieval-Augmented Generation) chatbot implementation, we needed to make several architectural decisions regarding the technology stack, including:
- Which service to use for embeddings generation
- Which vector database to use for similarity search
- How to structure the overall system architecture
- How to handle text chunking and tokenization

## Decision
We decided to use the following technology stack:
- **Embeddings**: Cohere's embed-multilingual-v3.0 model for generating text embeddings
- **Vector Database**: Qdrant for storing and searching vector embeddings
- **Response Generation**: Google's Gemini model for generating responses based on retrieved context
- **Backend**: Node.js with Express.js for the API server
- **Text Processing**: Custom chunking algorithm with configurable token limits

## Alternatives Considered
1. **Embeddings**:
   - OpenAI embeddings (higher cost, less multilingual support)
   - Hugging Face transformers (self-hosted, more complex setup)
   - Google embeddings (already using Gemini, but Cohere has better multilingual support)

2. **Vector Database**:
   - Pinecone (managed but more expensive)
   - Weaviate (open source alternative)
   - Supabase Vector (if already using Supabase)

3. **Response Generation**:
   - OpenAI GPT models (higher cost)
   - Anthropic Claude (different pricing model)
   - Open-source models (self-hosted, less reliable)

## Rationale
- Cohere's embed-multilingual-v3.0 was chosen for its excellent multilingual support and competitive pricing
- Qdrant was selected as a robust, open-source vector database with good performance and API support
- Gemini was retained for response generation to maintain the existing workflow while changing only the embedding service
- The architecture follows standard RAG patterns for good separation of concerns and maintainability

## Consequences
### Positive
- Good multilingual support for diverse content
- Cost-effective solution compared to some alternatives
- Scalable architecture with clear separation of concerns
- Open-source components where possible (Qdrant)

### Negative
- Dependency on multiple external APIs (Cohere, Qdrant, Gemini)
- Additional complexity compared to simpler solutions
- Potential vendor lock-in to specific services

## Implementation
The implementation includes:
- embeddings.js for Cohere integration
- qdrant.js for vector database operations
- chunker.js for text processing
- process-book.js for data pipeline
- server.js for the API layer