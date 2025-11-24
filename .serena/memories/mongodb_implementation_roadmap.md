# MongoDB Implementation Roadmap for AI-Driven Development

## Current Status

✅ **Correct Decision Made**: MongoDB is the right database
✅ **Docker Setup**: Already configured and working
✅ **Version**: MongoDB 8.0.14 (latest stable)

---

## What's Already There

### Docker Compose Setup (GOOD)
```yaml
services:
  mongo:
    image: mongo:8.0.14              ✅ Latest stable
    ports: 27017:27017              ✅ Standard port
    authentication: enabled          ✅ Secure
    volumes: persistent              ✅ Data survives restarts
  
  mongo-express:                     ✅ UI for development
    management interface             ✅ http://localhost:8081
```

### Current Collections (PARTIAL)
```
✅ users   - Created
✅ tasks   - Created
❌ prd_analysis - Missing (need this)
❌ rfc_analysis - Missing (need this)
❌ epics - Missing (need this)
❌ api_contracts - Missing (need this)
```

---

## What You Need to Add

### Phase 1: Collections & Validation (1-2 hours)

**File to Update**: `docker/mongodb/init-mongo.js`

```javascript
// Current: Creates users, tasks, admin user

// ADD THESE:

// 1. PRD Analysis Collection
db.createCollection('prd_analysis', {
  validator: {
    $jsonSchema: {
      // Use content from templates/schemas/prd.schema.json
      type: "object",
      required: ["metadata", "business_value", "goals", "scope"],
      properties: {
        metadata: {
          required: ["name", "version", "description", "status"]
        }
        // ... rest from schema
      }
    }
  }
})

// 2. RFC Analysis Collection
db.createCollection('rfc_analysis', {
  validator: {
    $jsonSchema: {
      // Use content from templates/schemas/rfc.schema.json
      type: "object",
      required: ["metadata", "problem_analysis", "proposed_solution", "architecture"],
      oneOf: [
        { required: ["prd_reference"] },
        { required: ["enhancement_context"] }
      ]
    }
  }
})

// 3. Epics Collection
db.createCollection('epics', {
  validator: {
    $jsonSchema: {
      // Use content from templates/schemas/epic.schema.json (fixed version)
      type: "object",
      required: ["epic_id", "title", "description", "priority", "status"],
      oneOf: [
        { required: ["prd_reference"] },
        { required: ["rfc_reference", "enhancement_context"] }
      ]
    }
  }
})

// 4. API Contracts Collection
db.createCollection('api_contracts', {
  validator: {
    $jsonSchema: {
      // Use content from templates/schemas/api-contract.schema.json
      type: "object",
      required: ["endpoint", "method"]
    }
  }
})

// 5. Update Tasks Collection
db.createCollection('tasks', {
  validator: {
    $jsonSchema: {
      // Use content from templates/schemas/task.schema.json
      type: "object",
      required: ["id", "title", "description", "type", "acceptance_criteria"]
    }
  }
})
```

### Phase 2: Indexes (15 minutes)

Add to `docker/mongodb/init-mongo.js` after collections created:

```javascript
// PRD Indexes
db.prd_analysis.createIndex({ "metadata.prd_id": 1 }, { unique: true })
db.prd_analysis.createIndex({ "metadata.status": 1 })
db.prd_analysis.createIndex({ "metadata.labels": 1 })
db.prd_analysis.createIndex({ "metadata.created_at": -1 })

// RFC Indexes
db.rfc_analysis.createIndex({ "metadata.rfc_id": 1 }, { unique: true })
db.rfc_analysis.createIndex({ "prd_reference.prd_id": 1 })
db.rfc_analysis.createIndex({ "metadata.status": 1 })
db.rfc_analysis.createIndex({ "metadata.created_at": -1 })

// Epic Indexes
db.epics.createIndex({ "epic_id": 1 }, { unique: true })
db.epics.createIndex({ "prd_reference.prd_id": 1 })
db.epics.createIndex({ "rfc_reference.rfc_id": 1 })
db.epics.createIndex({ "priority": 1, "status": 1 })
db.epics.createIndex({ "metadata.created_at": -1 })

// API Contract Indexes
db.api_contracts.createIndex({ "endpoint": 1, "method": 1 }, { unique: true })
db.api_contracts.createIndex({ "rfc_id": 1 })

// Task Indexes
db.tasks.createIndex({ "id": 1 }, { unique: true })
db.tasks.createIndex({ "epic_id": 1 })
db.tasks.createIndex({ "type": 1, "status": 1 })
db.tasks.createIndex({ "prd_context.prd_requirement": 1 })
```

