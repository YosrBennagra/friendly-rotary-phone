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

   ```bash

**Access Points:**   npm run dev

- 🌐 **Frontend**: http://localhost:3000   ```

- 🔧 **Backend API**: http://localhost:3001/api

- 📚 **API Documentation**: http://localhost:3001/api/docs6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Test Credentials

## 📖 Usage Guide

Use these credentials to test the application:

### Getting Started

- **Email**: `john.doe@example.com` | **Password**: `password123`1. **Sign up/Login**: Use the demo account (demo@cv-builder.com) or create your own

- **Email**: `jane.smith@example.com` | **Password**: `password123`2. **Create CV**: Click "Create New CV" from the dashboard

3. **Choose Template**: Select from Classic, Modern, or Compact templates

## 📋 Available Scripts4. **Edit Content**: Fill in your information using the intuitive editor

5. **Customize Design**: Adjust colors, fonts, and layout options

### Root Level Commands6. **Export PDF**: Download your CV as a professional PDF



```bash### Dashboard Features

npm run dev              # Start both frontend and backend- **My CVs**: View all your created CVs

npm run build            # Build both projects- **Search & Filter**: Find CVs quickly

npm run start            # Start production servers- **Quick Actions**: Edit, preview, export, or delete CVs

npm run install:all      # Install all dependencies- **Public Sharing**: Generate shareable links for recruiters

npm run lint             # Lint both projects

npm run db:seed          # Seed database with sample data### Editor Guide

```- **Sections**: Add/remove sections like Experience, Education, Skills, etc.

- **Rich Text**: Use formatting options for descriptions and summaries

### Individual Project Commands- **Drag & Drop**: Reorder sections by dragging

- **Tech Stack**: Add technology badges to experience and projects

```bash- **Auto-save**: Changes are saved automatically every few seconds

# Frontend only

npm run dev:frontend     # Start Next.js dev server## 🛠️ Tech Stack

npm run build:frontend   # Build frontend for production

npm run start:frontend   # Start frontend production server### Frontend

- **Next.js 15** - React framework with App Router

# Backend only  - **React 19** - UI library with latest features

npm run dev:backend      # Start NestJS dev server- **TypeScript** - Type-safe development

npm run build:backend    # Build backend for production- **Tailwind CSS** - Utility-first CSS framework

npm run start:backend    # Start backend production server- **shadcn/ui** - Beautiful, accessible UI components

```- **Zustand** - Lightweight state management

- **TipTap** - Rich text editor

## 🎯 Features- **React Hook Form** - Form handling with validation

- **dnd-kit** - Drag and drop functionality

### ✅ Currently Implemented

### Backend

- **🔐 Authentication System**- **Next.js API Routes** - Server-side API

  - JWT-based authentication- **Prisma** - Database ORM with type safety

  - User registration and login- **MongoDB** - NoSQL database

  - Session management- **NextAuth.js** - Authentication solution

- **Zod** - Schema validation

- **📄 CV Management**- **@react-pdf/renderer** - Server-side PDF generation

  - Create, read, update, delete CVs

  - Multiple CV templates (Classic, Modern, Compact)### Development Tools

  - Theme customization (colors, fonts, spacing)- **ESLint** - Code linting

- **Prettier** - Code formatting

- **📝 Rich Content Editing**- **TypeScript** - Type checking

  - Inline text editing- **Prisma Studio** - Database GUI

  - Multiple sections support (Experience, Education, Skills, etc.)

  - Drag-and-drop section reordering## 📁 Project Structure



- **🗄️ Database Integration**```

  - MongoDB with native drivercv-builder/

  - Comprehensive data models├── src/

  - Sample data seeding│   ├── app/                    # Next.js App Router

│   │   ├── (auth)/            # Authentication pages

- **🎨 Modern UI/UX**│   │   ├── api/               # API routes

  - Responsive design with Tailwind CSS│   │   ├── dashboard/         # Dashboard page

  - shadcn/ui components│   │   ├── editor/            # CV editor

  - Dark/light theme support│   │   └── preview/           # CV preview

│   ├── components/            # React components

- **📡 REST API**│   │   ├── ui/                # shadcn/ui components

  - Full NestJS backend API│   │   ├── cv/                # CV-specific components

  - OpenAPI/Swagger documentation│   │   └── editor/            # Editor components

  - CORS configuration for frontend-backend communication│   └── lib/                   # Utilities and configurations

│       ├── auth.ts            # NextAuth configuration

### 🚧 Planned Features│       ├── db.ts              # Database connection

│       ├── store.ts           # Zustand store

- **📱 Frontend API Integration**│       ├── validations.ts     # Zod schemas

  - Replace server actions with REST API calls│       └── pdf/               # PDF generation

  - React Query for data management├── prisma/                    # Database schema and migrations

  - Optimistic updates│   ├── schema.prisma          # Prisma schema

│   └── seed.ts               # Database seeding

- **📄 PDF Export**├── public/                    # Static assets

  - Server-side PDF generation└── tailwind.config.ts        # Tailwind configuration

  - Multiple export formats```

  - Print-to-PDF client fallback

## 🔧 Development

- **🔗 Sharing & Collaboration**

  - Public CV sharing### Available Scripts

  - Share tokens and links

  - Version management```bash

# Development

- **🎨 Advanced Customization**npm run dev          # Start development server

  - Custom templatesnpm run build        # Build for production

  - Advanced theme optionsnpm run start        # Start production server

  - Section customization

# Database

## 🏗️ Project Structurenpm run db:push      # Push schema changes to database

npm run db:studio    # Open Prisma Studio

```npm run db:generate  # Generate Prisma client

friendly-rotary-phone/npm run seed         # Seed database with demo data

├── frontend/                 # Next.js application

│   ├── src/# Code Quality

│   │   ├── app/             # App Router pagesnpm run lint         # Run ESLint

│   │   ├── components/      # React componentsnpm run format       # Format code with Prettier

│   │   ├── lib/            # Utilities and configurationsnpm run type-check   # Run TypeScript type checking

│   │   └── styles/         # Global styles```

│   ├── package.json

│   └── next.config.ts### Database Management

├── backend/                 # NestJS API server

│   ├── src/```bash

│   │   ├── auth/           # Authentication module# Reset database

│   │   ├── cvs/            # CV management modulenpx prisma db push --force-reset

│   │   ├── users/          # User management modulenpm run seed

│   │   ├── database/       # Database service and models

│   │   └── main.ts         # Application entry point# View data

│   ├── package.jsonnpm run db:studio

│   └── nest-cli.json

├── .github/# Generate types after schema changes

│   └── instructions/       # Project instructionsnpm run db:generate

├── package.json            # Workspace configuration```

└── README.md              # This file

```### Adding New Features



## 🛠️ Technology Stack1. **New CV Section**: 

   - Update Zod schema in `src/lib/validations.ts`

### Frontend Technologies   - Add to CV templates in `src/components/cv/templates/`

   - Create editor component in `src/components/editor/`

- **Framework**: Next.js 15+ with App Router

- **Language**: TypeScript2. **New Template**: 

- **Styling**: Tailwind CSS   - Create template component in `src/components/cv/templates/`

- **Components**: shadcn/ui   - Add to enum in `prisma/schema.prisma`

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
