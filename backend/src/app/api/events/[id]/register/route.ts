import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const existingAttendance = await prisma.attendance.findUnique({
        where: {
            eventId_userId: {
                userId,
                eventId: params.id,
            }
        }
    });

    if (existingAttendance) {
        return NextResponse.json({ message: 'User is already registered for this event' }, { status: 409 });
    }

    const attendance = await prisma.attendance.create({
      data: {
        userId,
        eventId: params.id,
      },
    });

    return NextResponse.json(attendance, { status: 201 });
  } catch (error) {
    console.error(`Error registering for event ${params.id}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
