# Components Directory

This directory contains all reusable UI components that can be shared across different parts of the application.

## Purpose

The components directory provides:

- Reusable UI building blocks
- Consistent design system implementation
- Separation between generic UI components and business logic
- Easy maintenance and testing of isolated components

## Structure

```
components/
├── ui/               # Basic UI primitives (buttons, inputs, theme-toggle, etc.)
├── forms/            # Form-related components
├── layout/           # Layout and structural components
├── navigation/       # Navigation-related components
├── feedback/         # Loading, error, success components
└── data-display/     # Tables, lists, cards for displaying data
```

## Component Design Principles

### 1. Single Responsibility

Each component should have one clear purpose and responsibility.

### 2. Composition over Inheritance

Build complex components by combining simpler ones rather than extending base classes.

### 3. Props Interface Design

```typescript
// Good: Clear, typed interface
interface ButtonProps {
    variant?: "primary" | "secondary" | "danger";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    loading?: boolean;
    children: ReactNode;
    onClick?: () => void;
}

// Avoid: Unclear or overly flexible interfaces
interface ButtonProps {
    config: any;
    options?: Record<string, unknown>;
}
```

## Performance Considerations

1. **Lazy Loading**: Use React.lazy for heavy components
2. **Memoization**: Use React.memo for expensive re-renders
3. **Bundle Splitting**: Import only what you need
4. **Tree Shaking**: Ensure proper ES modules exports