---

## Implementation Checklist

### Week 1: Foundation
- [ ] Create missing collections with schema validation
- [ ] Add performance indexes
- [ ] Test collection creation with docker-compose up
- [ ] Verify Mongo Express shows all 6 collections
- [ ] Verify schema validation works (try invalid document)

### Week 2: Operations
- [ ] Set up daily backup script
- [ ] Document common query patterns
- [ ] Create team guide for MongoDB usage
- [ ] Set up monitoring for database health
- [ ] Test backup and restore procedure

### Week 3: Integration
- [ ] Update prd-analyze command to use prd_analysis collection
- [ ] Update analyze-rfc command to use rfc_analysis collection
- [ ] Update prd-to-epics to use epics collection
- [ ] Update rfc-to-epics to use epics collection
- [ ] Update epic-to-tasks to use tasks collection

---

## Query Reference for Your Team

### Common Operations

**1. Get Complete PRD**
```javascript
db.prd_analysis.findOne({ "metadata.prd_id": "prd-001" })
```

**2. Get All RFCs for a PRD**
```javascript
db.rfc_analysis.find({ "prd_reference.prd_id": "prd-001" })
```

**3. Get All Epics for an RFC**
```javascript
db.epics.find({ "rfc_reference.rfc_id": "RFC-001" })
```

**4. Get All Tasks for an Epic**
```javascript
db.tasks.find({ "epic_id": "epic-001" })
```

**5. Get All API Contracts for an RFC**
```javascript
db.api_contracts.find({ "rfc_id": "RFC-001" })
```

**6. Find PRD by Status**
```javascript
db.prd_analysis.find({ "metadata.status": "approved" })
```

**7. Find RFC with all related data**
```javascript
db.rfc_analysis.aggregate([
  { $match: { "metadata.rfc_id": "RFC-001" } },
  { $lookup: {
      from: "prd_analysis",
      localField: "prd_reference.prd_id",
      foreignField: "metadata.prd_id",
      as: "prd"
    }
  },
  { $lookup: {
      from: "epics",
      localField: "metadata.rfc_id",
      foreignField: "rfc_reference.rfc_id",
      as: "epics"
    }
  }
])
```

**8. Get Epic with Requirements from PRD**
```javascript
db.epics.aggregate([
  { $match: { epic_id: "epic-001" } },
  { $lookup: {
      from: "prd_analysis",
      localField: "prd_reference.prd_id",
      foreignField: "metadata.prd_id",
      as: "prd_details"
    }
  },
  { $lookup: {
      from: "tasks",
      localField: "epic_id",
      foreignField: "epic_id",
      as: "tasks"
    }
  }
])
```

**9. Find Tasks of Specific Type**
```javascript
db.tasks.find({ type: "backend", status: "in_progress" })
```

**10. Find All Tasks for PRD Requirement**
```javascript
db.tasks.find({ "prd_context.prd_requirement": "REQ-001" })
```

---

## Backup & Recovery

### Backup Script

```bash
#!/bin/bash
# backup-mongodb.sh

BACKUP_DIR="/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="mongodb_backup_$DATE"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup MongoDB
docker exec ai-driven-development-mongo mongodump \
  --out "$BACKUP_DIR/$BACKUP_NAME" \
  -u root \
  -p example \
  --authenticationDatabase admin

# Compress backup
tar -czf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" -C "$BACKUP_DIR" "$BACKUP_NAME"

# Remove uncompressed backup
rm -rf "$BACKUP_DIR/$BACKUP_NAME"

# Keep only last 30 days
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_DIR/$BACKUP_NAME.tar.gz"
```

### Restore Script

