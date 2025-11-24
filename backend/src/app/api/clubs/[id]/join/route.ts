import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    // Check if user is already a member
    const existingMembership = await prisma.clubMembership.findUnique({
      where: {
        userId_clubId: {
          userId,
          clubId: params.id,
        },
      },
    });

    if (existingMembership) {
      return NextResponse.json({ message: 'User is already a member of this club' }, { status: 409 });
    }

    const membership = await prisma.clubMembership.create({
      data: {
        userId,
        clubId: params.id,
      },
    });

    return NextResponse.json(membership, { status: 201 });
  } catch (error) {
    console.error(`Error joining club ${params.id}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
