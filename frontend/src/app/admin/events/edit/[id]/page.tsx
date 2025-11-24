'use client';

import { ArrowLeft, Calendar, Save } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Club {
  id: string;
  name: string;
}

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startTime: '',
    endTime: '',
    clubId: '',
  });
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchClubsAndEvent = async () => {
      try {
        // Fetch clubs
        const clubsRes = await fetch('http://localhost:3001/api/clubs');
        const clubsData = await clubsRes.json();
        setClubs(clubsData);

        // Fetch event details
        if (id) {
          const eventRes = await fetch(`http://localhost:3001/api/events/${id}`);
          if (!eventRes.ok) throw new Error('Failed to fetch event details');
          const eventData = await eventRes.json();
          
          // Format dates for datetime-local input
          const formatDateTimeLocal = (isoString: string) => {
            if (!isoString) return '';
            const date = new Date(isoString);
            // Adjust for timezone offset
            const timezoneOffset = date.getTimezoneOffset() * 60000;
            const localDate = new Date(date.getTime() - timezoneOffset);
            return localDate.toISOString().slice(0, 16);
          };

          setFormData({
            title: eventData.title,
            description: eventData.description,
            location: eventData.location,
            startTime: formatDateTimeLocal(eventData.startTime),
            endTime: formatDateTimeLocal(eventData.endTime),
            clubId: eventData.clubId,
          });
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClubsAndEvent();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`http://localhost:3001/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'An error occurred.');
      }

      setSuccess('Event updated successfully!');
      setTimeout(() => router.push('/admin/events'), 1500);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Calendar className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
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
            {success && <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">{success}</div>}

            <div>
              <label htmlFor="clubId" className="block text-sm font-medium text-gray-700 mb-2">Club</label>
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
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
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
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
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
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Location</label>
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
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
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
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
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
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
