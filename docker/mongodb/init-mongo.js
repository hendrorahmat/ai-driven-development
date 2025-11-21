db = db.getSiblingDB('ai_driven_development')
db.createCollection('users');
db.createCollection('tasks');

db.createUser({
    user: "admin",
    pwd: "admin123",
    roles: [
        { role: "readWrite", db: "ai_driven_development" }
    ]
});