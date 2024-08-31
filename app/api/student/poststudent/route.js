import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req, res) {
  try {
    const { nom, prenom, birthDate, classId, inscription, telephone, ecoleOrigine, acteNaissance, picture } = await req.json();

    const newStudent = await prisma.student.create({
      data: {
        nom,
        prenom,
        birthDate: new Date(birthDate),
        classId: parseInt(classId),
        inscription,
        telephone,
        ecoleOrigine,
        acteNaissance,
        picture,
      },
    });

    return new Response(JSON.stringify(newStudent), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create student' }), { status: 500 });
  }
}
