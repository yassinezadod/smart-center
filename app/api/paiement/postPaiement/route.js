// app/api/payment/postPayments/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const data = await req.json(); // Assurez-vous que vous parsez les données JSON

    // Convertir les données aux types corrects
    const studentId = parseInt(data.studentId, 10); // Convertir en entier
    const amount = parseFloat(data.amount); // Convertir en float
    const paymentDate = new Date(data.paymentDate);
    
    // Assigner des valeurs par défaut pour les mois
    const monthsStatus = {
      septembre: data.septembre || 'PENDING',
      octobre: data.octobre || 'PENDING',
      novembre: data.novembre || 'PENDING',
      decembre: data.decembre || 'PENDING',
      janvier: data.janvier || 'PENDING',
      fevrier: data.fevrier || 'PENDING',
      mars: data.mars || 'PENDING',
      avril: data.avril || 'PENDING',
      mai: data.mai || 'PENDING',
      juin: data.juin || 'PENDING',
    };

    if (isNaN(studentId) || isNaN(amount) || !paymentDate ) {
      return NextResponse.json({ message: 'Invalid or missing fields' }, { status: 400 });
    }

    const payment = await prisma.payment.create({
      data: {
        studentId: studentId,
        amount: amount,
        paymentDate: paymentDate,
        ...monthsStatus, // Inclure les mois avec les valeurs par défaut
      },
    });

    return NextResponse.json({ message: 'Payment created successfully', payment });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json({ message: 'Error creating payment' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: true, // Assurez-vous que le bodyParser est configuré
  },
};
