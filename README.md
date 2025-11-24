# AI-Driven Development Framework

A comprehensive system for building applications faster, smarter, and more resilient by using AI as a collaborator throughout the software lifecycle.

## Overview

This framework enables:
- **Accelerated Development** – Reduce manual, repetitive tasks by letting AI handle code generation, testing, and documentation
- **Increased Quality** – Leverage AI to detect design flaws, suggest best practices, and generate reliable tests early
- **Adaptive Systems** – Use AI to continuously analyze user needs, system behavior, and performance, then recommend improvements
- **Knowledge-Driven Projects** – Store all project knowledge (requirements, designs, tasks) in structured, retrievable formats

---

## 🚀 Quick Start

### Generate Your First PRD (Product Requirements Document)

```bash
/generate-prd "A mobile app for tracking personal finances with budget alerts"
```

This creates a comprehensive PRD with:
- Executive summary and business goals
- Problem statement and target users
- 5+ functional requirements (REQ-001, REQ-002, etc.)
- Success metrics and acceptance criteria
- Risk analysis and release plan

**Output:** `docs/[product-name]-prd.md` (ready to review)

### Generate Technical Design (RFC)

```bash
/generate-rfc prd-finance-001 --with-prd
# Or simply: /generate-rfc prd-finance-001 (auto-detected as PRD ID)
```

This creates a technical design document with:
- Architecture diagrams (3 Mermaid diagrams)
- Complete API specifications (RFC 7807 error format)
- Data models and relationships
- Implementation strategy (3 realistic phases)
- Performance, security, and testing plans

**Output:** `docs/[product-name]-rfc.md` (with architecture diagrams)

### Complete Workflow in 5 Steps

```bash
# 1. Generate PRD from product idea
/generate-prd "Your product description"

# 2. Validate and store PRD in MongoDB
/analyze-prd docs/[product]-prd.md

# 3. Generate technical design (RFC)
/generate-rfc prd-[slug]-001 --with-prd
# Or simply: /generate-rfc prd-[slug]-001

# 4. Validate and store RFC in MongoDB
/analyze-rfc docs/[product]-rfc.md

# 5. Generate epics from PRD+RFC
/prd-rfc-to-epics prd-[slug]-001 RFC-001
```

**From here:** Generate tasks → AI code generation → Testing & deployment

---

## 📚 Custom Commands Reference

| Command | Purpose | Usage |
|---------|---------|-------|
| **`/generate-prd`** | Create comprehensive PRDs | `/generate-prd "product idea"` |
| **`/generate-rfc`** | Create technical designs | `/generate-rfc prd-001 --with-prd` or `/generate-rfc prd-001` |
| **`/analyze-prd`** | Validate & store PRD | `/analyze-prd docs/prd.md` |
| **`/analyze-rfc`** | Validate & store RFC | `/analyze-rfc docs/rfc.md` |
| **`/prd-rfc-to-epics`** | Generate epics (feature) | `/prd-rfc-to-epics prd-001 RFC-001` |
| **`/rfc-to-epics`** | Generate epics (enhancement) | `/rfc-to-epics RFC-001` |
| **`/epic-to-tasks`** | Generate implementable tasks | `/epic-to-tasks epic-001` |

**Full guide:** See `.claude/COMMANDS_GUIDE.md` for detailed examples and workflows

---

## Architecture & Core Concepts

### The AI-Driven Development Lifecycle

```
PRD (WHAT)
  ↓
  ├─ Define what problem to solve and why
  ├─ Identify user needs and business goals
  ├─ Set success metrics and scope
  └─ Document functional & non-functional requirements

RFC (HOW)
  ↓
  ├─ Design technical solution based on PRD
  ├─ Create architecture and data models
  ├─ Define API contracts (RFC 7807 compliant)
  ├─ Plan implementation phases
  └─ Analyze trade-offs and risks

EPICS (WHAT + HOW)
  ↓
  ├─ Break down RFC architecture into features
  ├─ Link each epic to PRD requirements
  ├─ Group related technical work
  └─ Create implementation roadmap

TASKS (IMPLEMENTABLE WORK)
  ↓
  ├─ Generate self-contained work items
  ├─ Include full PRD + RFC context
  ├─ Define acceptance criteria
  ├─ Enable AI code generation
  └─ Track progress and completion

CODE GENERATION & EXECUTION
  ↓
  ├─ AI generates implementation based on task context
  ├─ Full PRD requirements context
  ├─ RFC technical design context
  └─ Automated testing & validation

FEEDBACK & IMPROVEMENT
  └─ Monitor, measure, adapt, repeat
```

---

## Template & Schema Files

### 1. PRD (Product Requirements Document)

**Purpose:** Define WHAT to build and WHY

**Files:**
- `templates/prd.md` – Markdown template for writing PRDs
- `templates/schemas/prd.schema.json` – JSON schema for structured PRD data

**Key Sections:**
- Executive Summary
- Problem Statement
- Goals & Success Metrics
- Target Users & User Stories
- Scope (In/Out, Assumptions, Dependencies)
- Functional Requirements (REQ-001, REQ-002, etc.)
- Non-Functional Requirements
- Release Plan & Risks

**Output:** Structured PRD data saved to MongoDB `prd_analysis` collection

### 2. RFC (Request For Comment)

**Purpose:** Design HOW to build it

**Files:**
- `templates/rfc.md` – Markdown template for writing RFCs
- `templates/schemas/rfc.schema.json` – JSON schema for structured RFC data

