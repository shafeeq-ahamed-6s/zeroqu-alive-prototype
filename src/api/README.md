# API Layer

This directory contains all API-related code for communicating with backend services.

## Purpose

The API layer provides a centralized way to:

- Make HTTP requests to backend services
- Handle authentication and authorization
- Manage request/response transformations
- Implement error handling and retry logic
- Cache API responses when appropriate

## Structure

```
api/
└── index.ts          # Main API client and configuration
```

## Best Practices

<!-- TODO -->

## Environment Configuration

API configuration is managed through the centralized config system:

```typescript
// config/index.ts
const env = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    API_KEY: import.meta.env.VITE_API_KEY,
    // ... other API-related env vars
};
```

## Testing

<!-- TODO -->

## Security Considerations

1. **Never expose sensitive data**: API keys and secrets should be server-side only
2. **Validate responses**: Use Zod or similar for runtime type checking
3. **Implement proper authentication**: Token-based auth with refresh mechanisms
4. **Rate limiting**: Handle rate limiting gracefully with exponential backoff
5. **CORS**: Ensure proper CORS configuration on the backend

## Common Patterns

- Use React Query for advanced caching and synchronization
- Implement optimistic updates for better UX
- Use proper loading states and error boundaries
- Log API calls for debugging (in debug mode only)
