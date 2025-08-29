# Configuration Directory

This directory contains all application configuration, environment setup, and feature flags for the DewDrop Pilot MVP.

## Purpose

The config directory provides:

- Centralized application configuration
- Environment variable validation and typing
- Feature flag management
- Runtime configuration access
- Development vs production settings

## Structure

```
config/
├── index.tsx         # Main configuration file and environment setup
├── features.ts       # Feature flags and toggles
├── constants.ts      # Application constants
├── api.ts           # API configuration
└── theme.ts         # Theme and styling configuration
```

## Security Considerations

1. **Never expose secrets**: Only public configuration should be in VITE\_ variables
2. **Validate all inputs**: Use Zod or similar for runtime validation
3. **Environment separation**: Different configs for different environments
4. **Sensitive data**: Use server-side configuration for sensitive values
5. **Default values**: Provide secure defaults for all optional settings
