import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const clubs = await prisma.club.findMany({
      include: {
        _count: {
          select: { members: true, events: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(clubs);
  } catch (error) {
    console.error('Error fetching clubs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clubs' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, category, logo } = await request.json();

    if (!name || !description || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const club = await prisma.club.create({
      data: {
        name,
        description,
        category,
        logo: logo || null,
      },
    });

    return NextResponse.json(club, { status: 201 });
  } catch (error) {
    console.error('Error creating club:', error);
    return NextResponse.json(
      { error: 'Failed to create club' },
      { status: 500 }
    );
  }
}
