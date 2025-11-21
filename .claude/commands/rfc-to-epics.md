---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
description: You are an Epic Architect for RFC Enhancements.
argument-hint: [rfc_id]
mcp-servers: [sequential-thinking, context7, serena, MongoDB]
personas: [architect]
---

Your task:
Generate detailed epics from RFC-only mode (MODE 2 enhancements without PRD), creating architectural work breakdown following these principles:

EPIC GENERATION PRINCIPLES:
- Each epic is a cohesive unit of work addressing one major feature or enhancement component
- Epics are business-oriented, not implementation-oriented
- Complete context provided for task generation (epic_id → epic-to-tasks command)
- Clear traceability to RFC sections and architectural components
- Support for both new enhancements and improvements to existing systems

Output JSON array following this schema:
## JSON SCHEMA
read from this file @templates/schemas/epic.schema.json

## IMPORTANT RULES:
1. Each epic title must be clear, business-focused (e.g., "User Authentication System", not "Implement JWT")
2. Each epic description must be 150+ words with complete context from RFC
3. Epic scope should be implementable in 2-4 weeks by a small team
4. Include all RFC architectural context so task generation has complete information
5. **Epic Structure for Enhancement Mode:**
   - epic_id: "epic-RFC-{rfc_id}-{sequential}" (e.g., epic-RFC-RFC-001-1)
   - rfc_reference with rfc_id, section, and enhancement_type
   - NO prd_reference (this is enhancement/refactoring mode)
   - enhancement_context copied from RFC for traceability
   - Multiple epics per RFC if enhancement spans several components
6. Epics should span multiple disciplines (backend, frontend, qa, docs, infra)
7. Include acceptance criteria that validate the enhancement was successful
8. Dependencies between epics are allowed and should be documented
9. For enhancements of existing features, clearly describe current state → desired state
10. Include risk assessment and mitigation strategies
11. Use sequential.think_step for each epic generation step
12. Output only valid JSON matching the schema @templates/schemas/epic.schema.json
13. Save all epics into epics collection in mongodb

## STEP 1: LOAD AND VALIDATE RFC

1. Query MongoDB `rfc_analysis` collection by rfc_id
2. Validate RFC is in MODE 2 (enhancement_context present, no prd_reference)
3. Extract RFC sections:
   - enhancement_context (type, reason, scope, impact_analysis)
   - problem_analysis (current state, problem statement, constraints)
   - proposed_solution (approach, philosophy)
   - architecture_design (components, integrations)
   - data_models (entities and relationships)
   - api_contracts (endpoints and contracts)
   - implementation_strategy (phases and deliverables)
   - dependencies_risks (external dependencies, risks)
   - performance_scalability (targets and strategy)

4. Determine enhancement scope and affected components

## STEP 2: ANALYZE ENHANCEMENT IMPACT

For RFC-only enhancements, analyze:

**Current System State:**
- What exists that will be modified/improved
- Backward compatibility requirements
- Migration path if breaking changes required
- User/system impact scope

**Enhancement Type Context:**
- feature_enhancement: Adding new capability to existing feature
- refactoring: Improving internal structure without behavior change
- optimization: Performance/efficiency improvement
- bugfix: Fixing existing issues
- technical_debt: Addressing architectural/code quality issues

**Scope Analysis:**
- partial: Limited subset of system affected
- complete: Entire feature/subsystem affected
- comprehensive: Cross-cutting changes affecting multiple systems

**Business Justification:**
- Why this enhancement matters (from enhancement_context.reason)
- Expected benefits and outcomes
- Risk/reward trade-offs

## STEP 3: IDENTIFY EPIC BOUNDARIES

Break the RFC enhancement into logical epics:

**Potential Epic Categories:**

1. **Architecture/Data Model Epic:**
   - If enhancement requires new data structures or model changes
   - Typically Phase 1 dependency for other epics
   - Includes data migration if applicable

2. **API/Backend Epic:**
   - If enhancement involves new endpoints or service logic
   - Includes integration points with existing systems
   - Covers security and authentication changes

3. **Frontend/UI Epic:**
   - If enhancement affects user interface or user interaction
   - Includes accessibility considerations
   - References data models and API contracts

4. **Integration/Migration Epic:**
   - If enhancement requires integration with other systems
   - Includes data migration and backward compatibility
   - Covers cutover strategy

5. **Testing/Validation Epic:**
   - Comprehensive testing across all components
   - Performance validation against RFC targets
   - User acceptance testing

6. **Operations/Deployment Epic:**
   - Deployment strategy and rollout plan
   - Monitoring and observability setup
   - Scaling and reliability improvements

Analyze RFC scope and identify which epic types are needed. Create epics only for components actually affected by this enhancement.

## STEP 4: EPIC GENERATION WITH ENRICHED CONTEXT

Follow the complete schema structure in @templates/schemas/epic.schema.json

**Key Context Fields to Populate:**

When generating enhancement epics, ensure these critical fields are included:
- `epic_id`: Unique epic identifier (epic-RFC-RFC-001-1, epic-RFC-RFC-001-2, etc.)
- `title`: Clear, business-focused enhancement title
- `description`: 150+ words with complete RFC context
- `rfc_reference`:
  - rfc_id: Parent RFC identifier
  - sections: RFC sections (e.g., "4.2", "5.1")
  - architecture_components: From RFC architecture
  - implementation_phase: Phase from RFC
  - enhancement_type: One of feature_enhancement|refactoring|optimization|bugfix|technical_debt
  - scope: One of partial|complete|comprehensive
  - backward_compatible: true/false
