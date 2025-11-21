---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
description: You are an RFC Analyzer. Analyze and validate RFC documents and save to MongoDB.
argument-hint: [rfc_file_path]
mcp-servers: [sequential-thinking, context7, serena, MongoDB]
personas: [architect, analyst]
---

Your task:

## STEP 1: LOAD AND VALIDATE RFC

1. Read the RFC markdown file from the provided path
2. Validate it follows the RFC template structure (@templates/rfc.md)
3. Ensure all critical sections are present:
   - Related PRD reference (with prd_id)
   - Problem Analysis
   - Proposed Solution
   - Architecture Design
   - Data Models
   - API Contracts
   - Implementation Strategy

## STEP 2: IDENTIFY RFC MODE AND VALIDATE

First, determine which mode this RFC is using:

**Mode Detection:**
1. Check for `prd_reference` section with prd_id
2. Check for `enhancement_context` section with type

**Validation Rules:**

### MUST HAVE (both modes):
- rfc_id must match pattern RFC-\d+
- All required fields from rfc.schema.json
- Timestamps must be ISO 8601 format
- Problem analysis section
- Proposed solution
- Architecture design
- API contracts (if applicable)

### MODE 1: New Feature (prd_reference)
- ✅ MUST have: prd_reference with valid prd_id
- ✅ MUST NOT have: enhancement_context
- ✅ MUST have: requirements_addressed array matching PRD requirements (REQ-001, REQ-002, etc.)
- ✅ Query MongoDB prd_analysis by prd_id to validate PRD exists

### MODE 2: Enhancement (enhancement_context)
- ✅ MUST have: enhancement_context with type and reason (min 30 words)
- ✅ MUST NOT have: prd_reference
- ✅ MUST have ONE of: reference_rfc_id OR reference_epic_id OR reference_prd_requirement
- ✅ enhancement_context.type must be one of: feature_enhancement, refactoring, optimization, bugfix, technical_debt
- ✅ If reference_rfc_id provided: validate RFC exists in rfc_analysis collection
- ✅ If reference_epic_id provided: validate epic exists in epics collection
- ✅ If reference_prd_requirement provided: validate requirement exists in some prd_analysis

**Validation Error Handling:**
- If neither prd_reference nor enhancement_context: FAIL validation
- If both prd_reference AND enhancement_context: FAIL validation (mutually exclusive)
- If enhancement_context but missing type or reason: FAIL validation
- If enhancement_context but no valid references: FAIL validation

## STEP 3: LINK TO PRD

If PRD exists in MongoDB:
1. Query `prd_analysis` collection by prd_id
2. Validate requirements_addressed match PRD requirements (REQ-001, REQ-002, etc.)
3. Cross-reference PRD sections in rfc.problem_analysis
4. Validate that solution addresses the requirements

If PRD doesn't exist:
- Flag missing PRD as a risk
- Document in open_questions

## STEP 4: EXTRACT AND SAVE API CONTRACTS

For each api_contract in the RFC:

**Validation:**
1. Check against @templates/schemas/api-contract.schema.json
2. Verify error_responses follow RFC 7807 format with validationErrors array
3. Check authentication type is one of: Bearer, Basic, ApiKey, OAuth2, OpenID, None
4. Validate rate_limiting has requests, window, and tier

**Uniqueness Check:**
1. Query `api_contracts` collection for existing endpoint + method combination
2. If EXISTS:
   - Get the existing `_id` (api_contract_id)
   - Use that reference in RFC (do NOT re-save)
   - Log: "Using existing api_contract_id: [id]"
3. If NEW:
   - Generate new api_contract_id (if not provided)
   - Save full contract to `api_contracts` collection with:
     - All fields from api-contract.schema.json
     - timestamps: created_at, updated_at (ISO 8601)
     - rfc_id: Link back to source RFC
     - prd_requirement: If available
   - Get returned `_id` from MongoDB insert
   - Use that as api_contract_id in RFC reference

**API Contract Storage:**

For full contract schema details, refer to: `@templates/schemas/api-contract.schema.json`

Each contract saved to `api_contracts` collection includes:
- All fields from api-contract.schema.json
- Additional fields: rfc_id, prd_requirement, created_at, updated_at (ISO 8601)

**RFC stores only references:**
```
api_contracts (in rfc_analysis):
  - endpoint: /api/v1/users
  - method: POST
  - api_contract_id: [reference to api_contracts collection]
  - purpose: [brief description]
  - prd_requirement: REQ-001
```

## STEP 5: OUTPUT AND SAVE

