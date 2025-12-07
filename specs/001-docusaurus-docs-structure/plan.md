# Implementation Plan: Docusaurus Documentation Structure with Next.js Frontend

**Branch**: `001-docusaurus-docs-structure` | **Date**: 2025-12-07 | **Spec**: [specs/001-docusaurus-docs-structure/spec.md](spec.md)
**Input**: Feature specification from `/specs/001-docusaurus-docs-structure/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This plan implements a complete documentation structure using Docusaurus as the main documentation/book engine with a Next.js front page as an optional external UI layer. The implementation will create a structured book with 4 modules, each containing intro pages, learning outcomes, and chapters, all accessible through a responsive interface with proper navigation and diagram integration.

## Technical Context

**Language/Version**: JavaScript/TypeScript (Node.js 18+), Markdown for content
**Primary Dependencies**: Docusaurus 3.x, Next.js 14.x, React 18.x, Node.js package ecosystem
**Storage**: File-based (Markdown content, static assets)
**Testing**: Manual verification of navigation, build process, and responsive design
**Target Platform**: Web (GitHub Pages deployment, cross-browser compatible)
**Project Type**: Web application with static site generation
**Performance Goals**: Fast loading times for documentation pages, responsive UI across devices
**Constraints**: Must maintain Docusaurus core file compatibility, follow accessibility standards
**Scale/Scope**: Educational content for Physical AI and Humanoid Robotics book with 4 modules and 8 chapters

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Accuracy**: All Docusaurus and Next.js implementation details must follow official documentation
- **Clarity**: Documentation structure must be intuitive for learners following the book
- **Consistency**: All modules and chapters must follow the same structural patterns
- **Modular Writing**: Each module must be self-contained and independently navigable
- **Reproducibility**: All configuration steps must be replicable by following the book
- **Transparency**: Clear distinction between official Docusaurus features and custom implementations

## Architecture Sketch

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Pages Deployment                  │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                   Docusaurus Build Process                  │
│  (Static Site Generation from Markdown + React Components) │
└─────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌─────────────────┐   ┌─────────────────────┐   ┌─────────────────┐
│   Docusaurus    │   │   Next.js Frontend  │   │   Configuration │
│   Documentation │   │   (Optional Entry)  │   │   Files         │
│   Engine        │   │                     │   │                 │
│                 │   │ src/pages/index.tsx │   │ docusaurus.config.js │
│ docs/           │   │                     │   │ sidebars.js     │
│ ├── intro.md    │   │                     │   │ static/         │
│ ├── module-1/   │   │                     │   │                 │
│ │   ├── intro.md│   │                     │   │                 │
│ │   ├── ch-1.md │   │                     │   │                 │
│ │   └── ch-2.md │   │                     │   │                 │
│ └── ...         │   │                     │   │                 │
└─────────────────┘   └─────────────────────┘   └─────────────────┘
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Developer Workflow                       │
│        Edit Markdown → Build → Deploy to GitHub Pages     │
└─────────────────────────────────────────────────────────────┘
```

## Project Structure

### Documentation (this feature)

```text
specs/001-docusaurus-docs-structure/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
# Web application structure for documentation book
docs/
├── intro.md                     # Main book introduction
├── module-1/
│   ├── intro.md                 # Module 1 overview
│   ├── chapter-1.md             # Module 1, Chapter 1
│   └── chapter-2.md             # Module 1, Chapter 2
├── module-2/
│   ├── intro.md                 # Module 2 overview
│   ├── chapter-1.md             # Module 2, Chapter 1
│   └── chapter-2.md             # Module 2, Chapter 2
├── module-3/
│   ├── intro.md                 # Module 3 overview
│   ├── chapter-1.md             # Module 3, Chapter 1
│   └── chapter-2.md             # Module 3, Chapter 2
├── module-4/
│   ├── intro.md                 # Module 4 overview
│   ├── chapter-1.md             # Module 4, Chapter 1
│   └── chapter-2.md             # Module 4, Chapter 2
└── ...                          # Additional Docusaurus content files

src/
├── pages/
│   └── index.tsx                # Next.js homepage with module cards
└── components/                  # Reusable UI components (if needed)

# Docusaurus configuration files
docusaurus.config.js             # Main Docusaurus configuration
sidebars.js                      # Navigation sidebar configuration
static/                          # Static assets (images, logos)
```

**Structure Decision**: This structure follows the standard Docusaurus pattern with content in `/docs` and custom Next.js pages in `/src/pages`. This allows for both the documentation site and a custom homepage with module cards.

## Section Structure

### Docusaurus Book Sections:
- **Intro Page** (intro.md): Book title, description, "Read the Book" CTA button, four module cards
- **Module Structure**:
  - `/docs/module-1/` through `/docs/module-4/`
  - Each module contains: `intro.md` (overview + learning outcomes + chapter list), `chapter-1.md`, `chapter-2.md`
- **Navigation**: Sidebar configured to show intro → Module 1 → Module 2 → Module 3 → Module 4 → Chapters
- **Header/Footer**: Customized with book logo, Home, Modules, Read Book, GitHub links in header; module links, GitHub, copyright in footer
- **Diagram Integration**: Each module intro and chapter includes Mermaid diagram placeholders

## Key Decisions

1. **Docusaurus as Primary Engine**: Docusaurus handles the core documentation functionality with its powerful static site generation and navigation features.

2. **Next.js as Entry Point**: Next.js provides a modern, responsive frontend that can serve as an alternative entry point to the documentation.

3. **File Structure**: Markdown files in `/docs` for content, React components in `/src` for custom UI, configuration files at root for Docusaurus settings.

4. **Diagram Integration**: Using Mermaid for diagrams as it's natively supported by Docusaurus and provides good rendering capabilities.

5. **Deployment Strategy**: GitHub Pages for hosting to provide free, reliable, and fast static hosting with custom domain support.

## Quality Checks

- **Navigation Test**: Verify all links working between intro page, modules, and chapters
- **Next.js Test**: `npm run dev` and verify front page loads with responsive module cards
- **GitHub Pages Deployment Test**: Dry run deployment to verify build process works
- **Manual Proofreading**: Verify clarity and readability of all content
- **Citation Audit**: Ensure APA compliance for all references

## Phases (Spec-Kit Plus)

### Phase 1 — Research
- Gather Docusaurus documentation and best practices
- Identify Next.js integration patterns with Docusaurus
- Create placeholder APA citations for educational content

### Phase 2 — Foundation
- Update file structure with module directories
- Add intro.md with book content
- Add module folders with intro/chapter files
- Add Next.js index.tsx with module cards
- Configure sidebar, header, and footer

### Phase 3 — Analysis
- Write high-level content for modules and chapters
- Integrate Mermaid diagrams in all content pages
- Expand chapter stubs with educational content
- Confirm structure with Constitution rules

### Phase 4 — Synthesis
- Refine writing for clarity and accuracy
- Add proper citations and references
- Polish diagrams and visual elements
- Confirm compliance with all Constitution principles
- Prepare final build and GitHub Pages deployment

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Dual Frameworks (Docusaurus + Next.js) | Provides optimal user experience with Docusaurus for documentation and Next.js for modern frontend | Single framework approach would limit functionality of either documentation or frontend experience |
