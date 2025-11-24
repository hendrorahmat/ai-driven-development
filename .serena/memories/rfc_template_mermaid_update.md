# RFC Template & Schema Mermaid Update

## Changes Made

### 1. RFC Template (@templates/rfc.md)

#### Architecture Design Section (4. Architecture Design)

**New Structure:**
- **Section 4.1 System Architecture** - Added Mermaid overview diagram
  - Shows: Client → Gateway → Auth → Services → Database/Cache/Queue → External Systems
  - Includes component table with Type, Purpose, Responsibility, Technology
  - Added component descriptions section

- **Section 4.2 Integration Points** - Added Mermaid integration diagram
  - Shows: Multiple systems integrating with main application
  - Integration details table now includes Protocol column
  - Integration types: REST_API, gRPC, Event_Stream, Database, File_Transfer, Webhook, Other

- **NEW Section 4.3 Data Flow Architecture** - Complete new section with Mermaid data flow diagram
  - Shows: Request → Parser → Validator → Auth → Service → Cache/Query → Response
  - Data flow description covering:
    - Request entry points
    - Data validation and transformation
    - Database queries and caching
    - Response formatting
    - Error handling

### 2. RFC Schema (@templates/schemas/rfc.schema.json)

#### Architecture Object Restructured

**Old Structure:**
```
architecture
  ├─ diagram_url (single URL)
  ├─ components (array)
  └─ integrations (array)
```

**New Structure:**
```
architecture
  ├─ overview_diagram (object)
  │   ├─ diagram_url (external PNG/SVG link)
  │   ├─ mermaid_code (diagram text code)
  │   └─ description
  ├─ components (array with minItems: 1)
  │   ├─ name (required, minLength: 1)
  │   ├─ type (required, enum: service/library/database/cache/queue/gateway/other)
  │   ├─ purpose
  │   ├─ responsibility
  │   └─ technology
  ├─ integrations (object - restructured)
  │   ├─ diagram (object with mermaid_code and diagram_url)
  │   └─ integration_points (array)
  │       ├─ system (required)
  │       ├─ integration_type (required, enum: REST_API/gRPC/Event_Stream/Database/File_Transfer/Webhook/Other)
  │       ├─ protocol (REST/gRPC/Kafka/RabbitMQ/etc.)
  │       ├─ impact (critical/high/medium/low)
  │       └─ notes
  └─ data_flow (object - NEW)
      ├─ diagram (object with mermaid_code and diagram_url)
      ├─ description (detailed flow explanation)
      └─ key_flows (array)
          ├─ flow_name (e.g., "Create User Flow")
          ├─ steps (array of step descriptions)
          └─ error_handling
```

## Mermaid Diagram Features

### Diagram Types Supported

1. **Overview Diagram (graph TB/LR)**
   - Vertical (TB) or Horizontal (LR) layout
   - Shows all major components and their relationships
   - Connection labels (HTTP/REST, Read/Write, Publish Events, etc.)

2. **Integration Diagram (graph LR/TB)**
   - Shows external system integrations
   - Connection types (REST API, Event Stream, Database queries)
   - Bidirectional flows

3. **Data Flow Diagram (graph TB)**
   - Linear processing flow
   - Shows: Request → Processing stages → Response
   - Includes decision points (Cache check, Miss)

## Key Schema Improvements

1. **Dual Format Support:**
   - diagram_url: For external PNG/SVG links
   - mermaid_code: For embedded diagram code (minLength: 50 chars)

2. **Enhanced Integration Details:**
   - Added integration_type enum with 7 specific types
   - Added protocol field for communication protocol
   - Added notes field for additional details

3. **New Data Flow Section:**
   - Comprehensive data flow documentation
   - Key flow scenarios with steps
   - Error handling per flow

4. **Validation Improvements:**
   - components: minItems = 1 (requires at least one component)
   - Component name: required and minLength = 1
   - Component type: required enum
   - Mermaid code: minLength = 50 for quality diagrams

## Example Mermaid Diagrams in Template

### Overview Diagram Example:
```
Client Application 
  → API Gateway 
    → Auth Service
    → Service 1 → Database
    → Service 2 → Message Queue
```

### Integration Diagram Example:
```
System 1 (API) → Our Application → External Service
System 2 (Event) → Our Application
```

### Data Flow Diagram Example:
```
User Request 
  → Request Parser 
  → Data Validator 
  → Authorization Check 
  → Business Logic
    → Cache Check → Database Query
  → Response Builder
```

## Files Updated

1. ✅ /templates/rfc.md - Added Mermaid diagrams and new data flow section
2. ✅ /templates/schemas/rfc.schema.json - Updated architecture object structure

## Validation Status

✅ RFC Schema JSON syntax validated and correct
✅ Template includes 3 ready-to-use Mermaid diagrams
✅ All enum values match schema validation rules
✅ Backward compatible with existing integration_type patterns

## Usage Notes

- Users can provide either external diagram URLs or inline Mermaid code
- Mermaid code must be at least 50 characters for validation
- Integration types are now strictly typed (7 enum values)
- Data flow section enables detailed flow documentation
- All diagrams are optional but recommended for comprehensive documentation
