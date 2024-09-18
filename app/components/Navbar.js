"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaBell, FaSignOutAlt, FaCircle } from "react-icons/fa"; // Ajout de FaCircle pour la bulle verte
import axios from "axios";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .post("/api/auth/verify-token", { token })
        .then((response) => {
          setUser(response.data.user);
        })
        .catch((error) => {
          console.error("Invalid token or error verifying token", error);
          setError("Invalid token or error verifying token");
          localStorage.removeItem("token");
          router.push("/");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      router.push("/");
    }
  }, [router]);


  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
    } catch (error) {
      console.error("Error logging out", error);
    } finally {
      localStorage.removeItem("token");
      router.push("/");
    }
  };

  
  // Helper function to get initials for the avatar
  const getInitials = (name) => {
    if (!name) return '?';
    const names = name.split(' ');
    return names.map(name => name.charAt(0).toUpperCase()).join('');
  };

  // Helper function to generate a light color based on initials
  const getColorFromInitials = (name) => {
    const colors = [
      '#FFEBEE', '#FFCDD2', '#EF9A9A', '#E57373', '#EF5350',
      '#F44336', '#E53935', '#D32F2F', '#C62828', '#B71C1C',
      '#F1F8E9', '#DCE775', '#C0CA33', '#A4B42B', '#9E9D24',
      '#F0F4C3', '#E6EE9C', '#DCE775', '#D0D80A', '#C6D600',
      '#E0F2F1', '#B9FBC0', '#4DB6AC', '#26A69A', '#00796B'
    ];
    const initials = getInitials(name);
    let hash = 0;
    for (let i = 0; i < initials.length; i++) {
      hash = initials.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
  };

  const avatarColor = user ? getColorFromInitials(`${user.nom} ${user.prenom}`) : '#F0F0F0';

  return (
    <nav className="bg-sky-600 text-white flex items-center justify-between px-6 py-3 shadow-md">
      <div className="text-2xl font-semibold">
        {/* Titre de l'application, si nécessaire */}
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationMenuOpen(!isNotificationMenuOpen)}
            className="relative text-gray-300 hover:text-white focus:outline-none"
          >
            <FaBell className="text-xl" />
            {/* Badge */}
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </button>
          {isNotificationMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg z-10">
              <ul>
                <li className="px-4 py-2 border-b">Notification 1</li>
                <li className="px-4 py-2 border-b">Notification 2</li>
                <li className="px-4 py-2">Notification 3</li>
              </ul>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center text-gray-300 hover:text-white focus:outline-none"
          >
            {/* Avatar avec bulle verte */}
            <div className="relative flex items-center">
              <div
                className="w-10 h-10 text-white rounded-full flex items-center justify-center font-bold text-lg"
                style={{ backgroundColor: avatarColor }}
              >
                {user ? getInitials(`${user.prenom}`) : '?'}
              </div>
              {user && (
                <FaCircle
                  className="absolute -bottom-1 -right-1 text-green-500"
                  style={{ fontSize: "0.8rem" }}
                />
              )}
            </div>

            <span className="ml-2"><b>{user ? `${user.nom}` : 'Profile'}</b></span>
          </button>
          {isProfileMenuOpen && user && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg z-10">
              <div className="px-4 py-2 border-b">
                <p className="font-bold">{`${user.nom} ${user.prenom}`}</p>
                {/* Role en bleu */}
                <p className="text-sm text-blue-600">{user.role}</p>
              </div>
              <ul>
                <li className="px-4 py-2 border-b">
                  <Link href="/profile" className="hover:text-sky-600">Profile</Link>
                </li>
                <li className="px-4 py-2 border-b">
                  <Link href="/settings" className="hover:text-sky-600">Settings</Link>
                </li>
                <li className="px-4 py-2">
                  <button  onClick={handleLogout}  className="flex items-center text-red-500 hover:text-red-700">
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
