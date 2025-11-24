# Backend - Student Club Management Platform API

Backend API server for the Student Club Management Platform.

## Tech Stack

- Next.js 15 (API Routes)
- TypeScript
- Prisma ORM
- PostgreSQL
- bcryptjs for password hashing

## User Roles

- **USER** - Regular users (default)
- **ADMIN** - Administrators with elevated permissions

## Setup

1. **Install dependencies**:

```bash
npm install
```

2. **Configure environment variables**:
   Create `.env` file:

```env
DATABASE_URL="postgresql://username@localhost:5432/student_club_db"
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="your-secret-key-here"
```

3. **Run migrations**:

```bash
npx prisma migrate dev
```

4. **Start the server**:

```bash
npm run dev
```

Server will run on **http://localhost:3001**

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Clubs

- `GET /api/clubs` - List all clubs
- `POST /api/clubs` - Create new club

### Events

- `GET /api/events` - List all events
- `POST /api/events` - Create new event

## Database

Access Prisma Studio to view/edit data:

```bash
npx prisma studio
```

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma       # Database schema
├── src/
│   ├── app/
│   │   └── api/            # API routes
│   │       ├── auth/
│   │       ├── clubs/
│   │       └── events/
│   └── lib/
│       └── prisma.ts       # Prisma client
└── package.json
```
