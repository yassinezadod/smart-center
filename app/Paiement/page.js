"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import NavBar from "../components/NavBar";
import { Table, Modal, Input, Button } from "antd";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payments, setPayments] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .post("/api/auth/verify-token", { token })
        .then((response) => {
          setUser(response.data.user);
          axios.get("/api/paiement").then((res) => setPayments(res.data));
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

  const showModal = (record = null) => {
    setCurrentRecord(
      record || { studentName: "", registrationNumber: "", months: {} }
    );
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentRecord(null);
  };

  const handleOk = () => {
    if (currentRecord.key) {
      // Modifier un enregistrement existant
      setPayments((prev) =>
        prev.map((item) =>
          item.key === currentRecord.key ? currentRecord : item
        )
      );
    } else {
      // Ajouter un nouvel enregistrement
      setPayments((prev) => [
        ...prev,
        { ...currentRecord, key: payments.length + 1 },
      ]);
    }
    setIsModalVisible(false);
  };

  const handleInputChange = (month, field, value) => {
    setCurrentRecord({
      ...currentRecord,
      months: {
        ...currentRecord.months,
        [month]: {
          ...currentRecord.months[month],
          [field]: value,
        },
      },
    });
  };

  const columns = [
    {
      title: "Nom d'élève",
      dataIndex: "studentName",
      key: "studentName",
    },
    {
      title: "Numéro d'inscription",
      dataIndex: "registrationNumber",
      key: "registrationNumber",
    },
    ...[
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ].map((month) => ({
      title: month,
      dataIndex: month.toLowerCase(),
      key: month.toLowerCase(),
      render: (text) => (
        <>
          Prix: {text?.price || "-"}€, Statut: {text?.status || "-"}
        </>
      ),
    })),
  ];

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

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <NavBar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">
              Gestion des paiements
            </h1>
            <Button type="primary" className="mb-4" onClick={() => showModal()}>
              Ajouter un paiement
            </Button>
            <Table
              columns={columns}
              dataSource={payments}
              rowKey="registrationNumber"
              onRow={(record) => ({
                onClick: () => showModal(record),
              })}
            />
          </div>
        </main>
      </div>
      <Modal
        title={
          currentRecord?.key ? "Modifier le paiement" : "Ajouter un paiement"
        }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          placeholder="Nom d'élève"
          value={currentRecord?.studentName || ""}
          onChange={(e) =>
            setCurrentRecord({
              ...currentRecord,
              studentName: e.target.value,
            })
          }
          className="w-full mb-4"
        />
        <Input
          placeholder="Numéro d'inscription"
          value={currentRecord?.registrationNumber || ""}
          onChange={(e) =>
            setCurrentRecord({
              ...currentRecord,
              registrationNumber: e.target.value,
            })
          }
          className="w-full mb-4"
        />
        {[
          "Janvier",
          "Février",
          "Mars",
          "Avril",
          "Mai",
          "Juin",
          "Juillet",
          "Août",
          "Septembre",
          "Octobre",
          "Novembre",
          "Décembre",
        ].map((month) => (
          <div key={month} className="mb-4">
            <h3 className="font-semibold">{month}</h3>
            <Input
              placeholder={`Prix pour ${month}`}
              value={currentRecord?.months?.[month.toLowerCase()]?.price || ""}
              onChange={(e) =>
                handleInputChange(month.toLowerCase(), "price", e.target.value)
              }
              className="w-full mb-2"
            />
            <Input
              placeholder={`Statut pour ${month}`}
              value={currentRecord?.months?.[month.toLowerCase()]?.status || ""}
              onChange={(e) =>
                handleInputChange(month.toLowerCase(), "status", e.target.value)
              }
              className="w-full"
            />
          </div>
        ))}
      </Modal>
    </div>
  );
}
