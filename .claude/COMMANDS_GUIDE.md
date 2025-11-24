# Custom Commands Guide

## Overview

This guide documents all available custom Claude commands for the AI-Driven Development framework.

---

## Command Reference

### 1. `/generate-prd` - Generate Product Requirements Document

**Generate a comprehensive PRD from a product idea or description.**

#### Usage
```bash
/generate-prd "Your product description or idea"
/generate-prd docs/product-idea.txt
```

#### What It Does
- Analyzes your product description
- Asks clarifying questions if needed
- Generates complete PRD with:
  - Executive summary
  - Problem statement
  - Goals and success metrics
  - Target users and personas
  - 5+ functional requirements (REQ-001, REQ-002, etc.)
  - Non-functional requirements
  - User experience and design
  - Release plan and risks

#### Output
- Complete PRD markdown file
- Saved to: `docs/[product-name]-prd.md`
- PRD ID: `prd-[product-slug]-001`
- Ready for: `/analyze-prd` validation

#### Example
```bash
/generate-prd "A mobile app for tracking personal finances with budget alerts and spending insights"
```

#### Next Step
```bash
/analyze-prd docs/product-prd.md
```

---

### 2. `/generate-rfc` - Generate Request For Comment (Technical Design)

**Generate technical design document with architecture diagrams and API specifications.**

#### Usage

**MODE 1 - New Feature (with PRD):**
```bash
/generate-rfc prd-user-service-001 --with-prd
/generate-rfc prd-user-service-001  # Auto-detected as PRD ID
```

**MODE 2 - Enhancement (standalone):**
```bash
/generate-rfc "Optimize user lookup queries using database indexing" --enhancement
/generate-rfc "Optimize user lookup queries" # Auto-detected as enhancement description
```

#### What It Does
- Analyzes PRD (MODE 1) or enhancement description (MODE 2)
- Generates complete RFC with:
  - Problem analysis
  - Proposed solution
  - Architecture design (3 Mermaid diagrams)
    - System overview
    - Integration points
    - Data flow
  - Data models and relationships
  - Complete API contracts (with RFC 7807 error format)
  - Authentication & security
  - Performance & scalability
  - Implementation strategy (3 phases)
  - Testing strategy
  - Deployment & release plan
  - Risks and mitigation

#### Output
- Complete RFC markdown file
- Saved to: `docs/[rfc-name]-rfc.md`
- RFC ID: `RFC-###` (e.g., RFC-001)
- API contracts: Stored in `api_contracts` collection
- Ready for: `/analyze-rfc` validation

#### Examples

**MODE 1 (New Feature):**
```bash
/generate-rfc prd-user-service-001 --with-prd
/generate-rfc prd-user-service-001  # Auto-detected
```

**MODE 2 (Enhancement):**
```bash
/generate-rfc "Refactor authentication middleware to improve security and reduce code duplication" --enhancement
/generate-rfc "Refactor authentication middleware" # Auto-detected
```

#### Next Steps

**For MODE 1 (with PRD):**
```bash
/analyze-rfc docs/product-rfc.md
/prd-rfc-to-epics prd-product-001 rfc-product-001
```

**For MODE 2 (enhancement):**
```bash
/analyze-rfc docs/product-rfc.md
/rfc-to-epics rfc-001
```

---

### 3. `/analyze-prd` - Analyze and Validate PRD

**Parse, validate, and store PRD in MongoDB.**

#### Usage
```bash
/analyze-prd docs/my-product-prd.md
```

#### What It Does
- Reads PRD markdown file
- Validates against PRD schema
- Extracts structured JSON
- Saves to MongoDB `prd_analysis` collection
- Returns saved document ID

#### Output
- Validation report
- MongoDB document ID
- Ready for: Epic generation

---

### 4. `/analyze-rfc` - Analyze and Validate RFC

**Parse, validate, and store RFC in MongoDB. Supports both new features and enhancements.**

