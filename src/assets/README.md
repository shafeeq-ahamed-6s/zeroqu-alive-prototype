# Assets Directory

This directory contains all static assets used in the application including images, icons, fonts, and other media files.

## Purpose

The assets directory provides:

- Centralized storage for all static media files
- Optimized asset loading and bundling via Vite
- Type-safe asset imports
- Proper asset organization for maintainability

## Structure

```
assets/
├── images/           # Application images (photos, illustrations)
└── icons/            # Custom SVG icons and icon sets
```

## Best Practices

### Naming Conventions

- Use kebab-case for file names: `user-avatar.png`
- Include dimensions for images: `hero-banner-1920x1080.jpg`
- Use descriptive names: `loading-spinner.svg` instead of `icon1.svg`
- Version assets when needed: `logo-v2.svg`

## File Format Guidelines

### Icons

- **SVG**: Preferred for scalable icons
- **PNG**: For complex icons that don't scale well as SVG
- Use consistent viewBox dimensions (24x24, 32x32)
