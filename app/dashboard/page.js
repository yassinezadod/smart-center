"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Layout, Card, Typography, Spin, Alert } from "antd";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import Sidebar from "../components/Sidebar";
import NavBar from "../components/NavBar";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const { Content } = Layout;
const { Title: AntTitle } = Typography;

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCount, setUserCount] = useState(0); // Nombre d'utilisateurs
  const [classesCount, setClassesCount] = useState(0); // Nombre de classes
  const [studentCount, setStudentCount] = useState(0); // Nombre d'étudiants
  const [classData, setClassData] = useState([]); // Données des classes avec le nombre d'étudiants
  const [genderData, setGenderData] = useState({}); 
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

    // Récupérer le nombre d'utilisateurs
    axios.get("/api/getUser")
      .then((response) => {
        setUserCount(response.data.length); // Met à jour le nombre d'utilisateurs
      })
      .catch((error) => {
        console.error("Error fetching user count", error);
        setError("Error fetching user count");
      });

    // Récupérer le nombre de classes
    axios.get("/api/classes/getclasses")
      .then((response) => {
        setClassesCount(response.data.length); // Met à jour le nombre de classes
      })
      .catch((error) => {
        console.error("Error fetching classes count", error);
        setError("Error fetching classes count");
      });

    // Récupérer le nombre d'étudiants
    axios.get("/api/student/getStudent")
      .then((response) => {
        setStudentCount(response.data.length); // Met à jour le nombre d'étudiants

        // Traitement des données de genre
        const genderCounts = response.data.reduce((counts, student) => {
          counts[student.genre] = (counts[student.genre] || 0) + 1;
          return counts;
        }, {});
        setGenderData(genderCounts); // Met à jour les données des genres
      })
      .catch((error) => {
        console.error("Error fetching student count", error);
        setError("Error fetching student count");
      });

    // Récupérer les données des classes avec le nombre d'étudiants
    axios.get("/api/classes/getClassesWithStudentCount")
      .then((response) => {
        setClassData(response.data); // Met à jour les données des classes
      })
      .catch((error) => {
        console.error("Error fetching class data", error);
        setError("Error fetching class data");
      });

  }, [router]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert message={error} type="error" showIcon />
      </div>
    );
  if (!user)
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert message="Unauthorized" type="error" showIcon />
      </div>
    );

  const cardData = [
    { title: "Utilisateurs", count: userCount },
    { title: "Classes", count: classesCount },
    { title: "Eleves", count: studentCount },
    { title: "Paiements", count: 100 },
  ];

  const maxStudentCount = Math.max(...classData.map(cls => cls.studentCount), 0);
  const chartData = {
    responsive: true,
    maintainAspectRatio: false,
    labels: classData.map(cls => cls.niveau), // Les labels sont les noms des classes
    datasets: [
      {
        label: "Nombre d'éleves",
        data: classData.map(cls => cls.studentCount), // Les données sont les nombres d'étudiants
        backgroundColor: "rgba(135, 206, 235, 0.6)",
        borderColor: "rgba(135, 206, 235, 1)",
        borderWidth: 1,
      },
    ],
  };
  const totalGenderCount = Object.values(genderData).reduce((sum, count) => sum + count, 0);
  const pieChartData = {
    labels: Object.keys(genderData),
    datasets: [
      {
        label: "Répartition des Genres",
        data: Object.keys(genderData).map(gender => (genderData[gender] / totalGenderCount * 100).toFixed(2)), // Pourcentage
        backgroundColor: ["blue", "red"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(0); // Affiche le nombre sans décimales
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return Number.isInteger(value) ? value.toString() : ''; // Affiche uniquement les entiers
          }
        },
        beginAtZero: true, // Assure que l'axe commence à 0
        suggestedMax: maxStudentCount + 1 // Ajuste la valeur maximale affichée
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += context.parsed.toFixed(2) + '%'; // Affiche le pourcentage
            }
            return label;
          }
        }
      }
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout style={{ marginLeft: 156 }}>
        <NavBar />
        <Content style={{ padding: '24px', minHeight: 'calc(100vh - 64px)' }}>
          <div className="site-layout-content">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              {cardData.map((card, index) => (
                <Card key={index} title={card.title} style={{ width: '92%', margin:"20px", textAlign: "center" }}>
                  <p className="text-2xl md:text-3xl font-bold">{card.count}</p>
                </Card>
              ))}
            </div>
            <div className="flex flex-col gap-4 mt-8 md:flex-row">
              <div className="p-4 bg-white rounded-lg shadow-md" style={{ width: '700px', maxWidth: '100%' }}>
                <Bar data={chartData} options={chartOptions} />
              </div>
              <div className="p-4 bg-white rounded-lg shadow-md" style={{ width: '350px', maxWidth: '100%' }}>
                <Pie data={pieChartData} options={pieChartOptions} />
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
