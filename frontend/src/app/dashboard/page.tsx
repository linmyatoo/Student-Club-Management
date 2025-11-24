'use client';

import { Compass, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Club {
    id: string;
    name: string;
    description: string;
}

interface Event {
    id: string;
    title: string;
    startTime: string;
    description: string;
}

export default function StudentDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [allClubs, setAllClubs] = useState<Club[]>([]);
  const [myClubIds, setMyClubIds] = useState<Set<string>>(new Set());
  const [eventsByClub, setEventsByClub] = useState<Record<string, Event[]>>({});
  const [attendedEventIds, setAttendedEventIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState<Set<string>>(new Set());

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchAllClubs();
      fetchMyClubs(parsedUser.id);
      fetchAttendedEvents(parsedUser.id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAllClubs = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/clubs');
      if (!res.ok) throw new Error('Failed to fetch clubs');
      const data = await res.json();
      setAllClubs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyClubs = async (userId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/users/${userId}/clubs`);
      if (!res.ok) return;
      const myClubsData: Club[] = await res.json();
      const clubIds = new Set(myClubsData.map(club => club.id));
      setMyClubIds(clubIds);
      clubIds.forEach(clubId => fetchEventsForClub(clubId));
    } catch (error) {
      console.error('Failed to fetch my clubs', error);
    }
  };

  const fetchEventsForClub = async (clubId: string) => {
    setLoadingEvents(prev => new Set(prev).add(clubId));
    try {
      const res = await fetch(`http://localhost:3001/api/clubs/${clubId}/events`);
      if (res.ok) {
        const eventsData = await res.json();
        setEventsByClub(prev => ({ ...prev, [clubId]: eventsData }));
      }
    } catch (error) {
      console.error(`Failed to fetch events for club ${clubId}`, error);
    } finally {
      setLoadingEvents(prev => {
        const newSet = new Set(prev);
        newSet.delete(clubId);
        return newSet;
      });
    }
  };

  const fetchAttendedEvents = async (userId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/users/${userId}/attended-events`);
      if (res.ok) {
        const eventIds = await res.json();
        setAttendedEventIds(new Set(eventIds));
      }
    } catch (error) {
      console.error('Failed to fetch attended events', error);
    }
  };

  const handleJoinClub = async (clubId: string) => {
    if (!user) return;
    try {
      const res = await fetch(`http://localhost:3001/api/clubs/${clubId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      if (res.ok) {
        setMyClubIds(prev => new Set(prev).add(clubId));
        fetchEventsForClub(clubId);
      } else {
        console.error('Failed to join club');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLeaveClub = async (clubId: string) => {
    if (!user) return;
    try {
      const res = await fetch(`http://localhost:3001/api/clubs/${clubId}/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      if (res.ok) {
        setMyClubIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(clubId);
          return newSet;
        });
        setEventsByClub(prev => {
            const newState = {...prev};
            delete newState[clubId];
            return newState;
        });
      } else {
        console.error('Failed to leave club');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAttendEvent = async (eventId: string) => {
    if (!user) return;
    try {
      const res = await fetch(`http://localhost:3001/api/events/${eventId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      if (res.ok) {
        setAttendedEventIds(prev => new Set(prev).add(eventId));
      } else {
        console.error('Failed to attend event');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnregisterEvent = async (eventId: string) => {
    if (!user) return;
    try {
      const res = await fetch(`http://localhost:3001/api/events/${eventId}/unregister`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      if (res.ok) {
        setAttendedEventIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(eventId);
          return newSet;
        });
      } else {
        console.error('Failed to unregister from event');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col flex-shrink-0">
        <div className="p-6 text-center border-b">
          <h2 className="text-2xl font-bold text-blue-600">
            <Link href="/dashboard">Student Hub</Link>
          </h2>
          {user && <p className="text-gray-600 mt-2">Welcome, {user.name}!</p>}
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-blue-600 bg-blue-50 rounded-lg font-semibold">
            <Compass className="h-5 w-5" />
            Browse & Join Clubs
          </Link>
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 text-red-600 hover:bg-red-100 rounded-lg"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Clubs & Events</h1>
        <div className="space-y-6 mb-12">
          {allClubs.filter(club => myClubIds.has(club.id)).map(club => (
            <div key={club.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800">{club.name}</h2>
                <p className="text-gray-600 mt-1">{club.description}</p>
              </div>
              <div className="bg-gray-50 p-6 border-t">
                <h3 className="font-semibold text-lg text-gray-700 mb-4">Upcoming Events</h3>
                {loadingEvents.has(club.id) ? (
                  <p>Loading events...</p>
                ) : (
                  eventsByClub[club.id] && eventsByClub[club.id].length > 0 ? (
                    <ul className="space-y-4">
                      {eventsByClub[club.id].map(event => {
                        const isAttending = attendedEventIds.has(event.id);
                        return (
                          <li key={event.id} className="p-4 bg-white border rounded-lg flex justify-between items-center">
                            <div>
                              <h4 className="font-bold">{event.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                              <p className="text-xs text-gray-500 mt-2">
                                {new Date(event.startTime).toLocaleString()}
                              </p>
                            </div>
                            {isAttending ? (
                                    <button
                                      disabled
                                      className="bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg cursor-not-allowed"
                                    >
                                      Attending
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleAttendEvent(event.id)}
                                      className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                      Attend
                                    </button>
                                  )}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No upcoming events for this club.</p>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">All Clubs</h1>
        
        {loading ? (
          <p>Loading clubs...</p>
        ) : (
          <div className="space-y-6">
            {allClubs.filter(club => !myClubIds.has(club.id)).map(club => {
              const isMember = myClubIds.has(club.id);
              return (
                <div key={club.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6 flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{club.name}</h2>
                      <p className="text-gray-600 mt-1">{club.description}</p>
                    </div>
                    {isMember ? (
                      <button
                        disabled
                        className="bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg cursor-not-allowed"
                      >
                        Joined
                      </button>
                    ) : (
                      <button
                        onClick={() => handleJoinClub(club.id)}
                        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Join Club
                      </button>
                    )}
                  </div>
                  
                  {isMember && (
                    <div className="bg-gray-50 p-6 border-t">
                      <h3 className="font-semibold text-lg text-gray-700 mb-4">Upcoming Events</h3>
                      {loadingEvents.has(club.id) ? (
                        <p>Loading events...</p>
                      ) : (
                        eventsByClub[club.id] && eventsByClub[club.id].length > 0 ? (
                          <ul className="space-y-4">
                            {eventsByClub[club.id].map(event => {
                              const isAttending = attendedEventIds.has(event.id);
                              return (
                                <li key={event.id} className="p-4 bg-white border rounded-lg flex justify-between items-center">
                                  <div>
                                    <h4 className="font-bold">{event.title}</h4>
                                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                                    <p className="text-xs text-gray-500 mt-2">
                                      {new Date(event.startTime).toLocaleString()}
                                    </p>
                                  </div>
                                  {isAttending ? (
                                    <button
                                      disabled
                                      className="bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg cursor-not-allowed"
                                    >
                                      Attending
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleAttendEvent(event.id)}
                                      className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                      Attend
                                    </button>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <p className="text-gray-500">No upcoming events for this club.</p>
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
