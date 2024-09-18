"use client";

import { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaTrash, FaEdit } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import NavBar from "../components/NavBar";
import { Layout} from "antd";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FaTimes } from 'react-icons/fa';

const { Content } = Layout;

export default function ClassesPage() {
    const [image, setImage] = useState(null);
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [ecoleOrigine, setEcoleOrigine] = useState('');
    const [genre, setGenre] = useState('');
    const [inscription, setInscription] = useState('');
    const [telephone, setTelephone] = useState('');
    const [images, setImages] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentImageId, setCurrentImageId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchInscription, setSearchInscription] = useState('');
  const [searchNomPrenom, setSearchNomPrenom] = useState('');
  const [searchGenre, setSearchGenre] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchImages = async () => {
  try {
    const response = await fetch('/api/student/getStudent');
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des élèves');
    }
    const data = await response.json();
    const imagesUrls = data.map(image => ({
      id: image.id,
      nom: image.nom,
      prenom: image.prenom,
      birthDate: new Date(image.birthDate).toLocaleDateString(),
      ecoleOrigine: image.ecoleOrigine,
      genre: image.genre,
      inscription: image.inscription,
      telephone: image.telephone,
      createdAt: new Date(image.createdAt).toLocaleDateString(),
      classId: image.classId,
      url: `data:${image.mimeType};base64,${image.fileData}`
    }));
    setImages(imagesUrls);
  } catch (error) {
    console.error('Erreur lors de la récupération des élèves:', error);
  }
};

