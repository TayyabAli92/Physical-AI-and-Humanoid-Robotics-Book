---
id: 1
title: rag-chatbot-specification
stage: spec
date: 2025-12-09
surface: agent
model: gemini-2.5-flash
feature: rag-chatbot
branch: 001-rag-chatbot
user: user
command: "/sp.specify"
labels: ["specification", "rag", "chatbot", "book"]
links:
  spec: specs/001-rag-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-rag-chatbot/spec.md
 - specs/001-rag-chatbot/checklists/requirements.md
tests:
 - null
---

## Prompt

Title: Add RAG Chatbot to Digital Book Website (Using Gemini LLM)

Goal:
Integrate a Retrieval-Augmented Generation (RAG) chatbot into my digital book website. The chatbot should appear as a popup widget and answer user questions based only on my book's content or user-selected text. The main LLM must be Google Gemini, and embeddings should use any free embedding model (Gemini or OpenAI Mini).

Objectives:
1. Allow uploading the full book text, auto-chunking it, generating embeddings (using any free embedding model), and storing vectors in Qdrant Cloud Free Tier.
2. Build a FastAPI backend with:
   - /embed → create embeddings using Gemini or OpenAI Mini (free)
   - /search → query Qdrant for similar book chunks
   - /ask-agent → send question + selected text + retrieved chunks to the agent
3. Build a chatbot agent using OpenAI Agents SDK or ChatKit SDK that:
   - Uses Gemini as the main LLM for final answer generation
   - Uses backend RAG context
   - Answers strictly from book content
   - Says: "This information is not in the book" for irrelevant queries
4. Build a lightweight popup chatbot widget for the frontend:
   - Appears on every page of the book
   - Works with Vercel deployment
   - Supports user text highlight → chatbot answers from that highlighted text only
5. Deploy backend to Render.com Free Tier and frontend to Vercel free plan.
6. Fully connect:
   - Qdrant (vectors)
   - FastAPI (backend)
   - Gemini LLM
   - Embedding model
   - Chatbot widget on book site

Tech Stack:
- LLM: Gemini (flash, flash-lite, pro, etc.)
- Embeddings: Free model (Gemini embedding OR OpenAI Mini embedding)
- Backend: FastAPI (Python)
- Vector DB: Qdrant Cloud Free Tier
- Agent Runtime: OpenAI Agents SDK or ChatKit
- Hosting: Render (backend) + Vercel (frontend)
- Frontend: HTML + JS widget

Core Features:
- Highlight-to-answer (user selects text → chatbot uses only that text)
- RAG-powered global book search
- No hallucinations — strict book-only answers
- Popup chatbot with minimal UI and dark/light theme

Success Criteria:
- Book chunks uploaded to Qdrant successfully
- RAG pipeline responds accurately using Gemini LLM
- Popup chatbot loads on the website and communicates with backend
- System rejects out-of-book questions correctly

Deliverables:
- System architecture
- Project folder structure
- FastAPI backend code
- Qdrant upload script
- Popup widget HTML/JS
- Agent configuration (Gemini LLM + RAG)
- Deployment instructions (Render + Vercel)
- Integration guide for adding widget into book site

## Response snapshot

Created comprehensive feature specification for RAG Chatbot for Digital Book Website. The specification includes:

- User Scenarios & Testing with 3 prioritized user stories (P1-P3)
- Functional Requirements (FR-001 through FR-012) covering all aspects of the RAG chatbot functionality
- Key Entities including Book Content, Content Chunk, Chat Session, User Query, and Retrieved Context
- Success Criteria with 6 measurable outcomes (SC-001 through SC-006)
- Edge cases for error handling and boundary conditions

The specification addresses all the requirements from the user including book content upload and indexing, chatbot interaction, highlight-to-answer functionality, and the constraint that responses must come only from book content without hallucination.

## Outcome

- ✅ Impact: Created complete feature specification for RAG chatbot with measurable success criteria
- 🧪 Tests: No tests run yet, specification phase
- 📁 Files: Created spec.md and requirements checklist in specs/001-rag-chatbot/
- 🔁 Next prompts: Ready for planning phase with /sp.plan
- 🧠 Reflection: Specification addresses all core requirements while maintaining technology-agnostic approach

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed to planning phase