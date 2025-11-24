'use client';

import { ArrowLeft, Users, UserX } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Member {
  id: string;
  name: string;
  email: string;
}

interface Club {
    id: string;
    name: string;
    members: Member[];
}

export default function ClubMembersPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchClubMembers();
    }
  }, [id]);

  const fetchClubMembers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3001/api/clubs/${id}/members`);
      if (!res.ok) {
        throw new Error('Failed to fetch club members');
      }
      const data = await res.json();
      setClub(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/api/clubs/${id}/members/${memberId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to remove member');
      }

      // Refresh members list
      fetchClubMembers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading members...</div>;
  }
  
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              {club?.name ? `${club.name} - Members` : 'Club Members'}
            </h1>
          </div>
          <Link href="/admin/clubs" className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
            Back to Clubs
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Total Members: {club?.members?.length || 0}
          </h2>
          {club?.members && club.members.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {club.members.map((member) => (
                <li key={member.id} className="py-4 flex justify-between items-center">
                  <div>
                    <p className="text-lg font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveMember(member.id)}
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
              <p className="text-gray-600">This club has no members yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