#### Usage
```bash
/analyze-rfc docs/my-product-rfc.md
```

#### What It Does
- Reads RFC markdown file
- Detects RFC mode (new feature with PRD, or enhancement only)
- Validates against RFC schema
- Extracts API contracts to `api_contracts` collection
- Saves RFC to MongoDB `rfc_analysis` collection
- Links to related PRD (if MODE 1)

#### Output
- Validation report
- MongoDB document ID
- API contracts saved count
- Ready for: Epic generation

---

### 5. `/prd-rfc-to-epics` - Generate Epics from PRD + RFC

**Generate epics combining PRD requirements and RFC architecture.**

#### Usage
```bash
/prd-rfc-to-epics prd-user-service-001 rfc-user-service-001
```

#### What It Does
- Loads PRD from MongoDB
- Loads RFC from MongoDB
- Maps PRD requirements to RFC sections
- Creates epics grouping related work
- Links each epic to PRD + RFC context
- Creates task routing keywords

#### Output
- Epics saved to MongoDB
- Epic IDs: `epic-user-service-001`, etc.
- Ready for: `/epic-to-tasks`

---

### 6. `/rfc-to-epics` - Generate Epics from RFC (Enhancement)

**Generate epics from RFC enhancement (Mode 2 - without PRD).**

#### Usage
```bash
/rfc-to-epics RFC-001
```

#### What It Does
- Loads RFC enhancement from MongoDB
- Validates enhancement context
- Analyzes affected components
- Creates enhancement epics
- Preserves enhancement rationale

#### Output
- Epics saved to MongoDB
- Epic IDs: `epic-RFC-RFC-001-1`, etc.
- Ready for: `/epic-to-tasks`

---

### 7. `/epic-to-tasks` - Generate Tasks from Epic

**Generate implementable tasks from epic (works with both PRD-linked and enhancement epics).**

#### Usage
```bash
/epic-to-tasks epic-user-service-001
```

#### What It Does
- Loads epic from MongoDB
- Loads related PRD (if available)
- Loads related RFC
- Creates self-contained tasks for:
  - Backend implementation
  - Frontend implementation
  - QA/Testing
  - Documentation
  - Infrastructure
- Includes full PRD + RFC context in each task

#### Output
- Tasks saved to MongoDB `tasks` collection
- Task IDs: `task-001`, `task-002`, etc.
- Ready for: AI code generation

---

## Complete Workflow Examples

### Example 1: New Feature from Idea to Implementation

```bash
# 1. Generate PRD from product idea
/generate-prd "A collaborative task management app with real-time updates and team workspaces"

# 2. Review and edit docs/task-management-prd.md in your editor

# 3. Validate and store PRD in MongoDB
/analyze-prd docs/task-management-prd.md
# → Returns: prd_id = prd-task-management-001

# 4. Generate RFC based on PRD
/generate-rfc prd-task-management-001 --with-prd
# Or simply: /generate-rfc prd-task-management-001

# 5. Review and edit docs/task-management-rfc.md

# 6. Validate and store RFC in MongoDB
/analyze-rfc docs/task-management-rfc.md
# → Returns: rfc_id = RFC-001

# 7. Generate epics from PRD + RFC
/prd-rfc-to-epics prd-task-management-001 RFC-001

# 8. Generate tasks from epic
/epic-to-tasks epic-task-management-001

# 9. AI generates implementation code from tasks
# (Each task has full PRD + RFC context for code generation)
```

### Example 2: Enhancement to Existing System

```bash
# 1. Generate enhancement RFC (no PRD needed)
/generate-rfc "Optimize task search performance by adding database indexes and implementing full-text search" --enhancement
# Or simply: /generate-rfc "Optimize task search performance" (auto-detected)

# 2. Review and edit docs/task-search-rfc.md

# 3. Validate and store RFC in MongoDB
/analyze-rfc docs/task-search-rfc.md
# → Returns: rfc_id = RFC-002

# 4. Generate epics from enhancement RFC
/rfc-to-epics RFC-002

# 5. Generate tasks from enhancement epic
/epic-to-tasks epic-RFC-RFC-002-1

# 6. AI generates implementation code from tasks
```

