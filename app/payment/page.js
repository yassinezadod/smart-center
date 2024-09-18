"use client"

import React, { useState } from 'react';
import clsx from 'clsx';

const paiementDataInitial = [
  {
    "id": 1,
    "studentInscription": "12345",
    "nom": "Doe",
    "prenom": "John",
    "dateInscription": "2024-01-15T00:00:00Z",
    "datePaiement": "2024-09-10T00:00:00Z",
    "montant": 150,
    status: {
      "septembre": "Non payé",
      "octobre": "Non payé",
      "novembre": "Non payé",
      "decembre": "Non payé",
      "janvier": "Non payé",
      "fevrier": "Non payé",
      "mars": "Non payé",
      "avril": "Non payé",
      "mai": "Non payé",
      "juin": "Non payé"
    }
  }
];

const months = [
  "septembre", "octobre", "novembre", "decembre", 
  "janvier", "fevrier", "mars", "avril", "mai", "juin"
];

const statuses = ["Pas encore", "Non payé", "Payé"];

const getMonthStatus = (month, currentMonthIndex, status) => {
  const monthIndex = months.indexOf(month);
  if (monthIndex > currentMonthIndex) {
    return "Pas encore";
  }
  return status; // Return the actual status from the data
};

const PaiementTable = () => {
  const [paiementData, setPaiementData] = useState(paiementDataInitial);
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("Pas encore");
  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const [filterStatus, setFilterStatus] = useState("Tous");

  const handleCellClick = (paiementId, month) => {
    setSelectedCell({ paiementId, month });
    const paiement = paiementData.find(p => p.id === paiementId);
    const currentStatus = paiement?.status[month] || "Non payé";
    setSelectedStatus(currentStatus);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const saveStatus = () => {
    if (selectedCell) {
      const { paiementId, month } = selectedCell;
      const updatedPaiementData = paiementData.map(paiement => {
        if (paiement.id === paiementId) {
          return {
            ...paiement,
            status: {
              ...paiement.status,
              [month]: selectedStatus
            }
          };
        }
        return paiement;
      });
      setPaiementData(updatedPaiementData);
      setSelectedCell(null); // Close the select box after saving
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleFilterStatusChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const currentMonthIndex = new Date().getMonth(); // 0 = janvier, 11 = décembre

  const filteredPaiementData = paiementData.filter(paiement => {
    const status = paiement.status[selectedMonth];
    return filterStatus === "Tous" || status === filterStatus;
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Tableau des Paiements</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Choisir le mois:</label>
        <select 
          value={selectedMonth} 
          onChange={handleMonthChange} 
          className="border border-gray-300 p-1 rounded"
        >
          {months.map(month => (
            <option key={month} value={month}>
              {month.charAt(0).toUpperCase() + month.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Filtrer par statut:</label>
        <select 
          value={filterStatus} 
          onChange={handleFilterStatusChange} 
          className="border border-gray-300 p-1 rounded"
        >
          <option value="Tous">Tous</option>
          {statuses.map(status => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N°Inscription</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'inscription</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de paiement</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
            {months.map(month => (
              <th key={month} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {month.charAt(0).toUpperCase() + month.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredPaiementData.map((paiement) => (
            <tr key={paiement.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{paiement.studentInscription}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{paiement.nom}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{paiement.prenom}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(paiement.dateInscription).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(paiement.datePaiement).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{paiement.montant} €</td>
              {months.map(month => (
                <td key={month} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {selectedCell && selectedCell.paiementId === paiement.id && selectedCell.month === month ? (
                    <div className="relative">
                      <select 
                        value={selectedStatus} 
                        onChange={handleStatusChange} 
                        onBlur={saveStatus}
                        className="border border-gray-300 p-1 rounded"
                      >
                        {statuses.map(status => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <span
                      onClick={() => handleCellClick(paiement.id, month)}
                      className={clsx(
                        "cursor-pointer",
                        {
                          "text-green-500": getMonthStatus(month, currentMonthIndex, paiement.status[month]) === "Payé",
                          "text-red-500": getMonthStatus(month, currentMonthIndex, paiement.status[month]) === "Non payé",
                          "text-gray-500": getMonthStatus(month, currentMonthIndex, paiement.status[month]) === "Pas encore",
                        }
                      )}
                    >
                      {getMonthStatus(month, currentMonthIndex, paiement.status[month])}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaiementTable;
