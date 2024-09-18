// api/classes/getClassesWithStudentCount.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const classes = await prisma.class.findMany({
      include: {
        students: true,
      },
    });

    const classData = classes.map(cls => ({
      id: cls.id,
      niveau: cls.niveau,
      studentCount: cls.students.length,
    }));

    return new Response(JSON.stringify(classData), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    return new Response('Erreur lors de la récupération des données', { status: 500 });
  }
}
