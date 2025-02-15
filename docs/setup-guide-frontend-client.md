

#### Example section for PostgreSQL/Neon setup:

```markdown
## PostgreSQL Database Setup

### Message Table

The application uses PostgreSQL to store and manage *messages*


CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    image_id INTEGER NOT NULL,
    message TEXT NOT NULL, 
    sender TEXT NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE DEAFAULT CURRENT_TIMESTAMP
);

```

