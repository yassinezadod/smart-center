// app/api/getUser/route.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    // Récupérer tous les utilisateurs de la base de données
    const users = await prisma.user.findMany();

    // Si des utilisateurs sont trouvés, renvoyer les données
    if (users.length > 0) {
      return new Response(JSON.stringify(users), {
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // Si aucun utilisateur n'est trouvé, renvoyer une réponse vide avec un code de succès
      return new Response(JSON.stringify([]), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    // Déconnecter Prisma après l'utilisation
    await prisma.$disconnect();
  }
}
