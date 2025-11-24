import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Get dashboard stats for admin
export async function GET() {
  try {
    // Get total counts
    const [totalUsers, totalClubs, totalEvents, totalMemberships, totalAttendances] = await Promise.all([
      prisma.user.count(),
      prisma.club.count(),
      prisma.event.count(),
      prisma.clubMembership.count({ where: { status: 'ACTIVE' } }),
      prisma.attendance.count(),
    ]);

    // Get recent users
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Get clubs with member counts
    const clubs = await prisma.club.findMany({
      include: {
        _count: {
          select: { members: true, events: true },
        },
        members: {
          where: { isPresident: true },
          take: 1,
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get events with attendance
    const events = await prisma.event.findMany({
      include: {
        club: { select: { name: true } },
        _count: { select: { attendances: true } },
      },
      orderBy: { startTime: 'desc' },
      take: 10,
    });

    // Get all memberships with details
    const memberships = await prisma.clubMembership.findMany({
      where: { status: 'ACTIVE' },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        club: {
          select: { id: true, name: true },
        },
      },
      orderBy: { joinedAt: 'desc' },
    });

    return NextResponse.json({
      stats: {
        totalUsers,
        totalClubs,
        totalEvents,
        totalMemberships,
        totalAttendances,
      },
      recentUsers,
      clubs,
      events,
      memberships,
    });
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
