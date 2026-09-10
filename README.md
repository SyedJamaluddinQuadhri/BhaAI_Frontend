# BhaAI — Personal AI Life Operating System

A premium, responsive React/TypeScript frontend for a privacy-first Personal AI Life Operating System.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Included

- Login + signup flow with isolated auth service
- Responsive editorial application shell
- Dynamic page transitions and restrained Framer Motion interactions
- Global floating BhaAI assistant
- Document upload for PDF/JPG/PNG/WebP with drag-and-drop
- Simulated document processing pipeline
- Documents, deadlines, tasks, calendar, inbox, reminders, notifications
- Integrations and privacy center
- Knowledge and insights
- Student/professional settings
- React Query server-state boundary
- API Gateway-ready client with Bearer auth
- Mock mode switchable through `VITE_USE_MOCKS`
- AWS deployment architecture documented in `AWS_DEPLOYMENT.md`

## AWS direction

The frontend is designed for S3 + CloudFront static hosting with API Gateway behind it. Cognito is the authentication boundary, while Lambda/services own data access and document/AI workflows.

See `AWS_DEPLOYMENT.md` before connecting production infrastructure.
