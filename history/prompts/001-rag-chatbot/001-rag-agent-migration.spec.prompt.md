---
id: 001
title: rag-agent-migration
stage: spec
date: 2025-12-10
surface: agent
model: gemini-2.5-flash
feature: rag-chatbot
branch: 001-rag-chatbot
user: TayyabAli92
command: /sp.specify "RAG Chatbot Integration Fix + Agent SDK Migration"
labels: ["spec", "rag", "agent", "migration"]
links:
  spec: ../../specs/001-rag-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-rag-chatbot/spec.md
 - specs/001-rag-chatbot/checklists/requirements.md
tests:
 - specs/001-rag-chatbot/spec.md validation
 - requirements checklist creation
---

## Prompt

"RAG Chatbot Integration Fix + Agent SDK Migration"

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

## Response snapshot

Created and updated the feature specification for RAG Chatbot Integration Fix + Agent SDK Migration. The specification includes:

1. Updated the existing spec file to reflect the new requirements for OpenAI Agent SDK integration
2. Defined user scenarios with clear acceptance criteria for P1-P3 priorities
3. Documented functional requirements (FR-001 to FR-010) covering agent implementation, Qdrant integration, Cohere embeddings, API endpoints, frontend UI, and cleanup tasks
4. Identified key entities (Book Content, Embeddings, Chat Session, Qdrant Collection)
5. Established measurable success criteria (SC-001 to SC-006) with specific metrics
6. Created and validated a quality checklist to ensure spec completeness

## Outcome

- ✅ Impact: Updated feature specification to reflect detailed requirements for RAG chatbot migration to OpenAI Agent SDK
- 🧪 Tests: Validated spec against quality checklist criteria
- 📁 Files: Updated spec.md and requirements.md checklist
- 🔁 Next prompts: Ready for clarification or planning phase
- 🧠 Reflection: Specification now contains all necessary details for development team to proceed with implementation

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - All quality checklist items validated
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed to planning phase