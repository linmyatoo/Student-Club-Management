import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    const memberships = await prisma.clubMembership.findMany({
      where: { userId: params.userId },
      include: {
        club: true, // Include the full club object
      },
    });

    // Extract just the club data from the memberships
    const clubs = memberships.map(m => m.club);

    return NextResponse.json(clubs);
  } catch (error) {
    console.error(`Error fetching clubs for user ${params.userId}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
