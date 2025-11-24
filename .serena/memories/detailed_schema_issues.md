# Detailed Schema & Template Issues with Examples

## 1. EPIC SCHEMA - CRITICAL ISSUE

### File: templates/schemas/epic.schema.json

**Current Problem**:
```json
{
  "required": ["prd_id", "title", "description", "priority", "status", "business_context", "scope", "team", "timestamps"],
  "properties": {
    "prd_id": { ... }
  }
}
```

**Why It Breaks**:
- Command `rfc-to-epics.md` creates epics from RFC Mode 2 (enhancement, no PRD)
- Schema requires `prd_id` to be present
- Result: Generated epics don't match schema → validation fails

**Expected Output from rfc-to-epics (Mode 2)**:
```json
{
  "epic_id": "epic-RFC-RFC-001-1",      // ← NOT IN CURRENT SCHEMA
  "rfc_reference": {                     // ← NOT IN CURRENT SCHEMA
    "rfc_id": "RFC-001",
    "sections": ["4.2", "5.1"],
    "enhancement_type": "feature_enhancement",
    "scope": "complete"
  },
  "enhancement_context": {               // ← NOT IN CURRENT SCHEMA
    "type": "feature_enhancement",
    "reason": "To improve user onboarding...",
    "current_state": "Basic login flow",
    "desired_state": "Enhanced with SSO",
    "scope": "complete"
  },
  "title": "Implement Single Sign-On (SSO) Integration",
  "description": "Enable users to authenticate using their corporate SSO...",
  "priority": "high",
  "status": "draft",
  "business_context": { ... },
  "scope": { ... },
  "timestamps": { ... }
  // NO prd_id!
}
```

**What Schema Should Be**:
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Epic Schema",
  "type": "object",
  "required": ["epic_id", "title", "description", "priority", "status", "business_context", "scope", "timestamps"],
  
  "oneOf": [
    {
      "required": ["prd_reference"],
      "not": { "required": ["rfc_reference", "enhancement_context"] },
      "properties": {
        "prd_reference": {
          "type": "object",
          "required": ["prd_id", "requirements_addressed"],
          "properties": {
            "prd_id": { "type": "string" },
            "requirements_addressed": { "type": "array", "items": { "type": "string", "pattern": "^REQ-\\d+$" } }
          }
        }
      }
    },
    {
      "required": ["rfc_reference", "enhancement_context"],
      "not": { "required": ["prd_reference"] },
      "properties": {
        "rfc_reference": {
          "type": "object",
          "required": ["rfc_id"],
          "properties": {
            "rfc_id": { "type": "string", "pattern": "^RFC-\\d+$" },
            "sections": { "type": "array", "items": { "type": "string" } },
            "architecture_components": { "type": "array", "items": { "type": "string" } },
            "implementation_phase": { "type": "string" },
            "enhancement_type": { "enum": ["feature_enhancement", "refactoring", "optimization", "bugfix", "technical_debt"] },
            "scope": { "enum": ["partial", "complete", "comprehensive"] },
            "backward_compatible": { "type": "boolean" }
          }
        },
        "enhancement_context": {
          "type": "object",
          "required": ["type", "reason"],
          "properties": {
            "type": { "enum": ["feature_enhancement", "refactoring", "optimization", "bugfix", "technical_debt"] },
            "reason": { "type": "string", "minLength": 30 },
            "current_state": { "type": "string" },
            "desired_state": { "type": "string" },
            "scope": { "enum": ["partial", "complete", "comprehensive"] },
            "impact_analysis": { "type": "string" },
            "backward_compatibility": { "type": "string" },
            "migration_path": { "type": "string" }
          }
        }
      }
    }
  ],
  
  "properties": {
    "epic_id": {
      "type": "string",
      "pattern": "^epic-[a-z0-9-]+$",
      "description": "Unique epic identifier (e.g., epic-001 or epic-RFC-RFC-001-1)"
    },
    "title": { ... },
    "description": { ... },
    "priority": { ... },
    "status": { ... },
    "business_context": { ... },
    "scope": { ... },
    "timestamps": { ... }
  }
}
```

---

## 2. PRD SCHEMA - MISSING FIELDS

### File: templates/schemas/prd.schema.json

**Missing Field #1: prd_id**
```json
// MISSING - should be in schema:
{
  "prd_id": {
    "type": "string",
    "pattern": "^prd-[a-z0-9-]+$",
    "description": "Unique PRD identifier (e.g., prd-user-auth, prd-dashboard-v2)"
  }
}
```

**Why**: Commands need to reference PRDs by ID. Current schema has no unique identifier.

**Missing Field #2: rfc_references**
```json
// MISSING - should be in schema:
{
  "rfc_references": {
    "type": "array",
    "description": "RFCs that implement this PRD",
    "items": {
      "type": "object",
      "properties": {
        "rfc_id": { "type": "string", "pattern": "^RFC-\\d+$" },
        "mode": { "enum": ["mode_1_new_feature", "mode_2_enhancement"] },
        "status": { "type": "string" }
      }
    }
  }
}
```

**Why**: Need to track which RFCs implement this PRD (for traceability, impact analysis)

---

## 3. PRD TEMPLATE - FORMAT MISMATCHES

### File: templates/prd.md

**Issue #1: Date Format**

Current Template:
```markdown
| **Date Created** | [YYYY-MM-DD] |
| **Last Updated** | [YYYY-MM-DD] |
```

Schema Expects:
```json
{
  "created_at": "2025-01-15T14:30:00Z",  // ISO 8601
  "updated_at": "2025-01-15T14:30:00Z"
}
```

**Fix**: Update template to show ISO 8601 format:
```markdown
| **Created** | [YYYY-MM-DDTHH:MM:SSZ] (e.g., 2025-01-15T14:30:00Z) |
| **Updated** | [YYYY-MM-DDTHH:MM:SSZ] (e.g., 2025-01-15T14:30:00Z) |
```

---

**Issue #2: Missing PRD ID**

Current Template:
```markdown
| Field | Value |
|-------|-------|
| **Name** | [Product/Feature Name] |
| **Version** | [Semantic Version: x.y.z] |
...
```

Missing:
```markdown
| **PRD ID** | [prd-001 or prd-feature-name] |
```

**Why**: No way to reference PRD in commands

---

**Issue #3: Requirement Format Not Shown**

Current Template Section 8:
```markdown
## 8. Acceptance Criteria

