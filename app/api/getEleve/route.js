import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import mime from 'mime-types'; // Importer la bibliothèque mime-types

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Récupérer tous les étudiants de la base de données
    const students = await prisma.student.findMany({
      orderBy: {
        id: 'desc',
      },
    });


    // Construction des chemins complets et lecture des fichiers
    const studentsData = students.map(student => {
      const filePath = path.join(process.cwd(), 'app/uploads', path.basename(student.picture));
      
      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        const mimeType = mime.lookup(path.extname(filePath)) || 'application/octet-stream'; // Correction ici

        return {
          id: student.id,
          nom: student.nom,
          prenom: student.prenom,
          birthDate: student.birthDate,
          ecoleOrigine: student.ecoleOrigine,
          genre: student.genre,
          inscription: student.inscription,
          telephone: student.telephone,
          classId: student.classId,
          depart: student.depart,  // Ajout du champ départ
          fileName: path.basename(student.picture),
          fileData: fileBuffer.toString('base64'),
          mimeType: mimeType,
          createdAt: student.createdAt, // Ajout de createdAt
        };
      }
      return null;
    }).filter(student => student !== null);

 

    // Retourner les données des étudiants en JSON
    return NextResponse.json(studentsData);
  } catch (error) {
    console.error('Erreur lors de la récupération des données des étudiants:', error);
    return NextResponse.json({ message: 'Erreur lors de la récupération des données des étudiants' }, { status: 500 });
  }
}
