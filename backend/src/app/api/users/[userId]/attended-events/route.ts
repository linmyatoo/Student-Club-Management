import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;

  try {
    const attendedEvents = await prisma.attendance.findMany({
      where: {
        userId: userId,
      },
      select: {
        eventId: true,
      },
    });

    const eventIds = attendedEvents.map(a => a.eventId);

    return NextResponse.json(eventIds, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch attended events:', error);
    return NextResponse.json({ error: 'Failed to fetch attended events' }, { status: 500 });
  }
}
