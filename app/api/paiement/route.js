import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
  const { id } = params;
  const { studentId, amount, paymentDate, septembre, octobre, novembre, decembre, janvier, fevrier, mars, avril, mai, juin } = await request.json();

  // Validate inputs if needed
  if (!id || isNaN(parseInt(id))) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const updatedPayment = await prisma.payment.update({
      where: { id: parseInt(id) },
      data: { studentId, amount, paymentDate, septembre, octobre, novembre, decembre, janvier, fevrier, mars, avril, mai, juin },
    });

    return NextResponse.json(updatedPayment, { status: 200 });
  } catch (error) {
    console.error('Error updating payment:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
