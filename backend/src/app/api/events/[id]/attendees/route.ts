import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET attendees of an event
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const eventWithAttendees = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        attendances: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!eventWithAttendees) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(eventWithAttendees);
  } catch (error) {
    console.error('Error fetching event attendees:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
