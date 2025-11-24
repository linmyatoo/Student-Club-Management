'use client';

import { Award, Calendar, Plus, Users } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Award className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex gap-4">
              <Link href="/" className="px-4 py-2 text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link href="/clubs" className="px-4 py-2 text-gray-600 hover:text-gray-900">
                Clubs
              </Link>
              <Link href="/events" className="px-4 py-2 text-gray-600 hover:text-gray-900">
                Events
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<Users className="h-8 w-8 text-blue-600" />}
            title="My Clubs"
            value="5"
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={<Calendar className="h-8 w-8 text-green-600" />}
            title="Upcoming Events"
            value="12"
            bgColor="bg-green-50"
          />
          <StatCard
            icon={<Award className="h-8 w-8 text-purple-600" />}
            title="Total Members"
            value="150"
            bgColor="bg-purple-50"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionButton
              icon={<Plus className="h-5 w-5" />}
              label="Create Club"
              href="/clubs/new"
            />
            <ActionButton
              icon={<Calendar className="h-5 w-5" />}
              label="Create Event"
              href="/events/new"
            />
            <ActionButton
              icon={<Users className="h-5 w-5" />}
              label="Browse Clubs"
              href="/clubs"
            />
            <ActionButton
              icon={<Calendar className="h-5 w-5" />}
              label="View Events"
              href="/events"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <ActivityItem
              title="Joined Tech Club"
              time="2 hours ago"
              type="club"
            />
            <ActivityItem
              title="Registered for Hackathon 2025"
              time="1 day ago"
              type="event"
            />
            <ActivityItem
              title="Became a member of Art Society"
              time="3 days ago"
              type="club"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, title, value, bgColor }: { 
  icon: React.ReactNode; 
  title: string; 
  value: string; 
  bgColor: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>{icon}</div>
      </div>
    </div>
  );
}

function ActionButton({ icon, label, href }: { 
  icon: React.ReactNode; 
  label: string; 
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}

function ActivityItem({ title, time, type }: { 
  title: string; 
  time: string; 
  type: string;
}) {
  return (
    <div className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
      <div className="mt-1">
        {type === 'club' ? (
          <Users className="h-5 w-5 text-blue-600" />
        ) : (
          <Calendar className="h-5 w-5 text-green-600" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-gray-900 font-medium">{title}</p>
        <p className="text-sm text-gray-500">{time}</p>
      </div>
    </div>
  );
}
