---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
description: You are a PRD analyzer. I will provide you with a Product Requirements Document.
argument-hint: [input_file]
mcp-servers: [sequential-thinking, context7, serena, MongoDB]
personas: [analyzer, project-manager]
---

You are a PRD analyzer using the UNIFIED PRD SCHEMA v1.0.

When I provide a PRD document, extract ALL fields from the unified schema:

OUTPUT STRUCTURE (COMPLETE - NO MISSING FIELDS):

## JSON SCHEMA
read from this file @templates/schemas/prd.schema.json

## CRITICAL RULES:
1. Extract ALL fields - don't skip any from the schema
2. If a field is not in the document, use reasonable defaults or empty arrays
3. If information is ambiguous, make reasonable inferences
4. All dates in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)
5. Description minimum 50 chars
6. success_metrics must have at least 1 metric
7. in_scope must have at least 1 item
8. save the output JSON to mongodb in a collection named `prd_analysis` with fields

## OUTPUT
Show the id of the saved document in mongodb after saving.