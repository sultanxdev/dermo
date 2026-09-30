The report identifies persistent storage as the primary production gap: the application currently uses a singleton in-memory database, `DATABASE_URL` is unused, and PostgreSQL/pgvector has not been connected. 

For the next implementation PR, I’d make this **PR 1.1 — PostgreSQL + pgvector Database Foundation** rather than mixing persistence with WhatsApp, queues, and production hardening.

# PR 1.1 — PostgreSQL + pgvector Database Foundation

## Summary

PR 1.1 replaces Dermo's in-memory database foundation with persistent PostgreSQL storage and establishes the database layer required for production workloads.

The current application stores all business data in a singleton in-memory database, meaning clinic data, appointments, conversations, leads, services, knowledge documents, and other records are lost whenever the API process restarts.

This PR introduces the persistent database foundation while preserving the existing service and API contracts as much as possible.

## Problem

The current database layer is implemented as an in-memory singleton:

```text
API
 ↓
Services
 ↓
In-Memory DB
```

This creates several production limitations:

* Data is lost on every server restart.
* Multiple API instances cannot share state.
* PostgreSQL configuration already exists but is not connected.
* No database migrations exist.
* No persistent relational constraints exist.
* The vector store is also currently in-memory.

The status report identifies PostgreSQL + pgvector as the largest remaining infrastructure gap. 

## Goals

This PR will:

* Introduce PostgreSQL as the system of record.
* Establish a typed ORM/database access layer.
* Add version-controlled database migrations.
* Create persistent schemas for the application's core entities.
* Replace the in-memory persistence implementation without unnecessarily changing route contracts.
* Establish pgvector support for future persistent RAG retrieval.
* Provide a repeatable local database setup.
* Preserve seed-data support.
* Add database startup/configuration validation.

## Database Scope

The persistent schema should cover the entities already used by the application, including:

```text
Clinic
User / Staff
Doctor
Service
Lead
Appointment
Conversation
Message
FAQ
KnowledgeDocument
Payment
AuditLog
```

Relationships should reflect the existing application model rather than introducing a second domain model.

## Vector Storage

The current vector store performs cosine similarity in memory and uses Gemini embeddings.

This PR establishes PostgreSQL + pgvector as the persistent vector foundation:

```text
Knowledge Document
       ↓
   Embedding
       ↓
PostgreSQL + pgvector
       ↓
Vector similarity search
       ↓
      RAG
```

The existing AI/RAG behavior should remain functionally compatible while the persistence layer is introduced.

The current report confirms that the vector store is in-memory and PostgreSQL/pgvector is not yet connected. 

## Architecture

### Before

```text
Next.js
   ↓
Express API
   ↓
Services
   ↓
In-Memory DB
```

### After

```text
Next.js
   ↓
Express API
   ↓
Services
   ↓
Repository / Database Layer
   ↓
PostgreSQL
   │
   └── pgvector
```

The application should no longer depend directly on the singleton database implementation from business services.

## Implementation

### Database Package

Introduce a dedicated database layer responsible for:

* Database client initialization
* Schema definitions
* Migrations
* Repository/data-access operations
* Transaction boundaries
* Connection lifecycle

The API services should interact with the database layer rather than directly manipulating an in-memory singleton.

### Environment Configuration

Use the existing database configuration and make it operational.

Expected configuration should include:

```env
DATABASE_URL=
```

For pgvector-enabled environments, the database initialization process must ensure the required extension is available.

Development configuration should support a local PostgreSQL instance through Docker.

## Migration Strategy

Database changes must be migration-driven.

Each schema change should be:

```text
Schema change
    ↓
Migration
    ↓
Database
```

No manually modified production database schema should be required.

Migrations should be committed to the repository and reproducible from a clean database.

## Seed Data

The existing comprehensive seed dataset should remain available and be adapted to the persistent database.

The current seed includes:

* 1 clinic
* 2 staff users
* 2 doctors
* 5 services
* 10+ FAQs
* sample leads
* appointments
* conversations
* messages
* knowledge documents

The existing seed source contains approximately 433 lines and represents the current demo dataset. 

