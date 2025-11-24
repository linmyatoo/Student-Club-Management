'use client';

import { ArrowLeft, Users, UserX } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Attendee {
  id: string;
  name: string;
  email: string;
}

interface Event {
    id: string;
    title: string;
    attendances: { user: Attendee }[];
}

export default function EventAttendeesPage() {
  const params = useParams();
  const { id } = params;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEventAttendees = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3001/api/events/${id}/attendees`);
      if (!res.ok) {
        throw new Error('Failed to fetch event attendees');
      }
      const data = await res.json();
      setEvent(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEventAttendees();
    }
  }, [id]);

  const handleRemoveAttendee = async (attendeeId: string) => {
    if (!confirm('Are you sure you want to remove this attendee?')) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/api/events/${id}/attendees/${attendeeId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to remove attendee');
      }

      fetchEventAttendees(); // Refresh list
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading attendees...</div>;
  }
  
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  const attendees = event?.attendances.map(att => att.user) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              {event?.title ? `${event.title} - Attendees` : 'Event Attendees'}
            </h1>
          </div>
          <Link href="/admin/events" className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
            Back to Events
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Total Attendees: {attendees.length}
          </h2>
          {attendees.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {attendees.map((attendee) => (
                <li key={attendee.id} className="py-4 flex justify-between items-center">
                  <div>
                    <p className="text-lg font-medium text-gray-900">{attendee.name}</p>
                    <p className="text-sm text-gray-500">{attendee.email}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveAttendee(attendee.id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200"
                  >
                    <UserX className="h-4 w-4" />
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">This event has no attendees yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
