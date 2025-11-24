import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET members of a club
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const clubData = await prisma.club.findUnique({
      where: { id: params.id },
      include: {
        members: { // This is the list of ClubMembership records
          include: {
            user: { // Include the related User for each membership
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!clubData) {
      return NextResponse.json({ message: 'Club not found' }, { status: 404 });
    }

    // Transform the data to match frontend expectations
    const members = clubData.members.map(membership => membership.user);
    const response = {
      id: clubData.id,
      name: clubData.name,
      members: members,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching club members:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
