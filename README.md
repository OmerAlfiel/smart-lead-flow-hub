
# Smart Lead Flow Hub Project Overview

The Smart Lead Flow Hub is a full-stack application designed to help sales teams effectively manage leads, track campaigns, and analyze performance metrics. It consists of a React-based frontend client and a NestJS backend server.

## Architecture

The project follows a modern client-server architecture:

1. **Frontend (Client)**: Built with React, TypeScript, and Vite, using Tailwind CSS and Shadcn UI components for the interface
2. **Backend (Server)**: Built with NestJS, TypeScript, and TypeORM for database interactions

## Frontend Features

The client application offers a rich set of features:

- **Authentication System**: Secure login/signup functionality with JWT authentication
- **Dashboard**: Centralized view of key metrics and activities
- **Lead Management**: Interface to add, view, edit, and delete leads
- **Campaign Management**: Tools to create and monitor marketing campaigns
- **Analytics Dashboard**: Visualizations for lead performance metrics using Recharts
- **Task Management**: System for creating and tracking follow-up tasks
- **File Management**: Upload and manage documents related to leads and campaigns
- **Notification System**: Real-time notifications for important events
- **Team Collaboration**: Features for team members to work together on leads
- **Responsive Design**: Works across desktop and mobile devices with adaptive layouts
- **Dark/Light Theme**: Support for different visual preferences

## Backend Features

The server provides comprehensive API endpoints and functionality:

- **RESTful API**: Well-structured endpoints following REST principles
- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Database Integration**: TypeORM for database operations
- **File Storage**: Upload and serve files with proper organization
- **Report Generation**: Generate and export various reports
- **Audit Logging**: Track system activity and changes
- **Email Integration**: Connect with email services
- **CRM Integration**: Connect with external CRM systems
- **Data Validation**: Input validation using class-validator
- **Swagger Documentation**: Auto-generated API documentation
- **Error Handling**: Consistent error responses

## Key Modules

### Frontend Modules

- Dashboard and overview
- User authentication and profile management
- Lead tracking and qualification
- Campaign creation and monitoring
- Task and activity management
- Analytics and reporting dashboards
- Team collaboration tools
- Settings and configurations

### Backend Modules

- Authentication and user management
- Lead and contact management
- Campaign orchestration
- Task scheduling
- File storage and management
- Notifications
- Reporting and analytics
- Audit logging
- Integrations with third-party services

## Technology Stack

### Frontend

- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and development server
- **TailwindCSS**: Utility-first CSS framework
- **Shadcn UI**: Component library
- **React Router**: Client-side routing
- **React Query**: Data fetching and state management
- **Recharts**: Data visualization
- **React Hook Form**: Form handling
- **Zod**: Schema validation

### Backend

- **NestJS**: Progressive Node.js framework
- **TypeScript**: Type-safe JavaScript
- **TypeORM**: ORM for database interactions
- **PostgreSQL/SQLite**: Database options
- **JWT**: Authentication mechanism
- **Passport**: Authentication middleware
- **Swagger**: API documentation
- **Bull**: Queue management
- **Winston**: Logging
- **Multer**: File uploads
- **Class Validator**: Input validation

## Deployment

The application is designed to be deployed as:

- Frontend: Static site that can be hosted on services like Netlify, Vercel, or AWS S3
- Backend: Node.js service that can be deployed to platforms like AWS, Heroku, or Docker containers

## Getting Started

### Client Setup

```bash
cd client
npm install
npm run dev
```

### Server Setup

```bash
cd server
npm install
npm run start:dev
```

The server requires a PostgreSQL database and Redis for queue management. Environment variables can be configured in .env files.

## Project Structure

The project follows a modular architecture:

- **Client**: Component-based organization with pages, components, hooks, and contexts
- **Server**: Module-based architecture following NestJS conventions, with controllers, services, and repositories for each domain entity

## Summary

Smart Lead Flow Hub is a comprehensive lead management solution that helps sales teams capture, organize, and convert leads efficiently. With its intuitive interface and powerful backend, it provides all the tools needed to streamline the sales process and improve conversion rates.
