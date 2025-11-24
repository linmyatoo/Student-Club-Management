import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Student Club Management Platform - Backend API',
    version: '1.0.0',
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
      },
      clubs: {
        list: 'GET /api/clubs',
        create: 'POST /api/clubs',
      },
      events: {
        list: 'GET /api/events',
        create: 'POST /api/events',
      },
    },
  });
}