```bash
#!/bin/bash
# restore-mongodb.sh

BACKUP_FILE=$1
BACKUP_DIR="/tmp/restore"

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: ./restore-mongodb.sh <backup_file>"
  exit 1
fi

# Extract backup
tar -xzf "$BACKUP_FILE" -C "$BACKUP_DIR"

# Restore to MongoDB
docker exec -i ai-driven-development-mongo mongorestore \
  --drop \
  "$BACKUP_DIR/$(basename $BACKUP_FILE .tar.gz)" \
  -u root \
  -p example \
  --authenticationDatabase admin

echo "Restore completed from: $BACKUP_FILE"
```

---

## Monitoring & Health Checks

### Database Health Check Script

```javascript
// check-db-health.js
const MongoClient = require('mongodb').MongoClient

async function checkHealth() {
  const client = new MongoClient('mongodb://root:example@localhost:27017')
  
  try {
    await client.connect()
    
    // Check collections exist
    const db = client.db('ai_driven_development')
    const collections = await db.listCollections().toArray()
    
    const expectedCollections = [
      'users', 'tasks', 'prd_analysis', 
      'rfc_analysis', 'epics', 'api_contracts'
    ]
    
    const actualCollections = collections.map(c => c.name)
    
    // Check document counts
    const docCounts = {}
    for (const collection of expectedCollections) {
      docCounts[collection] = await db.collection(collection).countDocuments()
    }
    
    console.log('Database Health Check:')
    console.log('Collections:', actualCollections)
    console.log('Document counts:', docCounts)
    
  } finally {
    await client.close()
  }
}

checkHealth()
```

---

## Performance Optimization

### Query Optimization Tips

1. **Always use indexes on frequently queried fields**
   ```
   - prd_id, rfc_id, epic_id
   - status, priority
   - Composite: (prd_id, status)
   ```

2. **Use projection to limit returned fields**
   ```javascript
   // Good: Only get fields you need
   db.prd_analysis.find({}, { "metadata": 1, "goals": 1 })
   
   // Bad: Get all fields
   db.prd_analysis.find({})
   ```

3. **Limit query results**
   ```javascript
   db.prd_analysis.find().limit(10)
   ```

4. **Use aggregation for complex queries**
   ```javascript
   // More efficient than multiple queries
   db.epics.aggregate([
     { $match: { status: "in_progress" } },
     { $group: { _id: "$priority", count: { $sum: 1 } } }
   ])
   ```

---

## Security Considerations

### Currently Implemented ✅
- Authentication enabled (root user)
- Custom password (not default)
- User with limited permissions created
- Isolated Docker network

### Recommended Additions
- [ ] TLS/SSL for MongoDB connections
- [ ] Separate read-only users for different teams
- [ ] Audit logging enabled
- [ ] Regular security updates (use latest MongoDB version)
- [ ] IP whitelisting (if exposed)

---

## Scaling Strategy (Future)

### Current Single Node
- Suitable for development and small production
- No replication
- No sharding
- Fits on one server

### When to Scale (If needed)
- Data > 100GB
- Queries per second > 10,000
- Team > 20 concurrent users

### Scaling Options
1. **Replica Set** (High availability)
   - 3-5 nodes
   - Automatic failover
   - Read replicas

2. **Sharding** (Horizontal scaling)
   - Partition data by shard key
   - Distribute across multiple servers
   - No downtime migration

3. **Managed MongoDB (Atlas)**
   - Automatic backups
   - Built-in replication
   - Multi-cloud deployment

---

## Timeline

**Immediate (This week)**:
- [ ] Review this roadmap
- [ ] Create missing collections
- [ ] Add indexes
- [ ] Test with docker-compose up

**Short term (Next 2 weeks)**:
- [ ] Integrate with commands
- [ ] Set up backups
- [ ] Document patterns

**Medium term (Month 1-2)**:
- [ ] Full integration testing
- [ ] Team training
- [ ] Performance monitoring
- [ ] Disaster recovery drill

**Long term (Ongoing)**:
- [ ] Monitor performance
- [ ] Regular backups
- [ ] Security updates
- [ ] Usage analytics

---

## Conclusion

✅ **Your database choice is optimal for the project.**

MongoDB is the right fit because:
- Document-based data structure
- Complex nested objects
- Array fields everywhere
- Evolving schemas
- Hierarchical queries
- JSON-native operations

No need to reconsider SQL or alternatives.

Focus on implementing the missing pieces (collections, indexes, backups) and you'll have a solid foundation for scaling as your project grows.