- `enhancement_context`: Copied from RFC (reason, current_state, desired_state, migration_path, impact_analysis)
- `business_context.business_value`: Why stakeholders should care about this epic
- `scope.features_included`: List of features in this epic
- `scope.keywords`: Must span task types (backend, frontend, qa, docs, infra)
- `scope.dependencies`: Epic IDs that this epic depends on (if any)
- `priority`: Business priority level
- `status`: Current epic status
- `timestamps`: created_at, updated_at in ISO 8601 format

## STEP 5: EPIC SEQUENCING AND DEPENDENCIES

Organize epics in logical implementation order:

1. **Foundation Epics** (no dependencies):
   - Data model changes
   - Architecture refactoring
   - Infrastructure setup

2. **Core Feature Epics** (depend on foundation):
   - API/Backend implementation
   - Database/integration work
   - External system integration

3. **Enhancement Epics** (depend on core):
   - Frontend/UI updates
   - Optimization work
   - Advanced features

4. **Validation Epics** (depend on core/enhancement):
   - Testing and QA
   - Performance validation
   - User acceptance testing

5. **Launch Epics** (final phase):
   - Deployment and rollout
   - Operations and monitoring
   - Documentation and training

Document dependencies explicitly in epic.dependencies array.

## STEP 6: COMPREHENSIVE CONTEXT PRESERVATION

Each epic must preserve RFC context for /epic-to-tasks command:

**RFC Sections to Include:**
- architecture_design: Components and integration points
- data_models: Complete entity definitions and relationships
- api_contracts: Full contract references (endpoint, method, authentication)
- performance_scalability: Performance targets and strategy
- authentication_security: Security requirements and constraints
- implementation_strategy: Phase definitions and sequencing
- dependencies_risks: External dependencies and risk mitigation
- monitoring_observability: What to monitor post-deployment

**Enhancement-Specific Context:**
- Current system state and constraints
- Backward compatibility requirements
- Migration strategy if applicable
- Business drivers and justification
- Success metrics from enhancement_context

This ensures /epic-to-tasks has complete information for task generation without needing to re-query RFC.

## STEP 7: OUTPUT AND SAVE

Output the structured epics JSON and save to MongoDB:

**MongoDB Collection: `epics`**

Each epic must follow the complete schema structure in @templates/schemas/epic.schema.json

**Key Fields for Enhancement Epics:**
- `epic_id`: Unique epic identifier (epic-RFC-RFC-001-1, epic-RFC-RFC-001-2, etc.)
- `title`: Clear, business-focused enhancement title
- `description`: 150+ words with complete RFC context
- `rfc_reference`: Parent RFC identifier, sections, architecture components, implementation phase, enhancement type, scope, backward compatibility status
- `enhancement_context`: Copied from RFC (reason, current_state, desired_state, migration_path, impact_analysis)
- `business_context`: Business value, success metrics, user impact, business goals
- `scope`: Features included, keywords spanning all disciplines, dependencies, constraints
- `priority`: Business priority level
- `status`: Current epic status (draft, in_review, approved, in_progress)
- `timestamps`: created_at, updated_at in ISO 8601 format

**Instructions:**
1. Pretty-print the validated JSON
2. Use MongoDB insert-many to save all epics
3. Add timestamps: created_at, updated_at
4. Set initial status based on RFC validation (typically "draft" for new enhancements)
5. Verify all epics have complete RFC context preserved

## CRITICAL RULES FOR RFC ENHANCEMENT EPICS:

1. **RFC-Only Mode Validation:**
   - ✅ MUST have: rfc_reference with valid rfc_id
   - ✅ MUST have: enhancement_context with type, reason, scope
   - ✅ MUST NOT have: prd_reference (this is enhancement mode)
   - ✅ MUST have: clear business justification
   - ✅ Reference existing feature/system being enhanced

2. **Enhancement Type Impact:**
   - **feature_enhancement**: New capability → validate with architecture
   - **refactoring**: Code/structure improvement → validate backward compatibility
   - **optimization**: Performance improvement → validate with performance targets
   - **bugfix**: Issue fix → validate with current state and root cause
   - **technical_debt**: Quality improvement → validate with architecture impact

3. **Epic Scope Sizing:**
   - Each epic should represent 2-4 weeks of work
   - Not too granular (sub-tasks go in /epic-to-tasks)
   - Not too large (should fit in single implementation phase)
   - Contains work across multiple disciplines

4. **API Contract Handling:**
   - If enhancement adds new endpoints: Reference RFC api_contracts
   - If enhancement modifies existing endpoints: Document breaking changes
   - If enhancement is backend-only: Still reference contracts if applicable
   - Include endpoint, method, authentication, error handling

5. **Data Model Considerations:**
   - If enhancement adds entities: Document complete schema
   - If enhancement modifies entities: Document migrations
   - Include relationships and constraints from RFC

6. **Backward Compatibility:**
   - If backward_compatible: false, must document migration path
   - Include deprecation strategy for changed APIs
   - Plan for data migration if applicable

7. **Complete Context Preservation:**
   - Epic descriptions must include RFC section references
   - Include affected components and architecture impact
   - Preserve performance targets and security requirements
   - Document implementation phases and sequencing

## OUTPUT FORMAT:

Output an array of epics, each following @templates/schemas/epic.schema.json structure with complete RFC context

Provide a summary with:
- validation_result: success|warning|error
- rfc_id: RFC identifier
- enhancement_type: Type of enhancement from RFC
- epics_generated: Count of epics created
- epic_ids: List of generated epic IDs
- architectural_components: Count of affected components
- api_contracts_referenced: Count of API contracts referenced
- issues: Any validation issues encountered

**Summary:**
- X epics created from RFC enhancement with complete traceability
- Enhancement type: [type from RFC]
- Scope: [scope from RFC]
- Ready for /epic-to-tasks command to generate implementation tasks