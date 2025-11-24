'use client';

import { ArrowLeft, Calendar, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Club {
  id: string;
  name: string;
}

export default function NewEventPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startTime: '',
    endTime: '',
    clubId: '',
  });
  const [clubs, setClubs] = useState<Club[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }

    // Fetch clubs to populate the dropdown
    const fetchClubs = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/clubs');
        const data = await res.json();
        setClubs(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, clubId: data[0].id }));
        }
      } catch (err) {
        console.error('Failed to fetch clubs', err);
        setError('Failed to load clubs for selection.');
      }
    };
    fetchClubs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.clubId) {
      setError('Please select a club.');
      return;
    }

    if (!currentUser) {
      setError('You must be logged in to create an event.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          createdById: currentUser.id,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'An error occurred. Please try again.');
      }

      router.push('/admin/events');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Calendar className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
          </div>
          <Link href="/admin/events" className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
            Back to Events
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-8 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

            <div>
              <label htmlFor="clubId" className="block text-sm font-medium text-gray-700 mb-2">
                Club
              </label>
              <select
                id="clubId"
                name="clubId"
                value={formData.clubId}
                onChange={(e) => setFormData({ ...formData, clubId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
              >
                {clubs.map(club => (
                  <option key={club.id} value={club.id}>{club.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Event Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
              />
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  id="startTime"
                  name="startTime"
                  type="datetime-local"
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                />
              </div>
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <input
                  id="endTime"
                  name="endTime"
                  type="datetime-local"
                  required
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
              >
                <Save className="h-5 w-5" />
                Create Event
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
