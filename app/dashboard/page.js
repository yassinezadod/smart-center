"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Sidebar from "../components/Sidebar";
import NavBar from "../components/NavBar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
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
      await axios.post("/api/logout");
    } catch (error) {
      console.error("Error logging out", error);
      setError("Error logging out");
    } finally {
      localStorage.removeItem("token");
      router.push("/");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  if (!user)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Unauthorized
      </div>
    );

  const cardData = [
    { title: "Utilisateurs", count: 12 },
    { title: "Classes", count: 15 },
    { title: "Étudiants", count: 50 },
    { title: "Paiements", count: 100 },
  ];

  const chartData = {
    labels: ["Utilisateurs", "Classes", "Étudiants", "Paiements"],
    datasets: [
      {
        label: "Nombre",
        data: [12, 15, 50, 30],
        backgroundColor: ["rgba(75, 192, 192, 0.6)"],
        borderColor: ["rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <NavBar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">
              Bienvenue Dashboard!
            </h1>
            <h2 className="text-2xl mb-2 text-gray-700">
              Bienvenue, {user.nom} {user.prenom}
            </h2>
            <p className="text-lg text-gray-600">Rôle: {user.role}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              {cardData.map((card, index) => (
                <div key={index} className="bg-white shadow-md rounded-lg p-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {card.title}
                  </h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {card.count}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Bar data={chartData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
