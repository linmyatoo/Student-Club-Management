'use client';

import { ArrowLeft, Award, Save } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditClubPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'ACADEMIC',
    logo: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchClubDetails();
    }
  }, [id]);

  const fetchClubDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3001/api/clubs/${id}`);
      if (!res.ok) {
        throw new Error('Failed to fetch club details');
      }
      const data = await res.json();
      setFormData({
        name: data.name,
        description: data.description,
        category: data.category,
        logo: data.logo || '',
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`http://localhost:3001/api/clubs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'An error occurred. Please try again.');
      }

      setSuccess('Club updated successfully!');
      setTimeout(() => {
        router.push('/admin/clubs');
      }, 1500);
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
            <Award className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">Edit Club</h1>
          </div>
          <Link href="/admin/clubs" className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
            Back to Clubs
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-8 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
            {success && <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">{success}</div>}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Club Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                placeholder="e.g., Coding Club"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                placeholder="A brief description of the club's purpose and activities."
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
              >
                <option value="ACADEMIC">Academic</option>
                <option value="SPORTS">Sports</option>
                <option value="ARTS">Arts</option>
                <option value="TECHNOLOGY">Technology</option>
                <option value="SOCIAL">Social</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL (Optional)
              </label>
              <input
                id="logo"
                name="logo"
                type="url"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                placeholder="https://example.com/logo.png"
              />
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
