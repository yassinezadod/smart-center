import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: { class: true }, // Inclure les détails de la classe si nécessaire
    });
    return new Response(JSON.stringify(students), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch students' }), { status: 500 });
  }
}
