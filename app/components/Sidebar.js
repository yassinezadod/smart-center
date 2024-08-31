// app/components/Sidebar.js
'use client';

import Link from 'next/link';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      axios.post('/api/auth/verify-token', { token })
        .then(response => {
          setUser(response.data.user);
        })
        .catch(error => {
          console.error('Invalid token or error verifying token', error);
          localStorage.removeItem('token');
          router.push('/');
        });
    } else {
      router.push('/');
    }
  }, [router]);

  if (!user) return null; // Ne rien afficher si l'utilisateur n'est pas authentifié

  return (
    <aside className="w-64 bg-gray-800 h-screen text-white p-4">
      <h2 className="text-2xl font-bold mb-4">Sidebar</h2>
      <ul>
        <li className="mb-2">
          <Link href="/dashboard" className="hover:bg-gray-700 p-2 block rounded">
            Dashboard
          </Link>
        </li>
        {user.role === 'SUPER_ADMIN' && (
          <li className="mb-2">
            <Link href="/users" className="hover:bg-gray-700 p-2 block rounded">
              Users
            </Link>
          </li>
        )}
        <li className="mb-2">
          <Link href="/classes" className="hover:bg-gray-700 p-2 block rounded">
            Class
          </Link>
        </li>
        <li className="mb-2">
          <Link href="/student" className="hover:bg-gray-700 p-2 block rounded">
            Student
          </Link>
        </li>
        <li>
          <button
            onClick={async () => {
              try {
                await axios.post('/api/auth/logout');
              } catch (error) {
                console.error('Error logging out', error);
              } finally {
                localStorage.removeItem('token');
                router.push('/');
              }
            }}
            className="w-full text-left hover:bg-gray-700 p-2 rounded"
          >
            Logout
          </button>
        </li>
      </ul>
    </aside>
  );
}
