# Epic Schema: Before & After Comparison

## BEFORE (BROKEN) ❌

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Epic Schema",
  "description": "Comprehensive schema for Product Epics with business context, scope, team assignments, and progress tracking",
  "type": "object",
  "required": ["prd_id", "title", "description", "priority", "status", "business_context", "scope", "team", "timestamps"],
  
  "properties": {
    "prd_id": {
      "type": "string",
      "description": "Reference to the parent PRD document",
      "minLength": 1,
      "maxLength": 100
    },
    "title": { ... },
    "description": { ... },
    "priority": { ... },
    "status": { ... },
    ...
  }
}
```

### Problems with BEFORE:
- ❌ `prd_id` required at root level
- ❌ No `epic_id` field (no unique identifier)
- ❌ No support for RFC-only mode
- ❌ Cannot distinguish Mode 1 (PRD) from Mode 2 (RFC)
- ❌ No `rfc_reference` field
- ❌ No `enhancement_context` field
- ❌ rfc-to-epics.md command broken (produces invalid documents)
- ❌ prd-rfc-to-epics.md command incomplete

---

## AFTER (FIXED) ✅

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Epic Schema",
  "description": "Comprehensive schema for Product Epics supporting both PRD-linked (Mode 1) and RFC-only (Mode 2) enhancement workflows",
  "type": "object",
  "required": ["epic_id", "title", "description", "priority", "status", "business_context", "scope", "team", "timestamps"],
  
  "oneOf": [
    {
      "required": ["prd_reference"],
      "not": {
        "required": ["rfc_reference", "enhancement_context"]
      }
    },
    {
      "required": ["rfc_reference", "enhancement_context"],
      "not": {
        "required": ["prd_reference"]
      }
    }
  ],
  
  "properties": {
    "epic_id": {
      "type": "string",
      "pattern": "^epic-[a-z0-9-]+$",
      "description": "Unique epic identifier (e.g., epic-001, epic-user-auth, epic-RFC-RFC-001-1)"
    },
    
    "prd_reference": {
      "type": "object",
      "description": "Reference to parent PRD (Mode 1: PRD-linked epics). Mutually exclusive with rfc_reference.",
      "required": ["prd_id", "requirements_addressed"],
      "properties": {
        "prd_id": {
          "type": "string",
          "pattern": "^prd-[a-z0-9-]+$",
          "description": "Reference to the parent PRD document"
        },
        "requirements_addressed": {
          "type": "array",
          "description": "PRD requirements (REQ-###) that this epic addresses",
          "items": {
            "type": "string",
            "pattern": "^REQ-\\d+$"
          },
          "minItems": 1
        }
      }
    },
    
    "rfc_reference": {
      "type": "object",
      "description": "Reference to parent RFC (Mode 2: RFC-only enhancement epics). Mutually exclusive with prd_reference.",
      "required": ["rfc_id"],
      "properties": {
        "rfc_id": {
          "type": "string",
          "pattern": "^RFC-\\d+$",
          "description": "Reference to the parent RFC document"
        },
        "sections": {
          "type": "array",
          "description": "RFC sections (e.g., '4.2', '5.1') that this epic implements",
          "items": {
            "type": "string",
            "pattern": "^\\d+(\\.\\d+)*$"
          }
        },
        "architecture_components": {
          "type": "array",
          "description": "Architecture components from RFC that this epic covers",
          "items": { "type": "string" }
        },
        "implementation_phase": {
          "type": "string",
          "description": "RFC implementation phase (e.g., 'Phase 1: Foundation')"
        },
        "enhancement_type": {
          "type": "string",
          "enum": ["feature_enhancement", "refactoring", "optimization", "bugfix", "technical_debt"],
          "description": "Type of enhancement from RFC"
        },
        "scope": {
          "type": "string",
          "enum": ["partial", "complete", "comprehensive"],
          "description": "Scope of the RFC enhancement"
        },
        "backward_compatible": {
          "type": "boolean",
          "description": "Whether this enhancement maintains backward compatibility"
        }
      }
    },
    
    "enhancement_context": {
      "type": "object",
      "description": "Enhancement context details (Mode 2 only: RFC-only enhancements without PRD)",
      "required": ["type", "reason"],
      "properties": {
        "type": {
          "type": "string",
          "enum": ["feature_enhancement", "refactoring", "optimization", "bugfix", "technical_debt"],
          "description": "Type of enhancement"
        },
        "reason": {
          "type": "string",
          "minLength": 30,
          "description": "Business or technical justification (minimum 30 words)"
        },
        "current_state": { "type": "string" },
        "desired_state": { "type": "string" },
        "scope": { "enum": ["partial", "complete", "comprehensive"] },
        "impact_analysis": { "type": "string" },
        "backward_compatibility": { "type": "string" },
        "migration_path": { "type": "string" }
      }
    },
    
    "title": { ... },
    "description": { ... },
    "priority": { ... },
    "status": { ... },
    
    "scope": {
      "type": "object",
      "description": "Epic scope definition and relationships",
      "required": ["features_included"],
      "properties": {
        "related_prd_sections": {
          "type": "array",
          "description": "Section numbers from parent PRD - used for Mode 1 PRD-linked epics",
          "items": {
            "type": "string",
            "pattern": "^\\d+(\\.\\d+)*$"
          }
        },
        "related_rfc_sections": {
          "type": "array",
          "description": "RFC section references - used for Mode 2 RFC-only epics",
          "items": {
            "type": "string",
            "pattern": "^\\d+(\\.\\d+)*$"
          }
        },
        "features_included": { ... },
        "keywords": { ... },
        "dependencies": { ... },
        "constraints": { ... }
      }
    },
    
    "business_context": { ... },
    "team": { ... },
    "timeline": { ... },
    "progress": { ... },
    "timestamps": { ... }
  }
}
```

