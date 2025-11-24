# Student Club Management Platform

A full-stack web application for managing student clubs, events, and memberships with separated backend and frontend architecture.

## 🏗️ Architecture

This project is organized into two separate applications:

- **Backend** (`/backend`) - Next.js API server with Prisma ORM and PostgreSQL (Port 3001)
- **Frontend** (`/frontend`) - Next.js client application with React and Tailwind CSS (Port 3000)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL
- npm

### 1. Set Up Database

```bash
# Start PostgreSQL
brew services start postgresql@15

# Create database (use full path if createdb not in PATH)
/opt/homebrew/opt/postgresql@15/bin/createdb student_club_db
```

### 2. Set Up Backend

```bash
cd backend
npm install

# Configure .env (already created)
# DATABASE_URL="postgresql://your_username@localhost:5432/student_club_db"

# Run migrations
npx prisma migrate dev

# Start backend server (port 3001)
npm run dev
```

### 3. Set Up Frontend

```bash
cd frontend
npm install

# Configure .env (already created)
# NEXT_PUBLIC_API_URL="http://localhost:3001"

# Start frontend server (port 3000)
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Prisma Studio**: Run `npx prisma studio` in backend folder

## 📁 Project Structure

```
StudendClubManagementPlatform/
├── backend/                    # Backend API Server
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── src/
│   │   ├── app/api/           # API routes
│   │   └── lib/prisma.ts      # Database client
│   ├── .env                   # Backend environment variables
│   └── package.json
│
├── frontend/                   # Frontend Client
│   ├── src/
│   │   ├── app/               # Next.js pages
│   │   └── lib/api.ts         # API configuration
│   ├── .env                   # Frontend environment variables
│   └── package.json
│
└── README.md                  # This file
```

## 🔑 Features

- 🔐 User Authentication (Login/Register)
- 🏢 Club Management
- 📅 Event Scheduling
- 👥 Membership Management
- 📊 Dashboard & Analytics
- 🎨 Responsive UI with Tailwind CSS
- 🔒 Role-Based Access Control

## 🛠️ Tech Stack

### Backend

- Next.js 15 (API Routes)
- TypeScript
- Prisma ORM
- PostgreSQL
- bcryptjs

### Frontend

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Lucide React
- date-fns

## 📡 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Clubs

- `GET /api/clubs` - List all clubs
- `POST /api/clubs` - Create club

### Events

- `GET /api/events` - List all events
- `POST /api/events` - Create event

## 🗄️ Database Schema

- **User** - User accounts with roles (STUDENT, ADMIN, CLUB_PRESIDENT, CLUB_MEMBER)
- **Club** - Student organizations
- **ClubMembership** - User-club relationships with status
- **Event** - Club events with scheduling
- **Attendance** - Event registrations

## 🔧 Development

### Run Both Servers

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Database Management

```bash
cd backend

# Open Prisma Studio (GUI for database)
npx prisma studio

# Create migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset
```

## 📝 Environment Variables

### Backend `.env`

```env
DATABASE_URL="postgresql://username@localhost:5432/student_club_db"
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="your-secret-key"
```

### Frontend `.env`

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

## 🚢 Production Deployment

### Backend

```bash
cd backend
npm run build
npm start  # Runs on port 3001
```

### Frontend

```bash
cd frontend
npm run build
npm start  # Runs on port 3000
```

## 🐛 Troubleshooting

**PostgreSQL command not found?**

```bash
# Use full path
/opt/homebrew/opt/postgresql@15/bin/createdb student_club_db

# Or add to PATH in ~/.zshrc
export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"
```

**Port already in use?**

```bash
# Kill process on port
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

**CORS issues?**

- Make sure backend is running on port 3001
- Frontend should have `NEXT_PUBLIC_API_URL=http://localhost:3001`
- Backend has CORS headers configured for localhost:3000

## 📄 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

**Happy Coding! 🎉**
