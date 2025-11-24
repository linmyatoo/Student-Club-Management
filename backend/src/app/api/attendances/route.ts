import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Register for event
export async function POST(request: Request) {
  try {
    const { userId, eventId } = await request.json();

    if (!userId || !eventId) {
      return NextResponse.json(
        { error: 'Missing userId or eventId' },
        { status: 400 }
      );
    }

    // Check if already registered
    const existing = await prisma.attendance.findUnique({
      where: {
        eventId_userId: { userId, eventId },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Already registered for this event' },
        { status: 400 }
      );
    }

    // Check event capacity
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: { select: { attendances: true } },
      },
    });

    if (event?.maxAttendees && event._count.attendances >= event.maxAttendees) {
      return NextResponse.json(
        { error: 'Event is full' },
        { status: 400 }
      );
    }

    const attendance = await prisma.attendance.create({
      data: {
        userId,
        eventId,
        status: 'registered',
      },
      include: {
        event: true,
      },
    });

    return NextResponse.json(attendance, { status: 201 });
  } catch (error) {
    console.error('Error registering for event:', error);
    return NextResponse.json(
      { error: 'Failed to register for event' },
      { status: 500 }
    );
  }
}

// Unregister from event
export async function DELETE(request: Request) {
  try {
    const { userId, eventId } = await request.json();

    if (!userId || !eventId) {
      return NextResponse.json(
        { error: 'Missing userId or eventId' },
        { status: 400 }
      );
    }

    await prisma.attendance.delete({
      where: {
        eventId_userId: { userId, eventId },
      },
    });

    return NextResponse.json({ message: 'Unregistered successfully' });
  } catch (error) {
    console.error('Error unregistering from event:', error);
    return NextResponse.json(
      { error: 'Failed to unregister' },
      { status: 500 }
    );
  }
}
