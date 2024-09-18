"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import {
  FaUsers,
  FaUser,
  FaTachometerAlt,
  FaChalkboard,
  FaGraduationCap,
  FaMoneyBillWave,
  FaSignOutAlt
} from "react-icons/fa";

export default function Sidebar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Ajout de l'état de chargement

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .post("/api/auth/verify-token", { token })
        .then((response) => {
          setUser(response.data.user);
          setLoading(false); // Fin du chargement une fois l'utilisateur récupéré
        })
        .catch((error) => {
          console.error("Invalid token or error verifying token", error);
          localStorage.removeItem("token");
          router.push("/");
          setLoading(false); // Fin du chargement même en cas d'erreur
        });
    } else {
      router.push("/");
      setLoading(false); // Fin du chargement si pas de token
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

  return (
    <div className="flex">
      <aside className="bg-sky-600 h-screen text-white p-4 fixed top-0 left-0">
        <div className="flex items-center mb-6">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV-zBcBp7RunZYMDrtEFexGgjDHkVAieXc1Q&s"
            alt="Logo"
            className="w-20 h-20 object-cover rounded-full"
            style={{ marginLeft: "0.5cm" }}
          />
        </div>
        <ul>
          <li className="mb-4">
            <Link
              href="/dashboard"
              className="flex items-center text-white hover:bg-sky-700 p-2 rounded"
            >
              <FaTachometerAlt className="text-xl mr-2" />
              <span>Dashboard</span>
            </Link>
          </li>

          {!loading && user?.role === "SUPER_ADMIN" && ( // Afficher ce lien seulement après le chargement
            <li className="mb-4">
              <Link
                href="/users"
                className="flex items-center text-white hover:bg-sky-700 p-2 rounded"
              >
                <FaUser className="text-xl mr-2" />
                <span>Utilisateurs</span>
              </Link>
            </li>
          )}

          <li className="mb-4">
            <Link
              href="/classes"
              className="flex items-center text-white hover:bg-sky-700 p-2 rounded"
            >
              <FaChalkboard className="text-xl mr-2" />
              <span>Classes</span>
            </Link>
          </li>

          <li className="mb-4">
            <Link
              href="/eleve"
              className="flex items-center text-white hover:bg-sky-700 p-2 rounded"
            >
              <FaGraduationCap className="text-xl mr-2" />
              <span>Eleve</span>
            </Link>
          </li>

          <li className="mb-4">
            <Link
              href="/groupeleve"
              className="flex items-center text-white hover:bg-sky-700 p-2 rounded"
            >
              <FaUsers className="text-xl mr-2" />
              <span>Groupes d'élèves</span>
            </Link>
          </li>

          <li className="mb-4">
            <Link
              href="/Paiement"
              className="flex items-center text-white hover:bg-sky-700 p-2 rounded"
            >
              <FaMoneyBillWave className="text-xl mr-2" />
              <span>Paiements</span>
            </Link>
          </li>

          <li>
            <button
              onClick={handleLogout}
              className="flex items-center w-full text-white hover:bg-sky-700 p-2 rounded"
            >
              <FaSignOutAlt className="text-xl mr-2" />
              <span>Déconnexion</span>
            </button>
          </li>
        </ul>
      </aside>
    </div>
  );
}
