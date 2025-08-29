# Source Directory (src)

This is the main source directory containing all the application code for the DewDrop Pilot MVP frontend.

## Structure Overview

```
src/
├── App.tsx           # Main application component
├── main.tsx          # Application entry point
├── index.css         # Global styles
├── vite-env.d.ts     # Vite environment type definitions
├── api/              # API layer and HTTP clients
├── assets/           # Static assets (images, icons, fonts)
├── components/       # Reusable UI components
├── config/           # Application configuration and environment setup
├── features/         # Feature-based modules (pages, components, hooks, APIs)
├── hooks/            # Shared custom React hooks
├── layouts/          # Layout components for different page structures
├── lib/              # Core utilities and providers
├── pages/            # Top-level route components
├── routes/           # Route definitions and configurations
└── utils/            # Utility functions and helpers
```

## Architecture Principles

### 1. Feature-First Organization

- Code is organized by features rather than file types
- Each feature contains its own components, hooks, and API calls
- Shared code lives in dedicated directories (components, hooks, lib)

### 2. Clean Imports

- Use absolute imports with `@/` alias for all internal modules
- Keep relative imports only for files in the same directory
- Example: `import { Button } from "@/components/ui/button"`

### 3. TypeScript First

- All files use TypeScript for type safety
- Define types close to where they're used
- Use proper type exports for shared interfaces

## Best Practices

### File Naming

- Use kebab-case for directories: `user-profile/`
- Use PascalCase for React components: `UserProfile.tsx`
- Use camelCase for utilities and hooks: `useUserData.ts`
- Use lowercase for configuration files: `index.ts`

### Component Structure

```tsx
// UserProfile.tsx
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { useUserData } from "./hooks/useUserData";

interface UserProfileProps {
    userId: string;
}

export const UserProfile: FC<UserProfileProps> = ({ userId }) => {
    const { user, loading } = useUserData(userId);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="user-profile">
            <h1>{user.name}</h1>
            <Button onClick={() => console.log("Edit")}>Edit Profile</Button>
        </div>
    );
};
```

### Environment Configuration

- All environment variables must be prefixed with `VITE_`
- Use the centralized config system in `config/`
- Access environment variables through the typed config object

### Styling Guidelines

- Use Tailwind CSS for styling
- Follow the design system established in `components/ui/`
- Use CSS variables for theme colors
- Keep component-specific styles in the component file

## Development Workflow

1. **Adding New Features**: Create a new directory in `features/`
2. **Shared Components**: Add to `components/` (UI) or `components/` (business logic)
3. **API Integration**: Use the centralized API layer in `api/`
4. **State Management**: Use React hooks and context for local state
5. **Routing**: Define new routes in `routes/`

## Dependencies

- **React 19**: Modern React with latest features
- **TypeScript**: Type safety and developer experience
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component primitives
- **Zod**: Runtime type validation
- **Lucide React**: Icon library

## Getting Started

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Build for production: `npm run build`
4. Run linting: `npm run lint`

For detailed environment setup, see `docs/ENVIRONMENT.md`.
