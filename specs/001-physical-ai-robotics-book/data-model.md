# Data Model: Physical AI & Humanoid Robotics Book

**Feature Branch**: `001-physical-ai-robotics-book`
**Created**: 2025-12-04

## Key Entities

### Book
- Represents the entire collection of modules and chapters.
- Attributes: Title, Goal, Target Audience, Scope (high-level), Success Criteria (overall book), Constraints (overall book), Exclusions (overall book), Deliverables (overall book).

### Module
- A distinct section of the book, covering a specific topic (e.g., ROS 2, NVIDIA Isaac).
- Attributes: Title, Goal (module-specific), Target Audience (module-specific), Scope (module-specific), Success Criteria (module-specific), Constraints (module-specific), Exclusions (module-specific), Deliverables (module-specific).
- Relationships: Contains Chapters.

### Chapter
- A subdivision within a module.
- Attributes: Title, Content (Markdown), Learning Outcomes.
- Relationships: Belongs to a Module.

### Code Example
- Runnable code snippets provided within chapters.
- Attributes: Code (text), Language, Description, Expected Output, Verification Steps.
- Relationships: Associated with a Chapter.

### Diagram
- Visual representations of concepts or architectures.
- Attributes: Image File (path), Description.
- Relationships: Associated with a Chapter.

### Hardware Table
- Lists of recommended or compatible hardware.
- Attributes: Table Content (Markdown).
- Relationships: Associated with a Chapter or Module.

### Technical Reference
- External links to official documentation or relevant resources.
- Attributes: URL, Title, Access Date, Relevance Summary.
- Relationships: Associated with specific claims or sections within a Chapter.
