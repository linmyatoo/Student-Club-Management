# Frontend - Student Club Management Platform

Frontend client for the Student Club Management Platform.

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Lucide React (Icons)
- date-fns

## Setup

1. **Install dependencies**:

```bash
npm install
```

2. **Configure environment variables**:
   Create `.env` file:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

3. **Start the development server**:

```bash
npm run dev
```

Frontend will run on **http://localhost:3000**

## Pages

- `/` - Landing page
- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/dashboard` - User dashboard
- `/clubs` - Browse clubs
- `/events` - View events

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── auth/           # Auth pages
│   │   ├── clubs/          # Club pages
│   │   ├── dashboard/      # Dashboard
│   │   ├── events/         # Event pages
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   └── lib/
│       └── api.ts          # API configuration
├── tailwind.config.ts
└── package.json
```

## Development

The frontend communicates with the backend API at `http://localhost:3001`. Make sure the backend server is running.

## Build for Production

```bash
npm run build
npm start
```
