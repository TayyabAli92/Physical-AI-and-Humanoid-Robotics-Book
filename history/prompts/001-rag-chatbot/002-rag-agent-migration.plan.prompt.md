---
id: 002
title: rag-agent-migration
stage: plan
date: 2025-12-10
surface: agent
model: gemini-2.5-flash
feature: rag-chatbot
branch: 001-rag-chatbot
user: TayyabAli92
command: /sp.plan "PHASE 1 — System Preparation  1. Clean old chatbot files      - Remove previous JS/CSS widget attempts      - Delete unused API code and old agent scripts  2. Prepare environment variables      - GEMINI_API_KEY      - QDRANT_URL      - QDRANT_API_KEY      - COHERE_API_KEY      - AGENT_ID (from OpenAI Agent SDK after creation)PHASE 2 — Embedding Pipeline (Cohere)  1. Implement an embed_text() utility using Cohere free embedding model  2. Build an embedding pipeline script:        - Load markdown files        - Chunk text        - Generate embeddings        - Upsert into Qdrant ("book_chunks" collection)  3. Add verification step:        - If embeddings missing → print "Embedding not found: run embed pipeline"PHASE 3 — Qdrant Vector Database Setup  1. Create collection "book_chunks" via API      - size: 1024 (Cohere embedding dimension)      - distance: cosine  2. Implement FastAPI services:      - POST /embed      - POST /rag      - POST /rag/selected  3. Connect Qdrant client in backend  4. Add retrieval logic for RAG agent toolPHASE 4 — OpenAI Agent SDK + Gemini Integration  1. Create RAG agent via OpenAI Agent SDK      - add tool: retrieve_chunks()      - add tool: answer_with_context()  2. Configure agent to use Gemini as the LLM provider  3. Add MCP tools for RAG actions (from con"
labels: ["plan", "rag", "agent", "migration", "qdrant", "cohere"]
links:
  spec: ../../specs/001-rag-chatbot/spec.md
  plan: ../../specs/001-rag-chatbot/plan.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-rag-chatbot/plan.md
 - specs/001-rag-chatbot/research.md
 - specs/001-rag-chatbot/data-model.md
 - specs/001-rag-chatbot/quickstart.md
 - specs/001-rag-chatbot/contracts/embed-api.yaml
 - specs/001-rag-chatbot/contracts/rag-api.yaml
tests:
 - plan validation
 - research documentation
 - data model creation
 - API contract definition
 - quickstart guide creation
---

## Prompt

PHASE 1 — System Preparation
  1. Clean old chatbot files
      - Remove previous JS/CSS widget attempts
      - Delete unused API code and old agent scripts
  2. Prepare environment variables
      - GEMINI_API_KEY
      - QDRANT_URL
      - QDRANT_API_KEY
      - COHERE_API_KEY
      - AGENT_ID (from OpenAI Agent SDK after creation)

PHASE 2 — Embedding Pipeline (Cohere)
  1. Implement an embed_text() utility using Cohere free embedding model
  2. Build an embedding pipeline script:
        - Load markdown files
        - Chunk text
        - Generate embeddings
        - Upsert into Qdrant ("book_chunks" collection)
  3. Add verification step:
        - If embeddings missing → print "Embedding not found: run embed pipeline"

PHASE 3 — Qdrant Vector Database Setup
  1. Create collection "book_chunks" via API
      - size: 1024 (Cohere embedding dimension)
      - distance: cosine
  2. Implement FastAPI services:
      - POST /embed
      - POST /rag
      - POST /rag/selected
  3. Connect Qdrant client in backend
  4. Add retrieval logic for RAG agent tool

PHASE 4 — OpenAI Agent SDK + Gemini Integration
  1. Create RAG agent via OpenAI Agent SDK
      - add tool: retrieve_chunks()
      - add tool: answer_with_context()
  2. Configure agent to use Gemini as the LLM provider
  3. Add MCP tools for RAG actions (from con

## Response snapshot

Successfully completed the planning phase for the RAG Chatbot Integration Fix + Agent SDK Migration feature. The following artifacts were created and updated:

1. **Plan.md**: Updated implementation plan with details on migrating to OpenAI Agent SDK, Cohere embeddings, Qdrant integration, and ChatKit frontend.

2. **Research.md**: Comprehensive research document covering technical decisions for OpenAI Agent SDK implementation, Cohere embeddings, Qdrant Cloud integration, ChatKit frontend, MCP tools, and selected text RAG mode.

3. **Data-model.md**: Complete data model defining entities for Book Content, Embeddings, Chat Session, Message, Qdrant Collection, and API request/response models.

4. **API Contracts**: Created OpenAPI specifications for embed-api.yaml and rag-api.yaml defining the required endpoints and data structures.

5. **Quickstart.md**: Detailed quickstart guide covering environment setup, backend configuration, API endpoints, and frontend integration.

All required planning artifacts are now in place, following the Spec-Driven Development approach. The plan addresses all requirements from the original feature specification including:
- OpenAI Agent SDK implementation with required tools
- Cohere embedding model integration
- Qdrant Cloud setup with proper collection configuration
- Required API endpoints (POST /embed, POST /rag, POST /rag/selected)
- ChatKit frontend widget integration
- Selected text RAG mode that bypasses Qdrant
- Proper error handling and accessibility features

## Outcome

- ✅ Impact: Complete planning artifacts created for RAG chatbot migration to OpenAI Agent SDK
- 🧪 Tests: All planning artifacts validated against specification requirements
- 📁 Files: plan.md, research.md, data-model.md, quickstart.md, API contracts created/updated
- 🔁 Next prompts: Ready for task generation phase (/sp.tasks) and implementation
- 🧠 Reflection: Planning phase complete with all necessary design decisions documented

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - All planning artifacts align with feature specification
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed to task generation phase