# BhaAI Frontend Architecture

## Product flow

Information → Understanding → Organization → Search → Memory → Prioritization → Action → Reminder → Follow-up

## UI layers

1. App shell
2. Feature pages
3. Shared domain primitives
4. Service boundaries
5. Mock data

## AWS replacement points

- `services/auth` → Cognito session/token handling
- `services/api` → API Gateway
- feature services → Lambda/backend APIs
- documents service → S3 metadata + document intelligence APIs
- AI service → Bedrock/RAG/agent orchestration endpoint
- reminders/notifications → EventBridge/SQS/notification service

No UI component directly depends on AWS SDKs.
