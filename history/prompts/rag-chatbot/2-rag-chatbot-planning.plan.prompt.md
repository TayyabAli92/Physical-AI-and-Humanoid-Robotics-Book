---
id: 2
title: rag-chatbot-planning
stage: plan
date: 2025-12-09
surface: agent
model: gemini-2.5-flash
feature: rag-chatbot
branch: 001-rag-chatbot
user: user
command: "/sp.plan"
labels: ["planning", "architecture", "rag", "chatbot"]
links:
  spec: specs/001-rag-chatbot/spec.md
  plan: specs/001-rag-chatbot/plan.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-rag-chatbot/plan.md
 - specs/001-rag-chatbot/research.md
 - specs/001-rag-chatbot/data-model.md
 - specs/001-rag-chatbot/quickstart.md
 - specs/001-rag-chatbot/contracts/api-contracts.yaml
 - .specify/memory/constitution.md
tests:
 - null
---

## Prompt

Project: Add RAG Chatbot to Digital Book (Gemini + FastAPI + Qdrant)

Overall Goal:
Create a fully working Retrieval-Augmented Generation (RAG) chatbot integrated into my Docusaurus book website. The chatbot must use Gemini as the LLM, a free embedding model, Qdrant Cloud Free Tier for vector storage, and a FastAPI backend deployed on Render. The frontend chatbot widget will run on Vercel and appear on every page of the book. Book content format = Markdown. Expected concurrent users = 50.

---

Phase 1 — Setup (Accounts + Environment)
1. Create accounts:
   - Qdrant Cloud Free Tier
   - Google AI Studio (for Gemini API key)
   - Render.com (for FastAPI backend)
   - Vercel (for frontend deployment)
2. Create local project folders:
   - backend/
   - frontend/
   - book/
3. Install dependencies:
   - Python, FastAPI, Uvicorn
   - qdrant-client
   - free embedding model SDK (Gemini or OpenAI Mini)
   - OpenAI Agents/ChatKit SDK for orchestrating the chatbot

---

Phase 2 — Vector Database Setup (Qdrant)
1. Create a Qdrant Cloud Cluster (Free Tier).
2. Create a "book_chunks" collection with:
   - vector_size (according to embedding model)
   - cosine similarity
3. Write a script (`upload_chunks.py`) that:
   - Reads all Markdown book chapters
   - Splits them into chunks
   - Generates embeddings (free model)
   - Uploads them to Qdrant

Deliverables:
- Chunking logic
- Embedding generator
- Qdrant upload script

---

Phase 3 — FastAPI Backend
Create backend endpoints:

1. **POST /embed**
   - Accept text
   - Generate embedding (free model)
   - Return vector

2. **POST /search**
   - Query Qdrant using embedding
   - Return top matching chunks

3. **POST /ask-agent**
   - Input: user question + context + selected text (if any)
   - Fetch relevant chunks via search
   - Call Gemini LLM with:
       - retrieved chunks
       - user-selected text (priority)
   - Return final answer

4. Configure CORS for frontend access.

Deliverables:
- FastAPI project
- LLM caller (Gemini)
- Embedding module
- RAG pipeline

---

Phase 4 — Chatbot Agent Setup
1. Build agent using OpenAI Agents SDK or ChatKit SDK.
2. Agent tasks:
   - Accept question
   - Retrieve chunks via backend
   - Use Gemini LLM to generate answer
   - Reject out-of-book questions with:
     "This information is not in the book."

3. Integrate:
   - Gemini → final answer
   - Embedding model → vectorization
   - FastAPI → search + chunk retrieval

Deliverables:
- Agent configuration
- Routing logic
- RAG reasoning template
- Output formatting

---

Phase 5 — Frontend Chatbot Widget
1. Build a simple popup widget in HTML + CSS + JS.
2. Features:
   - Open/close floating chatbot modal
   - Ask question → call backend → show answer
   - Dark/Light mode auto support
   - Text highlight → send selected text to backend as context

3. Integrate widget into Docusaurus book:
   - Add script tag in `docusaurus.config.js`
   - Include widget on every page

Deliverables:
- Chatbot widget
- API integration
- Highlight-to-answer support

---

Phase 6 — Deployment
1. Deploy FastAPI backend to Render (free)
2. Deploy book + widget to Vercel
3. Add environment vars:
   - GEMINI_API_KEY
   - QDRANT_URL
   - QDRANT_API_KEY
   - EMBEDDING_MODEL_KEY (free model)
4. Validate CORS + public API routes

Deliverables:
- Live backend URL
- Live book URL with embedded chatbot
- Working demo

---

Phase 7 — Final Testing & Optimization
1. Test:
   - RAG accuracy
   - Highlight-based answers
   - Out-of-book question rejection
   - Slow/fast networks
   - 50 concurrent user simulation
2. Fix:
   - Slow embedding calls
   - Chunk sizes
   - Gemini prompt tuning

Deliverables:
- Final working demo
- Performance improvements

---

Completion Criteria:
✔ RAG chatbot embedded inside book
✔ Gemini-powered reasoning
✔ Free embedding model implemented
✔ Qdrant vector search working
✔ FastAPI backend functioning
✔ Popup chatbot widget live
✔ Highlight-based answering supported
✔ Deployed on Render + Vercel
✔ Handles 50 concurrent users

## Response snapshot

Completed comprehensive planning for the RAG Chatbot project. The planning includes:

1. **Technical Context**: Defined technologies (Python 3.11, FastAPI, Qdrant, Gemini) and constraints
2. **Constitution Check**: Verified compliance with project principles
3. **Project Structure**: Detailed directory structure with backend, frontend, and book components
4. **Research Summary**: Made key decisions on embedding model (Google text-embedding-005), agent framework (direct Gemini API), text chunking (512-token chunks), and frontend architecture
5. **Data Model**: Defined entities (Book Content, Content Chunk, Chat Session, User Query, Retrieved Context, Chat Message) with relationships
6. **API Contracts**: Specified endpoints (/embed, /search, /ask-agent, /health) with request/response schemas
7. **Quickstart Guide**: Created setup instructions for implementation
8. **Agent Context**: Updated Claude Code context with new technologies

All Phase 0 (research) and Phase 1 (design) deliverables completed successfully. The plan is ready for task generation and implementation.

## Outcome

- ✅ Impact: Created complete architecture plan with data models, API contracts, and implementation guide
- 🧪 Tests: No tests run yet, planning phase
- 📁 Files: Created plan.md, research.md, data-model.md, quickstart.md, and contracts/api-contracts.yaml
- 🔁 Next prompts: Ready for task generation with /sp.tasks
- 🧠 Reflection: Plan addresses all requirements while maintaining scalability for 50 concurrent users

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed to task generation phase