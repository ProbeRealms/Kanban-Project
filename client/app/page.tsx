import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 border-b border-gray-800">
        <div className="text-2xl font-bold text-blue-500">KanbanFlow</div>
        <div className="space-x-4">
          <Link href="/login" className="hover:text-gray-300">Login</Link>
          <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition">
            Go to Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          Manage Projects <span className="text-blue-500">Effortlessly</span>
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl">
          Streamline your workflow with our intuitive Kanban board. Track tasks, collaborate with your team, and ship faster.
        </p>
        <Link href="/dashboard">
          <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-lg font-bold hover:scale-105 transition transform">
            Get Started for Free
          </button>
        </Link>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-gray-500 border-t border-gray-800">
        © 2026 KanbanFlow Project. All rights reserved.
      </footer>
    </div>
  );
}