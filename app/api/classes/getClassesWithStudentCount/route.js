import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get all classes with students
    const classes = await prisma.class.findMany({
      include: {
        students: true,
      },
    });

    // Create an object to store the number of students for each 'niveauScolaire'
    const studentCountByNiveau = {};

    classes.forEach(cls => {
      const activeStudents = cls.students.filter(student => student.depart === "Actif");
      
      // If the 'niveauScolaire' does not exist in the object, initialize it
      if (!studentCountByNiveau[cls.niveauScolaire]) {
        studentCountByNiveau[cls.niveauScolaire] = 0;
      }

      // Increment the count of active students for this 'niveauScolaire'
      studentCountByNiveau[cls.niveauScolaire] += activeStudents.length;
    });

    const result = Object.keys(studentCountByNiveau).map(niveau => ({
      niveau: niveau,
      studentCount: studentCountByNiveau[niveau],
    }));

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    return new Response('Erreur lors de la récupération des données', { status: 500 });
  }
}
