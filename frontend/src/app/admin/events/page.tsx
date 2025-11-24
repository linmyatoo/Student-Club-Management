'use client';

import { format } from 'date-fns';
import { Award, Calendar, MapPin, Plus, Trash2, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  status: string;
  maxAttendees: number | null;
  club: {
    id: string;
    name: string;
  };
  _count: {
    attendances: number;
  };
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/events');
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await fetch(`http://localhost:3001/api/events/${id}`, {
          method: 'DELETE',
        });
        setEvents(events.filter((event) => event.id !== id));
      } catch (error) {
        console.error('Error deleting event:', error);
      }
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
              <h1 className="text-2xl font-bold text-gray-900">Manage Events</h1>
            </div>
            <div className="flex gap-4">
              <Link href="/admin/dashboard" className="px-4 py-2 text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/admin/clubs" className="px-4 py-2 text-gray-600 hover:text-gray-900">
                Manage Clubs
              </Link>
              <Link href="/admin/events" className="px-4 py-2 text-purple-600 font-medium hover:text-purple-700">
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
        {/* Create Event Button */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">All Events</h2>
          <Link
            href="/admin/events/new"
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
          >
            <Plus className="h-5 w-5" />
            Create New Event
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first event</p>
            <Link
              href="/admin/events/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
            >
              <Plus className="h-5 w-5" />
              Create New Event
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">{event.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        event.status === 'UPCOMING' ? 'bg-green-100 text-green-800' :
                        event.status === 'ONGOING' ? 'bg-blue-100 text-blue-800' :
                        event.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                    <p className="text-sm text-purple-600 font-medium mb-2">{event.club.name}</p>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(event.startTime), 'PPp')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>
                          {event._count.attendances} attending
                          {event.maxAttendees && ` / ${event.maxAttendees} max`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Link
                      href={`/admin/events/${event.id}/edit`}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                    >
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(event.id)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                    <Link href={`/admin/events/attendees/${event.id}`} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 bg-green-100 rounded-lg hover:bg-green-200">
                      <Users className="h-4 w-4" />
                      Attendees
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
