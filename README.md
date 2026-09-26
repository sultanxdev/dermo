
# DermoAI

> AI employee for clinics that handles WhatsApp conversations, clinic knowledge, leads, appointments, and human handoff.

DermoAI is a clinic-focused AI assistant designed to automate repetitive patient conversations while keeping important business decisions under application control.

**Core workflow**

`WhatsApp → AI → Knowledge → Lead → Appointment → Human Handoff`

## Why DermoAI?

Clinics receive repetitive enquiries about:

- Treatments and services
- Consultation fees
- Doctors
- Working hours
- Clinic location
- Appointment availability
- Cancellations and rescheduling
- General FAQs

Handling these conversations manually creates repetitive work, delayed responses, and avoidable booking mistakes.

DermoAI automates the repetitive workflow while keeping staff involved when human judgment is needed.

## How It Works

```text
Patient → WhatsApp → DermoAI → Knowledge / Tools → Lead / Appointment
                                      ↓
                                 Human Handoff
```

The application controls business state such as appointments, leads, availability, and conversation mode. The LLM does not receive unrestricted database access.

## Architecture

DermoAI uses a modular monolith designed for a single-clinic deployment.

```text
WhatsApp
   ↓
Webhook
   ↓
PostgreSQL + pgvector
   ↓
Redis + BullMQ
   ↓
Conversation Engine
   ↓
RAG + LLM + Tools
   ↓
WhatsApp
```

The architecture keeps business rules inside application services while AI handles language, classification, retrieval, and response generation.

## AI Pipeline

```text
Message
  ↓
Intent
  ↓
Safety
  ↓
Conversation State
  ↓
RAG / Clinic Context
  ↓
Tool Validation
  ↓
Response
```

## RAG

Clinic-approved information is stored and retrieved with PostgreSQL + pgvector.

`Clinic Content → Chunk → Embed → pgvector → Retrieve → LLM`

The system is designed to use approved clinic knowledge and provide a safe fallback or human escalation when reliable information is unavailable.

## Appointment Booking

Appointments are handled by deterministic application logic rather than free-form AI decisions.

`Request → Validate → Check Availability → Check Conflict → Commit`

The server validates availability again during booking so the displayed slot is not treated as a guaranteed reservation.

## Human Handoff & Safety

A conversation can move between:

`AI ↔ HUMAN_TAKEOVER`

Handoff can occur when:

- The patient requests a human
- Medical input requires staff involvement
- The AI cannot answer reliably
- An emergency signal is detected

DermoAI is not a diagnostic or prescription system.

## WhatsApp

The inbound webhook flow is:

`Verify → Deduplicate → Persist → Queue → Process`

Provider message IDs are used for idempotency so duplicate webhook deliveries do not create duplicate processing.

## Core Features

- WhatsApp patient conversations
- Clinic-specific knowledge retrieval
- AI intent detection
- Medical safety boundaries
- Lead management
- Appointment availability and booking
- Cancellation and rescheduling
- Human receptionist takeover
- Razorpay payment integration
- Knowledge management
- Clinic dashboard
- Audit logging
- Operational monitoring

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js, React |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Vector Search | pgvector |
| Background Jobs | Redis, BullMQ |
| AI | Gemini, LangChain |
| Messaging | WhatsApp Cloud API |
| Payments | Razorpay |
| Validation | Zod |
| Authentication | JWT, bcrypt |
| Styling | Tailwind CSS |

## Project Structure

```text
dermoai/
├── apps/
│   ├── api/
│   └── web/
├── packages/
│   ├── schemas/
│   └── types/
├── docs/
└── package.json
```
## Testing

The project includes tests for:

- Authentication and authorization
- Webhook verification
- Message idempotency
- Appointment availability
- Booking conflicts
- Conversation state
- Safety rules
- RAG retrieval
- AI tool execution

The project also includes a versioned AI evaluation suite for supported clinic conversation scenarios.

## Security

Security-sensitive areas include:

- Staff authentication and authorization
- WhatsApp webhook verification
- Provider credentials
- AI credentials
- Database credentials
- Audit logging
- Clinic data boundaries

Secrets must never be committed to the repository or exposed in normal responses and logs.

## Project Status

**Active Development**

Current focus:

`WhatsApp → AI → Knowledge → Lead → Appointment → Payment → Human Handoff → Dashboard`

> **AI handles conversation. The application controls business decisions.**




