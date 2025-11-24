import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        club: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: { attendances: true },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, description, location, startTime, endTime, maxAttendees, clubId, createdById } = await request.json();

    if (!title || !description || !location || !startTime || !endTime || !clubId || !createdById) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        location,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        maxAttendees: maxAttendees || null,
        clubId,
        createdById,
      },
      include: {
        club: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
