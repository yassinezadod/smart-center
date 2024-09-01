"use client";

import { FaUser, FaBell, FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";

export default function NavBar() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);

  return (
    <nav className="bg-sky-600 text-white flex items-center justify-between px-6 py-3">
      <div className="text-2xl font-semibold">Smart Centre </div>
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationMenuOpen(!isNotificationMenuOpen)}
            className="relative text-gray-300 hover:text-white"
          >
            <FaBell className="text-xl" />
            {/* Badge */}
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </button>
          {isNotificationMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg">
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
            className="flex items-center text-gray-300 hover:text-white"
          >
            <FaUser className="text-xl mr-2" />
            <span>Profile</span>
          </button>
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg">
              <ul>
                <li className="px-4 py-2 border-b">
                  <Link href="/profile">Profile</Link>
                </li>
                <li className="px-4 py-2 border-b">
                  <Link href="/settings">Settings</Link>
                </li>
                <li className="px-4 py-2">
                  <Link href="/logout">Logout</Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
