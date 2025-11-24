import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// DELETE a member from a club
export async function DELETE(request: Request, { params }: { params: { id: string, memberId: string } }) {
  try {
    // The memberId from the URL is the User's ID. We need to find the ClubMembership record.
    const membership = await prisma.clubMembership.findFirst({
      where: {
        clubId: params.id,
        userId: params.memberId,
      },
    });

    if (!membership) {
      return NextResponse.json({ message: 'Membership not found' }, { status: 404 });
    }

    // Now delete the ClubMembership record by its own ID
    await prisma.clubMembership.delete({
      where: {
        id: membership.id,
      },
    });

    return NextResponse.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Error removing member:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
