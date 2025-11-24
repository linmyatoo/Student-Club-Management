import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET a single event by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: params.id },
    });
    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (update) an event by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { title, description, location, startTime, endTime, clubId } = await request.json();
    const updatedEvent = await prisma.event.update({
      where: { id: params.id },
      data: {
        title,
        description,
        location,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        clubId,
      },
    });
    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE an event by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.event.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
