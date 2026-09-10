# BhaAI — Backend & AWS Readiness

## Current status

The frontend is **backend-ready at the boundary**, not backend-complete. UI components do not call AWS SDKs directly. Feature services sit between React Query and the API.

### API Gateway boundary
Set `VITE_API_BASE_URL` to the deployed API Gateway stage. `src/services/api/client.ts` automatically adds the session Bearer token and supports JSON and multipart uploads.

### Authentication boundary
`src/services/auth/auth.service.ts` is intentionally isolated. The current implementation is a mock session so the demo works without AWS. Replace its internals with Cognito Hosted UI / PKCE or the Cognito SDK; the UI contract stays the same.

### Document upload boundary
`documentsService.upload(file)` already separates the UI from transport. Mock mode simulates processing. Real mode sends `multipart/form-data` to `POST /documents/upload`.

## Recommended AWS production flow

React/Vite → S3 static hosting → CloudFront → API Gateway → Lambda/services → RDS/Aurora + S3 → SQS/EventBridge → document processing/OCR → knowledge/RAG → Bedrock.

Use Cognito for authentication. Store document binaries in a private S3 bucket; return short-lived presigned URLs from the backend for viewing. Never expose AWS credentials in the frontend.

## API contracts already represented

- POST /auth/login
- POST /auth/logout
- GET /user/profile
- GET /emails
- GET /documents
- GET /documents/:id
- POST /documents/upload
- GET /deadlines
- POST /deadlines
- PATCH /deadlines/:id
- GET /tasks
- POST /tasks
- PATCH /tasks/:id
- GET /calendar/events
- POST /calendar/events
- GET /reminders
- POST /reminders
- PATCH /reminders/:id
- GET /notifications
- PATCH /notifications/:id
- GET /integrations
- PATCH /integrations/:id
- POST /ai/chat
- POST /ai/actions
- POST /ai/search
- GET /knowledge/search
- GET /insights
- GET /privacy
- GET /privacy/sessions
- GET /privacy/audit-log
- POST /privacy/export
- DELETE /privacy/data

## Production checklist

- [ ] Replace mock auth with Cognito.
- [ ] Configure API Gateway CORS for the CloudFront domain.
- [ ] Configure JWT authorizer on protected routes.
- [ ] Enforce `userId`/tenant isolation in every backend query.
- [ ] Use private S3 buckets and presigned upload/download URLs.
- [ ] Move document processing to async SQS/EventBridge jobs.
- [ ] Persist document metadata and extracted entities in PostgreSQL/Aurora.
- [ ] Add vector/RAG infrastructure behind `/ai/search` and `/knowledge/search`.
- [ ] Route agent actions through an approval-aware backend endpoint.
- [ ] Store secrets in Secrets Manager, not Vite env files.
- [ ] Add CloudWatch logs/metrics and alarms.
- [ ] Add rate limiting/WAF where appropriate.
- [ ] Add CI/CD to build the Vite app and publish `dist/` to S3/CloudFront.

## Important frontend security rule

Anything prefixed `VITE_` is public at build time. Do not put AWS secret keys, database credentials, API private keys, or Cognito client secrets in these variables.
