import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    await prisma.attendance.delete({
      where: {
        userId_eventId: {
          userId,
          eventId: params.id,
        },
      },
    });

    return NextResponse.json({ message: 'Successfully unregistered from the event' }, { status: 200 });
  } catch (error) {
    console.error(`Error unregistering from event ${params.id}:`, error);
    if (error.code === 'P2025') {
        return NextResponse.json({ message: 'Attendance not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
