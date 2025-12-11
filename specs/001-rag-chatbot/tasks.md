# Implementation Tasks: RAG Chatbot Integration Fix + Agent SDK Migration

**Feature**: RAG Chatbot Integration Fix + Agent SDK Migration
**Branch**: 001-rag-chatbot
**Generated**: 2025-12-10

## Implementation Strategy

This feature implements a migration from a custom chatbot implementation to OpenAI Agent SDK with Qdrant vector database and ChatKit frontend integration. The system uses Cohere for embeddings, Gemini as LLM provider via MCP tools, and provides both global RAG and selected-text-only RAG functionality.

**MVP Scope**: User Story 1 (RAG Chatbot Query) with basic functionality to ask questions and receive answers from book content.

## Phase 1: Setup and Project Initialization

- [X] T001 Create project structure: backend/src/models/, backend/src/services/, backend/src/api/, backend/src/tools/, backend/tests/, frontend/src/components/, frontend/src/services/, frontend/src/widgets/
- [X] T002 [P] Create requirements.txt with dependencies: fastapi, uvicorn, openai, cohere, qdrant-client, python-dotenv, google-generativeai
- [X] T003 [P] Create package.json for frontend dependencies
- [X] T004 Create .env file with environment variable placeholders: GEMINI_API_KEY, QDRANT_URL, QDRANT_API_KEY, COHERE_API_KEY, OPENAI_API_KEY
- [X] T005 Create backend/main.py with basic FastAPI app structure

## Phase 2: Foundational Components

- [X] T006 [P] Create Qdrant client configuration in backend/src/config.py
- [X] T007 [P] Create Cohere embedding service in backend/src/services/embedding_service.py
- [X] T008 [P] Create Qdrant service in backend/src/services/qdrant_service.py with collection creation
- [X] T009 Create OpenAI Agent service in backend/src/services/agent_service.py
- [X] T010 Create tools for agent: retrieve_chunks and answer_with_context in backend/src/tools/
- [X] T011 Create Book Content and Embedding models in backend/src/models/
- [X] T012 [P] Create embedding verification utility in backend/src/utils/embedding_validator.py
- [X] T013 Create API endpoint dependencies in backend/src/api/deps.py
- [X] T014 [P] Set up MCP tools configuration per context7 documentation

## Phase 3: User Story 1 - RAG Chatbot Query

**Goal**: As a user reading the Docusaurus book, I want to ask questions about the content using a chatbot so that I can quickly find relevant information without manually searching through pages.

**Independent Test**: Can be fully tested by initiating a chat session, asking a question about the book content, and receiving a relevant answer that references the book content. This delivers the primary value of the RAG system.

- [X] T015 [P] [US1] Create POST /embed endpoint in backend/src/api/endpoints/embed.py
- [X] T016 [P] [US1] Create POST /rag endpoint in backend/src/api/endpoints/rag.py
- [X] T017 [US1] Implement retrieve_chunks tool with Qdrant integration in backend/src/tools/retrieve_chunks.py
- [X] T018 [US1] Implement answer_with_context tool with Gemini integration in backend/src/tools/answer_with_context.py
- [X] T019 [US1] Create OpenAI Agent with required tools in backend/src/services/agent_service.py
- [X] T020 [US1] Implement embedding verification in POST /rag endpoint
- [X] T021 [P] [US1] Create Chat Session model in backend/src/models/chat_session.py
- [X] T022 [P] [US1] Create Message model in backend/src/models/message.py
- [X] T023 [US1] Add error handling for "Embedding not found" case
- [X] T024 [US1] Implement basic ChatKit widget integration in frontend/src/widgets/chat_widget.js
- [ ] T025 [US1] Test basic RAG functionality with sample book content

## Phase 4: User Story 2 - Selected Text RAG Query

**Goal**: As a user reading the Docusaurus book, I want to select specific text and ask questions about only that selected text so that I can get focused answers without the chatbot referencing the entire book.

