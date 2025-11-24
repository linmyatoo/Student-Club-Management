'use client';

import { format } from 'date-fns';
import { Award, Calendar, Clock, MapPin, Plus, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  maxAttendees: number | null;
  status: string;
  club: {
    id: string;
    name: string;
  };
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    attendances: number;
  };
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
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
              <Calendar className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">Events</h1>
            </div>
            <div className="flex gap-4">
              <Link href="/dashboard" className="px-4 py-2 text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/clubs" className="px-4 py-2 text-gray-600 hover:text-gray-900">
                Clubs
              </Link>
              <Link
                href="/events/new"
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Plus className="h-5 w-5" />
                Create Event
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events yet</h3>
            <p className="text-gray-600 mb-4">Create your first event!</p>
            <Link
              href="/events/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Plus className="h-5 w-5" />
              Create Event
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-32 flex-shrink-0">
          <div className="bg-primary-600 text-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold">
              {format(new Date(event.startTime), 'd')}
            </div>
            <div className="text-sm">
              {format(new Date(event.startTime), 'MMM yyyy')}
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{event.title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Award className="h-4 w-4" />
                <span>{event.club.name}</span>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              event.status === 'UPCOMING' ? 'bg-green-100 text-green-800' :
              event.status === 'ONGOING' ? 'bg-blue-100 text-blue-800' :
              event.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
              'bg-red-100 text-red-800'
            }`}>
              {event.status}
            </span>
          </div>
          
          <p className="text-gray-600 mb-4">{event.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-5 w-5" />
              <span>
                {format(new Date(event.startTime), 'PPp')} - {format(new Date(event.endTime), 'p')}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-5 w-5" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="h-5 w-5" />
              <span>
                {event._count.attendances} attending
                {event.maxAttendees && ` / ${event.maxAttendees} max`}
              </span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Link
              href={`/events/${event.id}`}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
            >
              View Details
            </Link>
            <button className="px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 font-medium">
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
