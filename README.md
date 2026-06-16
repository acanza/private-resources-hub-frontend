# Private Resources Hub - Frontend

A secure, production-ready React + TypeScript + Vite single-page application (SPA) for accessing private resources through Amazon Cognito authentication and AWS integration.

---

## Overview

**Private Resources Hub** is a frontend application that enables authenticated users to securely access private resources hosted on AWS. The application integrates with Amazon Cognito User Pools for authentication and works seamlessly with an AWS backend infrastructure to provide role-based access control to protected content distributed through Amazon CloudFront.

### Key Features

- **Secure Authentication**: Email and password login via Amazon Cognito User Pool
- **Role-Based Access Control**: Display resources based on user permissions determined by the backend
- **CloudFront Signed Cookies**: Automatic handling of signed cookies for secure content delivery
- **Protected Routes**: Automatic redirection of unauthenticated users to the login page
- **Responsive UI**: Clean and minimal interface optimized for modern browsers
- **Type-Safe Development**: Full TypeScript support with explicit type definitions

---

## Application Architecture

The application is built on a client-side SPA architecture that communicates with AWS backend services:

```
┌─────────────────────┐
│  React Vite SPA     │  (This frontend)
│  S3 + CloudFront    │
└──────────┬──────────┘
           │
           │ API Calls (JWT Auth)
           │
┌──────────▼──────────┐
│  API Gateway        │
│  + Lambda           │
└──────────┬──────────┘
           │
┌──────────┼──────────┐
│          │          │
│     DynamoDB   Cognito
│     (Perms)    (Auth)
│
└──────────┬──────────┐
           │
    ┌──────▼──────┐
    │  S3 Private │
    │  + CloudFront
    │  (Content)
    └─────────────┘
```

---

## Application Components

### Pages

#### 1. **Login Page** (`/`)
The entry point of the application where users authenticate with their email and password.

- Email input field with validation
- Password input field
- Login button with loading state
- Error message display for authentication failures
- Link to request access for new users

#### 2. **Resources Page** (`/resources`)
Protected page displaying all available resource directories for the authenticated user.

- List of resource directories with access status
- Accessible resources displayed as clickable links
- Inaccessible resources displayed as disabled items
- Loading and error states
- Logout button

#### 3. **Directory Page** (`/resources/:directoryName`)
Protected page showing the contents of a specific resource directory.

- Automatic permission validation before content display
- List of files available in the selected directory
- Direct download links to files
- Back navigation to resources list
- Permission error handling (403 Forbidden)

### Core Modules

#### `api/` - API Client
- `client.ts` - Base HTTP client with JWT token handling
- `resources.ts` - Resource-specific API calls
- `index.ts` - Public API exports

#### `auth/` - Authentication
- `cognito.ts` - Amazon Cognito configuration and initialization
- `auth.ts` - Authentication logic and token management
- `AuthProvider.tsx` - React context provider for auth state

#### `components/` - Reusable UI Components
- `ProtectedRoute.tsx` - Route guard ensuring only authenticated users can access protected pages
- `ResourceCard.tsx` - Component for displaying individual resource items

#### `pages/` - Route Components
- `LoginPage.tsx` - Login form and authentication
- `ResourcesPage.tsx` - Resource directory listing
- `DirectoryPage.tsx` - Directory content and file listing

#### `types/` - TypeScript Definitions
- `api.ts` - API response and request type definitions

#### `styles/` - Styling
- Component-specific CSS modules for maintainability

#### `hooks/` - Custom React Hooks
- `useAuth.ts` - Hook for accessing authentication context

---

## Navigation Flow

### User Journey

```
1. User visits application
   └─ Not authenticated
      └─ Redirect to Login Page (/)
      
2. Login Page (/)
   ├─ Enter email and password
   ├─ Click "Log In"
   ├─ Cognito validates credentials
   └─ If successful → Navigate to Resources Page
   
3. Resources Page (/resources)
   ├─ Display list of directories
   ├─ Each resource shows:
   │  ├─ Name
   │  └─ Access status (Accessible / No disponible)
   ├─ Click accessible resource
   └─ Navigate to Directory Page (/resources/{directoryName})
   
4. Directory Page (/resources/{directoryName})
   ├─ Request access via POST /resources/{directoryName}/access
   ├─ Backend validates JWT and checks DynamoDB permissions
   ├─ Backend sets CloudFront signed cookies
   ├─ Fetch file list via GET /resources/{directoryName}
   ├─ Display files as downloadable links
   └─ User can:
      ├─ Download files (via signed CloudFront URLs)
      └─ Return to Resources Page (back button)

5. Logout
   └─ Clear authentication tokens
   └─ Redirect to Login Page (/)
```

### UI Screenshots

#### Login Page
Users authenticate with their Cognito credentials on this clean login form.

![Login Page](./docs/private-resources-hub-login.png)

