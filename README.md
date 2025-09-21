# CV Builder# CV Builder



This repository contains two separate projects that do not share a root package.json.Clean separation of frontend and backend. Each lives in its own folder with its own package.json and runs independently.



- frontend/ — Next.js + TypeScript app## Structure

- backend/ — NestJS + MongoDB API- frontend/ — Next.js + TypeScript app

- backend/ — NestJS + MongoDB API

## Setup

## Setup

Frontend

- cd frontendFrontend

- npm install- cd frontend

- copy `.env.example` to `.env.local` and configure- npm install

- npm run dev- Copy `.env.example` to `.env.local` and configure

- npm run dev

Backend

- cd backendBackend

- npm install- cd backend

- copy `.env.example` to `.env` and configure- npm install

- (optional) npm run seed- Copy `.env.example` to `.env` and configure

- npm run start:dev- (optional) npm run seed

- npm run start:dev

## URLs

- Frontend: http://localhost:3000## URLs

- Backend API: http://localhost:3001/api- Frontend: http://localhost:3000

- Backend API: http://localhost:3001/api

Notes

- Manage dependencies inside each project folder only.## Notes

- Use two terminals when running both services locally.- Root workspaces removed; manage dependencies from each project folder.

- Use two terminals for local development.
# CV Builder 📄✨# CV Builder - Professional Resume Builder



A modern, full-featured CV builder application with separate frontend and backend architecture.A modern, full-stack CV builder application built with Next.js 15, React 19, TypeScript, and MongoDB. Create beautiful, professional CVs with multiple templates, real-time editing, and PDF export functionality.



## 🏗️ Architecture## ✨ Features



- **Frontend**: Next.js 15+ with TypeScript, Tailwind CSS, and React Query### Core Functionality

- **Backend**: NestJS with MongoDB native driver- 🎨 **Multiple Professional Templates**: Classic, Modern, and Compact designs

- **Database**: MongoDB Atlas with comprehensive data models- ⚡ **Real-time Preview**: See changes instantly as you edit

- **Authentication**: JWT-based authentication with secure session management- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile

- 🔐 **User Authentication**: Secure login with NextAuth.js (email + magic link)

## 🚀 Quick Start- ☁️ **Cloud Storage**: All CVs saved to MongoDB with automatic backups

- 📄 **PDF Export**: High-quality PDF generation for job applications

### Prerequisites- 🎯 **Version Management**: Track changes and revert to previous versions

- 🔗 **Public Sharing**: Share CVs via secure links

- Node.js >= 18.0.0- 🌓 **Dark/Light Mode**: Adaptive theme support

- MongoDB Atlas account (or local MongoDB instance)

### Editor Features

### 1. Clone the Repository- 📝 **Rich Text Editing**: TipTap-powered WYSIWYG editor

- 🎨 **Theme Customization**: Colors, fonts, spacing, and layout options

```bash- 🔄 **Drag & Drop Sections**: Reorder CV sections effortlessly

git clone https://github.com/YosrBennagra/friendly-rotary-phone.git- ⚡ **Auto-save**: Never lose your work with automatic saving

cd friendly-rotary-phone- 📊 **Progress Tracking**: Visual indicators for CV completion

```- 🏷️ **Tech Stack Tags**: Professional skill and technology badges

- 📷 **Profile Photos**: Upload and crop profile images

### 2. Install Dependencies- 🔗 **Social Links**: LinkedIn, GitHub, portfolio links with icons



```bash### Templates

# Install root workspace dependencies1. **Classic**: Traditional single-column layout, perfect for conservative industries

npm install2. **Modern**: Two-column layout with sidebar, great for tech and creative roles

3. **Compact**: Space-efficient design, ideal for experienced professionals

# Install all project dependencies

npm run install:all## 🚀 Quick Start

```

### Prerequisites

### 3. Environment Setup- Node.js 18+ 

- MongoDB database (local or MongoDB Atlas)

#### Backend Environment- Git

Create `backend/.env` file:

```env### Installation

# MongoDB Configuration

MONGODB_URI=your_mongodb_connection_string1. **Clone the repository**

DATABASE_NAME=cv_builder   ```bash

   git clone https://github.com/your-username/cv-builder.git

# JWT Configuration   cd cv-builder

JWT_SECRET=your-super-secret-jwt-key-here   ```



# Server Configuration2. **Install dependencies**

PORT=3001   ```bash

NODE_ENV=development   npm install

   ```

# CORS Configuration

FRONTEND_URL=http://localhost:30003. **Set up environment variables**

```   ```bash

   cp .env.example .env.local

#### Frontend Environment   ```

Create `frontend/.env.local` file:   

```env   Configure your `.env.local`:

# NextAuth Configuration   ```env

NEXTAUTH_SECRET=your-nextauth-secret-here   # Database

NEXTAUTH_URL=http://localhost:3000   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/cv-builder?retryWrites=true&w=majority"

   

# API Configuration   # NextAuth

NEXT_PUBLIC_API_URL=http://localhost:3001/api   NEXTAUTH_SECRET="your-secret-key-here"

```   NEXTAUTH_URL="http://localhost:3000"

   

### 4. Database Setup   # Email (for magic link authentication)

   EMAIL_SERVER="smtp://username:password@smtp.gmail.com:587"

```bash   EMAIL_FROM="noreply@cv-builder.com"

# Seed the database with sample data   ```

npm run db:seed

```4. **Set up the database**

   ```bash

### 5. Start Development Servers   npx prisma db push

   npx prisma generate

```bash   npm run seed

# Start both frontend and backend concurrently   ```

npm run dev

