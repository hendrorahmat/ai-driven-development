# Custom Commands: Generate PRD & RFC

## Overview

Created two new custom Claude commands to automate PRD and RFC generation:

1. **`/generate-prd`** - Generate Product Requirements Documents
2. **`/generate-rfc`** - Generate Request For Comment technical designs

These commands integrate with the existing AI-Driven Development framework and leverage MongoDB storage, Mermaid diagrams, and comprehensive schema validation.

---

## Command 1: `/generate-prd`

### Location
`/Users/mekari/Development/ai-driven-development/.claude/commands/generate-prd.md`

### Purpose
Generate comprehensive Product Requirements Documents from product ideas or descriptions.

### Usage
```bash
/generate-prd [product_description_or_file_path]
```

### Examples
```bash
/generate-prd "A mobile app for tracking personal finances with budget alerts"
/generate-prd "docs/my-product-idea.txt"
```

### Key Features

**Input Understanding:**
- Analyzes product description
- Asks clarifying questions if needed
- Extracts key information (problem, solution, users, metrics)

**Comprehensive Structure:**
- Executive summary
- Problem statement and opportunity
- Goals and success metrics (KPIs)
- Target users and personas (5-10 user stories)
- Scope (in/out scope, assumptions, constraints)
- Functional requirements (minimum 5, numbered REQ-001 through REQ-###)
- Non-functional requirements (performance, security, scalability, reliability)
- User experience and design
- Technical considerations
- Release plan with phases
- Risks and mitigation strategies
- Open questions
- References

**Quality Checks:**
- ✅ At least 5 functional requirements
- ✅ All requirements have acceptance criteria
- ✅ Realistic priority mix (not all "must_have")
- ✅ Proper requirement numbering (REQ-001, REQ-002, etc.)
- ✅ Technology-agnostic (WHAT and WHY, not HOW)
- ✅ User-centric language
- ✅ Measurable success metrics

**Output:**
- Complete PRD markdown file
- Saved to `docs/[product-name]-prd.md`
- Ready for `/analyze-prd` validation and MongoDB storage
- Unique PRD ID: `prd-[product-slug]-001`

### Personas
- product-manager
- analyst
- business-strategist

### MCP Servers
- sequential-thinking (for complex analysis)
- context7 (for documentation patterns)
- serena (for code understanding)

---

## Command 2: `/generate-rfc`

### Location
`/Users/mekari/Development/ai-driven-development/.claude/commands/generate-rfc.md`

### Purpose
Generate comprehensive Request For Comment technical design documents supporting two modes:
- **MODE 1**: New Feature RFC (linked to PRD)
- **MODE 2**: Enhancement RFC (standalone improvement)

### Usage

**MODE 1 - New Feature (with PRD):**
```bash
/generate-rfc prd-user-service-001 new_feature
/generate-rfc [prd_id]
```

**MODE 2 - Enhancement (standalone):**
```bash
/generate-rfc "Optimize user lookup queries using database indexing" enhancement
/generate-rfc "[enhancement_description]" [mode]
```

### Key Features

**Architectural Design with Mermaid:**
- Overview diagram (graph TB): Shows all components and relationships
- Integration diagram (graph LR): Shows external system integrations
- Data flow diagram (graph TB): Shows request processing pipeline

**Comprehensive Sections:**
- Metadata with RFC ID and ownership
- Context reference (PRD link for MODE 1, enhancement context for MODE 2)
- Problem analysis
- Proposed solution overview
- Architecture design (with 3 Mermaid diagrams)
- Data models (entities, relationships, migration strategy)
- API contracts (complete endpoint specifications)
  - Endpoint path and HTTP method
  - Authentication and authorization
  - Request/response schemas
  - RFC 7807 error format with validationErrors
  - Rate limiting (requests, window, tier)
- Authentication & security
- Performance & scalability targets
- Trade-offs and alternatives analysis
- Implementation strategy (3 phases + technology stack)
- Dependencies and risks (with mitigation)
- Testing strategy (unit, integration, e2e, performance)
- Monitoring and observability (metrics, logging, alerting)
- Deployment and release strategy
- Success criteria checklist

**MODE 1 - New Feature (with PRD):**
- Loads PRD from MongoDB `prd_analysis` collection
- Maps PRD requirements (REQ-001, REQ-002) to RFC sections
- Links RFC to PRD with `prd_reference` section
- Includes `requirements_addressed` array
- Context from PRD informs technical decisions

**MODE 2 - Enhancement (standalone):**
- No PRD required
- Has `enhancement_context` with:
  - Type: feature_enhancement | refactoring | optimization | bugfix | technical_debt
  - Reason: 30+ word explanation
  - Reference: RFC-### OR epic-### OR REQ-### (one required)
  - Scope: partial | complete | comprehensive
  - Backward compatibility assessment
  - Migration path if breaking changes
- Standalone technical design document

**API Contracts:**
- Each endpoint fully specified
- Authentication type required (Bearer JWT, Basic, ApiKey, OAuth2, None)
- Authorization requirements
- Request schema (input validation)
- Response schema (success response)
- Error responses in RFC 7807 format with validationErrors array
- Rate limiting configuration
- Related PRD requirement reference

**Mermaid Diagrams:**
- All diagrams in Mermaid syntax (graph format)
- Stored both as inline code and URL references
- Complete architecture visualization
- Data flow clarity
- Integration point visibility

**Technology Stack Decisions:**
- Frontend framework with rationale
- Backend language/framework with rationale
- Database choice with rationale
- Cache solution with rationale
- Infrastructure platform with rationale
- DevOps tools with rationale

**Implementation Phases:**
- Phase 1: Foundation
- Phase 2: Core Features
- Phase 3: Polish & Testing
- Realistic timelines and dependencies
- Clear deliverables per phase

**Output:**
- Complete RFC markdown file
- Saved to `docs/[rfc-name]-rfc.md`
- RFC ID: RFC-### (sequential)
- Ready for `/analyze-rfc` validation
- API contracts extracted to `api_contracts` collection
- RFC stored in `rfc_analysis` collection

### Personas
- architect
- senior-engineer
- tech-lead

### MCP Servers
- sequential-thinking (for design analysis)
- context7 (for documentation patterns)
- serena (for code understanding)
- MongoDB (for PRD lookup and storage)

---

## Integration with Existing Workflow

### Complete AI-Driven Development Lifecycle

```
1. /generate-prd "Product idea"
   ↓ (generates PRD markdown)
   ↓
2. /analyze-prd docs/product-prd.md
   ↓ (validates & stores in MongoDB prd_analysis)
   ↓
3. /generate-rfc prd-product-001 new_feature
   ↓ (generates RFC with PRD link)
   ↓
4. /analyze-rfc docs/product-rfc.md
   ↓ (validates & stores in MongoDB rfc_analysis)
   ↓
5. /prd-rfc-to-epics prd-product-001 rfc-product-001
   ↓ (generates epics from both PRD and RFC)
   ↓
6. /epic-to-tasks epic-product-001
   ↓ (generates implementable tasks)
   ↓
7. AI Code Generation from tasks
   ↓ (implementation with full context)
   ↓
8. Testing & Deployment
```

---

## Schema Alignment

### PRD Generation
- Uses: `@templates/prd.md` (template)
- Validates: `@templates/schemas/prd.schema.json`
- Stores: MongoDB `prd_analysis` collection
- ID Format: `prd-[slug]-001`

### RFC Generation
- Uses: `@templates/rfc.md` (template with Mermaid)
- Validates: `@templates/schemas/rfc.schema.json` (with Mermaid support)
- Stores: MongoDB `rfc_analysis` collection
- ID Format: `RFC-###`
- API Contracts: Stored in `api_contracts` collection

---

## Key Requirements

### PRD Generation Requirements
- Minimum 5 functional requirements (REQ-001 through REQ-###)
- All requirements have acceptance criteria
- Mix of priorities (must_have, should_have, nice_to_have)
- Technology-agnostic descriptions
- User story format: "As a [user], I want [action] so that [benefit]"
- Measurable success metrics
- Clear risk mitigation

### RFC Generation Requirements
- Complete architectural design with Mermaid diagrams
- All API endpoints fully specified with RFC 7807 error format
- Performance targets (measurable and justified)
- Implementation in realistic phases
- Comprehensive testing strategy
- Risks documented with mitigation
- For MODE 1: Linked to PRD requirements
- For MODE 2: Enhancement context with type and reason

---

## Usage Tips

1. **Start with PRD first** - Product vision before technical design
2. **Use MODE 1 for new features** - Leverage PRD context
3. **Use MODE 2 for improvements** - Refactoring, optimization, bugfixes
4. **Iterate after generation** - Review and refine before analyze step
5. **Validate with /analyze** - Ensures MongoDB compatibility
6. **Keep requirements focused** - MVP first, future iterations later
7. **Document decisions** - Use trade-offs section to explain choices
8. **Plan implementation** - Realistic phases with clear dependencies

---

## File Locations

- `/Users/mekari/Development/ai-driven-development/.claude/commands/generate-prd.md`
- `/Users/mekari/Development/ai-driven-development/.claude/commands/generate-rfc.md`

Both commands are ready to use via `/generate-prd` and `/generate-rfc` in the Claude Code environment.