// Utilisation de `fetchImages` dans `useEffect`
useEffect(() => {
  fetchImages();

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes/getclasses');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des classes');
      }
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des classes:', error);
    }
  }
  fetchClasses();
}, []);


  // Trouver le niveau de classe basé sur l'id
  const getClassName = (classId) => {
    const cls = classes.find(cls => cls.id === classId);
    return cls ? cls.niveau : 'Non spécifiée';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !nom || !prenom || !birthDate || !ecoleOrigine || !genre || !inscription || !telephone || !selectedClass) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('nom', nom);
      formData.append('prenom', prenom);
      formData.append('birthDate', birthDate);
      formData.append('ecoleOrigine', ecoleOrigine);
      formData.append('genre', genre);
      formData.append('inscription', inscription);
      formData.append('telephone', telephone);
      formData.append('classId', selectedClass);

      const url = isEditing ? `/api/student/putStudent/${currentImageId}` : '/api/student/postStudent';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (response.ok) {
        const { url } = await response.json();
        alert(`${isEditing ? 'Modification' : 'Ajout'} réussie ! URL: ${url}`);
        fetchImages();
        setShowForm(false);
        setIsEditing(false);
        setCurrentImageId(null);
      } else {
        const errorData = await response.json();
        alert(`Erreur lors de l${isEditing ? 'a modification' : 'ajout de l\'eleve'}: ${errorData.message}`);
      }
    } catch (error) {
      console.error(`Erreur lors de l${isEditing ? 'a modification' : 'ajout de l\'eleve'}`, error);
      alert('Une erreur s\'est produite. Veuillez réessayer plus tard.');
    }
  };

  const handleDeleteImage = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) {
      try {
        const response = await fetch(`/api/student/deleteStudent/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setImages(images.filter(img => img.id !== id));
          alert('Eleve supprimée avec succès');
        } else {
          const errorData = await response.json();
          console.error(errorData.message);
          alert('Erreur lors de la suppression de l\'Eleve.');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'Eleve:', error);
        alert('Une erreur s\'est produite. Veuillez réessayer plus tard.');
      }
    }
  };

  // Fonction pour ouvrir le formulaire d'édition avec les informations de l'élève
  const handleEdit = (img) => {
    setNom(img.nom);
    setPrenom(img.prenom);
    setBirthDate(img.birthDate);
    setEcoleOrigine(img.ecoleOrigine);
    setGenre(img.genre);
    setInscription(img.inscription);
    setTelephone(img.telephone);
    setSelectedClass(img.classId);
    setImage(null); // Ne pas préremplir l'image
    setCurrentImageId(img.id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleView = (img) => {
    setSelectedStudent(img);
  };

  const filteredImages = images.filter((img) => {
    const matchesInscription = img.inscription.toLowerCase().includes(searchInscription.toLowerCase());
    const matchesNomPrenom = (img.nom + ' ' + img.prenom).toLowerCase().includes(searchNomPrenom.toLowerCase());
    const matchesGenre = searchGenre ? img.genre === searchGenre : true;

    return matchesInscription && matchesNomPrenom && matchesGenre;
  });

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredImages.map(img => ({
      Inscription: img.inscription,
      date_inscription: img.createdAt,
      Nom: img.nom,
      Prénom: img.prenom,
      DateDeNaissance: img.birthDate,
      EcoleDorigine: img.ecoleOrigine,
      Genre: img.genre,
      Téléphone: img.telephone,
      Classe: getClassName(img.classId)
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Élèves');

    const fileName = 'eleves.xlsx';
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName);
  };


 
  const indexOfLastClass = currentPage * itemsPerPage;
  const indexOfFirstClass = indexOfLastClass - itemsPerPage;
  const currentClasses = classes.slice(indexOfFirstClass, indexOfLastClass);

  const totalPages = Math.ceil(classes.length / itemsPerPage);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout style={{ marginLeft: 156 }}>
        <NavBar />
        <Content style={{ padding: '24px', minHeight: 'calc(100vh - 64px)' }}>
   
      <div className="flex-1 p-6 overflow-auto">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">Gestion des Eleves</h1>
          <button
  onClick={() => setShowForm(true)}
  className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700 mr-[700px]"
>
  {isEditing ? 'Modifier un élève' : 'Ajouter un élève'}
</button>
<button
  onClick={exportToExcel}
  className="bg-gray-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-gray-400 transition duration-300"
>
  <DocumentArrowDownIcon className="h-5 w-5 mr-2 inline-block align-middle" />
  Exporter
</button>


          {/* Form Popup */}
          {showForm && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center z-50 overflow-y-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-auto relative overflow-y-auto">
              <button
        onClick={() => {
          setShowForm(false);
          setIsEditing(false);
          setCurrentImageId(null);
        }}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <FaTimes size={20} />
      </button>
              <h2 className="text-3xl font-semibold mb-6">{isEditing ? 'Modifier un élève' : 'Ajouter un élève'}</h2>
                <form  onSubmit={handleSubmit}>
                  <input
                     type="text"
                  placeholder="Nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                    className="border border-gray-300 p-2 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    required
                  />
                   <input
                     type="text"
                  placeholder="Prénom"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                    className="border border-gray-300 p-2 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    required
                  />
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                    className="border border-gray-300 p-2 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    required
                  />
                   <input
                     type="text"
                  placeholder="École d'origine"
                  value={ecoleOrigine}
                  onChange={(e) => setEcoleOrigine(e.target.value)}
                    className="border border-gray-300 p-2 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    required
                  />
                    <select
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                    className="border border-gray-300 p-2 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    required
                  >
                     <option value="">Sélectionner</option>
                  <option value="Masculin">Masculin</option>
                  <option value="Féminin">Féminin</option>
                  </select>
                  <input
                     type="text"
                  placeholder="Numéro d'inscription"
                  value={inscription}
                  onChange={(e) => setInscription(e.target.value)}
                    className="border border-gray-300 p-2 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    required
                  />
                   <input
                     type="tel"
                   placeholder="Téléphone"
                   value={telephone}
                   onChange={(e) => setTelephone(e.target.value)}
                    className="border border-gray-300 p-2 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    required
                  />
                  <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                    className="border border-gray-300 p-2 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    required
                  >
                     <option value="">Sélectionner une classe</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.niveau}
                    </option>
                  ))}
                  </select>

                  <input
                     type="file"
                     onChange={(e) => setImage(e.target.files[0])}
                    className="border border-gray-300 p-2 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    required
                  />
                  <div className="flex justify-between">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                       {isEditing ? 'Mettre à jour' : 'Ajouter'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher par inscription"
          value={searchInscription}
          onChange={(e) => setSearchInscription(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        <input
          type="text"
          placeholder="Rechercher par nom et prénom"
          value={searchNomPrenom}
          onChange={(e) => setSearchNomPrenom(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        <select
          value={searchGenre}
          onChange={(e) => setSearchGenre(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        >
          <option value="">Tous les genres</option>
          <option value="Masculin">Masculin</option>
          <option value="Féminin">Féminin</option>
        </select>
      </div>

          {/* Classes Table */}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N°inscription</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'inscription</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de Naissance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">École d'origine</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classe</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {filteredImages.map(img => (
                    <tr key={img.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{img.inscription}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{img.createdAt}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{img.nom}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{img.prenom}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{img.birthDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{img.ecoleOrigine}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{img.genre}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{img.telephone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getClassName(img.classId)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <img
                    src={img.url}
                    alt={`Image ${img.id}`}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button onClick={() => handleView(img)} className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-blue-600">
                          <FaEye />
                        </button>
                      <button
                         onClick={() => handleEdit(img)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-yellow-600"
                      >
                        <FaEdit />
                      </button>
                      <button
                          onClick={() => handleDeleteImage(img.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                      >
                         <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div className="flex justify-center mt-6">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Précédente
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Suivante
              </button>
            </nav>
          </div>
        </div>
      </div>

       {/* Card Popup for Student Details */}
       {selectedStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full relative">
          <h2 className="text-2xl font-bold mb-4 text-center">Détails de l'élève</h2>
          
          <div className="flex flex-col items-center mb-4">
            <img src={selectedStudent.url} alt={selectedStudent.nom} className="w-32 h-32 object-cover rounded-full mb-4" />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p><strong>Nom:</strong> {selectedStudent.nom}</p>
              <p><strong>DateBirth:</strong> {selectedStudent.birthDate}</p>
              <p><strong>Genre:</strong> {selectedStudent.genre}</p>
              <p><strong>Téléphone:</strong> {selectedStudent.telephone}</p>
            </div>
            <div>
              <p><strong>Prénom:</strong> {selectedStudent.prenom}</p>
              <p><strong>École d'origine:</strong> {selectedStudent.ecoleOrigine}</p>
              <p><strong>N° Inscription:</strong> {selectedStudent.inscription}</p>
              <p><strong>Classe:</strong> {getClassName(selectedStudent.classId)}</p>
            </div>
          </div>

          {/* Close Button with FontAwesome Icon */}
          <button
            onClick={() => setSelectedStudent(null)}
            className="absolute top-2 right-2 p-2 bg-gray-200 rounded-full hover:bg-gray-300"
          >
            <FontAwesomeIcon icon={faTimes} className="text-gray-600" />
          </button>
        </div>
      </div>
          )}

      </Content>
      </Layout>
       </Layout>
  );
}
