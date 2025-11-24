'use client';

import { Award, Building2, Plus, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Club {
  id: string;
  name: string;
  description: string;
  category: string;
  createdAt: string;
  _count: {
    members: number;
    events: number;
  };
}

export default function AdminClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/clubs');
      const data = await res.json();
      setClubs(data);
    } catch (error) {
      console.error('Error fetching clubs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Award className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">Manage Clubs</h1>
            </div>
            <div className="flex gap-4">
              <Link href="/admin/dashboard" className="px-4 py-2 text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/admin/clubs" className="px-4 py-2 text-purple-600 font-medium hover:text-purple-700">
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
        {/* Create Club Button */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">All Clubs</h2>
          <Link
            href="/admin/clubs/new"
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
          >
            <Plus className="h-5 w-5" />
            Create New Club
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading clubs...</p>
          </div>
        ) : clubs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No clubs yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first club</p>
            <Link
              href="/admin/clubs/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
            >
              <Plus className="h-5 w-5" />
              Create New Club
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club) => (
              <div key={club.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <Building2 className="h-12 w-12 text-purple-600" />
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                    {club.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{club.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{club.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{club._count.members} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    <span>{club._count.events} events</span>
                  </div>
                </div>
                <div className="mt-4 border-t pt-4 flex justify-end gap-3">
                  <Link
                    href={`/admin/clubs/edit/${club.id}`}
                    className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-100 rounded-lg hover:bg-purple-200"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/admin/clubs/members/${club.id}`}
                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200"
                  >
                    Members
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
