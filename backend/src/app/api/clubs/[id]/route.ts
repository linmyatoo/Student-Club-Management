import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET a single club by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const club = await prisma.club.findUnique({
      where: { id: params.id },
    });
    if (!club) {
      return NextResponse.json({ message: 'Club not found' }, { status: 404 });
    }
    return NextResponse.json(club);
  } catch (error) {
    console.error('Error fetching club:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (update) a club by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { name, description, category, logo } = await request.json();
    const updatedClub = await prisma.club.update({
      where: { id: params.id },
      data: {
        name,
        description,
        category,
        logo,
      },
    });
    return NextResponse.json(updatedClub);
  } catch (error) {
    console.error('Error updating club:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
