import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Join a club
export async function POST(request: Request) {
  try {
    const { userId, clubId } = await request.json();

    if (!userId || !clubId) {
      return NextResponse.json(
        { error: 'Missing userId or clubId' },
        { status: 400 }
      );
    }

    // Check if already a member
    const existing = await prisma.clubMembership.findUnique({
      where: {
        userId_clubId: { userId, clubId },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Already a member of this club' },
        { status: 400 }
      );
    }

    const membership = await prisma.clubMembership.create({
      data: {
        userId,
        clubId,
        status: 'ACTIVE',
      },
      include: {
        club: true,
      },
    });

    return NextResponse.json(membership, { status: 201 });
  } catch (error) {
    console.error('Error joining club:', error);
    return NextResponse.json(
      { error: 'Failed to join club' },
      { status: 500 }
    );
  }
}

// Leave a club
export async function DELETE(request: Request) {
  try {
    const { userId, clubId } = await request.json();

    if (!userId || !clubId) {
      return NextResponse.json(
        { error: 'Missing userId or clubId' },
        { status: 400 }
      );
    }

    await prisma.clubMembership.delete({
      where: {
        userId_clubId: { userId, clubId },
      },
    });

    return NextResponse.json({ message: 'Left club successfully' });
  } catch (error) {
    console.error('Error leaving club:', error);
    return NextResponse.json(
      { error: 'Failed to leave club' },
      { status: 500 }
    );
  }
}
