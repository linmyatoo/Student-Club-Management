import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Get club members (admin only)
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const clubId = params.id;

    const members = await prisma.clubMembership.findMany({
      where: { clubId },
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
      orderBy: { joinedAt: 'desc' },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching club members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}