For each functional requirement:
- [Criterion 1]
- [Criterion 2]
```

Should Show:
```markdown
## 8. Functional Requirements

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-001 | Users must be able to register with email | Acceptance criteria... |
| REQ-002 | Users must be able to login with email/password | Acceptance criteria... |
| REQ-003 | Passwords must meet security requirements | Acceptance criteria... |
```

---

**Issue #4: No RFC Linkage Section**

Missing Section:
```markdown
## 20. Related RFCs (Implementation)

| RFC ID | Mode | Status | Purpose |
|--------|------|--------|---------|
| RFC-001 | Mode 1: New Feature | Draft | Implements REQ-001, REQ-002 |
| RFC-002 | Mode 1: New Feature | Approved | Implements REQ-003 |
```

**Why**: Need to track which RFCs implement this PRD

---

## 4. RFC TEMPLATE - ENHANCEMENT MODE EXAMPLE MISSING

### File: templates/rfc.md

**Current**: Section 1 "Context Reference" shows both options but no example

**Should Add**:

Add before "---" separator in section 1:

```markdown
**Example Mode 2 Completion**:

For an enhancement RFC:
- **Enhancement Type:** refactoring
- **Reason:** Current authentication system uses custom JWT implementation which is difficult to maintain and has security concerns. By migrating to industry-standard OAuth2, we reduce maintenance burden by 40% and improve security posture. This aligns with our SOC2 compliance goals.
- **Scope:** partial (only affects auth service, not user management)
- **Backward Compatible:** no
- **Migration Path:** Existing JWT tokens remain valid for 30 days during transition period. New clients automatically use OAuth2. Legacy clients can continue with JWT until sunset date.
```

---

## 5. TIMESTAMPS - INCONSISTENCY ACROSS SCHEMAS

### Problem: Different timestamp field names

**In prd.schema.json**:
```json
"created_at": { "format": "date-time" },
"updated_at": { "format": "date-time" }
```

**In epic.schema.json**:
```json
"timestamps": {
  "properties": {
    "created_at": { ... },
    "updated_at": { ... }
  }
}
```

**In task.schema.json**:
```json
"created_at": { "format": "date-time" },
"updated_at": { "format": "date-time" }
```

**Inconsistency**: 
- PRD and Task: flat structure `created_at`, `updated_at`
- Epic: nested under `timestamps` object

**Recommendation**: Standardize to flat structure in all schemas (PRD, RFC, Epic, Task):
```json
"created_at": { "type": "string", "format": "date-time" },
"updated_at": { "type": "string", "format": "date-time" },
"approved_at": { "type": "string", "format": "date-time" }
```

---

## 6. STATUS ENUM INCONSISTENCIES

### Different status values across schemas

**PRD Schema**:
```json
"status": { "enum": ["draft", "in_review", "approved", "active", "archived"] }
```

**RFC Schema**:
```json
"status": { "enum": ["draft", "in_review", "approved", "implemented", "archived"] }
```

**Epic Schema**:
```json
"status": { "enum": ["planning", "in_progress", "blocked", "completed", "deprecated"] }
```

**Problem**: Inconsistent terminology
- PRD uses "active", RFC uses "implemented", Epic uses "completed"
- Makes tracking confusing

**Recommendation**: Standardize across all:
```json
// Unified status enum
"status": { "enum": ["draft", "in_review", "approved", "in_progress", "completed", "archived"] }
```

Mapping:
- Draft = draft (initial)
- In Review = in_review (feedback)
- Approved = approved (decision made)
- In Progress = in_progress (active work)
- Completed = completed (done)
- Archived = archived (obsolete)

---

## 7. COMMAND-SPECIFIC SCHEMA GAPS

### Commands Expect Fields Not in Schema

**Issue in epic-to-tasks.md line 38-39**:
```
For frontend tasks, always include ui_requirements
```

**But task.schema.json doesn't have ui_requirements field!**

Should be:
```json
{
  "ui_requirements": {
    "type": "string",
    "description": "UI mockups, design specs, accessibility requirements, etc.",
    "minLength": 50
  }
}
```

---

**Issue in epic-to-tasks.md line 11**:
```
All tasks include functional_requirements
```

**But task.schema.json doesn't clearly show functional_requirements!**

Should have:
```json
{
  "functional_requirements": {
    "type": "array",
    "description": "What the task must accomplish",
    "items": { "type": "string", "minLength": 20 }
  }
}
```

---

## 8. UNIQUE ID PATTERNS MISSING

### Current State
- ✅ RFC: pattern `^RFC-\d+$` (e.g., RFC-001)
- ✅ Requirements: pattern `^REQ-\d+$` (e.g., REQ-001)
- ❌ PRD: no prd_id pattern
- ❌ Epic: no epic_id pattern
- ✅ Task: pattern `^[A-Z]+-[0-9]+$` (e.g., TASK-001)

### Recommended Patterns

**PRD ID**:
```
prd-[a-z0-9-]+
Examples:
- prd-001
- prd-user-authentication
- prd-payment-integration-v2
```

**Epic ID**:
```
epic-[a-z0-9-]+
Examples:
- epic-001
- epic-auth-system
- epic-RFC-RFC-001-1
- epic-RFC-RFC-001-2
```

---

## SUMMARY: What Needs Fixing

| Issue | File(s) | Type | Effort | Blocking |
|-------|---------|------|--------|----------|
| Epic schema dual-mode | epic.schema.json | Schema | 30 min | YES |
| Add epic_id pattern | epic.schema.json | Schema | 5 min | YES |
| Add prd_id pattern | prd.schema.json | Schema | 5 min | NO |
| Add rfc_references | prd.schema.json | Schema | 10 min | NO |
| Standardize timestamps | All schemas | Schema | 20 min | NO |
| Standardize status enum | All schemas | Schema | 15 min | NO |
| Add ui_requirements to task | task.schema.json | Schema | 5 min | NO |
| PRD template format | prd.md | Template | 30 min | NO |
| RFC template example | rfc.md | Template | 15 min | NO |
| Date format in PRD | prd.md | Template | 5 min | NO |

**Total Blocking Issues**: 35 minutes  
**Total All Issues**: ~2 hours
