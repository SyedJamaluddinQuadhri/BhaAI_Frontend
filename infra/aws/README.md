# AWS frontend deployment

1. `npm ci`
2. `npm run build`
3. Upload `dist/` to a private S3 bucket and serve it through CloudFront.
4. Configure CloudFront custom error responses so SPA routes return `/index.html` with HTTP 200.
5. Set `VITE_API_BASE_URL` at build time to the API Gateway stage.
6. Never place AWS access keys, database credentials, Bedrock secrets, or other private credentials in Vite environment variables.

Recommended production architecture:
S3 + CloudFront → React → API Gateway → Cognito JWT authorizer → Lambda/services → Aurora/PostgreSQL + private S3 → SQS/EventBridge → document processing → Bedrock/RAG.
