'use client';

import { Award, Calendar, Plus, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Club {
  id: string;
  name: string;
  description: string;
  category: string;
  logo: string | null;
  _count: {
    members: number;
    events: number;
  };
}

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const res = await fetch('/api/clubs');
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
              <Award className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">Student Clubs</h1>
            </div>
            <div className="flex gap-4">
              <Link href="/dashboard" className="px-4 py-2 text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/events" className="px-4 py-2 text-gray-600 hover:text-gray-900">
                Events
              </Link>
              <Link
                href="/clubs/new"
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Plus className="h-5 w-5" />
                Create Club
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading clubs...</p>
          </div>
        ) : clubs.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No clubs yet</h3>
            <p className="text-gray-600 mb-4">Be the first to create a club!</p>
            <Link
              href="/clubs/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Plus className="h-5 w-5" />
              Create Club
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function ClubCard({ club }: { club: Club }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-32 flex items-center justify-center">
        {club.logo ? (
          <img src={club.logo} alt={club.name} className="h-20 w-20 rounded-full bg-white" />
        ) : (
          <Award className="h-20 w-20 text-white" />
        )}
      </div>
      <div className="p-6">
        <div className="mb-2">
          <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 text-xs font-semibold rounded-full">
            {club.category}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{club.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{club.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{club._count.members} members</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{club._count.events} events</span>
          </div>
        </div>
        <Link
          href={`/clubs/${club.id}`}
          className="block w-full text-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
