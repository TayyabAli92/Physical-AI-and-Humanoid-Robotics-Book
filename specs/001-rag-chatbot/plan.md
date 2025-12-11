# Implementation Plan: RAG Chatbot Integration Fix + Agent SDK Migration

**Branch**: `001-rag-chatbot` | **Date**: 2025-12-10 | **Spec**: [link](specs/001-rag-chatbot/spec.md)
**Input**: Feature specification from `/specs/001-rag-chatbot/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Migration from custom chatbot implementation to OpenAI Agent SDK with Qdrant vector database and ChatKit frontend integration. The system will use Cohere for embeddings, Gemini as LLM provider via MCP tools, and provide both global RAG and selected-text-only RAG functionality. This includes cleaning old chatbot files, implementing new API endpoints, and ensuring proper widget integration with accessibility features.

## Technical Context

**Language/Version**: Python 3.11, JavaScript/TypeScript for frontend
**Primary Dependencies**: FastAPI, OpenAI Agent SDK, qdrant-client, cohere, ChatKit SDK, MCP tools
**Storage**: Qdrant Cloud vector database with "book_chunks" collection
**Testing**: pytest for backend, manual testing for frontend integration
**Target Platform**: Web application (Docusaurus book site) with backend API
**Project Type**: Web (determines source structure)
**Performance Goals**: Response time under 5 seconds, handle 95% of queries successfully
**Constraints**: Must use Cohere free embeddings, Qdrant Cloud Free Tier, OpenAI Agent SDK, Gemini API via MCP
**Scale/Scope**: Single book content, multiple concurrent users, accessible on all book pages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Compliance Check
- ✅ **Accuracy**: Technical requirements clearly specified (OpenAI Agent SDK, Qdrant, Cohere, ChatKit, etc.)
- ✅ **Clarity**: Requirements are well-defined with measurable success criteria
- ✅ **Consistency**: Follows established patterns for web applications
- ✅ **Modular Writing**: Will be structured in separate backend/frontend components
- ✅ **Reproducibility**: Will provide step-by-step instructions for setup and deployment
- ✅ **Transparency**: Clear distinction between different technologies and their roles

### Gate Status
All constitution principles are satisfied. No violations detected.

## Project Structure

### Documentation (this feature)

```text
specs/001-rag-chatbot/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   ├── services/
│   ├── api/
│   └── tools/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── services/
│   └── widgets/
└── tests/

# Environment and configuration files
.env
requirements.txt
package.json
```

**Structure Decision**: Web application with separate backend (FastAPI) and frontend (ChatKit widget) components to maintain clear separation of concerns while enabling the RAG functionality.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Multiple dependencies (Qdrant, Cohere, OpenAI, ChatKit) | RAG system requires multiple specialized services | Single service solutions don't provide the same quality of RAG functionality |
