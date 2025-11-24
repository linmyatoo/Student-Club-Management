import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    const attendances = await prisma.attendance.findMany({
      where: { 
        userId: params.userId,
        event: {
          // Filter for events that are upcoming
          startTime: {
            gte: new Date(),
          }
        }
      },
      include: {
        event: {
          include: {
            club: {
              select: { name: true }
            }
          }
        },
      },
      orderBy: {
        event: {
          startTime: 'asc',
        }
      }
    });

    // Extract just the event data from the attendances
    const events = attendances.map(a => a.event);

    return NextResponse.json(events);
  } catch (error) {
    console.error(`Error fetching events for user ${params.userId}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
