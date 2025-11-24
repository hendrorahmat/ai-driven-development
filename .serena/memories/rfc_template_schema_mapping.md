# RFC Template to Schema Mapping

## Metadata Fields (Schema: rfc.schema.json#/properties/metadata)

### Required Fields in Schema
| Template Field | Schema Field | Format | Example |
|---|---|---|---|
| RFC ID | `rfc_id` | Pattern: `^RFC-\d+$` | RFC-001 |
| Title | `title` | String, 10-150 chars | "Implement User Authentication" |
| Version | `version` | SemVer pattern `^\d+\.\d+\.\d+$` | 1.0.0 |
| Status | `status` | Enum: draft, in_review, approved, implemented, archived | draft |

### Optional Metadata Fields (Schema)
| Template Field | Schema Field | Format | Notes |
|---|---|---|---|
| Author | `author` | String | RFC creator/initiator |
| Technical Owner | `owner` | String | Primary technical responsibility |
| Reviewers | `reviewers` | Array of strings | List of review participants |
| Created | `created_at` | ISO 8601 datetime | YYYY-MM-DDTHH:MM:SSZ |
| Last Updated | `updated_at` | ISO 8601 datetime | YYYY-MM-DDTHH:MM:SSZ |
| Approved On | `approved_at` | ISO 8601 datetime | Only when status = approved |
| Labels | `labels` | Array of strings | Tags: backend, frontend, database, etc. |

## Schema Validation Rules

### RFC ID Pattern
```
Pattern: ^RFC-\d+$
Examples: RFC-001 ✓, RFC-100 ✓, RFC001 ✗, rfc-001 ✗
```

### Version Pattern
```
Pattern: ^(\d+)\.(\d+)\.(\d+)$
Examples: 1.0.0 ✓, 2.1.0 ✓, 1.0 ✗, v1.0.0 ✗
```

### Status Enum
- `draft` - Initial creation, still being developed
- `in_review` - Circulating for feedback
- `approved` - Accepted and ready for implementation
- `implemented` - Code has been deployed
- `archived` - Superseded or no longer relevant

### Datetime Format (ISO 8601)
```
Format: YYYY-MM-DDTHH:MM:SSZ
Examples: 2025-01-15T14:30:00Z ✓, 2025-01-15 14:30:00 ✗
```

## Context Reference Section (Schema: oneOf)

The schema uses `oneOf` to require either:

### Option A: PRD Reference
```json
"prd_reference": {
  "prd_id": "prd-id-001",
  "prd_title": "Feature Title",
  "prd_version": "1.0.0",
  "requirements_addressed": ["REQ-001", "REQ-002"]
}
```

### Option B: Enhancement Context
```json
"enhancement_context": {
  "type": "feature_enhancement|refactoring|optimization|bugfix|technical_debt",
  "reason": "Why this enhancement is needed (min 30 words)",
  "reference_rfc_id": "RFC-001" [for refactoring],
  "reference_epic_id": "epic-001" [for enhancements],
  "reference_prd_requirement": "REQ-001" [for bugfixes],
  "scope": "partial|complete|comprehensive",
  "impact_analysis": "What existing functionality is impacted",
  "backward_compatibility": "yes|no",
  "migration_path": "Path for breaking changes"
}
```

## Major Schema Sections

| Template Section | Schema Property | Notes |
|---|---|---|
| 1. Context Reference | `prd_reference` OR `enhancement_context` | oneOf required |
| 2. Problem Analysis | `problem_analysis` | Contains summary, constraints, challenges |
| 3. Proposed Solution | `proposed_solution` | Overview, philosophy, key_benefits |
| 4. Architecture Design | `architecture` | Components, integrations, diagram_url |
| 5. Data Models | `data_models` | Entities, relationships, data_flow |
| 6. API Contracts | `api_contracts` | Array of endpoint/method references |
| 7. Authentication & Security | `authentication_security` | Scheme, authorization, compliance |
| 8. Performance & Scalability | `performance_scalability` | Targets, strategy, distribution |
| 9. Trade-offs | `trade_offs` | Chosen approach, alternatives analysis |
| 10. Implementation Strategy | `implementation` | Phases, tech stack, guidelines |
| 11. Dependencies & Risks | `dependencies_risks` | External deps, technical risks |
| 12. Testing Strategy | `testing_quality` | Unit, integration, E2E, performance tests |
| 13. Monitoring | `monitoring_observability` | Metrics, logging, alerting |
| 14. Deployment | `deployment` | Strategy, environments, rollback |
| 15. Success Criteria | `success_criteria` | Array of completion criteria |
| 16. Open Questions | `open_questions` | Questions, owner, priority, status |
| 17. References | `references` | Related documents and links |

## Parsing Recommendations

When parsing RFC documents into structured schema format:

1. **Metadata**: Extract from template's "Document Information" section
2. **Context**: Map to either prd_reference OR enhancement_context (mutually exclusive)
3. **Problem Analysis**: Extract from section 2
4. **Proposed Solution**: Extract from section 3
5. **Architecture**: Extract from section 4
6. **Data Models**: Extract from section 5
7. **API Contracts**: Extract from section 6, reference by endpoint+method
8. **Security**: Extract from section 7
9. **Performance**: Extract from section 8
10. **Trade-offs**: Extract from section 9
11. **Implementation**: Extract from section 10
12. **Risks**: Extract from section 11
13. **Testing**: Extract from section 12
14. **Monitoring**: Extract from section 13
15. **Deployment**: Extract from section 14
16. **Success Criteria**: Extract from section 15 (as array)
17. **Open Questions**: Extract from section 16 (as array of objects)
18. **References**: Extract from section 18

## Validation Checklist

- [ ] RFC ID matches pattern `^RFC-\d+$`
- [ ] Title is 10-150 characters
- [ ] Version matches semantic versioning `^\d+\.\d+\.\d+$`
- [ ] Status is valid enum value
- [ ] Created/Updated/Approved dates are ISO 8601 format
- [ ] Either prd_reference OR enhancement_context is present (not both)
- [ ] If prd_reference: requirements_addressed matches pattern `^REQ-\d+$`
- [ ] If enhancement_context: reason is min 30 words
- [ ] All required sections present in template
- [ ] API contracts properly reference endpoints and methods