The new seed process should populate PostgreSQL instead of the in-memory singleton.

## Service Migration

Existing services should be migrated incrementally.

Priority order:

```text
1. Clinic / Users
2. Doctors
3. Services
4. Leads
5. Appointments
6. Conversations / Messages
7. Knowledge / FAQs
8. Payments
9. Audit Logs
10. Analytics source data
```

Business logic should remain in the service layer.

The database layer should handle persistence rather than moving business rules into SQL or route handlers.

## Transactions

Operations that require atomicity should use database transactions.

Examples include:

### Appointment Booking

```text
Validate slot
   ↓
Transaction
   ├── verify availability
   ├── create appointment
   └── update related state
```

### Conversation / Message Operations

Message creation and corresponding conversation state changes should remain consistent.

### Payment State Changes

Payment/order records should not be partially persisted.

## Compatibility

Existing API endpoints should retain their public request/response contracts wherever possible.

The goal of this PR is:

```text
Replace persistence
≠
Rewrite the API
```

Routes and services should continue to expose the application's existing functionality while changing the underlying storage implementation.

## Testing

Add database-backed tests covering:

* Database connection
* Migration execution
* Seed execution
* CRUD persistence
* Relationships
* Transaction behavior
* Appointment conflict handling
* Conversation/message persistence
* Knowledge document persistence
* Vector insertion
* Vector similarity queries

The existing API and business-logic tests should continue to pass after migration.

The current test suite contains unit tests, integration tests, and an AI evaluation suite, but overall test coverage is currently reported as partial. 

## Acceptance Criteria

* [ ] PostgreSQL is connected and operational.
* [ ] Database schema is version controlled through migrations.
* [ ] Core Dermo entities have persistent schemas.
* [ ] API services no longer depend on the in-memory singleton for migrated entities.
* [ ] Existing seed data can populate a clean PostgreSQL database.
* [ ] pgvector is enabled and usable.
* [ ] Knowledge embeddings can be persisted.
* [ ] Vector similarity queries work against PostgreSQL.
* [ ] Application data survives API restarts.
* [ ] Transactional operations are atomic.
* [ ] Existing API tests remain compatible.
* [ ] Database integration tests pass.
* [ ] Local PostgreSQL setup is documented.
* [ ] Environment configuration fails clearly when required database configuration is missing.

## Out of Scope

This PR intentionally does not include:

* Redis / BullMQ
* WhatsApp outbound delivery
* WhatsApp delivery-status processing
* WhatsApp template messaging
* Rate limiting
* Full RBAC enforcement
* LLM-based intent classification
* Analytics redesign
* Google Docs/Sheets synchronization
* Docker production deployment
* CI/CD
* Production monitoring

Those are separate concerns and should be implemented in subsequent focused PRs.

## Why This PR Comes First

The current application already contains the majority of its product surface — REST APIs, AI modules, appointment logic, payments, WhatsApp webhook handling, and dashboard pages. However, the current persistence model means the application remains fundamentally demo-oriented because all data is lost on restart. 

Establishing PostgreSQL first provides the durable foundation required for the remaining production work.

## Verification

Expected verification before merge:

```bash
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm test
pnpm build
```

Additionally verify:

```text
1. Start PostgreSQL
2. Run migrations
3. Seed data
4. Start API
5. Create/update records
6. Restart API
7. Confirm records remain
8. Execute vector search
9. Confirm RAG retrieval remains functional
```

## Checklist

* [ ] PostgreSQL configured
* [ ] ORM/database client added
* [ ] Schema implemented
* [ ] Migrations added
* [ ] pgvector enabled
* [ ] Repository/data-access layer added
* [ ] Core services migrated
* [ ] Seed migrated
* [ ] Transactions implemented where required
* [ ] Database integration tests added
* [ ] Existing tests passing
* [ ] Build passing
* [ ] Local setup documented
* [ ] In-memory persistence removed from migrated paths

This keeps **PR 1.1 focused on the single biggest architectural gap** instead of combining database, Redis, WhatsApp, and deployment work into one large change.
