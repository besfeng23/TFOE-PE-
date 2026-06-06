TFOE-PE → Supabase/Vercel Production Migration

You are the Lead Architect and Principal Engineer for TFOE-PE (The Fraternal Order of Eagles - Philippine Eagles Member Command Center).

Your mission is to migrate the entire platform from Firebase to Supabase while preserving all existing functionality.

Do NOT create a new application.

Do NOT rebuild screens.

Do NOT redesign the UI.

Do NOT remove working features.

The goal is a production-grade migration.

⸻

Current State

Frontend:

Next.js 15
React 18
TypeScript
Tailwind
Radix UI

Current Backend:

Firebase Auth
Firestore
Firebase Storage

Target Backend:

Supabase Auth
PostgreSQL
Supabase Storage
Supabase Realtime

Hosting:

Vercel

⸻

Existing Supabase Project

NEXT_PUBLIC_SUPABASE_URL=https://ilphzaydpectappekhti.supabase.co

Database already exists.

The following tables already exist:

regions
clubs
profiles
members
applications
events
event_attendees
documents
dues
payments
notifications
audit_logs
activity_logs
offices
positions
member_positions
approval_workflows
approval_steps
approval_actions
announcements
conversations
conversation_participants
messages
roles
permissions
role_permissions
user_roles
ai_generations
auth_profiles
storage_buckets_registry

DO NOT recreate them.

Inspect database before making schema changes.

⸻

Primary Objective

Replace Firebase completely.

End state:

Firebase = 0 dependencies
Firestore = removed
Firebase Auth = removed
Firebase Storage = removed
Supabase = 100%

⸻

Required Architecture

Create:

src/lib/supabase/
client.ts
server.ts
middleware.ts

Create:

src/lib/repositories/
members.repository.ts
applications.repository.ts
events.repository.ts
documents.repository.ts
dues.repository.ts
payments.repository.ts
notifications.repository.ts

Rule:

No page may directly call Supabase.

All data access must flow through repositories.

⸻

Migration Order

Phase 1

Members

Replace:

Firestore members collection

with:

members table

Repository:

getMembers()
getMember()
createMember()
updateMember()
deleteMember()

⸻

Phase 2

Applications

Replace Firestore applications.

Connect:

applications
approval_workflows
approval_steps
approval_actions

⸻

Phase 3

Events

Replace Firestore events.

Use:

events
event_attendees

⸻

Phase 4

Documents

Replace Firebase Storage.

Use buckets:

member-documents
member-ids
endorsements
meeting-minutes
event-photos

Create upload service.

⸻

Phase 5

Dues

Replace Firestore dues.

Connect:

dues
payments

⸻

Phase 6

Messaging

Replace existing Firebase messaging.

Use:

conversations
conversation_participants
messages

⸻

Phase 7

Notifications

Use:

notifications

⸻

Authentication Migration

Replace:

firebase/auth

with:

@supabase/supabase-js

Requirements:

Email Login
Password Reset
Session Persistence
Role Loading
Profile Loading

Create:

src/providers/AuthProvider.tsx

based on Supabase.

⸻

RBAC

Roles already exist.

Use:

roles
permissions
role_permissions
user_roles

Implement:

super_admin
national_admin
region_admin
club_admin
member

Permission checks must be centralized.

Create:

src/lib/auth/permissions.ts

⸻

Audit Logging

Every mutation must create records in:

audit_logs

Track:

actor
action
entity_type
entity_id
timestamp

⸻

Activity Logging

Track:

login
profile update
member update
dues payment
event registration
document upload

Store in:

activity_logs

⸻

AI Integration

Keep existing AI flows.

Do not remove:

ask-about-the-eagles
generate-member-report
generate-speech-flow
generate-endorsement-letter
summarize-document-submissions

Log all AI executions to:

ai_generations

⸻

Production Hardening

Install:

npm install @supabase/supabase-js
npm install zod
npm install react-hook-form
npm install @tanstack/react-query

Add:

Sentry
Vercel Analytics
Vercel Speed Insights

⸻

Code Quality Rules

Never use:

supabase.from(...)

inside React pages.

Only repositories may access database.

All forms:

Zod validation
React Hook Form

All server actions:

typed
validated
error handled

⸻

Deliverables

Continue until all of the following are complete:

[ ] Firebase removed
[ ] Supabase Auth live
[ ] Supabase Storage live
[ ] Repository layer complete
[ ] RBAC implemented
[ ] Audit logging implemented
[ ] Activity logging implemented
[ ] AI logging implemented
[ ] Vercel deployment ready
[ ] Production build passes
[ ] TypeScript build passes
[ ] No lint errors

For every completed step:

1. Show files changed.
2. Show code diff.
3. Explain migration impact.
4. Commit with meaningful git message.

Never stop at planning.
Always execute the next migration step until completion.