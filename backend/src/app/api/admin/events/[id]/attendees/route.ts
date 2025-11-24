import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Get event attendees (admin only)
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;

    const attendees = await prisma.attendance.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            studentId: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(attendees);
  } catch (error) {
    console.error('Error fetching event attendees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendees' },
      { status: 500 }
    );
  }
}
