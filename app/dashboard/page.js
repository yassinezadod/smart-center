// app/dashboard/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import axios from "axios";
import Sidebar from '../components/Sidebar';
import NavBar from '../components/NavBar'; // Importation de NavBar

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Gestion des erreurs
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            axios.post('/api/auth/verify-token', { token })
                .then(response => {
                    setUser(response.data.user);
                })
                .catch(error => {
                    console.error('Invalid token or error verifying token', error);
                    setError('Invalid token or error verifying token');
                    localStorage.removeItem('token');
                    router.push('/');
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            router.push('/');
        }
    }, [router]);

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout');
        } catch (error) {
            console.error('Error logging out', error);
            setError('Error logging out');
        } finally {
            localStorage.removeItem('token');
            router.push('/');
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    if (!user) return <div className="flex justify-center items-center h-screen text-red-500">Unauthorized</div>;

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <NavBar /> {/* Ajout de NavBar */}
                <main className="flex-1 p-6 overflow-auto">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold mb-4 text-gray-900">Welcome to the Dashboard!</h1>
                        <h2 className="text-2xl mb-2 text-gray-700">Bienvenue, {user.nom} {user.prenom}</h2>
                        <p className="text-lg text-gray-600">Rôle: {user.role}</p>
                       
                    </div>
                </main>
            </div>
        </div>
    );
}
