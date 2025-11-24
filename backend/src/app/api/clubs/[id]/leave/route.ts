import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    await prisma.clubMembership.delete({
      where: {
        userId_clubId: {
          userId,
          clubId: params.id,
        },
      },
    });

    return NextResponse.json({ message: 'Successfully left the club' }, { status: 200 });
  } catch (error) {
    console.error(`Error leaving club ${params.id}:`, error);
    // Prisma throws an error if the record to delete is not found, handle this gracefully
    if (error.code === 'P2025') {
        return NextResponse.json({ message: 'Membership not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