Output the structured RFC JSON and save to MongoDB:

**MongoDB Collection: `rfc_analysis`**
```
{
  "rfc_id": "RFC-001",
  "metadata": { ... },
  "prd_reference": { ... },
  "status": "draft/in_review/approved/implemented",
  ... (complete schema)
}
```

**Instructions:**
1. Pretty-print the validated JSON
2. Use MongoDB insert-many to save
3. Add timestamps: created_at, updated_at
4. Set initial status based on validation results
5. If validation errors exist, save with status="draft" and document issues in open_questions

## CRITICAL RULES:

1. **RFC Mode Validation - MUST BE ONE OF:**
   - MODE 1: New Feature with `prd_reference` (has prd_id)
   - MODE 2: Enhancement with `enhancement_context` (has type, reason, reference)
   - MUST NOT be both or neither

2. **MODE 1 (New Feature) Rules:**
   - ✅ MUST have: prd_reference with valid prd_id
   - ✅ MUST have: requirements_addressed array matching PRD requirement IDs (REQ-001, REQ-002, etc.)
   - ✅ MUST NOT have: enhancement_context
   - ✅ Validate PRD exists in prd_analysis collection

3. **MODE 2 (Enhancement) Rules:**
   - ✅ MUST have: enhancement_context with type (feature_enhancement, refactoring, optimization, bugfix, technical_debt)
   - ✅ MUST have: reason field with minimum 30 words
   - ✅ MUST have ONE of: reference_rfc_id, reference_epic_id, or reference_prd_requirement
   - ✅ MUST NOT have: prd_reference
   - ✅ Validate references exist in their respective collections

4. **API Contracts - Single Source of Truth:**
   - Each contract MUST be saved to `api_contracts` collection
   - Endpoint + Method combination MUST be unique (check before saving)
   - RFC ONLY stores references: endpoint, method, api_contract_id, purpose
   - All contract details (authentication, error_responses, rate_limiting) go to api_contracts
   - This enables: API docs generation, contract reuse across RFCs, change tracking

5. **API Contract Storage Rules:**
   - Save with all fields from api-contract.schema.json
   - Include rfc_id link back to source RFC
   - Include prd_requirement reference if applicable
   - Set timestamps: created_at, updated_at (ISO 8601)
   - For duplicates: query existing by endpoint+method, reuse api_contract_id

6. **Architecture components must be clearly described**

7. **Implementation phases must have realistic scope**

8. **Performance targets must be measurable and justified**

9. **All open_questions must be recorded for resolution tracking**

10. **Output ONLY valid JSON matching rfc.schema.json**
   - api_contracts in RFC should only have: endpoint, method, api_contract_id, purpose, prd_requirement
   - Full contracts stored separately in api_contracts collection
   - For MODE 1: Include prd_reference
   - For MODE 2: Include enhancement_context

11. **Save RFC to MongoDB rfc_analysis collection with unique rfc_id**

12. **API Contract Workflow:**
    - Extract contracts from RFC
    - Validate against api-contract.schema.json
    - Check for duplicates: SELECT * FROM api_contracts WHERE endpoint = X AND method = Y
    - If exists: use existing api_contract_id
    - If new: INSERT into api_contracts, get _id, use as api_contract_id
    - Store reference in RFC

## STEP 6: API DOCUMENTATION GENERATION ENABLEMENT

By saving all API contracts to the `api_contracts` collection, you enable:

1. **Automatic API Documentation Generation:**
   ```
   Query: db.api_contracts.find({ rfc_id: "RFC-001" })
   Output: Complete API specs ready for OpenAPI/Swagger generation
   ```

2. **Contract Reusability:**
   - Same endpoint across multiple RFCs? Query by endpoint+method
   - Reuse contract definition (avoid duplication)
   - Track which RFCs use the same endpoint

3. **API Versioning:**
   - Create v2 of existing endpoint
   - Link to rfc_id that introduced it
   - Generate migration docs

4. **Change Tracking:**
   - Compare contract versions
   - See which RFC changed the API
   - Identify breaking changes

## OUTPUT FORMAT:

```json
{
  "validation_result": "success|warning|error",
  "rfc_id": "RFC-001",
  "prd_linked": true,
  "prd_id": "prd-id-001",
  "requirements_count": 3,
  "api_contracts_saved": 5,
  "api_contracts_reused": 2,
  "architecture_components": 4,
  "issues": []
}
```

**Summary:**
- X API contracts saved to api_contracts collection
- Y API contracts reused (already existed)
- Complete RFC JSON saved to rfc_analysis collection with references to api_contract_ids
