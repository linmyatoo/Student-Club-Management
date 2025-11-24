'use client';

import { Award, Building2, Calendar, TrendingUp, UserCheck, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface DashboardData {
  stats: {
    totalUsers: number;
    totalClubs: number;
    totalEvents: number;
    totalMemberships: number;
    totalAttendances: number;
  };
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }>;
  clubs: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    _count: { members: number; events: number };
    members: Array<{ user: { name: string; email: string } }>;
  }>;
  events: Array<{
    id: string;
    title: string;
    startTime: string;
    club: { name: string };
    _count: { attendances: number };
  }>;
  memberships: Array<{
    id: string;
    joinedAt: string;
    isPresident: boolean;
    user: { id: string; name: string; email: string };
    club: { id: string; name: string };
  }>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/admin/dashboard');
      const dashboardData = await res.json();
      setData(dashboardData);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600">Failed to load dashboard</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Award className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex gap-4">
              <Link href="/admin/dashboard" className="px-4 py-2 text-purple-600 font-medium hover:text-purple-700">
                Dashboard
              </Link>
              <Link href="/admin/clubs" className="px-4 py-2 text-gray-600 hover:text-gray-900">
                Manage Clubs
              </Link>
              <Link href="/admin/events" className="px-4 py-2 text-gray-600 hover:text-gray-900">
                Manage Events
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem('user');
                  window.location.href = '/';
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard icon={<Users />} title="Total Users" value={data.stats.totalUsers} color="blue" />
          <StatCard icon={<Building2 />} title="Total Clubs" value={data.stats.totalClubs} color="purple" />
          <StatCard icon={<Calendar />} title="Total Events" value={data.stats.totalEvents} color="green" />
          <StatCard icon={<UserCheck />} title="Memberships" value={data.stats.totalMemberships} color="indigo" />
          <StatCard icon={<TrendingUp />} title="Attendances" value={data.stats.totalAttendances} color="orange" />
        </div>

        {/* Clubs Overview */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">All Clubs</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">Club Name</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">Members</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">Events</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">President</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.clubs.map((club) => (
                    <tr key={club.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{club.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{club.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{club._count.members}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{club._count.events}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {club.members[0]?.user.name || 'None'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link href={`/admin/clubs/${club.id}/members`} className="text-primary-600 hover:text-primary-900">
                          View Members
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Memberships */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Memberships</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {data.memberships.slice(0, 10).map((membership) => (
                <div key={membership.id} className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">{membership.user.name}</p>
                    <p className="text-sm text-gray-500">{membership.user.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{membership.club.name}</p>
                    <p className="text-sm text-gray-500">
                      {membership.isPresident && <span className="text-primary-600 font-semibold">President • </span>}
                      {new Date(membership.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Users</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {data.recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, title, value, color }: { 
  icon: React.ReactNode; 
  title: string; 
  value: number;
  color: string;
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${colors[color as keyof typeof colors]} p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