```5. **Start the development server**

   # CV Builder

   A cleanly organized, two-project setup:

   - Frontend: Next.js + TypeScript (in `frontend/`)
   - Backend: NestJS + MongoDB (in `backend/`)

   Each project has its own `package.json` and runs independently. No root-level npm scripts are required.

   ## Getting Started

   Clone the repo and install dependencies per project:

   Frontend
   - Path: `frontend/`
   - Install: run `npm install` inside `frontend`
   - Dev: run `npm run dev` inside `frontend`
   - Env file: create `frontend/.env.local` based on `frontend/.env.example`

   Backend
   - Path: `backend/`
   - Install: run `npm install` inside `backend`
   - Dev: run `npm run start:dev` inside `backend`
   - Seed: run `npm run seed` inside `backend` (optional, requires Mongo env)
   - Env file: create `backend/.env` based on `backend/.env.example`

   ## Environment Variables

   Frontend `.env.local`
   - NEXTAUTH_SECRET=
   - NEXTAUTH_URL=
   - NEXT_PUBLIC_API_URL=

   Backend `.env`
   - MONGODB_URI=
   - DATABASE_NAME=
   - JWT_SECRET=
   - PORT=3001
   - NODE_ENV=development
   - FRONTEND_URL=http://localhost:3000

   Refer to the example env files in each project for full details.

   ## Scripts Overview

   Frontend (run from `frontend/`):
   - `npm run dev` - start Next.js dev server
   - `npm run build` - build for production
   - `npm start` - start production server
   - `npm run lint` - lint the project

   Backend (run from `backend/`):
   - `npm run start:dev` - start NestJS in watch mode
   - `npm run build` - build backend
   - `npm run start:prod` - start compiled server from `dist`
   - `npm run lint` - lint the project
   - `npm run seed` - seed MongoDB with demo data

   ## Access Points

   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api

   ## Notes

   - Root-level `package.json` and monorepo workspaces were removed to keep frontend and backend fully separate.
   - Use two terminals during development—one for the frontend and one for the backend.
   - See each subfolder's README or comments for feature details and further docs.

- **State Management**: Zustand + React Query   - Update CV renderer component

- **Forms**: React Hook Form + Zod validation

- **Rich Text**: TipTap editor3. **New Theme Options**: 

- **Drag & Drop**: dnd-kit   - Extend theme schema in `src/lib/validations.ts`

   - Update theme editor in components

### Backend Technologies   - Apply styles in templates



- **Framework**: NestJS## 🚀 Deployment

- **Language**: TypeScript

- **Database**: MongoDB with native driver### Environment Setup

- **Authentication**: JWT with Passport.js1. Set up MongoDB Atlas cluster

- **Validation**: Class-validator + Class-transformer2. Configure email service (Gmail, SendGrid, etc.)

- **Documentation**: Swagger/OpenAPI3. Generate secure NEXTAUTH_SECRET

4. Set production NEXTAUTH_URL

### Development Tools

### Vercel Deployment

- **Package Manager**: npm with workspaces1. **Push to GitHub**

- **Linting**: ESLint   ```bash

- **Code Formatting**: Prettier   git add .

- **Process Manager**: Concurrently (for development)   git commit -m "Initial commit"

   git push origin main

## 📚 API Documentation   ```



Once the backend is running, visit http://localhost:3001/api/docs for interactive API documentation powered by Swagger.2. **Deploy on Vercel**

   - Connect your GitHub repository

### Main API Endpoints   - Set environment variables

   - Deploy automatically

- **Authentication**: `/api/auth/*`

- **User Management**: `/api/users/*`3. **Post-deployment**

- **CV Operations**: `/api/cvs/*`   ```bash

   # Run database migrations

## 🚀 Deployment   npx prisma db push

   

### Production Build   # Seed production database

   npm run seed

```bash   ```

# Build both projects

npm run build### Alternative Deployments

- **Docker**: Dockerfile included for containerization

# Start production servers- **Railway**: Deploy with automatic database provisioning

npm run start- **Netlify**: Static export support for frontend-only deployment

```

## 🤝 Contributing

### Environment Variables for Production

We welcome contributions! Here's how to get started:

Make sure to set appropriate production values for:

- `MONGODB_URI`1. **Fork the repository**

- `JWT_SECRET`2. **Create a feature branch**

- `NEXTAUTH_SECRET`   ```bash

- `NEXTAUTH_URL`   git checkout -b feature/amazing-feature

- `NEXT_PUBLIC_API_URL`   ```

3. **Make your changes**

## 🤝 Contributing4. **Run tests and linting**

   ```bash

1. Fork the repository   npm run lint

2. Create a feature branch: `git checkout -b feature/amazing-feature`   npm run type-check

3. Commit changes: `git commit -m 'Add amazing feature'`   ```

4. Push to branch: `git push origin feature/amazing-feature`5. **Commit your changes**

5. Open a Pull Request   ```bash

   git commit -m "Add amazing feature"

## 📝 License   ```

6. **Push and create PR**

This project is licensed under the MIT License - see the LICENSE file for details.   ```bash

   git push origin feature/amazing-feature

## 🙋‍♂️ Support   ```



For support and questions:### Development Guidelines

- 📧 Create an issue in the GitHub repository- Follow TypeScript best practices

- 📖 Check the API documentation at `/api/docs`- Use Prettier for code formatting

- 🔍 Review the code in the respective `frontend/` and `backend/` directories- Write meaningful commit messages

- Add tests for new features

---- Update documentation as needed



Built with ❤️ using Next.js and NestJS## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Prisma](https://www.prisma.io/) for type-safe database access
- [TipTap](https://tiptap.dev/) for the rich text editor

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/cv-builder/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/cv-builder/discussions)
- **Email**: support@cv-builder.com

---

**Built with ❤️ using Next.js 15, React 19, and modern web technologies.**
