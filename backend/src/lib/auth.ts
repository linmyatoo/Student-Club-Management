import { prisma } from '@/lib/prisma';

// Middleware to check authentication and role
export async function checkAuth(request: Request, requiredRole?: 'ADMIN' | 'USER') {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader) {
    return { error: 'Unauthorized', status: 401 };
  }

  // In a real app, validate JWT token here
  // For now, we'll use a simple user ID from header
  const userId = authHeader.replace('Bearer ', '');

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { error: 'User not found', status: 404 };
    }

    if (requiredRole && user.role !== requiredRole && user.role !== 'ADMIN') {
      return { error: 'Forbidden', status: 403 };
    }

    return { user, status: 200 };
  } catch (error) {
    return { error: 'Authentication failed', status: 500 };
  }
}
