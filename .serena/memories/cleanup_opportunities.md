# Cleanup Opportunities Identified

## IntelliJ IDEA Cache Files (.idea/)
Location: `.idea/`

**Issues:**
- `.idea/copilot.data.migration.*.xml` - Multiple migration files (ask2agent, edit, ask, agent) suggest incomplete migration cleanup
- `.idea/workspace.xml` - IDE workspace state (should be ignored)
- `.idea/modules.xml` - IDE module configuration
- `.idea/php.xml` - IDE PHP configuration (project is TypeScript, not PHP)
- `.idea/.gitignore` - Duplicate ignore file
- `.idea/ai-driven-development.iml` - IDE project file

**Action**: Should be in `.gitignore`, not committed to repo. These are IDE-specific and will vary per developer environment.

## Docker/MongoDB Configuration
Location: `docker/`, `docker-compose.yml`

**Status**: ✅ Clean - Well organized, purposeful

## Configuration Files
Location: Root level

**Review**: `.mcp.json` - MCP server configuration is active and properly set up
- Sequential Thinking MCP
- MongoDB MCP with correct connection string

## CLI Commands
Location: `.claude/commands/`

**Files Present**:
- prd-analyze.md
- prd-to-epics.md
- epic-to-tasks.md
- prd-to-mongo.md

**Status**: ✅ Clean - Organized CLI commands for workflow

## Summary
Main cleanup opportunity: Remove IDE-specific `.idea/` directory files that shouldn't be in source control
