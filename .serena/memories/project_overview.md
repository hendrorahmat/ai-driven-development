# AI-Driven Development Project Overview

## Project Purpose
A framework and toolkit for AI-driven software development that enables AI collaboration throughout the software lifecycle:
- Requirements analysis and PRD generation
- Architecture design
- Code generation
- Testing and validation
- Documentation
- Continuous improvement

Goal: Build applications faster, smarter, and more resilient by leveraging AI as a collaborator.

## Tech Stack
- **Language**: TypeScript
- **Containerization**: Docker (MongoDB 8.0.14 + Mongo Express)
- **Configuration**: MCP servers (Sequential Thinking, MongoDB MCP)
- **IDE**: JetBrains (IntelliJ IDEA)

## Project Structure
```
ai-driven-development/
├── docker/                 # Docker configuration
│   └── mongodb/           # MongoDB initialization
├── docs/                  # Documentation
│   └── prds/              # Product Requirements Documents
├── templates/             # Reusable templates
│   ├── prd.md            # PRD template
│   └── schemas/          # JSON schemas for structured data
├── .claude/              # Claude Code configuration
│   └── commands/         # Custom slash commands
├── .serena/              # Serena project configuration
├── .idea/                # JetBrains IDE configuration
├── docker-compose.yml    # Docker services definition
├── .mcp.json            # MCP server configuration
└── CLAUDE.md            # Project vision/goals document
```

## Key Files and Their Purpose
- `CLAUDE.md`: Project vision and goals for AI-Driven Development
- `docker-compose.yml`: MongoDB and Mongo Express services
- `.mcp.json`: MCP server definitions (Sequential Thinking, MongoDB)
- `templates/`: Reusable document and schema templates
- `docs/prds/`: Sample PRDs and documentation
