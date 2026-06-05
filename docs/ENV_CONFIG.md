# Environment Configuration

Copy `.env.example` to `.env.local` and fill in your Cognito and API configuration:

```bash
cp .env.example .env.local
```

## Required Variables

### Cognito Configuration

- `VITE_COGNITO_REGION`: AWS region of your Cognito User Pool (e.g., `eu-west-1`)
- `VITE_COGNITO_USER_POOL_ID`: Cognito User Pool ID (format: `region_randomId`)
- `VITE_COGNITO_CLIENT_ID`: Cognito App Client ID

### API Configuration

- `VITE_API_BASE_URL`: Base URL of your API Gateway endpoint (e.g., `https://api.example.execute-api.eu-west-1.amazonaws.com`)

## Example

```env
VITE_COGNITO_REGION=eu-west-1
VITE_COGNITO_USER_POOL_ID=eu-west-1_xxxxxxxx
VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_API_BASE_URL=https://api.example.execute-api.eu-west-1.amazonaws.com
```

All variables prefixed with `VITE_` are exposed to the browser bundle. Do not store secrets in these variables.
