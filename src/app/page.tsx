import { Award, Calendar, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Award className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">Student Club Platform</h1>
            </div>
            <div className="flex gap-4">
              <Link 
                href="/auth/login" 
                className="px-4 py-2 text-primary-600 hover:text-primary-700 font-medium"
              >
                Login
              </Link>
              <Link 
                href="/auth/register" 
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
            Welcome to Student Club Management Platform
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Connect with student clubs, manage memberships, organize events, and build your campus community all in one place.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/auth/register" 
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold text-lg"
            >
              Get Started
            </Link>
            <Link 
              href="/clubs" 
              className="px-8 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg hover:bg-primary-50 font-semibold text-lg"
            >
              Browse Clubs
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            icon={<Users className="h-10 w-10 text-primary-600" />}
            title="Club Management"
            description="Create and manage student clubs with ease. Track memberships and roles."
          />
          <FeatureCard 
            icon={<Calendar className="h-10 w-10 text-primary-600" />}
            title="Event Planning"
            description="Organize events, manage attendees, and keep your community engaged."
          />
          <FeatureCard 
            icon={<TrendingUp className="h-10 w-10 text-primary-600" />}
            title="Analytics"
            description="Track club activity, member engagement, and event success metrics."
          />
          <FeatureCard 
            icon={<Award className="h-10 w-10 text-primary-600" />}
            title="Member Profiles"
            description="Build your profile, showcase achievements, and connect with peers."
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <StatCard number="50+" label="Active Clubs" />
            <StatCard number="1000+" label="Students" />
            <StatCard number="200+" label="Events Hosted" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-gray-400">© 2025 Student Club Management Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-4xl font-bold text-primary-600 mb-2">{number}</div>
      <div className="text-gray-600 font-medium">{label}</div>
    </div>
  );
}
