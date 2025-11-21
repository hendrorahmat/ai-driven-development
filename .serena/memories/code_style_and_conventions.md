# Code Style & Conventions

## Language & Framework
- **Primary Language**: TypeScript
- **Focus**: Structured data, templates, and CLI commands
- **No main application code yet** - Project is in template/infrastructure phase

## File Organization
- `templates/`: Reusable document templates (Markdown + JSON schemas)
- `docs/`: Documentation and examples
- `docker/`: Infrastructure configuration
- `.claude/`: Claude-specific configuration and commands

## Naming Conventions
- **Files**: kebab-case for Markdown and config files (prd.md, epic-to-tasks.md)
- **Directories**: lowercase with hyphens (prd, mongodb)
- **JSON Files**: Descriptive names matching their schema purpose

## JSON Schemas
Schemas defined in `templates/schemas/`:
- `prd.schema.json` - Product Requirements Document structure
- `epic.schema.json` - Epic breakdown structure  
- `task.schema.json` - Individual task definition
- `implementation.schema.json` - Implementation plan details
- `api-contract.schema.json` - API specification
- `prd-task-breakdown.schema.json` - PRD to task breakdown mapping

## Documentation Standards
- Use Markdown for all documentation
- Follow template format in `templates/prd.md`
- Include Document Information (name, version, date, author)
- Structured sections with clear hierarchy

## No Current Code Style Rules for Application Code
Application code style will be defined when TypeScript application development begins.