**Key Sections:**
- Related PRD Reference (links to parent PRD)
- Problem Analysis (from PRD context)
- Proposed Solution
- Architecture Design (components, integrations)
- Data Models (entities, relationships, data flow)
- API Contracts (reference to api-contract.schema.json)
- Authentication & Security
- Performance & Scalability
- Trade-offs & Alternatives
- Implementation Strategy (phases, tech stack)
- Testing & Monitoring Strategy
- Deployment Plan

**Output:** Structured RFC data saved to MongoDB `rfc_analysis` collection

### 3. API Contract Schema

**Purpose:** Define API specifications with RFC 7807 error handling

**File:** `templates/schemas/api-contract.schema.json`

**Key Features:**
- Endpoint and HTTP method
- Request/Response schemas
- RFC 7807 Problem Details for error responses
- Validation error details (field, message, code)
- Authentication requirements (Bearer, Basic, ApiKey, OAuth2)
- Rate limiting configuration (requests, window, tier)

### 4. Epic Schema

**Purpose:** Group related technical work from RFC

**File:** `templates/schemas/epic.schema.json`

**Links:**
- PRD requirements (REQ-001, REQ-002)
- RFC sections and components
- API contracts
- Implementation phase
- Keywords for task routing

### 5. Task Schema

**Purpose:** Define implementable work units with full context

**File:** `templates/schemas/task.schema.json`

