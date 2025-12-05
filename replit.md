# Bricks - Personal Training Platform

## Overview

Bricks is a comprehensive personal training platform that connects fitness trainers with students. The application facilitates workout management, scheduling, and marketplace discovery through a modern, dark-themed interface with neon accent design.

The platform serves two primary user types:
- **Personal Trainers**: Create and manage workouts, track students, handle scheduling, and maintain professional profiles
- **Students**: Browse trainers, receive assigned workouts, book appointments, and track fitness progress

Built as a full-stack web application with responsive design optimized for both desktop and mobile experiences.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, built using Vite for development and production bundling.

**Routing**: Client-side routing implemented with Wouter, a lightweight React router. Routes are split between public (landing, auth) and protected (dashboards, features) pages.

**State Management**: 
- React Query (TanStack Query) for server state management, data fetching, caching, and synchronization
- React Context API for authentication state via custom `AuthProvider`
- React Hook Form with Zod for form state and validation

**UI Component Library**: Custom component system built on Radix UI primitives with shadcn/ui patterns. All components follow the "new-york" style variant with dark mode as default.

**Styling System**:
- Tailwind CSS for utility-first styling
- Custom design tokens defined in CSS variables following strict brand guidelines
- Three-color palette: Deep petrol green (#002c2b) for backgrounds, neon green (#b6ff00) for accents, ice white (#f7f7f7) for text
- Responsive breakpoints with mobile-first approach

**Layout Strategy**:
- Desktop: Fixed sidebar navigation (64-unit width) with main content area
- Mobile: Bottom navigation bar with touch-optimized tap targets
- Shared `AppLayout` component wrapping authenticated views

### Backend Architecture

**Framework**: Express.js on Node.js runtime with TypeScript.

**API Design**: RESTful endpoints under `/api` prefix. Authentication required for most routes via JWT bearer tokens.

**Authentication Flow**:
- JWT-based stateless authentication
- Passwords hashed using bcryptjs
- Custom `authMiddleware` extracts and validates tokens from Authorization header
- User context injected into protected route handlers

**Database Layer**:
- PostgreSQL as relational database
- Drizzle ORM for type-safe database queries and schema management
- Connection pooling via `pg` library
- Schema-first design with TypeScript types generated from Drizzle schema

**Data Models**:
- `users`: Base authentication and profile data with user type enum
- `personalProfiles`: Extended professional information for trainers
- `students`: Extended student-specific data with optional personal trainer link
- `workouts`: Workout templates created by trainers
- `workoutExercises`: Exercise details within workouts (sets, reps, videos)
- `studentWorkouts`: Assignment of workouts to students with status tracking
- `availabilitySlots`: Trainer scheduling availability
- `appointments`: Booked sessions between trainers and students
- `studentPlans`: Subscription/plan management for ongoing relationships

**Storage Pattern**: Repository pattern abstracted through `storage.ts` interface, allowing database implementation to be swapped without changing route handlers.

### External Dependencies

**Database**: PostgreSQL (expected to be provisioned via `DATABASE_URL` environment variable)

**UI Component System**: Radix UI headless components for accessibility-compliant interactions (dialogs, dropdowns, forms, calendars, etc.)

**Validation**: Zod schemas shared between frontend and backend for consistent data validation

**Date Handling**: date-fns library for formatting and date manipulation with Portuguese (Brazil) locale support

**Build Tools**:
- Vite for frontend development server and production builds
- esbuild for server-side bundling with selective dependency bundling
- TypeScript compiler for type checking (no-emit mode, types only)

**Development Tooling**:
- Replit-specific plugins for development banner, error overlay, and code cartography
- Hot module replacement (HMR) via Vite WebSocket connection

## Recent Changes

### December 5, 2025
- Added text logo alongside main icon logo in headers (landing page, marketplace, footer)
- Implemented support dialog with contact form (name, email, subject, message)
- Added WhatsApp integration (number: 5511945296363) - direct button and form submission
- Fixed search input interruption using React 18's useDeferredValue for debounced filtering
- Fixed PersonalProfile interface to match database schema (specialties array, city, averagePrice)
- Images use CSS invert filter for proper display on dark background

**Security**:
- bcryptjs for password hashing
- jsonwebtoken for JWT creation and verification
- Session secret configurable via environment variable (defaults provided for development)

**Font System**: Google Fonts integration with Inter as primary typeface and Fira Code for monospace elements