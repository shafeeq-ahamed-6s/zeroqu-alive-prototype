# Routes Directory

This directory contains route configuration, guards, and navigation-related utilities for the application's routing system.

## Purpose

The routes directory provides:

- Route definitions and configuration
- Route guards and authentication checks
- Navigation utilities and hooks
- Route-based code splitting
- Breadcrumb and navigation state management

## Structure

```
routes/
├── README.md              # This file
├── index.tsx             # Main route configuration
├── AppRouter.tsx         # Router component with providers
├── guards/               # Route protection and guards
│   ├── AuthGuard.tsx     # Authentication guard
│   ├── RoleGuard.tsx     # Role-based access guard
│   └── RouteGuard.tsx    # Generic route guard
├── types.ts              # Route-related types
├── constants.ts          # Route constants and paths
├── utils.ts              # Navigation utilities
└── hooks/                # Navigation hooks
    ├── useNavigation.ts  # Navigation state and utilities
    ├── useBreadcrumbs.ts # Breadcrumb management
    └── useRouteAuth.ts   # Route authentication status
```
