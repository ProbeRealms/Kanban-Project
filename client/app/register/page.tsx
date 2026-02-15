"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:3500/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, pwd })
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 2000); // Redirect after 2s
      } else if (res.status === 409) {
        setError("Username already taken.");
      } else {
        setError("Registration failed.");
      }
    } catch (err) {
      setError("No Server Response.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-500">Create Account</h2>
        
        {success ? (
          <div className="bg-green-500/20 border border-green-500 text-green-200 p-4 rounded text-center">
            Success! Redirecting to login...
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-6">
            {error && <div className="text-red-400 text-sm text-center">{error}</div>}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Username</label>
              <input type="text" required value={user} onChange={e => setUser(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded p-3 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <input type="password" required value={pwd} onChange={e => setPwd(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded p-3 focus:border-blue-500 outline-none" />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-bold">
              Sign Up
            </button>
          </form>
        )}
        <p className="mt-6 text-center text-gray-400 text-sm">
          Already have an account? <Link href="/login" className="text-blue-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}