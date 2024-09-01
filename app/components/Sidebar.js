import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaTachometerAlt,
  FaChalkboard,
  FaGraduationCap,
  FaMoneyBillWave,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function Sidebar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(true);

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
          localStorage.removeItem("token");
          router.push("/");
        });
    } else {
      router.push("/");
    }
  }, [router]);

  if (!user) return null;

  return (
    <div className="flex">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 fixed top-4 left-4 z-50 bg-sky-800 text-white rounded-full"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <aside
        className={`bg-sky-600 h-screen text-white p-4 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4">. </h2>
        <ul>
          <li className="mb-2">
            <Link
              href="/dashboard"
              className="hover:bg-gray-700 p-2 block rounded flex items-center"
            >
              <FaTachometerAlt className="text-xl mr-2" />
              <span>Dashboard</span>
            </Link>
          </li>

          {user.role === "SUPER_ADMIN" && (
            <li className="mb-2">
              <Link
                href="/users"
                className="hover:bg-gray-700 p-2 block rounded flex items-center"
              >
                <FaUser className="text-xl mr-2" />
                <span>Utilisateurs</span>
              </Link>
            </li>
          )}

          <li className="mb-2">
            <Link
              href="/classes"
              className="hover:bg-gray-700 p-2 block rounded flex items-center"
            >
              <FaChalkboard className="text-xl mr-2" />
              <span>Classes</span>
            </Link>
          </li>

          <li className="mb-2">
            <Link
              href="/etudiants"
              className="hover:bg-gray-700 p-2 block rounded flex items-center"
            >
              <FaGraduationCap className="text-xl mr-2" />
              <span>Etudiants</span>
            </Link>
          </li>

          <li className="mb-2">
            <Link
              href="/Paiement"
              className="hover:bg-gray-700 p-2 block rounded flex items-center"
            >
              <FaMoneyBillWave className="text-xl mr-2" />
              <span>Paiement</span>
            </Link>
          </li>

          <li>
            <button
              onClick={async () => {
                try {
                  await axios.post("/api/auth/logout");
                } catch (error) {
                  console.error("Error logging out", error);
                } finally {
                  localStorage.removeItem("token");
                  router.push("/");
                }
              }}
              className="w-full text-left hover:bg-gray-700 p-2 rounded"
            >
              Déconnexion
            </button>
          </li>
        </ul>
      </aside>
    </div>
  );
}
