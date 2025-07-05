# MIDI Studio - Audio Processing Web Application

## Overview

MIDI Studio is a full-stack web application that provides audio processing capabilities, specifically focused on converting YouTube videos to MIDI files and generating sheet music from MIDI files. The application features a Spotify-inspired dark theme UI and handles audio file management with real-time processing status updates.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: Radix UI primitives with custom styling
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **File Upload**: Multer for handling multipart form data
- **Development**: Hot module replacement via Vite middleware

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Migration**: Drizzle Kit for schema migrations
- **Session Management**: PostgreSQL session store

## Key Components

### Database Schema
The application uses three main tables:
- **conversion_jobs**: Tracks audio conversion tasks with status, progress, and metadata
- **audio_files**: Stores file metadata including type, size, and duration
- **user_sessions**: Manages user session state and preferences

### Frontend Components
- **Sidebar Navigation**: Spotify-style sidebar with navigation between different conversion tools
- **YouTube Converter**: Interface for converting YouTube videos to MIDI
- **MIDI Converter**: Interface for converting MIDI files to sheet music
- **Audio Preview**: Library for previewing converted audio files
- **Settings**: Configuration panel for audio processing parameters
- **Now Playing**: Real-time status display for active conversions

### Backend Services
- **Storage Layer**: Abstracted storage interface with in-memory implementation
- **File Management**: Upload handling and file system operations
- **API Routes**: RESTful endpoints for conversion jobs and file management
- **Background Processing**: Job queue system for audio conversion tasks

## Data Flow

1. **File Upload**: Users upload audio files or provide YouTube URLs
2. **Job Creation**: System creates conversion jobs with pending status
3. **Background Processing**: Jobs are processed asynchronously with progress updates
4. **Status Updates**: Real-time polling provides conversion progress to frontend
5. **File Delivery**: Completed files are made available for download/preview

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless database connector
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: Accessible UI primitive components
- **tailwindcss**: Utility-first CSS framework
- **multer**: File upload middleware
- **express**: Web application framework

### Audio Processing Dependencies
The application is designed to integrate with audio processing libraries for:
- YouTube video downloading and audio extraction
- MIDI file generation from audio
- Sheet music generation from MIDI files

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite provides instant feedback during development
- **Type Checking**: TypeScript compilation for type safety
- **Database Migrations**: Drizzle Kit handles schema changes

### Production Build
- **Frontend**: Vite builds optimized static assets
- **Backend**: esbuild bundles server code for Node.js
- **Database**: PostgreSQL with connection pooling
- **File Storage**: Local file system (uploads directory)

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string
- **NODE_ENV**: Environment mode (development/production)
- **File Upload Directory**: Configurable upload path

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

July 05, 2025:
- ✓ Built complete YouTube to MIDI converter with Spotify-inspired UI
- ✓ Implemented working YouTube search with real-time results
- ✓ Added YouTube video download and MIDI conversion pipeline
- ✓ Created MIDI to sheet music generation functionality
- ✓ Built responsive design for all device orientations
- ✓ Added mobile navigation with sidebar toggle
- ✓ Implemented file upload with visual feedback
- ✓ Created credits page with JSON configuration
- ✓ Added file download system for converted files
- ✓ Documented complete setup process with API key instructions

## Known Issues
- YouTube search requires API key for full functionality (documented in README)
- TypeScript type errors in query responses (using 'as any' workaround)
- FFmpeg dependency required for audio processing

## User Preferences
- Simple, everyday language for communication
- Complete working functionality over partial implementations
- Comprehensive documentation for setup and API configuration