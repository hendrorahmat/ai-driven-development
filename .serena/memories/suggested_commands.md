# Suggested Commands for Development

## Docker Commands
```bash
# Start services (MongoDB + Mongo Express)
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f mongo

# Access MongoDB shell
docker exec -it ai-driven-development-mongo-1 mongosh -u root -p example
```

## Project Commands
### Custom CLI Commands (via Claude Code)
```bash
/prd-analyze [input_file]          # Analyze PRD documents
/prd-to-epics [prd_id]             # Break down PRD into epics
/epic-to-tasks [epic_id]           # Break down epics into tasks
/prd-to-mongo [input_file]         # Load PRD data into MongoDB
```

## Git Commands (when repo is initialized)
```bash
git status          # Check current status
git add .          # Stage changes
git commit -m ""   # Create commit
git branch         # List branches
git checkout -b    # Create feature branch
```

## File System Commands
```bash
ls -la             # List files (including hidden)
find . -type f     # Find all files
grep -r pattern    # Search for pattern
```

## Development Workflow
1. Start services: `docker-compose up -d`
2. Access Mongo Express: http://localhost:8081 (admin/admin123)
3. Use Claude Code with `/sc:` commands for AI-driven development
4. Load PRDs into MongoDB for structured data management