---

## Key Features

### PRD Generation
✅ Comprehensive product documentation
✅ 5+ functional requirements with acceptance criteria
✅ Non-functional requirements (performance, security, scalability)
✅ User personas and stories
✅ Success metrics and KPIs
✅ Risk analysis and mitigation

### RFC Generation
✅ Mermaid architecture diagrams (3 types)
✅ Complete API contracts with RFC 7807 error format
✅ Data models and relationships
✅ Authentication & security design
✅ Performance & scalability planning
✅ Implementation in realistic phases
✅ Comprehensive testing strategy
✅ Risk assessment and mitigation

### Dual-Mode Support
✅ MODE 1: New features linked to PRD requirements
✅ MODE 2: Enhancements standalone without PRD
✅ Flexible reference types (RFC, Epic, Requirement)

### MongoDB Integration
✅ Automatic storage in appropriate collections
✅ Unique ID generation
✅ Schema validation
✅ API contract deduplication
✅ Full traceability chain (PRD → RFC → Epic → Task)

---

## Tips & Best Practices

1. **Start with PRD First**
   - Clear product vision before technical design
   - PRD anchors all downstream decisions

2. **Use Descriptive Product Ideas**
   - More details → Better PRD generation
   - Include target users, success metrics, constraints

3. **Review Generated Documents**
   - Review PRD before running `/analyze-prd`
   - Review RFC before running `/analyze-rfc`
   - Iterate until happy with quality

4. **Follow the Workflow**
   - Generate → Review → Analyze → Generate Next
   - Each step builds on previous

5. **Document Decisions**
   - RFC trade-offs section explains WHY
   - Helps future developers understand context

6. **Start with MVP**
   - Don't try to build everything
   - Focus PRD/RFC on core features first
   - Plan future versions explicitly

7. **Be Specific**
   - Performance targets: "<200ms response time" not "fast"
   - Requirements: measurable and testable
   - Success metrics: quantifiable

8. **Test Early**
   - RFC includes testing strategy
   - Tasks include test requirements
   - Generate tests as part of implementation

---

## Troubleshooting

### PRD Not Generating Well
- **More details in description** - Provide more context
- **Ask for clarification** - Let command ask questions
- **Review output** - Edit before storing

### RFC Not Complete
- **Start with PRD first** - RFC builds on PRD context
- **Clarify technology stack** - Help RFC choose right approach
- **Add implementation details** - Be specific about scale and performance

### Tasks Missing Context
- **Run all steps** - PRD → RFC → Epic → Tasks
- **Use both PRD and RFC** - Tasks need full context
- **Review MongoDB storage** - Ensure PRD/RFC stored correctly

---

## File Locations

Commands are defined in `.claude/commands/`:
- `/generate-prd.md` - PRD generation command
- `/generate-rfc.md` - RFC generation command
- `/prd-analyze.md` - PRD analysis command
- `/analyze-rfc.md` - RFC analysis command
- `/prd-rfc-to-epics.md` - Epic generation from PRD+RFC
- `/rfc-to-epics.md` - Epic generation from RFC only
- `/epic-to-tasks.md` - Task generation from epic

Templates are in `templates/`:
- `templates/prd.md` - PRD markdown template
- `templates/rfc.md` - RFC markdown template

Schemas are in `templates/schemas/`:
- `templates/schemas/prd.schema.json` - PRD validation schema
- `templates/schemas/rfc.schema.json` - RFC validation schema

---

## Next Steps

1. Try `/generate-prd` with your product idea
2. Review and edit the generated PRD
3. Run `/analyze-prd` to store in MongoDB
4. Generate RFC with `/generate-rfc`
5. Continue through the complete workflow

Happy building! 🚀