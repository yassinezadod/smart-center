// /api/payment/getPayments/route.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        student: {
          select: {
            nom: true,
            prenom: true,
            inscription: true,
            picture: true,
            createdAt: true, // Assurez-vous que ces champs existent et sont corrects
          },
        },
      },
    });

    // Chemin de base pour les images
    const basePath = '/uploads/';

    // Met à jour les paiements avec les chemins d'images complets
    const updatedPayments = payments.map(payment => ({
      id: payment.id,
      studentId: payment.studentId,
      amount: payment.amount,
      paymentDate: payment.paymentDate.toISOString(),
      septembre: payment.septembre,
      octobre: payment.octobre,
      novembre: payment.novembre,
      decembre: payment.decembre,
      janvier: payment.janvier,
      fevrier: payment.fevrier,
      mars: payment.mars,
      avril: payment.avril,
      mai: payment.mai,
      juin: payment.juin,
      studentNom: payment.student.nom,
      studentPrenom: payment.student.prenom,
      studentInscription: payment.student.inscription,
      studentPicture: payment.student.picture ? basePath + payment.student.picture.split('/').pop() : null,
      studentCreatedAt: payment.student.createdAt.toISOString()
    }));

    return new Response(JSON.stringify(updatedPayments), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des paiements : ", error);
    return new Response('Erreur lors de la récupération des paiements', { status: 500 });
  }
}
