import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// DELETE an attendee from an event
export async function DELETE(request: Request, { params }: { params: { id: string, attendeeId: string } }) {
  try {
    // The attendeeId from the URL is the User's ID. We need to find the Attendance record.
    const attendance = await prisma.attendance.findFirst({
      where: {
        eventId: params.id,
        userId: params.attendeeId,
      },
    });

    if (!attendance) {
      return NextResponse.json({ message: 'Attendance not found' }, { status: 404 });
    }

    // Now delete the Attendance record by its own ID
    await prisma.attendance.delete({
      where: {
        id: attendance.id,
      },
    });

    return NextResponse.json({ message: 'Attendee removed successfully' });
  } catch (error) {
    console.error('Error removing attendee:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
