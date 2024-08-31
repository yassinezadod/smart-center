import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(request, { params }) {
  try {
    await prisma.student.delete({
      where: { id: parseInt(params.id) },
    });
    return new NextResponse('Student deleted', { status: 200 });
  } catch (error) {
    return new NextResponse('Error deleting student', { status: 500 });
  }
}