#### Resources Page
After login, users see their available resources. Some resources may be restricted based on permissions.

![Resources Page](./docs/private-resources-hub-home.png)

#### Directory Page
When accessing an authorized directory, users can view and download files.

![Directory Page](./docs/private-resources-hub-directory-view.png)

---

## Technology Stack

- **React 19+** - UI framework
- **TypeScript 5+** - Type-safe JavaScript
- **Vite 5+** - Lightning-fast build tool
- **React Router 7+** - Client-side routing
- **AWS Amplify Auth** / **amazon-cognito-identity-js** - Cognito authentication
- **Native Fetch API** - HTTP requests (no heavy dependencies)
- **CSS Modules** - Component-scoped styling

---

## Project Structure

```
src/
├── api/                    # HTTP client and API functions
│   ├── client.ts          # Base fetch wrapper with JWT support
│   ├── resources.ts       # Resource-specific API calls
│   └── index.ts           # Public API exports
├── auth/                   # Authentication logic
│   ├── cognito.ts         # Cognito configuration
│   ├── auth.ts            # Auth utilities
│   └── AuthProvider.tsx   # Auth context provider
├── components/             # Reusable UI components
│   ├── ProtectedRoute.tsx # Route guard component
│   ├── ResourceCard.tsx   # Resource display component
│   └── ...
├── hooks/                  # Custom React hooks
│   └── useAuth.ts         # Auth context hook
├── pages/                  # Route-level components
│   ├── LoginPage.tsx      # /
│   ├── ResourcesPage.tsx  # /resources
│   └── DirectoryPage.tsx  # /resources/:directoryName
├── styles/                 # Global and component styles
├── types/                  # TypeScript definitions
│   └── api.ts             # API types
├── utils/                  # Utility functions
├── App.tsx                # Main app component
└── main.tsx               # Application entry point
```

---

## Environment Configuration

Create a `.env.local` file in the project root with the following variables:

```env
VITE_API_BASE_URL=https://your-api.execute-api.region.amazonaws.com
VITE_COGNITO_REGION=region
VITE_COGNITO_USER_POOL_ID=region_xxxxxxxxxx
VITE_COGNITO_CLIENT_ID=your-cognito-client-id
```

**Note:** Do not commit `.env.local` to version control. See [ENV_CONFIG.md](./docs/ENV_CONFIG.md) for detailed configuration instructions.

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Environment variables configured (see above)

### Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

3. **Format code (optional)**
   ```bash
   npm run format
   ```

4. **Check for linting issues**
   ```bash
   npm run lint
   ```

### Production Build

1. **Build for production**
   ```bash
   npm run build
   ```
   Output is generated in the `dist/` directory.

2. **Preview production build locally**
   ```bash
   npm run preview
   ```

### Deployment to AWS S3 + CloudFront

1. Build the application:
   ```bash
   npm run build
   ```

2. Upload `dist/` contents to your frontend S3 bucket:
   ```bash
   aws s3 sync dist/ s3://your-frontend-bucket --delete
   ```

3. Invalidate CloudFront distribution cache (if needed):
   ```bash
   aws cloudfront create-invalidation \
     --distribution-id YOUR_DISTRIBUTION_ID \
     --paths "/*"
   ```

**Important:** Ensure your CloudFront distribution is configured to route unknown paths to `index.html` for proper SPA routing.

---

## Security Considerations

✅ **What we do right:**
- JWT tokens sent via `Authorization` header (never in URLs)
- Tokens stored securely (memory or sessionStorage, not localStorage)
- Protected routes prevent unauthorized access to pages
- All authorization decisions validated by the backend
- CloudFront signed cookies handled by backend only
- No AWS credentials exposed in frontend code

⚠️ **What the backend handles:**
- JWT validation and token refresh
- DynamoDB permission checks
- CloudFront signed cookie generation
- Access control decisions
- Rate limiting and security headers

---

## API Integration

The frontend communicates with the backend through these endpoints:

### Authentication
- Handled by Amazon Cognito User Pool

### Resource Operations
- `GET /resources` - List available directories
- `POST /resources/{directoryName}/access` - Request access to a directory
- `GET /resources/{directoryName}` - List files in a directory

See the backend documentation for detailed API contracts.

---

## Troubleshooting

### "Invalid credentials or user not registered"
- Verify your email and password with your Cognito User Pool
- Contact your administrator to request access

### "You do not have permission to access this resource"
- This resource is restricted to your account
- Contact your administrator to request access

### Build fails with TypeScript errors
```bash
npm run lint
```
Review and fix any type errors reported.

### CloudFront content not loading
- Verify `credentials: "include"` is set on API calls
- Check that CloudFront signed cookies are being set
- Verify CloudFront distribution permissions

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile 90+)

---

## Support

For issues, questions, or feature requests related to this frontend application, contact the project maintainers.
