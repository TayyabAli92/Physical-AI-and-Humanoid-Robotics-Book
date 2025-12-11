# Research: RAG Chatbot Integration Fix + Agent SDK Migration

**Date**: 2025-12-10
**Feature**: RAG Chatbot Integration Fix + Agent SDK Migration
**Branch**: 001-rag-chatbot

## Overview

This document captures research findings for migrating the existing RAG chatbot to use OpenAI Agent SDK with Cohere embeddings, Qdrant vector database, and ChatKit frontend integration.

## Decision: OpenAI Agent SDK Implementation

**Rationale**: The requirements mandate using the official OpenAI Agent SDK to create the RAG chatbot agent. This provides a standardized way to create AI agents with custom tools and functions.

**Alternatives considered**:
- Custom agent implementation: More complex and not aligned with requirements
- LangChain agents: Would not fulfill the requirement to use OpenAI Agent SDK specifically

## Decision: Cohere Embedding Model

**Rationale**: The requirements specify using Cohere's free embedding model for generating embeddings. Cohere's embed-multilingual-v2.0 model is suitable for this purpose and available on the free tier.

**Alternatives considered**:
- OpenAI embeddings: Not specified in requirements
- Google embeddings: Not specified in requirements
- Hugging Face models: Would require additional infrastructure

## Decision: Qdrant Cloud Integration

**Rationale**: The requirements mandate connecting to Qdrant Cloud Free Tier with specific environment variables (QDRANT_URL, QDRANT_API_KEY). Qdrant is a proven vector database solution that supports the required cosine similarity search.

**Alternatives considered**:
- Pinecone: Would require different integration approach
- Weaviate: Would require different integration approach
- Local vector stores: Would not meet cloud requirements

## Decision: ChatKit Frontend SDK

**Rationale**: The requirements specify using ChatKit frontend SDK for the widget implementation. This provides a standardized UI for agent conversations with streaming support.

**Alternatives considered**:
- Custom chat UI: Would require more development time
- Other chat SDKs: Would not fulfill the specific requirement

## Decision: MCP Tools Integration

**Rationale**: The requirements specify using MCP (Model Context Protocol) tools as documented in context7. This allows for standardized integration between the agent and external systems.

**Alternatives considered**:
- Direct API calls: Would not follow MCP standards
- Custom tool implementations: Would not be standardized

## Decision: Selected Text RAG Mode

**Rationale**: The requirements specify implementing a selected-text-only RAG mode that bypasses Qdrant. This allows users to get answers specifically from highlighted text without querying the entire knowledge base.

**Alternatives considered**:
- Always use full RAG: Would not fulfill the specific requirement
- Different implementation approach: Would not meet the bypass requirement

## Technical Findings

### OpenAI Agent SDK
- Requires agent creation with specific tools
- Tools can be added to agent for retrieving chunks and answering with context
- Agent ID is generated upon creation and needed for frontend integration

### Cohere Embeddings
- Cohere's embed-multilingual-v2.0 model produces 1024-dimensional vectors
- Free tier allows for limited requests per day
- Requires COHERE_API_KEY environment variable

### Qdrant Collection Setup
- Collection "book_chunks" needs to be created
- Vector size should match embedding dimensions (1024 for Cohere)
- Cosine distance is appropriate for similarity search

### API Endpoints
- POST /embed: Creates embeddings and upserts to Qdrant
- POST /rag: Retrieves relevant chunks and generates response
- POST /rag/selected: Processes selected text without Qdrant

### Environment Variables Required
- GEMINI_API_KEY: For Gemini LLM access
- QDRANT_URL: For Qdrant Cloud connection
- QDRANT_API_KEY: For Qdrant Cloud authentication
- COHERE_API_KEY: For Cohere embeddings
- AGENT_ID: Generated from OpenAI Agent SDK after creation

## Implementation Considerations

### Error Handling
- Embedding verification before Qdrant queries
- Fallback message when backend is unavailable
- Proper error messages for missing embeddings

### Accessibility
- ARIA label "Open chatbot" for the widget button
- Proper focus management for keyboard navigation
- Screen reader compatibility

### Performance
- Chunk size optimization for embedding generation
- Caching strategies for frequent queries
- Response streaming for better user experience