# Data Model: RAG Chatbot Integration Fix + Agent SDK Migration

**Date**: 2025-12-10
**Feature**: RAG Chatbot Integration Fix + Agent SDK Migration
**Branch**: 001-rag-chatbot

## Overview

This document defines the data models for the RAG chatbot system using OpenAI Agent SDK, Cohere embeddings, Qdrant vector database, and ChatKit frontend integration.

## Key Entities

### Book Content
**Description**: The source material from the Docusaurus book that will be chunked and embedded for RAG
- **Fields**:
  - `id` (string): Unique identifier for the content
  - `title` (string): Title of the book section/chapter
  - `content` (string): The actual text content
  - `source_path` (string): Path to the original source file
  - `created_at` (datetime): Timestamp of when content was processed
  - `updated_at` (datetime): Timestamp of last update

### Embeddings
**Description**: Vector representations of book content chunks stored in Qdrant for similarity search
- **Fields**:
  - `id` (string): Unique identifier for the embedding
  - `content_id` (string): Reference to the source content
  - `vector` (array[float]): The embedding vector (1024 dimensions for Cohere)
  - `metadata` (object): Additional information about the embedding
    - `chunk_index` (int): Position of this chunk in the original content
    - `source_path` (string): Path to the original source
    - `content_length` (int): Length of the original content chunk

### Chat Session
**Description**: User interaction context that maintains conversation history and context
- **Fields**:
  - `session_id` (string): Unique identifier for the chat session
  - `user_id` (string): Identifier for the user (if available)
  - `created_at` (datetime): When the session was created
  - `updated_at` (datetime): When the session was last updated
  - `messages` (array[Message]): List of messages in the conversation

### Message
**Description**: Individual message in a chat conversation
- **Fields**:
  - `message_id` (string): Unique identifier for the message
  - `session_id` (string): Reference to the chat session
  - `role` (string): Either "user" or "assistant"
  - `content` (string): The message text
  - `timestamp` (datetime): When the message was created
  - `retrieved_chunks` (array[object]): Chunks retrieved for this message (if any)

### Qdrant Collection
**Description**: Named "book_chunks", stores embedded content vectors with metadata
- **Fields** (Qdrant-specific):
  - `id` (string): Point ID in Qdrant
  - `vector` (array[float]): The embedding vector (1024 dimensions)
  - `payload` (object): Metadata stored with the vector
    - `content_id` (string): Reference to the original content
    - `text` (string): The original text chunk
    - `source_path` (string): Path to the original source
    - `chunk_index` (int): Position of this chunk in the original content

## API Request/Response Models

### Embed Request
**Description**: Request model for the /embed endpoint
- **Fields**:
  - `content` (string): The text content to embed
  - `source_path` (string): Path to the source document (optional)

### Embed Response
**Description**: Response model for the /embed endpoint
- **Fields**:
  - `status` (string): "success" or "error"
  - `message` (string): Human-readable status message
  - `chunks_processed` (int): Number of text chunks processed

### RAG Request
**Description**: Request model for the /rag endpoint
- **Fields**:
  - `query` (string): The user's question
  - `top_k` (int): Number of chunks to retrieve (default: 5)

### RAG Response
**Description**: Response model for the /rag endpoint
- **Fields**:
  - `query` (string): The original user query
  - `answer` (string): The agent's response
  - `retrieved_chunks` (array[object]): The chunks used to generate the answer
    - `text` (string): The chunk text
    - `source_path` (string): Path to the source document
    - `score` (float): Similarity score

### Selected Text RAG Request
**Description**: Request model for the /rag/selected endpoint
- **Fields**:
  - `selected_text` (string): The text selected by the user
  - `query` (string): The user's question about the selected text

### Selected Text RAG Response
**Description**: Response model for the /rag/selected endpoint
- **Fields**:
  - `query` (string): The original user query
  - `answer` (string): The agent's response based only on selected text
  - `selected_text_used` (string): The text that was used as context

## Validation Rules

### Book Content
- Content must be non-empty
- Source path must be valid
- Content should be reasonably sized (not too large for processing)

### Embeddings
- Vector dimensions must match Cohere's output (1024)
- Content ID must reference an existing book content record
- Metadata must include required fields

### Chat Session
- Session ID must be unique
- Messages must be in chronological order
- Session must be cleaned up after inactivity period

### API Models
- All required fields must be present
- Text fields should be sanitized to prevent injection
- Query lengths should be reasonable to prevent abuse

## State Transitions

### Chat Session States
1. **Created**: Session is initialized when user opens chat
2. **Active**: User has sent first message
3. **Inactive**: No activity for a period (may be cleaned up)
4. **Closed**: Session ended by user or system

## Relationships

- Book Content → Embeddings (1 to many): One content document can generate multiple embeddings
- Chat Session → Messages (1 to many): One session contains multiple messages
- Message → Retrieved Chunks (1 to many): One message may reference multiple chunks
- Embeddings → Qdrant Collection (stored as): Embeddings are stored in Qdrant as vectors with metadata