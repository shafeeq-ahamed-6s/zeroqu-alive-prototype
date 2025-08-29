# Zeroqu Prototype Frontend

A modern React frontend application for the Zeroqu Prototype, built with TypeScript, Vite, and Tailwind CSS.

## 🚀 Tech Stack

- **Framework**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 7.1.2
- **Styling**: Tailwind CSS 4.1.12
- **UI Components**: ShadcnUI components
- **Icons**: Lucide React
- **Validation**: Zod
- **Linting**: ESLint 9

## 📁 Project Structure

```
src/
├── api/              # API related functions and configurations
├── assets/           # Static assets (images, fonts, etc.)
├── components/       # Reusable UI components
│   ├── theme/        # Theme-related components
│   └── ui/           # Base UI components (buttons, dropdowns, etc.)
├── config/           # Application configuration
├── features/         # Feature-specific modules
│   └── feature/      # Example feature structure
│       ├── api/      # Feature-specific API calls
│       ├── components/ # Feature-specific components
│       └── hooks/    # Feature-specific hooks
├── hooks/            # Shared custom hooks
├── layouts/          # Page layout components
├── lib/              # Utility libraries and contexts
├── pages/            # Page components
├── routes/           # Routing configuration
└── utils/            # Utility functions
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd zeroqu-prototype
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📝 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally

## 🎨 Features

- **Modern React**: Built with React 19 and modern hooks
- **TypeScript**: Full type safety throughout the application
- **Theme Support**: Dark/light mode toggle with theme context
- **Component Library**: Reusable UI components built with Radix UI
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Code Quality**: ESLint configuration for consistent code style

## 🏗️ Architecture

The project follows a feature-based architecture:

- **Components**: Organized into reusable UI components and theme components
- **Features**: Self-contained modules with their own API, components, and hooks
- **Hooks**: Custom React hooks for shared logic
- **API**: Centralized API configuration and calls
- **Utils**: Shared utility functions

## 🔧 Configuration

- **Vite**: Configured with React and Tailwind CSS plugins
- **TypeScript**: Strict configuration for better type safety
- **ESLint**: Modern ESLint configuration with React hooks support
- **Tailwind**: Latest Tailwind CSS v4 with custom animations

## 🎯 Development Guidelines

1. **Component Structure**: Follow the established component patterns
2. **Type Safety**: Use TypeScript for all new code
3. **Styling**: Use Tailwind CSS classes for styling
4. **Code Quality**: Run linting before committing changes
5. **Feature Organization**: Keep related code together in feature folders


## 📄 License

This project is private and proprietary.

---

Built with ❤️ for the Zeroqu Prototype