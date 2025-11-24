import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const events = await prisma.event.findMany({
      where: {
        clubId: params.id,
        startTime: {
          gte: new Date(), // Only fetch upcoming or ongoing events
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error(`Error fetching events for club ${params.id}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
