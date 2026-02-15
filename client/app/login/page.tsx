"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // We use the direct fetch here to establish the session
      const res = await fetch('http://localhost:3500/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, pwd }),
        credentials: 'include' // <--- CRITICAL: Allows backend to set the Cookie
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('accessToken', data.accessToken);
        router.push('/dashboard');
      } else {
        setError('Invalid Username or Password');
      }
    } catch (err) {
      setError('Login Failed. Is backend running?');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-500">Welcome Back</h2>
        {error && <div className="text-red-400 text-sm text-center mb-4">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-6">
          <input type="text" placeholder="Username" required value={user} onChange={e => setUser(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded p-3 outline-none focus:border-blue-500" />
          <input type="password" placeholder="Password" required value={pwd} onChange={e => setPwd(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded p-3 outline-none focus:border-blue-500" />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-bold">
            Sign In
          </button>
        </form>
        <p className="mt-6 text-center text-gray-400 text-sm">
          No account? <Link href="/register" className="text-blue-400 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}