"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import NavBar from "../components/NavBar";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [image, setImage] = useState(null); // State for image
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .post("/api/auth/verify-token", { token })
        .then((response) => {
          setUser(response.data.user);

          axios.get("/api/student").then((res) => setStudents(res.data));
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

  const showModal = (student = null) => {
    setEditingStudent(student);
    setImage(null); // Reset image state
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingStudent(null);
  };

  const handleDelete = async (studentId) => {
    try {
      await axios.delete(`/api/student/${studentId}`);
      setStudents(students.filter((student) => student.key !== studentId));
    } catch (error) {
      console.error("Error deleting student", error);
      setError("Error deleting student");
    }
  };

  const handleImageUpload = ({ file }) => {
    setImage(file);
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });
    if (image) {
      formData.append("image", image);
    }

    try {
      if (editingStudent) {
        // Update student
        await axios.put(`/api/student/${editingStudent.key}`, formData);
        setStudents(
          students.map((student) =>
            student.key === editingStudent.key
              ? {
                  ...student,
                  ...values,
                  image: image ? URL.createObjectURL(image) : student.image,
                }
              : student
          )
        );
      } else {
        // Add new student
        const { data } = await axios.post("/api/student", formData);
        setStudents([...students, { ...data, key: data.id }]);
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error saving student", error);
      setError("Error saving student");
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text) => <img src={text} alt="Student" className="w-10 h-10" />,
    },
    {
      title: "Nom",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Prénom",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Date de naissance",
      dataIndex: "birthDate",
      key: "birthDate",
    },
    {
      title: "Genre",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Date d'inscription",
      dataIndex: "registrationDate",
      key: "registrationDate",
    },
    {
      title: "Numéro d'inscription",
      dataIndex: "registrationNumber",
      key: "registrationNumber",
    },
    {
      title: "Téléphone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "École d'origine",
      dataIndex: "originSchool",
      key: "originSchool",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button onClick={() => showModal(record)}>Modifier</Button>
          <Button onClick={() => handleDelete(record.key)} danger>
            Supprimer
          </Button>
        </>
      ),
    },
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
              Gestion des étudiants
            </h1>
            <Button type="primary" onClick={() => showModal()}>
              Ajouter un étudiant
            </Button>
            <Table columns={columns} dataSource={students} rowKey="key" />
          </div>
        </main>
      </div>

      <Modal
        title={editingStudent ? "Modifier un étudiant" : "Ajouter un étudiant"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          initialValues={editingStudent}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item label="Nom" name="lastName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Prénom"
            name="firstName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Date de naissance"
            name="birthDate"
            rules={[{ required: true }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item label="Genre" name="gender" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="male">Homme</Select.Option>
              <Select.Option value="female">Femme</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Date d'inscription"
            name="registrationDate"
            rules={[{ required: true }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="Numéro d'inscription"
            name="registrationNumber"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Téléphone"
            name="phone"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="École d'origine"
            name="originSchool"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Image"
            name="image"
            valuePropName="file"
            getValueFromEvent={(e) =>
              e.fileList ? e.fileList[0].originFileObj : null
            }
          >
            <Upload beforeUpload={() => false} onChange={handleImageUpload}>
              <Button icon={<UploadOutlined />}>Importer une image</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingStudent ? "Modifier" : "Ajouter"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