### Improvements in AFTER:
- ✅ `epic_id` required at root level (unique identifier)
- ✅ `oneOf` validation enforces Mode 1 OR Mode 2
- ✅ `prd_reference` object (Mode 1 PRD-linked epics)
- ✅ `rfc_reference` object (Mode 2 RFC-only epics)
- ✅ `enhancement_context` object (Mode 2 details)
- ✅ `related_rfc_sections` complements `related_prd_sections`
- ✅ Pattern validation for epic_id, prd_id, rfc_id
- ✅ Mutually exclusive modes enforced
- ✅ rfc-to-epics.md now produces valid documents
- ✅ prd-rfc-to-epics.md now fully functional

---

## Line-by-Line Changes

### Line 3-4: Updated Description
**Before**: "Comprehensive schema for Product Epics with business context..."
**After**: "Comprehensive schema for Product Epics supporting both PRD-linked (Mode 1) and RFC-only (Mode 2) enhancement workflows"

**Reason**: Clarifies dual-mode support

---

### Line 6: Updated Required Array
**Before**: `"required": ["prd_id", "title", "description", ...]`
**After**: `"required": ["epic_id", "title", "description", ...]`

**Reason**: epic_id now unique identifier instead of prd_id

---

### Lines 7-20: Added oneOf Validation
**Before**: None (no dual-mode support)
**After**: 
```json
"oneOf": [
  {
    "required": ["prd_reference"],
    "not": { "required": ["rfc_reference", "enhancement_context"] }
  },
  {
    "required": ["rfc_reference", "enhancement_context"],
    "not": { "required": ["prd_reference"] }
  }
]
```

**Reason**: Enforces exactly one mode per epic

---

### Lines 22-26: Added epic_id Field
**Before**: None
**After**: 
```json
"epic_id": {
  "type": "string",
  "pattern": "^epic-[a-z0-9-]+$",
  "description": "Unique epic identifier..."
}
```

**Reason**: Every epic needs unique identifier with pattern validation

---

### Lines 27-47: Created prd_reference Object
**Before**: Flat prd_id field
**After**: Structured prd_reference with prd_id + requirements_addressed

**Reason**: Organizes Mode 1 data, enforces requirement mapping

---

### Lines 48-92: Added rfc_reference Object (NEW)
**Before**: None
**After**: Complete RFC reference structure for Mode 2

**Reason**: Enables RFC-only enhancement mode

---

### Lines 93-134: Added enhancement_context Object (NEW)
**Before**: None
**After**: Enhancement details for Mode 2 epics

**Reason**: Captures why and how enhancement improves system

---

### Lines 208-215: Added related_rfc_sections
**Before**: Only related_prd_sections existed
**After**: Added related_rfc_sections to scope

**Reason**: Mode 2 epics need RFC section references

---

## Field Summary

| Field | Old | New | Mode | Purpose |
|-------|-----|-----|------|---------|
| epic_id | ❌ | ✅ | Both | Unique identifier |
| prd_id | ✅ Root | ✅ In prd_reference | Mode 1 | PRD reference |
| prd_reference | ❌ | ✅ | Mode 1 | Organize PRD data |
| rfc_reference | ❌ | ✅ | Mode 2 | RFC reference |
| enhancement_context | ❌ | ✅ | Mode 2 | Enhancement details |
| related_prd_sections | ✅ | ✅ Same | Mode 1 | PRD section links |
| related_rfc_sections | ❌ | ✅ | Mode 2 | RFC section links |

---

## Schema Validation Rules

### BEFORE (Single Mode - PRD Only)
- prd_id must be present
- No way to create RFC-only epics
- No dual-mode support

### AFTER (Dual Mode - PRD or RFC)
- **Mode 1 Branch**: MUST have prd_reference AND NOT have rfc_reference
- **Mode 2 Branch**: MUST have rfc_reference AND enhancement_context AND NOT have prd_reference
- oneOf ensures exactly one mode per epic
- epic_id required in both modes

---

## Migration Example (If Needed)

For existing PRD-linked epics, convert from old to new schema:

```javascript
// MongoDB migration (if you had existing data)
db.epics.updateMany(
  { prd_id: { $exists: true }, rfc_reference: { $exists: false } },
  [
    {
      $set: {
        epic_id: { $concat: ["epic-", { $toLower: { $substr: ["$_id", 0, 8] } }] },
        prd_reference: {
          prd_id: "$prd_id",
          requirements_addressed: "$requirements_addressed"
        }
      }
    },
    { $unset: ["prd_id"] }
  ]
)
```

But if this is a new project with no existing data, **no migration needed**.

---

## Compatibility Note

⚠️ **Breaking Change**: Old epic format with `prd_id` at root won't validate.

✅ **No Migration Impact**: If you have no existing epics in MongoDB.

✅ **New Epics**: All newly generated epics will use correct schema.

✅ **Data Migration**: Simple MongoDB update if needed (see Migration Example above).
