# Feature Specification: RAG Chatbot Integration Fix + Agent SDK Migration

**Feature Branch**: `001-rag-chatbot`
**Created**: 2025-12-10
**Status**: Draft
**Input**: User description: "RAG Chatbot Integration Fix + Agent SDK Migration"

REQ-001: Agent Creation Using OpenAI Agent SDK
  - The RAG chatbot agent MUST be implemented using the official OpenAI Agent SDK.
  - Agent MUST expose a function/tool for:
      - retrieve_chunks(query) → fetch from Qdrant
      - answer_with_context(question, chunks)
  - Gemini API MUST be injected inside the agent as the LLM provider.
  - MCP MUST be used as documented in context7 (agent-tools).
  - All unofficial or custom agent code MUST be removed.

REQ-002: Embeddings Verification (Cohere Free Model)
  - Embeddings MUST be generated using Cohere free embedding model.
  - System MUST verify that embeddings exist before performing any Qdrant query.
  - If embeddings are missing, backend MUST show: "Embedding not found: Re‑run embed pipeline."

REQ-003: Qdrant Integration
  - Backend MUST connect to Qdrant Cloud Free Tier using:
        QDRANT_URL
        QDRANT_API_KEY
  - A collection MUST exist (name: "book_chunks").
  - Backend MUST provide FastAPI routes:
        POST /embed → create embeddings + upsert to Qdrant
        POST /rag → retrieve + generate
        POST /rag/selected → selected-text-only RAG

REQ-004: ChatKit Frontend UI
  - Chatbot widget MUST use ChatKit frontend SDK.
  - The widget MUST render the agent conversation UI and support streaming.
  - The widget MUST load the agent you created via agent ID.
  - All previous unoffical UI/jQuery/chatbot scripts MUST be deleted.

REQ-005: Widget Visibility and Accessibility
  - Widget MUST appear on every page of the Docusaurus book.
  - It MUST show as a floating button in the bottom-right corner.
  - Button MUST include ARIA label: "Open chatbot".
  - If backend or agent fails to load, widget MUST show fallback:
        "Chatbot is unavailable. Please try again later."

REQ-006: Selected Text RAG Mode
  - User selects text → frontend sends it to `/rag/selected`.
  - Agent MUST answer *only* from that selected text.
  - This mode MUST bypass Qdrant.

REQ-007: File Cleanup
  - All old files related to the previous failed chatbot must be deleted, including:
       - old /chatbox.js
       - unused css/chatbot.css
       - old agent helper scripts
       - any API routes not used by the new agent system

REQ-008: Display Fix
  - Chatbot MUST correctly render inside the book pages.
  - No console errors must occur during initialization.
  - ChatKit MUST successfully connect to the OpenAI Agent endpoint.

Acceptance Criteria:
  - Agent appears inside the book UI
  - Agent responds to queries using RAG

## User Scenarios & Testing *(mandatory)*

### User Story 1 - RAG Chatbot Query (Priority: P1)

As a user reading the Docusaurus book, I want to ask questions about the content using a chatbot so that I can quickly find relevant information without manually searching through pages.

**Why this priority**: This is the core functionality that provides immediate value to users by enabling them to get answers to their questions using the book content.

**Independent Test**: Can be fully tested by initiating a chat session, asking a question about the book content, and receiving a relevant answer that references the book content. This delivers the primary value of the RAG system.

**Acceptance Scenarios**:

1. **Given** user is viewing any page of the Docusaurus book, **When** user clicks the chatbot button and asks a question about the book content, **Then** the chatbot responds with an answer based on the book content and shows relevant citations.

2. **Given** user has initiated a chat session, **When** user asks a follow-up question, **Then** the chatbot maintains context and provides a relevant answer.

---

### User Story 2 - Selected Text RAG Query (Priority: P2)

As a user reading the Docusaurus book, I want to select specific text and ask questions about only that selected text so that I can get focused answers without the chatbot referencing the entire book.

**Why this priority**: This provides an enhanced user experience by allowing targeted queries on specific content sections.

**Independent Test**: Can be fully tested by selecting text on a book page, initiating a chat session about that selected text, and receiving answers that only reference the selected content without pulling from other parts of the book.

**Acceptance Scenarios**:

1. **Given** user has selected text on a book page, **When** user activates the chatbot and asks a question, **Then** the chatbot responds only using the selected text as context.

---

### User Story 3 - Embedding Pipeline Management (Priority: P3)

As a system administrator, I want to be able to create and update embeddings for the book content so that the RAG system has access to the latest book information.

**Why this priority**: This is essential for system maintenance and ensuring the chatbot has access to current content, but is not a direct user-facing feature.

**Independent Test**: Can be fully tested by triggering the embedding pipeline and verifying that content is properly embedded and stored in the vector database, with appropriate feedback when the process is complete.

**Acceptance Scenarios**:

1. **Given** book content exists, **When** the embedding endpoint is called, **Then** embeddings are created using Cohere and stored in Qdrant collection.

2. **Given** no embeddings exist for content, **When** user queries the chatbot, **Then** system shows error message "Embedding not found: Re-run embed pipeline."

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST implement the RAG chatbot using OpenAI Agent SDK with functions for retrieving chunks from Qdrant and answering with context
- **FR-002**: System MUST integrate with Qdrant Cloud Free Tier using QDRANT_URL and QDRANT_API_KEY for vector storage and retrieval
- **FR-003**: System MUST generate embeddings using Cohere free embedding model before storing in Qdrant
- **FR-004**: System MUST provide API endpoints for: POST /embed, POST /rag, and POST /rag/selected
- **FR-005**: System MUST verify embeddings exist before performing Qdrant queries and show appropriate error if missing
- **FR-006**: Frontend MUST implement ChatKit widget that appears as a floating button in bottom-right corner of every book page
- **FR-007**: Frontend MUST support selected text RAG mode that bypasses Qdrant and only uses selected content
- **FR-008**: System MUST use Gemini API as the LLM provider within the OpenAI Agent
- **FR-009**: System MUST clean up all old chatbot-related files including chatbox.js, chatbot.css, and unofficial UI scripts
- **FR-010**: Frontend MUST provide accessibility features including ARIA label "Open chatbot" for the widget button

### Key Entities

- **Book Content**: The source material from the Docusaurus book that will be chunked and embedded for RAG
- **Embeddings**: Vector representations of book content chunks stored in Qdrant for similarity search
- **Chat Session**: User interaction context that maintains conversation history and context
- **Qdrant Collection**: Named "book_chunks", stores embedded content vectors with metadata

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can ask questions about book content and receive relevant answers within 5 seconds
- **SC-002**: System successfully handles 95% of queries without showing "Embedding not found" error when embeddings exist
- **SC-003**: Chatbot widget appears consistently on 100% of book pages with no console errors during initialization
- **SC-004**: Selected text RAG mode correctly responds using only the selected text without referencing other book content in 98% of cases
- **SC-005**: Embedding pipeline successfully processes all book content and stores it in Qdrant collection without errors
- **SC-006**: All old chatbot files and code are successfully removed without breaking other functionality