**Independent Test**: Can be fully tested by selecting text on a book page, initiating a chat session about that selected text, and receiving answers that only reference the selected content without pulling from other parts of the book.

- [X] T026 [P] [US2] Create POST /rag/selected endpoint in backend/src/api/endpoints/rag_selected.py
- [X] T027 [US2] Modify answer_with_context tool to handle selected text mode
- [X] T028 [US2] Implement frontend logic to capture selected text in frontend/src/services/text_selection_service.js
- [X] T029 [US2] Update ChatKit widget to handle selected text mode in frontend/src/widgets/chat_widget.js
- [X] T030 [US2] Test selected text RAG functionality with sample content

## Phase 5: User Story 3 - Embedding Pipeline Management

**Goal**: As a system administrator, I want to be able to create and update embeddings for the book content so that the RAG system has access to the latest book information.

**Independent Test**: Can be fully tested by triggering the embedding pipeline and verifying that content is properly embedded and stored in the vector database, with appropriate feedback when the process is complete.

- [ ] T031 [P] [US3] Create embedding pipeline script in backend/scripts/embed_pipeline.py
- [ ] T032 [US3] Implement text chunking logic in backend/src/utils/chunker.py
- [ ] T033 [US3] Add embedding generation and upsert to Qdrant functionality
- [ ] T034 [US3] Create health check endpoint to verify embeddings exist
- [ ] T035 [US3] Test embedding pipeline with full book content

## Phase 6: Frontend Integration and Accessibility

- [ ] T036 [P] Implement floating chatbot button with ARIA label "Open chatbot"
- [ ] T037 [P] Add accessibility features: keyboard navigation, screen reader support
- [ ] T038 Create fallback message "Chatbot is unavailable. Please try again later." for when backend is down
- [ ] T039 Implement widget positioning to appear in bottom-right corner of every book page
- [ ] T040 Add console error prevention and proper initialization handling
- [ ] T041 Ensure ChatKit successfully connects to OpenAI Agent endpoint

## Phase 7: File Cleanup and Migration

- [ ] T042 [P] Identify and list all old chatbot files to be removed (chatbox.js, chatbot.css, old agent scripts)
- [ ] T043 Remove old chatbot-related files as specified in REQ-007
- [ ] T044 Delete unused API routes not used by the new agent system
- [ ] T045 Verify no functionality is broken after cleanup

## Phase 8: Testing and Validation

- [ ] T046 Create basic unit tests for backend services in backend/tests/
- [ ] T047 Test all API endpoints: /embed, /rag, /rag/selected
- [ ] T048 Verify error handling: "Embedding not found: Re-run embed pipeline"
- [ ] T049 Test agent functionality with Gemini LLM
- [ ] T050 Validate that agent appears inside book UI and responds to queries using RAG

## Phase 9: Polish & Cross-Cutting Concerns

- [ ] T051 Add proper logging throughout the application
- [ ] T052 Implement rate limiting for API endpoints
- [ ] T053 Add request/response validation using Pydantic models
- [ ] T054 Optimize performance: implement caching where appropriate
- [ ] T055 Add comprehensive error handling and graceful degradation
- [ ] T056 Update documentation with deployment instructions
- [ ] T057 Create deployment configuration for Render.com backend
- [ ] T058 Test complete end-to-end functionality
- [ ] T059 Verify all success criteria are met (response time < 5s, 95% query success rate, etc.)

## Dependencies

- User Story 1 (P1) must be completed before User Story 2 (P2) and User Story 3 (P3)
- Foundational components (Phase 2) must be completed before any user stories
- File cleanup (Phase 7) can be done in parallel with other phases but should be validated at the end

## Parallel Execution Opportunities

- Multiple API endpoints can be developed in parallel (T015, T016, T026)
- Frontend components can be developed in parallel with backend (T024, T028, T036-T040)
- Model creation can happen in parallel (T011, T021, T022)
- Testing can be done in parallel after each phase completion