**Context Includes:**
- PRD requirement (REQ-###)
- RFC section and architecture component
- API contract specifications
- Acceptance criteria
- Type: backend, frontend, qa, docs, infra

---

## End-to-End Workflow

### Phase 1: Create PRD

```bash
# 1. Write PRD in markdown
create docs/my-project-prd.md

# 2. Validate PRD structure
/analyze-prd docs/my-project-prd.md

# 3. PRD is stored in MongoDB prd_analysis collection
```

**Output:**
```
MongoDB: prd_analysis collection
{
  "_id": ObjectId,
  "prd_id": "prd-user-service-001",
  "metadata": { ... },
  "functional_requirements": [
    { "id": "REQ-001", "title": "...", "priority": "..." },
    { "id": "REQ-002", "title": "...", "priority": "..." }
  ],
  ...
}
```

### Phase 2: Create RFC

RFCs support two modes:

#### **Mode 1: New Feature RFC (with PRD)**
For building new features based on PRD requirements:

```bash
# 1. Write RFC in markdown (reference PRD with prd_id)
# Section 1: "Option A: New Feature (with PRD)"
create docs/my-project-rfc.md

# 2. Validate RFC and link to PRD
/analyze-rfc docs/my-project-rfc.md
   # Automatically finds PRD by prd_id reference
   # Validates requirements_addressed match PRD requirements
   # Validates API contracts and architecture

# 3. RFC is stored in MongoDB rfc_analysis collection
```

#### **Mode 2: Enhancement RFC (without PRD)**
For improving existing features, refactoring, optimization, bug fixes, or technical debt:

```bash
# 1. Write RFC in markdown (use Option B: Enhancement)
# Section 1: "Option B: Enhancement/Improvement (without PRD)"
# Include: enhancement_context (type, reason, reference)
create docs/improve-user-service-rfc.md

# 2. Validate RFC enhancement
/analyze-rfc docs/improve-user-service-rfc.md
   # Validates enhancement_context with type and reason
   # Validates references (rfc_id, epic_id, or requirement_id)
   # Validates API contracts and architecture

# 3. RFC is stored in MongoDB rfc_analysis collection
```

**Output (Mode 1 - with PRD):**
```
MongoDB: rfc_analysis collection
{
  "_id": ObjectId,
  "rfc_id": "rfc-user-service-001",
  "prd_reference": {
    "prd_id": "prd-user-service-001",
    "requirements_addressed": ["REQ-001", "REQ-002"]
  },
  "architecture": { ... },
  "api_contracts": [
    {
      "endpoint": "/api/v1/users",
      "method": "POST",
      "authentication": { ... },
      "error_responses": { ... }
    }
  ],
  ...
}
```

**Output (Mode 2 - Enhancement only):**
```
MongoDB: rfc_analysis collection
{
  "_id": ObjectId,
  "rfc_id": "RFC-002",
  "enhancement_context": {
    "type": "optimization",
    "reason": "Current user lookup queries are slow, requiring database optimization...",
    "scope": "partial",
    "reference_rfc_id": "rfc-user-service-001"
  },
  "architecture": { ... },
  "api_contracts": [
    {
      "endpoint": "/api/v1/users/:id",
      "method": "GET",
      ...
    }
  ],
  ...
}
```

### Phase 3: Generate Epics

Choose the appropriate command based on RFC mode:

#### **For Mode 1 (New Feature with PRD): Use `/prd-rfc-to-epics`**

```bash
# Generate epics from both PRD and RFC
/prd-rfc-to-epics prd-user-service-001 rfc-user-service-001

# This command:
# 1. Loads PRD from MongoDB prd_analysis
# 2. Loads RFC from MongoDB rfc_analysis
# 3. Validates RFC links to PRD
# 4. Maps PRD requirements (REQ-001, etc.) to RFC architecture
# 5. Creates epics linking both PRD and RFC contexts
# 6. Saves to MongoDB epics collection
```

**Output (Mode 1 - with PRD):**
```
MongoDB: epics collection
[
  {
    "epic_id": "epic-user-service-001",
    "title": "User Service Core",
    "prd_reference": {
      "prd_id": "prd-user-service-001",
      "requirements": ["REQ-001", "REQ-002"]
    },
    "rfc_reference": {
      "rfc_id": "rfc-user-service-001",
      "sections": ["4.2", "5.1"],
      "components": ["User Service", "Auth Middleware"]
    },
    "api_contracts": [
      {
        "endpoint": "/api/v1/users",
        "method": "POST"
      }
    ],
    "keywords": ["user", "api", "backend", "authentication"],
    ...
  }
]
```

#### **For Mode 2 (Enhancement without PRD): Use `/rfc-to-epics`**

```bash
# Generate epics from RFC enhancement
/rfc-to-epics RFC-002

# This command:
# 1. Loads RFC from MongoDB rfc_analysis (Mode 2 - enhancement)
# 2. Validates RFC has enhancement_context
# 3. Analyzes enhancement scope and components
# 4. Creates epics breaking down enhancement work
# 5. Preserves RFC context and references
# 6. Saves to MongoDB epics collection
```

**Output (Mode 2 - enhancement only):**
```
MongoDB: epics collection
[
  {
    "epic_id": "epic-RFC-RFC-002-1",
    "title": "Optimize User Lookup Performance",
    "rfc_reference": {
      "rfc_id": "RFC-002",
      "sections": ["4.2"],
      "enhancement_type": "optimization",
      "scope": "partial",
      "components": ["User Service Database Layer"]
    },
    "enhancement_context": {
      "type": "optimization",
      "reason": "Current queries are slow, require indexing and query optimization...",
      "current_state": "Single sequential lookup queries",
      "desired_state": "Optimized queries with proper indexing",
      "reference_rfc_id": "rfc-user-service-001"
    },
    "api_contracts": [
      {
        "endpoint": "/api/v1/users/:id",
        "method": "GET"
      }
    ],
    ...
  }
]
```

### Phase 4: Generate Tasks

The `/epic-to-tasks` command works with epics from **both** workflows:

```bash
# Generate tasks from epic (works for Mode 1 or Mode 2 epics)
/epic-to-tasks epic-user-service-001

# This command:
# 1. Loads epic from MongoDB epics
# 2. Extracts prd_id and rfc_id from epic (if available)
# 3. If PRD exists (Mode 1):
#    - Loads full PRD from prd_analysis
#    - Includes PRD requirements (REQ-###) in task context
# 4. Loads full RFC from rfc_analysis
# 5. If Mode 2 (no PRD):
#    - Uses enhancement_context for business justification
#    - Validates current/desired state from enhancement context
# 6. Generates tasks with complete context:
#    - PRD functional requirements (if Mode 1)
#    - Enhancement context and improvements (if Mode 2)
#    - Technical design from RFC
#    - API specifications
#    - Acceptance criteria
# 7. Creates tasks across all disciplines (backend, frontend, qa, docs, infra)
# 8. Saves to MongoDB tasks collection
```

**Output:**
```
MongoDB: tasks collection
[
  {
    "task_id": "task-001",
    "epic_id": "epic-user-service-001",
    "type": "backend",
    "category": "api",
    "title": "Implement POST /api/v1/users endpoint",

    "prd_context": {
      "prd_id": "prd-user-service-001",
      "requirement_id": "REQ-001",
      "requirement_title": "User can create profile",
      "acceptance_criteria": [
        "Validates email format",
        "Validates age > 18",
        "Returns error on duplicate email"
      ]
    },

    "rfc_context": {
      "rfc_id": "rfc-user-service-001",
      "section": "4.2",
      "section_title": "User Service API Design",
      "architecture_component": "User Service",
      "implementation_phase": "Phase 1"
    },

    "api_contract": {
      "endpoint": "/api/v1/users",
      "method": "POST",
      "authentication": {
        "required": true,
        "type": "Bearer",
        "bearerFormat": "JWT"
      },
      "request_schema": { ... },
      "response_schema": { ... },
      "error_responses": {
        "type": "https://api.example.com/errors/validation-error",
        "status": 422,
        "validationErrors": [
          {
            "field": "email",
            "message": "Invalid email format",
            "code": "INVALID_FORMAT"
          }
        ]
      }
    },

    "description": "200+ word description with full context...",
    "functional_requirements": ["From PRD + RFC"],
    "acceptance_criteria": ["From PRD + RFC"],
    "status": "pending"
  },
  {
    "task_id": "task-002",
    "type": "frontend",
    ...
  },
  {
    "task_id": "task-003",
    "type": "qa",
    ...
  }
]
```

### Phase 5: Code Generation (AI-Powered)

With tasks fully contextualized, AI can now:

```bash
# AI reads task with full PRD + RFC context
# Generates implementation code
# Includes:
# - API endpoints matching api-contract.schema.json
# - Error handling with RFC 7807 format
# - Database models from RFC
# - Unit tests based on acceptance criteria
# - API documentation
```

---

## Command Reference

### `/analyze-prd [prd_file_path]`

**Purpose:** Parse, validate, and store PRD in MongoDB

**Usage:**
```bash
/analyze-prd docs/my-project-prd.md
```

**What it does:**
1. Reads PRD markdown file
2. Validates structure against template
3. Parses content into structured JSON
4. Validates against prd.schema.json
5. Saves to MongoDB `prd_analysis` collection

**Output:** Structured PRD in MongoDB

---

### `/analyze-rfc [rfc_file_path]`

**Purpose:** Parse, validate, and store RFC in MongoDB (supports both Mode 1 and Mode 2)

**Usage:**
```bash
# Mode 1: RFC with PRD reference
/analyze-rfc docs/my-project-rfc.md

# Mode 2: RFC enhancement without PRD
/analyze-rfc docs/improve-user-service-rfc.md
```

**What it does:**
1. Reads RFC markdown file
2. Validates structure against template
3. Detects RFC mode:
   - **Mode 1 (PRD-based)**: Has prd_reference with prd_id
   - **Mode 2 (Enhancement)**: Has enhancement_context with type and reason
4. For Mode 1 RFCs:
   - Loads related PRD from MongoDB
   - Validates requirements_addressed match PRD requirements
5. For Mode 2 RFCs:
   - Validates enhancement_context (type, reason, scope)
   - Validates references (rfc_id, epic_id, or requirement_id)
6. Validates API contracts against api-contract.schema.json
7. Saves all API contracts to api_contracts collection for API docs generation
8. Parses content into structured JSON
9. Validates against rfc.schema.json
10. Saves to MongoDB `rfc_analysis` collection

**Output:** Structured RFC in MongoDB with PRD traceability (Mode 1) or enhancement context (Mode 2)

---

### `/prd-rfc-to-epics [prd_id] [rfc_id]`

**Purpose:** Generate epics combining PRD requirements and RFC architecture

**Usage:**
```bash
/prd-rfc-to-epics prd-user-service-001 rfc-user-service-001
```

**What it does:**
1. Loads PRD from MongoDB `prd_analysis`
2. Loads RFC from MongoDB `rfc_analysis`
3. Validates RFC links to PRD
4. Analyzes scope:
   - Counts PRD requirements
   - Examines RFC architecture components
   - Determines epic strategy (single vs multiple)
5. Maps requirements to RFC sections and components
6. Groups related work into epics
7. Links each epic to:
   - PRD requirements (requirements_addressed)
   - RFC sections (related_rfc_sections)
   - API contracts
   - Implementation phases
8. Creates keywords spanning all task types (backend, frontend, qa, docs, infra)
9. Saves epics to MongoDB `epics` collection with prd_id and rfc_id

**Output:** Epics in MongoDB with full context for task generation

---

### `/rfc-to-epics [rfc_id]`

**Purpose:** Generate epics from RFC enhancement (Mode 2 - without PRD)

**Usage:**
```bash
/rfc-to-epics RFC-002
```

**What it does:**
1. Loads RFC from MongoDB `rfc_analysis` (Mode 2 - enhancement)
2. Validates RFC has enhancement_context (not prd_reference)
3. Extracts enhancement type, reason, scope, and references
4. Analyzes enhancement scope:
   - Identifies affected components from RFC
   - Determines epic boundaries (foundation, core, enhancement, validation, launch)
   - Groups related work
5. Generates epics for:
   - Architecture/data model changes
   - API/Backend implementation
   - Frontend/UI updates
   - Integration/Migration work
   - Testing/Validation
   - Operations/Deployment
6. Links each epic to:
   - RFC sections and components
   - Enhancement context (type, reason, scope)
   - API contracts
   - Referenced RFCs, epics, or requirements
7. Creates keywords spanning all task types (backend, frontend, qa, docs, infra)
8. Saves epics to MongoDB `epics` collection with rfc_id but NO prd_id

**Output:** Enhancement epics in MongoDB ready for task generation

---

### `/epic-to-tasks [epic_id]`

**Purpose:** Generate implementable tasks from epic (works with both Mode 1 and Mode 2)

**Usage:**
```bash
# For Mode 1 epic (from PRD + RFC)
/epic-to-tasks epic-user-service-001

# For Mode 2 epic (from RFC enhancement)
/epic-to-tasks epic-RFC-RFC-002-1
```

**What it does:**
1. Loads epic from MongoDB `epics`
2. Extracts prd_id and rfc_id from epic (prd_id may be optional for Mode 2)
3. If PRD exists (Mode 1):
   - Loads full PRD from `prd_analysis`
   - Includes PRD requirements (REQ-###) in task context
4. Loads full RFC from `rfc_analysis`
5. If Mode 2 (no PRD):
   - Extracts enhancement_context from epic
   - Uses enhancement business justification instead of PRD requirements
6. Analyzes epic scope and identifies task types needed:
   - Backend tasks (APIs, services, databases, integrations)
   - Frontend tasks (UI, forms, pages, interactions)
   - QA tasks (unit tests, integration tests, e2e scenarios)
   - Documentation tasks (API docs, guides)
   - Infrastructure tasks (deployment, monitoring, scaling)
7. Generates self-contained tasks with:
   - PRD requirement context if Mode 1 (REQ-###, acceptance criteria)
   - Enhancement context if Mode 2 (type, reason, current/desired state)
   - RFC technical context (section, architecture component, phase)
   - API contract specifications (if applicable)
   - Full business and technical context
   - Clear acceptance criteria
8. Saves tasks to MongoDB `tasks` collection

**Output:** Tasks with complete context for AI-powered code generation (Mode 1 or Mode 2)

---

## MongoDB Collections

### `prd_analysis`
Stores structured Product Requirements Documents

**Key fields:**
- `_id`: MongoDB ObjectId
- `prd_id`: Unique PRD identifier (prd-xxx-001)
- `metadata`: Title, version, status, author
- `business_value`: Problem statement, opportunity, target users
- `goals`: Business goals, user goals, success metrics
- `scope`: In/out scope, assumptions, constraints, dependencies
- `functional_requirements`: Array of REQ-### items
- `non_functional_requirements`: Performance, security, reliability, usability
- `release_plan`: Phases and milestones

---

### `rfc_analysis`
Stores structured Request For Comment documents (Mode 1 with PRD or Mode 2 enhancements)

**Mode 1 Fields (New Feature with PRD):**
- `_id`: MongoDB ObjectId
- `rfc_id`: Unique RFC identifier (RFC-###)
- `prd_reference`: Link to parent PRD (prd_id) with requirements_addressed
- `metadata`: Title, version, status, reviewers
- `problem_analysis`: From PRD context
- `proposed_solution`: Technical approach
- `architecture`: Components, integrations
- `data_models`: Entities, relationships
- `api_contracts`: API endpoints with RFC 7807 error format
- `authentication_security`: Auth scheme, authorization, compliance
- `performance_scalability`: Targets, strategy, distribution
- `implementation`: Phases, tech stack, guidelines
- `dependencies_risks`: External deps, technical risks
- `testing_quality`: Unit, integration, e2e, performance tests
- `monitoring_observability`: Metrics, logging, alerting
- `deployment`: Strategy, rollback plan, release date

**Mode 2 Fields (Enhancement without PRD):**
- `_id`: MongoDB ObjectId
- `rfc_id`: Unique RFC identifier (RFC-###)
- `enhancement_context`: Type, reason, scope, reference (rfc_id, epic_id, or requirement_id)
- `problem_analysis`: Current state and desired state
- `proposed_solution`: Enhancement approach
- `architecture`: Modified/new components
- `data_models`: New or modified entities
- `api_contracts`: New or modified endpoints
- `authentication_security`: Updated auth/security requirements
- `performance_scalability`: Enhancement targets
- `implementation`: Phases for enhancement work
- `dependencies_risks`: Dependencies and risks
- `testing_quality`: Testing strategy for enhancement
- `deployment`: Deployment and rollout strategy

---

### `epics`
Stores feature/component groupings from PRD+RFC (Mode 1) or RFC enhancements (Mode 2)

**Mode 1 Fields (with PRD):**
- `_id`: MongoDB ObjectId
- `epic_id`: Unique epic identifier (epic-xxx)
- `prd_reference`: PRD id and requirements addressed (REQ-###)
- `rfc_reference`: RFC id, sections, components
- `api_contracts`: Endpoints in this epic
- `data_models`: Entities used
- `keywords`: For task type routing
- `priority`: high, medium, low
- `status`: planned, in_progress, completed

**Mode 2 Fields (enhancement without PRD):**
- `_id`: MongoDB ObjectId
- `epic_id`: Unique epic identifier (epic-RFC-{rfc_id}-{n})
- `rfc_reference`: RFC id, sections, components, enhancement_type, scope
- `enhancement_context`: Type, reason, current/desired state, migration path
- `api_contracts`: New or modified endpoints
- `data_models`: New or modified entities
- `keywords`: For task type routing
- `priority`: high, medium, low
- `status`: planned, in_progress, completed

---

### `api_contracts`
Stores API endpoint specifications (RFC 7807 compliant)

**Key fields:**
- `_id`: MongoDB ObjectId
- `api_contract_id`: Unique identifier
- `endpoint`: API path
- `method`: GET, POST, PUT, PATCH, DELETE
- `authentication`: Type, scheme, location
- `request_schema`: Input validation
- `response_schema`: Success response
- `error_responses`: RFC 7807 format with validationErrors
- `rate_limiting`: Tier-based limits
- `created_at`: Timestamp

---

### `tasks`
Stores implementable work units with complete context

**Key fields:**
- `_id`: MongoDB ObjectId
- `task_id`: Unique identifier
- `epic_id`: Parent epic
- `prd_context`: Requirement ID, acceptance criteria
- `rfc_context`: Section, architecture, phase
- `api_contract`: If applicable
- `type`: backend, frontend, qa, docs, infra
- `category`: Feature-specific (e.g., api, ui, test)
- `description`: 200+ words with full context
- `functional_requirements`: What needs to be done
- `acceptance_criteria`: How to verify completion
- `status`: pending, in_progress, completed
- `dependencies`: Related task IDs
- `created_at`: Timestamp

---

## Project Structure

```
ai-driven-development/
├── README.md                              # This file (project documentation)
├── .claude/
│   ├── COMMANDS_GUIDE.md                  # Detailed commands reference & examples
│   ├── commands/
│   │   ├── generate-prd.md                # 🆕 PRD generation command
│   │   ├── generate-rfc.md                # 🆕 RFC generation command
│   │   ├── analyze-prd.md                 # PRD validation & storage
│   │   ├── analyze-rfc.md                 # RFC validation & storage
│   │   ├── prd-rfc-to-epics.md            # Epic generation (PRD+RFC)
│   │   ├── rfc-to-epics.md                # Epic generation (RFC only)
│   │   └── epic-to-tasks.md               # Task generation
│   └── MCP_*.md                           # MCP server configuration
│
├── templates/
│   ├── prd.md                             # PRD markdown template
│   ├── rfc.md                             # RFC markdown template (with Mermaid)
│   └── schemas/
│       ├── prd.schema.json                # PRD JSON schema validation
│       ├── rfc.schema.json                # RFC JSON schema (with Mermaid support)
│       ├── api-contract.schema.json       # API contract specification schema
│       ├── epic.schema.json               # Epic grouping schema (dual-mode)
│       └── task.schema.json               # Task definition schema
│
├── docs/
│   ├── [project-name]-prd.md              # Generated PRD documents
│   ├── [project-name]-rfc.md              # Generated RFC documents
│   └── tasks/
│       └── task-*.md                      # Individual task documentation
│
└── docker-compose.yml                     # MongoDB setup for document storage
```

### Key Directories Explained

**`.claude/commands/`** - Custom Claude commands for the workflow
- `generate-*` commands: Generate new documents from scratch
- `analyze-*` commands: Validate and store documents in MongoDB
- Epic/Task generation: Convert higher-level documents to implementation units

**`templates/`** - Document templates and validation schemas
- Markdown templates: Structure for PRD and RFC documents
- JSON schemas: Validation and MongoDB storage structure

**`docs/`** - Generated documents for your projects
- Store generated PRDs, RFCs, and tasks here
- Each project gets its own set of documents
- Organized by project name

---

## 📖 How to Use This Project

### Step 1: Generate a PRD (Product Requirements Document)

The PRD defines **WHAT** you're building and **WHY**.

```bash
/generate-prd "Your product description or idea"
```

**Example:**
```bash
/generate-prd "A collaborative task management app where teams can create projects, assign tasks, track progress, and communicate in real-time"
```

**What you get:**
- Complete PRD markdown file saved to `docs/[product]-prd.md`
- Executive summary
- 5+ functional requirements (REQ-001, REQ-002, etc.)
- Success metrics and KPIs
- Target users and personas
- Risk assessment
- Ready to review and iterate

**Next:** Review the generated PRD, make edits if needed, then proceed to validation.

---

### Step 2: Validate and Store PRD in MongoDB

Once you're happy with the PRD, validate it and store in MongoDB:

```bash
/analyze-prd docs/[product]-prd.md
```

**What happens:**
- PRD is validated against schema
- Structured JSON extracted
- Saved to MongoDB `prd_analysis` collection
- Returns unique PRD ID (e.g., `prd-task-management-001`)

**Note the PRD ID** - you'll need it for the next step!

---

### Step 3: Generate Technical Design (RFC)

The RFC defines **HOW** you'll build it.

#### For New Features (with PRD context):

```bash
/generate-rfc prd-task-management-001 new_feature
```

**What you get:**
- Complete RFC with technical design
- 3 Mermaid architecture diagrams:
  - System overview (components and relationships)
  - Integration points (external systems)
  - Data flow (request processing pipeline)
- All API endpoints fully specified
- Data models and relationships
- Implementation strategy (3 phases)
- Performance and security plans
- Testing strategy
- Risk assessment

#### For Enhancements (without PRD):

```bash
/generate-rfc "Optimize database queries with strategic indexing to reduce query time from 500ms to 50ms" enhancement
```

**What you get:**
- Enhancement context (type, reason, scope)
- Technical design for the improvement
- Implementation approach
- Risk and mitigation strategy

**Output:** RFC markdown file saved to `docs/[product]-rfc.md` with Mermaid diagrams

---

### Step 4: Validate and Store RFC in MongoDB

Validate the RFC and extract API contracts:

```bash
/analyze-rfc docs/[product]-rfc.md
```

**What happens:**
- RFC validated against schema
- Structured JSON extracted
- API contracts saved to `api_contracts` collection
- RFC saved to `rfc_analysis` collection
- Returns RFC ID (e.g., `RFC-001`)

**Tip:** RFC 7807 error format with validationErrors is validated automatically

---

### Step 5: Generate Epics (Group Related Work)

Epics organize work into feature groups that can be implemented together.

#### For New Features (PRD + RFC):

```bash
/prd-rfc-to-epics prd-task-management-001 RFC-001
```

#### For Enhancements (RFC only):

```bash
/rfc-to-epics RFC-002
```

**What you get:**
- Epics that group related features
- Each epic links PRD requirements to RFC architecture
- Epic IDs for task generation
- Task routing keywords (backend, frontend, qa, docs, infra)

---

### Step 6: Generate Tasks (Implementable Work)

Tasks are self-contained work items ready for implementation.

```bash
/epic-to-tasks epic-task-management-001
```

**What you get:**
- Backend tasks (APIs, services, database)
- Frontend tasks (UI, forms, pages)
- QA tasks (unit tests, integration tests, e2e)
- Documentation tasks
- Infrastructure tasks

**Each task includes:**
- Full PRD context (requirements, acceptance criteria)
- RFC context (architecture, implementation phase)
- API specifications (if applicable)
- Complete description for AI code generation
- Acceptance criteria for validation

---

### Step 7: AI Code Generation

With tasks fully contextualized, AI can now generate implementation:

```bash
# AI reads task with full PRD + RFC context
# Generates:
# - API endpoints matching specifications
# - Error handling with RFC 7807 format
# - Database models from RFC
# - Unit tests based on acceptance criteria
# - API documentation
```

---

## 🎯 Complete Workflow Summary

```
┌─────────────────────────────────────────────────────────────┐
│ 1. /generate-prd "Your product idea"                        │
│    ↓ (generates docs/[product]-prd.md)                     │
│    Review & edit the PRD                                    │
│    ↓                                                        │
├─────────────────────────────────────────────────────────────┤
│ 2. /analyze-prd docs/[product]-prd.md                       │
│    ↓ (stores in MongoDB, returns prd-id)                   │
├─────────────────────────────────────────────────────────────┤
│ 3. /generate-rfc prd-id new_feature                         │
│    ↓ (generates docs/[product]-rfc.md with Mermaid)        │
│    Review & edit the RFC                                    │
│    ↓                                                        │
├─────────────────────────────────────────────────────────────┤
│ 4. /analyze-rfc docs/[product]-rfc.md                       │
│    ↓ (stores in MongoDB, returns RFC-id)                   │
├─────────────────────────────────────────────────────────────┤
│ 5. /prd-rfc-to-epics prd-id RFC-id                          │
│    ↓ (creates grouped work units)                          │
├─────────────────────────────────────────────────────────────┤
│ 6. /epic-to-tasks epic-id                                   │
│    ↓ (creates implementable tasks)                         │
├─────────────────────────────────────────────────────────────┤
│ 7. AI Code Generation                                       │
│    ↓ (generates working code with full context)            │
├─────────────────────────────────────────────────────────────┤
│ 8. Testing & Deployment                                     │
│    ✅ Complete, tested, documented application             │
└─────────────────────────────────────────────────────────────┘
```

---

## 💾 Understanding MongoDB Collections

This project uses MongoDB to store all project knowledge:

### `prd_analysis`
Stores Product Requirements Documents
```json
{
  "prd_id": "prd-task-management-001",
  "title": "Task Management System",
  "version": "1.0.0",
  "functional_requirements": [
    {
      "id": "REQ-001",
      "title": "User can create tasks",
      "description": "Users must be able to create new tasks with title, description, and due date",
      "priority": "must_have",
      "acceptance_criteria": ["Task appears in user's task list", "Due date is validated"]
    }
  ],
  "success_metrics": ["100+ active users", "<2s task creation time"],
  "status": "Draft"
}
```

### `rfc_analysis`
Stores Request For Comment (technical designs)
```json
{
  "rfc_id": "RFC-001",
  "title": "Task Management API Design",
  "version": "1.0.0",
  "prd_reference": {
    "prd_id": "prd-task-management-001",
    "requirements_addressed": ["REQ-001", "REQ-002"]
  },
  "architecture": {
    "overview_diagram": {
      "mermaid_code": "graph TB; Client-->Gateway; Gateway-->Service; Service-->DB",
      "description": "System architecture overview"
    }
  },
  "status": "Draft"
}
```

### `api_contracts`
Stores API endpoint specifications
```json
{
  "endpoint": "/api/v1/tasks",
  "method": "POST",
  "authentication": "Bearer JWT",
  "request_schema": {
    "title": "string (required)",
    "description": "string",
    "due_date": "date (ISO 8601)"
  },
  "response_schema": {
    "task_id": "string",
    "created_at": "datetime",
    "status": "created"
  },
  "error_responses": [
    {
      "status": 401,
      "type": "Unauthorized",
      "description": "Missing or invalid authentication token"
    },
    {
      "status": 400,
      "type": "ValidationError",
      "validationErrors": [{"field": "title", "message": "Title is required"}]
    }
  ],
  "rate_limiting": "100 requests per minute"
}
```

### `epics`
Stores feature groupings (linked to PRD + RFC)
```json
{
  "epic_id": "epic-task-management-001",
  "title": "Task Creation and Management",
  "prd_reference": {
    "prd_id": "prd-task-management-001",
    "requirements_addressed": ["REQ-001", "REQ-002"]
  },
  "rfc_reference": {
    "rfc_id": "RFC-001",
    "sections": ["4 - Architecture Design", "6 - API Contracts"],
    "architecture_components": ["Task Service", "Database"]
  },
  "tasks_count": 8,
  "status": "Planning"
}
```

### `tasks`
Stores implementable work items
```json
{
  "task_id": "task-001",
  "epic_id": "epic-task-management-001",
  "type": "backend",
  "title": "Implement Task Creation API Endpoint",
  "description": "Create the POST /api/v1/tasks endpoint that accepts task creation requests with title, description, and due_date. Must validate input, create database record, and return task_id. Include error handling for validation failures. This task is part of REQ-001 (User can create tasks) from PRD and implements the API contract defined in RFC-001 section 6.",
  "status": "Todo",
  "prd_context": {
    "requirement_id": "REQ-001",
    "requirement_title": "User can create tasks",
    "acceptance_criteria": ["Task appears in user's task list", "Due date is validated"]
  },
  "rfc_context": {
    "rfc_id": "RFC-001",
    "api_endpoint": "/api/v1/tasks",
    "http_method": "POST",
    "implementation_phase": "Phase 1"
  }
}
```

---

## 🔗 Document Linking

Documents are fully linked for complete traceability:

```
PRD Requirement → RFC Section → Epic → Task → Code
  (REQ-001)    →  (4.2)     →  (epic-001) → (task-001)

Each level includes context from all previous levels
This enables:
- Full requirements traceability
- Understanding "why" decisions were made
- Complete context for code generation
- Easy impact analysis for changes
```

---

## 📚 Reference Materials

- **Quick Start:** Read the section above
- **Commands Guide:** See `.claude/COMMANDS_GUIDE.md`
- **PRD Template:** See `templates/prd.md`
- **RFC Template:** See `templates/rfc.md` (with Mermaid examples)
- **Schemas:** See `templates/schemas/` for validation rules

---

## Best Practices

### 1. PRD Guidelines

✅ **DO:**
- Focus on WHAT and WHY, not HOW
- Include user stories and pain points
- Define clear success metrics
- Specify all constraints and assumptions
- Number requirements (REQ-001, REQ-002, etc.)

❌ **DON'T:**
- Include technical implementation details
- Specify exact technology choices
- Write like a technical design document
- Assume one particular solution

### 2. RFC Guidelines

✅ **DO:**
- Reference related PRD by ID
- Validate RFC requirements match PRD
- Define all API endpoints with RFC 7807 error format
- Document trade-offs and alternatives considered
- Plan implementation in realistic phases
- Include security and performance considerations

❌ **DON'T:**
- Duplicate PRD requirements
- Design without considering PRD context
- Use vague architectural descriptions
- Ignore error handling specifications

### 3. Epic Guidelines

✅ **DO:**
- Link to specific PRD requirements (REQ-###)
- Reference RFC sections and components
- Include API contracts that will be implemented
- Use comprehensive keywords for task routing
- Organize around features or components
- Aim for 5-15 tasks per epic

❌ **DON'T:**
- Create epics from requirements alone (use PRD+RFC)
- Mix feature epics with infrastructure epics
- Create epics with too many tasks (>20)
- Leave API contracts unspecified

### 4. Task Guidelines

✅ **DO:**
- Include PRD requirement context
- Reference RFC architecture section
- Specify API contracts (if applicable)
- Write 200+ word descriptions with full context
- Make acceptance criteria business-focused
- Include all necessary information for AI code generation

❌ **DON'T:**
- Leave tasks without PRD context
- Omit technical design details from RFC
- Skip acceptance criteria
- Mix multiple user stories in one task
- Assume implementation knowledge

---

## Example Workflow

### Create User Service Feature

**Step 1: Write and Analyze PRD**
```bash
# Write docs/user-service-prd.md with:
# - Problem: Users need to create and manage profiles
# - Goals: Support 1M users, 99.9% uptime
# - Requirements: REQ-001 (create profile), REQ-002 (list profiles), REQ-003 (update profile)
# - Success Metrics: 95% user adoption

/analyze-prd docs/user-service-prd.md
# → Stored as prd-user-service-001 in MongoDB
```

**Step 2: Write and Analyze RFC**
```bash
# Write docs/user-service-rfc.md with:
# - Link to prd-user-service-001
# - Architecture: User Service + Auth Middleware + Database
# - API Contracts: POST /api/v1/users, GET /api/v1/users, etc.
# - Error handling: RFC 7807 format with validationErrors
# - Implementation: 3 phases over 4 weeks

/analyze-rfc docs/user-service-rfc.md
# → Linked to PRD, stored as rfc-user-service-001 in MongoDB
```

**Step 3: Generate Epics**
```bash
/prd-rfc-to-epics prd-user-service-001 rfc-user-service-001
# → Generates epics linking PRD requirements to RFC architecture
# → Stores epic-user-service-001 with full context
```

**Step 4: Generate Tasks**
```bash
/epic-to-tasks epic-user-service-001
# → Generates tasks across all disciplines:
#   - Backend: Implement endpoints, validation, error handling
#   - Frontend: Profile form UI, error display
#   - QA: Unit tests, integration tests, e2e scenarios
#   - Docs: API documentation with RFC 7807 examples
#   - Infra: Deployment setup, monitoring, scaling
# → Tasks stored with complete PRD + RFC context
```

**Step 5: AI Code Generation**
```bash
# AI reads task-001 with full context:
# - PRD: REQ-001 (create profile) with acceptance criteria
# - RFC: Section 4.2 (User Service API), data model, auth scheme
# - API Contract: POST /api/v1/users with RFC 7807 error format
# → AI generates complete, tested implementation
```

---

## Integration with External Tools

### PRD/RFC Source Options
- ✅ Markdown files (.md)
- ✅ Confluence pages (export to markdown)
- ✅ Notion documents (export to markdown)
- ✅ Google Docs (export to markdown)
- ✅ Direct JSON upload (for pre-structured data)

**Process:**
1. Create PRD/RFC in your preferred tool
2. Export as markdown or JSON
3. Run `/analyze-prd` or `/analyze-rfc`
4. Automatically stored in MongoDB
5. Ready for epic and task generation

---

## Troubleshooting

### PRD Not Linking to RFC
- Ensure RFC has correct `prd_id` in metadata
- Verify PRD is already analyzed and in MongoDB
- Check `requirements_addressed` in RFC matches PRD requirement IDs

### RFC Validation Fails
- Validate all API contracts follow `api-contract.schema.json`
- Ensure error_responses include RFC 7807 format
- Check validationErrors array is properly structured

### Epic Generation Skipped
- Verify PRD has at least 5 requirements
- Check RFC architecture is clearly defined
- Ensure `requirements_addressed` is non-empty

### Tasks Missing Context
- Verify epic has both `prd_reference` and `rfc_reference`
- Check API contracts are referenced in epic
- Ensure RFC implementation_phase is defined

---

## Contributing & Extending

### Adding New Fields to Schemas
1. Update the relevant .schema.json file
2. Update the markdown template
3. Update command documentation
4. Document in this README

### Creating New Commands
1. Create `.claude/commands/your-command.md`
2. Follow existing command format
3. Include MongoDB operations
4. Document in this README

---

## License & Attribution

This framework is designed for AI-driven development using Claude AI and supports integration with MongoDB for persistent storage.

---

## Quick Reference

| Task | Command | Input | Output |
|------|---------|-------|--------|
| Analyze PRD | `/analyze-prd` | .md file | MongoDB prd_analysis |
| Analyze RFC | `/analyze-rfc` | .md file | MongoDB rfc_analysis |
| Generate Epics | `/prd-rfc-to-epics` | prd_id, rfc_id | MongoDB epics |
| Generate Tasks | `/epic-to-tasks` | epic_id | MongoDB tasks |
| Trace Requirement | Query MongoDB | REQ-001 | PRD → RFC → Epic → Task |
| Find API Contract | Query MongoDB | endpoint, method | api_contracts collection |

---

**Last Updated:** 2025-01-21
**Version:** 1.0.0
